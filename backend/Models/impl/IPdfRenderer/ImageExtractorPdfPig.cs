using UglyToad.PdfPig;

namespace backend
{
    /// <summary>
    /// 大きなファイルは最初の読み込みに時間がかかるし、ページのレンダリングも遅い。
    /// しかもasyncに対応していないのでバックエンドが固まる。
    /// 使用方法：https://github.com/UglyToad/PdfPig/wiki/Images
    /// </summary>
    internal class ImageExtractorPdfPig : IImageExtractor
    {
        public Task Open(string path)
        {
            pdf = PdfDocument.Open(path);
            return Task.CompletedTask;
        }

        public void Close()
        {
            pdf?.Dispose();
            pdf = null;
        }

        public bool IsOpened  => pdf is not null; 

        public int PageCount => pdf?.NumberOfPages ?? 0;

        public PdfReader.Size GetSize(int pageIndex)
        {
            if(pdf is null) return new PdfReader.Size(0, 0);
            var page = pdf.GetPage(pageIndex + 1);
            return new PdfReader.Size(page.Width, page.Height);
        }

        public bool HasText(int pageIndex) => pdf?.GetPage(pageIndex + 1)?.Text?.Length != 0;

        public IEnumerable<(byte[], RectangleF)> ExtractImages(int pageIndex)
        {
            if (pdf is null) return [];
            var page = pdf.GetPage((int)pageIndex + 1);
            return page.GetImages()
                .Select(img => ((byte[])[.. img.RawBytes], new RectangleF((float)img.Bounds.Left, (float)img.Bounds.Top, (float)img.Bounds.Width, (float)img.Bounds.Height)));
        }

        //|
        //| private
        //|

        PdfDocument? pdf;
    }
}
