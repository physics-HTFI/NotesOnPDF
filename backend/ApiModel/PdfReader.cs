using backend.Models.impl;
using System.Collections;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.CompilerServices;
using Windows.Data.Pdf;
using Windows.Storage.Streams;

namespace backend
{
    internal class PdfReader
    {
        /// <summary>
        /// PDFの1つのページのサイズ（フロントエンドに渡すので小文字にしている）
        /// </summary>
        public record Size(double width, double height);


        //|
        //| public
        //|

        /// <summary>
        /// PDFファイルを開いて各ページのサイズを返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<Size[]> GetSizes(string path)
        {
            await OpenIfNeeded(path);
            return Enumerable.Range(0, pdfRenderer.PageCount).Select(i =>
            {
                var size = pdfRenderer.GetSize(i);
                return new Size(size.Width, size.Height);
            }).ToArray();
        }

        /// <summary>
        /// 画像ファイルを返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<byte[]> GetPagePng(string path, int pageNum, int width, int height)
        {
            await OpenIfNeeded(path);
            if (pdfRenderer.PageCount <= pageNum) throw new Exception();
            if (width == 0 || System.Windows.SystemParameters.PrimaryScreenWidth < width) throw new Exception();

            return await pdfRenderer.Render(pageNum, width, height) ?? throw new Exception();
        }


        //|
        //| private
        //|

        string? currentPath;
        readonly IPdfRenderer pdfRenderer = new PdfRendererCubePdfium();

        async Task OpenIfNeeded(string path)
        {
            if (path == currentPath && pdfRenderer.IsOpened) return;

            Close();
            await pdfRenderer.Open(path);
            if (!pdfRenderer.IsOpened) throw new Exception();
            currentPath = path;
        }


        void Close()
        {
            currentPath = null;
            pdfRenderer.Close();
        }

        ~PdfReader()
        {
            Close();
        }
    }
}
