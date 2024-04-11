using CommunityToolkit.Mvvm.Messaging;
using System.IO;
using Windows.Data.Pdf;
using Windows.Storage.Streams;

namespace backend
{
    internal class PdfReader
    {
        /// <summary>
        /// PDFファイルを開いて各ページのサイズを返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<Size[]> Open(string path)
        {
            Close();

            // PDFを開く
            pdfStream = File.OpenRead(path);
            randomAccessStream = pdfStream.AsRandomAccessStream();
            pdf = await PdfDocument.LoadFromStreamAsync(randomAccessStream);
            currentPath = path;

            // MD5と各ページのサイズを取得する
            if (items.FirstOrDefault(x => x.Path == path) is Item item) return item.Sizes;
            if (MD5.FromFile(path) is not string md5) throw new Exception();
            Size[] sizes = Enumerable.Range(0, (int)pdf.PageCount).Select(i =>
            {
                using var page = pdf.GetPage((uint)i);
                return new Size(page.Size.Width, page.Size.Height);
            }).ToArray();
            items.Add(new(path, md5, sizes));
            return sizes;
        }

        /// <summary>
        /// PDFファイルのMD5を返す。失敗したら<c>throw</c>。
        /// </summary>
        public async Task<string> GetMD5(string path)
        {
            if (items.FirstOrDefault(x => x.Path == path) is Item item) return item.MD5;
            await Open(path);
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
        public async Task<byte[]> GetPagePng(string path, uint pageNum, uint width)
        {
            if (path != currentPath)
            {
                await Open(path);
            }
            if (pdf is null) throw new Exception();
            if (width == 0 || System.Windows.SystemParameters.PrimaryScreenWidth < width) throw new Exception();
            if (pdf.PageCount <= pageNum) throw new Exception();

            using var page = pdf.GetPage(pageNum);
            using var memStream = new MemoryStream();
            using var renderStream = memStream.AsRandomAccessStream();
            await page.RenderToStreamAsync(renderStream, new PdfPageRenderOptions { DestinationWidth=width });
            return memStream.ToArray();
        }


        //|
        //| private
        //|

        string? currentPath;
        PdfDocument? pdf;
        FileStream? pdfStream;
        IRandomAccessStream? randomAccessStream;


        /// <summary>
        /// 開いたことのあるPDFファイル
        /// </summary>
        readonly List<Item> items = [];

        void Close()
        {
            currentPath = null;
            pdf = null;
            pdfStream?.Close();
            randomAccessStream?.Dispose();
        }

        ~PdfReader()
        {
            Close();
        }
    }
}
