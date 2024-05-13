using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using UglyToad.PdfPig.Graphics;
using Windows.Data.Pdf;

namespace backend
{
    /// <summary>
    /// 遅くはないが、サポートが終了している
    /// </summary>
    internal class ImageExtractorITextSharp : IImageExtractor
    {
        public Task Open(string path)
        {
            reader = new(path);
            return Task.CompletedTask;
        }

        public void Close()
        {
            reader?.Dispose();
            reader = null;
        }

        public bool IsOpened  => reader is not null; 

        public int PageCount => reader?.NumberOfPages ?? 0;

        public PdfReader.Size GetSize(int pageIndex)
        {
            if(reader is null) return new PdfReader.Size(0, 0);
            var page = reader.GetPageSize(pageIndex + 1);
            return new PdfReader.Size(page.Width, page.Height);
        }

        public bool HasText(int pageIndex)
        {
            string text = PdfTextExtractor.GetTextFromPage(reader, pageIndex + 1, new SimpleTextExtractionStrategy());
            return text.Length != 0;
        }

        public IEnumerable<(byte[], RectangleF)> ExtractImages(int pageIndex)
        {
            if (reader is null) return [];
            var parser = new PdfReaderContentParser(reader);
            List<(byte[], RectangleF)> images = [];
            parser.ProcessContent(pageIndex + 1, new ImageRenderListener(images));
            return images;
        }

        //|
        //| private
        //|

        iTextSharp.text.pdf.PdfReader? reader;
    }

    internal class ImageRenderListener : IRenderListener
    {
        private List<(byte[], RectangleF)> _list;
        public ImageRenderListener(List<(byte[], RectangleF)> list) { _list = list; }
        public void BeginTextBlock() { }
        public void EndTextBlock() { }
        public void RenderImage(ImageRenderInfo renderInfo) {
            var img = renderInfo.GetImage();
            var matrix = renderInfo.GetImageCTM();
            var x = matrix[6];
            var y = matrix[7];
            var width = matrix[0];
            var height = matrix[4];
            _list.Add(new (img.GetImageAsBytes(), new RectangleF(x, y, width, height)));
        }
        public void RenderText(TextRenderInfo renderInfo) { }
    }
}
