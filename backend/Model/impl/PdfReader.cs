using System.IO;
using Windows.Data.Pdf;
using Windows.Storage.Streams;
using Size = Windows.Foundation.Size;

namespace backend
{
    internal class PdfReader
    {
        /// <summary>
        /// PDFファイルを開く。失敗したら`throw`。
        /// </summary>
        public async Task<(string md5, uint pageNum, Size[] sizes)> Open(string path)
        {
            currentPath = null;
            CloseStream();
            if (MD5.FromFile(path) is not string md5) throw new Exception();

            // PDFファイルオープン
            pdfStream = File.OpenRead(path);
            randomAccessStream = pdfStream.AsRandomAccessStream();
            pdf = await PdfDocument.LoadFromStreamAsync(randomAccessStream);

            uint pageNum = pdf.PageCount;
            Size[] sizes = Enumerable.Range(0, (int)pageNum).Select(i =>
            {
                using var page = pdf.GetPage((uint)i);
                return new Size(page.Size.Width, page.Size.Height);
            }).ToArray();
            currentPath = path;
            return new(md5, pageNum, sizes);
        }

        public record Size(double Width, double Height);

        /// <summary>
        /// 画像ファイルを返す。失敗したら`throw`。
        /// </summary>
        public async Task<byte[]> GetPagePng(string path, uint pageNum, uint width)
        {
            if (path != currentPath)
            {
                await Open(path);
            }
            if (pdf is null) return [];
            if (width < 1 || System.Windows.SystemParameters.PrimaryScreenWidth < width) throw new Exception();
            if (pageNum < 0 || pdf.PageCount < pageNum) throw new Exception();

            using var page = pdf.GetPage(pageNum);
            using var memStream = new MemoryStream();
            using var renderStream = memStream.AsRandomAccessStream();
            {
                await page.RenderToStreamAsync(renderStream);
                return memStream.ToArray();
            }
        }


        #region private

        string? currentPath;
        FileStream? pdfStream;
        PdfDocument? pdf;
        IRandomAccessStream? randomAccessStream;

        ~PdfReader()
        {
            CloseStream();
        }

        void CloseStream()
        {
            pdfStream?.Close();
            randomAccessStream?.Dispose();
        }

        #endregion
    }
}
