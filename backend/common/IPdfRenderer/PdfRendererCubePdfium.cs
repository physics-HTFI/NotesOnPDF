using Cube.Pdf.Pdfium;
using Cube.Pdf.Extensions;
using System.Drawing.Imaging;
using System.IO;

namespace backend
{
    /// <summary>
    /// <c>Windows.Data.Pdf</c>はスキャン画像のレンダリングがピンボケになる。
    /// これはその代替である。
    /// </summary>
    internal class PdfRendererCubePdfium : IPdfRenderer
    {
        public Task Open(string path)
        {
            pdf = new DocumentRenderer(path);
            pdf.RenderOption.Background = Color.White;
            return Task.CompletedTask;
        }

        public void Close()
        {
            pdf = null;
            pdf?.Dispose();
        }

        public bool IsOpened => pdf is not null;

        public int PageCount => pdf?.File.Count ?? 0;

        public SizeF GetSize(int pageIndex)
        {
            if (pdf is null) return new(0, 0);
            var page = pdf.GetPage(pageIndex + 1);
            return (page.Rotation.Degree == 0 || page.Rotation.Degree == 180)
                ? new(page.Size.Width, page.Size.Height)
                : new(page.Size.Height, page.Size.Width);
        }

        public Task<byte[]?> Render(int pageIndex, int width, int height)
        {
            if (pdf is null) return Task.FromResult<byte[]?>(null);
            var page = pdf.GetPage(pageIndex + 1);
            using var bmp = pdf.Render(page, new System.Drawing.Size(width, height));
            using var stream = new MemoryStream();
            bmp.Save(stream, ImageFormat.Bmp);
            return Task.FromResult<byte[]?>(stream.ToArray());
        }

        //|
        //| private
        //|

        DocumentRenderer? pdf;
    }
}
