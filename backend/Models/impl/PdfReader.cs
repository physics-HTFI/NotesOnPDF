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

            var options = new PdfPageRenderOptions
            {
                DestinationWidth = width,
                // https://learn.microsoft.com/ja-jp/windows/win32/wic/-wic-guids-clsids
                // JPEG: 0x1a34f5c1, 0x4a5a, 0x46dc, 0xb6, 0x44, 0x1f, 0x45, 0x67, 0xe7, 0xa6, 0x76
                // PNG: 0x27949969, 0x876a, 0x41d7, 0x94, 0x47, 0x56, 0x8f, 0x6a, 0x35, 0xa4, 0xdc
                // BMP: 0x69be8bb4, 0xd66d, 0x47c8, 0x86, 0x5a, 0xed, 0x15, 0x89, 0x43, 0x37, 0x82
                // GIF: 0x114f5598, 0xb22, 0x40a0, 0x86, 0xa1, 0xc8, 0x3e, 0xa4, 0x95, 0xad, 0xbd
                BitmapEncoderId = new Guid(0x1a34f5c1, 0x4a5a, 0x46dc, 0xb6, 0x44, 0x1f, 0x45, 0x67, 0xe7, 0xa6, 0x76)
            };

            using var page = pdf.GetPage(pageNum);
            using var memStream = new MemoryStream();
            using var renderStream = memStream.AsRandomAccessStream();
            await page.RenderToStreamAsync(renderStream, options);
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
