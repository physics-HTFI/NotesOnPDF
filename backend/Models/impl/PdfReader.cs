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
        /// PDFファイルを開いて各ページのサイズを返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<Size[]> Open(string path, PdfOrigin origin)
        {
            Close();

            // URLならダウンロードする（必要なら）
            string localFilePath = origin == PdfOrigin.Web ? await Download.FromUrl(path) : path;

            // PDFを開く
            await pdfRenderer.Open(localFilePath);
            if (!pdfRenderer.IsOpened) throw new Exception();
            currentPath = path;

            // MD5と各ページのサイズを返す
            return Enumerable.Range(0, pdfRenderer.PageCount).Select(i => pdfRenderer.GetSize(i)).ToArray();
        }

        /// <summary>
        /// 画像ファイルを返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<byte[]> GetPagePng(string path, PdfOrigin origin, int pageNum, int width, int height)
        {
            if (path != currentPath)
            {
                await Open(path, origin);
            }
            if (!pdfRenderer.IsOpened) throw new Exception();
            if (pdfRenderer.PageCount <= pageNum) throw new Exception();
            if (width == 0 || System.Windows.SystemParameters.PrimaryScreenWidth < width) throw new Exception();

            return await pdfRenderer.Render(pageNum, width, height) ?? throw new Exception();
        }


        //|
        //| private
        //|

        string? currentPath;
        readonly IPdfRenderer pdfRenderer = new PdfRendererCubePdfium();

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
