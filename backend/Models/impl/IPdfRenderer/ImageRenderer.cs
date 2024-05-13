using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UglyToad.PdfPig;
using Windows.Storage.Streams;

namespace backend
{
    /// <summary>
    /// PDFから抽出した画像からページ画像を描画する。
    /// テキストを持つPDFはレンダリングを行わない。
    /// </summary>
    internal class ImageRenderer : IPdfRenderer
    {
        public ImageRenderer(IImageExtractor imgExtractor) { imageExtractor = imgExtractor; }

        public Task Open(string path)
        {
            imageExtractor.Open(path);
            hasText = false;
            return Task.CompletedTask;
        }

        public void Close()
        {
            imageExtractor.Close();
            hasText = false;
        }

        public bool IsOpened => imageExtractor.IsOpened;

        public int PageCount => imageExtractor.PageCount;

        public PdfReader.Size GetSize(int pageIndex) => imageExtractor.GetSize(pageIndex);


        public Task<byte[]?> Render(int pageIndex, int width)
        {
            // テキストを持つPDFファイルの場合はレンダリング対象にしない
            if (!IsOpened || hasText) return Task.FromResult<byte[]?>(null);
            hasText = imageExtractor.HasText(pageIndex);
            if (hasText) return Task.FromResult<byte[]?>(null);

            var (pdfWidth, pdfHeight) = GetSize(pageIndex);
            int r(double d) => (int)(Math.Round(d * width / pdfWidth));
            using var bitmap = new Bitmap(width, r(pdfHeight));
            using var g = Graphics.FromImage(bitmap);
            g.Clear(Color.White);

            var images = imageExtractor.ExtractImages(pageIndex)
                .Select(img => (img.Item1, new Rectangle(r(img.Item2.Left), r(pdfHeight - img.Item2.Top), r(img.Item2.Width), r(img.Item2.Height))))
                .OrderBy(img => img.Item2.Y);
            int Y = 0;
            foreach (var (img, rect) in images)
            {
                rect.Offset(0, Y - rect.Y); // 隙間ができないように移動する
                Y = rect.Y + rect.Height;
                using Stream stream = new MemoryStream(img);
                g.DrawImage(Image.FromStream(stream), rect);
            }

            using MemoryStream ms = new();
            bitmap.Save(ms, ImageFormat.Bmp);
            return Task.FromResult<byte[]?>(ms.ToArray());
        }

        bool hasText = false;
        readonly IImageExtractor imageExtractor;
    }

}
