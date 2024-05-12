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
    /// PdfPigにはPDFの完全なレンダリング機能はない。
    /// 画像のみのページであれば、画像を抽出することでレンダリングできる。
    /// ただし、大きなファイルは最初の読み込みに時間がかかるし、ページのレンダリングも遅い。
    /// しかもasyncに対応していないのでバックエンドが固まる。
    /// 使用方法：https://github.com/UglyToad/PdfPig/wiki/Images
    /// </summary>
    internal class PdfRendererPdfPig : IPdfRenderer
    {
        public Task Open(string path)
        {
            pdf = PdfDocument.Open(path);
            hasText = false;
            return Task.CompletedTask;
        }

        public void Close()
        {
            pdf?.Dispose();
            pdf = null;
            hasText = false;
        }

        public bool IsOpened  => pdf is not null; 

        public int PageCount => (int)(pdf?.NumberOfPages ?? 0);

        public PdfReader.Size GetSize(int index)
        {
            if(pdf is null) return new PdfReader.Size(0, 0);
            var page = pdf.GetPage(index);
            return new PdfReader.Size(page.Width, page.Height);
        }

        public Task<byte[]?> Render(int pageIndex, int width)
        {
            if (pdf is null || hasText) return Task.FromResult<byte[]?>(null);

            // テキストを持つPDFファイルの場合はレンダリング対象にしない
            var page = pdf.GetPage((int)pageIndex + 1);
            hasText = page.Text.Length != 0;
            if (hasText) return Task.FromResult<byte[]?>(null);

            int r(double d) => (int)(Math.Round(d * width / page.Width));
            using var bitmap = new Bitmap((int)width, r(page.Height));
            using var g = Graphics.FromImage(bitmap);
            g.Clear(Color.White);

            var images = page.GetImages()
                .Select(img => (img, new Rectangle(r(img.Bounds.Left), r(page.Height - img.Bounds.Top), r(img.Bounds.Width), r(img.Bounds.Height))))
                .OrderBy(img => img.Item2.Y);
            int Y = 0;
            foreach (var (img, rect) in images)
            {
                rect.Offset(0, Y - rect.Y); // 隙間ができないように移動する
                Y = rect.Y + rect.Height;
                using Stream stream = new MemoryStream([.. img.RawBytes]);
                g.DrawImage(Image.FromStream(stream), rect);
            }
            using MemoryStream ms = new();
            bitmap.Save(ms, ImageFormat.Bmp);
            return Task.FromResult<byte[]?>(ms.ToArray());
        }

        //|
        //| private
        //|

        PdfDocument? pdf;
        bool hasText = false;

    }
}
