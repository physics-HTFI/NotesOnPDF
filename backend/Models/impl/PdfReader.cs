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
        public async Task<Size[]> Open(string path, NotesPaths.PdfOrigin origin)
        {
            Close();

            // URLならダウンロードする（必要なら）
            string localFilePath = origin == NotesPaths.PdfOrigin.Web ? await Download.FromUrl(path) : path;

            // PDFを開く
            await pdfRenderer.Open(localFilePath);
            await pdfRendererSub.Open(localFilePath);
            if (!pdfRenderer.IsOpened) throw new Exception();
            if (!pdfRendererSub.IsOpened) throw new Exception();
            currentPath = path;

            // MD5と各ページのサイズを取得する
            if (items.FirstOrDefault(x => x.Path == path) is Item item) return item.Sizes;
            if (MD5.FromFile(localFilePath) is not string md5) throw new Exception();
            Size[] sizes = Enumerable.Range(0, pdfRenderer.PageCount).Select(i => pdfRenderer.GetSize(i)).ToArray();
            items.Add(new(path, md5, sizes));
            return sizes;
        }

        /// <summary>
        /// PDFファイルのMD5を返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<string> GetMD5(string path, NotesPaths.PdfOrigin origin)
        {
            if (items.FirstOrDefault(x => x.Path == path) is Item item) return item.MD5;
            await Open(path, origin);
            return items.First(x => x.Path == path).MD5;
        }

        /// <summary>
        /// 開いたことのあるPDFファイルの情報
        /// </summary>
        public record Item(string Path, string MD5, Size[] Sizes);

        /// <summary>
        /// PDFの1つのページのサイズ（フロントエンドに渡すので小文字にしている）
        /// </summary>
        public record Size(double width, double height);


        /// <summary>
        /// 画像ファイルを返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<byte[]> GetPagePng(string path, NotesPaths.PdfOrigin origin, int pageNum, int width)
        {
            if (path != currentPath)
            {
                await Open(path, origin);
            }
            if (!pdfRenderer.IsOpened) throw new Exception();
            if (pdfRenderer.PageCount <= pageNum) throw new Exception();
            if (width == 0 || System.Windows.SystemParameters.PrimaryScreenWidth < width) throw new Exception();

            return await pdfRenderer.Render(pageNum, width) ?? throw new Exception();
        }


        //|
        //| private
        //|

        string? currentPath;
        readonly IPdfRenderer pdfRenderer = new PdfRendererCubePdfium();

        /// <summary>
        /// <c>pdfRenderer</c>によるレンダリングはスキャン画像のPDFの場合にぼやける。
        /// そのため、画像だけからなるPDFの場合はこれを使う
        /// </summary>
        readonly ImageRenderer pdfRendererSub = new (new ImageExtractorITextSharp());


        /// <summary>
        /// 開いたことのあるPDFファイル
        /// </summary>
        readonly List<Item> items = [];

        void Close()
        {
            currentPath = null;
            pdfRenderer.Close();
            pdfRendererSub.Close();
        }

        ~PdfReader()
        {
            Close();
        }
    }
}
