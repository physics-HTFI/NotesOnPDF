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
            pdfStream = File.OpenRead(localFilePath);
            randomAccessStream = pdfStream.AsRandomAccessStream();
            pdf = await PdfDocument.LoadFromStreamAsync(randomAccessStream);
            pdfPigDocument = UglyToad.PdfPig.PdfDocument.Open(localFilePath);
            isScanned = null;
            currentPath = path;

            // MD5と各ページのサイズを取得する
            if (items.FirstOrDefault(x => x.Path == path) is Item item) return item.Sizes;
            if (MD5.FromFile(localFilePath) is not string md5) throw new Exception();
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
        public async Task<byte[]> GetPagePng(string path, NotesPaths.PdfOrigin origin, uint pageNum, uint width)
        {
            if (path != currentPath)
            {
                await Open(path, origin);
            }
            if (pdf is null) throw new Exception();
            if (width == 0 || System.Windows.SystemParameters.PrimaryScreenWidth < width) throw new Exception();
            if (pdf.PageCount <= pageNum) throw new Exception();

            if (isScanned == true || isScanned is null)
            {
                // 画像を含む場合にWindows.Data.Pdfを使ってレンダリングするとボケるので、PDFから抜き出した画像をそのまま返す
                // https://github.com/UglyToad/PdfPig/wiki/Images
                var pdfPigPage = (pdfPigDocument?.GetPage((int)pageNum + 1)) ?? throw new Exception();
                isScanned = pdfPigPage.Text.Length == 0 && pdfPigPage.NumberOfImages !=0;
                if (isScanned == true)
                {
                    int r(double d) => (int)(Math.Round(d * width / pdfPigPage.Width));
                    using var bitmap = new Bitmap((int)width, r(pdfPigPage.Height));
                    using var g = Graphics.FromImage(bitmap);
                    g.Clear(Color.White);

                    var images = pdfPigPage.GetImages()
                        .Select(img => (img, new Rectangle(r(img.Bounds.Left), r(pdfPigPage.Height - img.Bounds.Top), r(img.Bounds.Width), r(img.Bounds.Height))))
                        .OrderBy(img => img.Item2.Y);
                    int Y = 0;
                    foreach(var (img, rect) in images)
                    {
                        rect.Offset(0, Y - rect.Y); // 隙間ができないように移動する
                        Y = rect.Y + rect.Height;
                        using Stream stream = new MemoryStream([.. img.RawBytes]);
                        g.DrawImage(Image.FromStream(stream), rect);
                    }
                    using MemoryStream ms = new();
                    bitmap.Save(ms, ImageFormat.Bmp);
                    return ms.ToArray();
                }
            }
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
        UglyToad.PdfPig.PdfDocument? pdfPigDocument;
        /// <summary> スキャン画像で作られたPDFかどうか </summary>
        bool? isScanned;


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
            pdfPigDocument?.Dispose();
        }

        ~PdfReader()
        {
            Close();
        }
    }
}
