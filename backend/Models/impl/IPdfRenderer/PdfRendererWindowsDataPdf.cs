using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Data.Pdf;
using Windows.Storage.Streams;

namespace backend
{
    /// <summary>
    /// 追加のインストールが不要で使用できるし、十分速い。
    /// しかし、スキャン画像のレンダリングがピンボケになるので使えない。
    /// </summary>
    internal class PdfRendererWindowsDataPdf : IPdfRenderer
    {
        public async Task Open(string path)
        {
            pdfStream = File.OpenRead(path);
            randomAccessStream = pdfStream.AsRandomAccessStream();
            pdf = await PdfDocument.LoadFromStreamAsync(randomAccessStream);
        }

        public void Close()
        {
            pdf = null;
            pdfStream?.Close();
            randomAccessStream?.Dispose();
        }

        public bool IsOpened  => pdf is not null; 

        public int PageCount => (int)(pdf?.PageCount ?? 0);

        public PdfReader.Size GetSize(int index)
        {
            if(pdf is null) return new PdfReader.Size(0, 0);
            using var page = pdf.GetPage((uint)index);
            return new PdfReader.Size(page.Size.Width, page.Size.Height);
        }

        public async Task<byte[]?> Render(int pageIndex, int width, int height)
        {
            if (pdf is null) return null;
            var options = new PdfPageRenderOptions
            {
                DestinationWidth = (uint)width,
                DestinationHeight = (uint)height,
                // https://learn.microsoft.com/ja-jp/windows/win32/wic/-wic-guids-clsids
                // JPEG: 0x1a34f5c1, 0x4a5a, 0x46dc, 0xb6, 0x44, 0x1f, 0x45, 0x67, 0xe7, 0xa6, 0x76
                // PNG: 0x27949969, 0x876a, 0x41d7, 0x94, 0x47, 0x56, 0x8f, 0x6a, 0x35, 0xa4, 0xdc
                // BMP: 0x69be8bb4, 0xd66d, 0x47c8, 0x86, 0x5a, 0xed, 0x15, 0x89, 0x43, 0x37, 0x82
                // GIF: 0x114f5598, 0xb22, 0x40a0, 0x86, 0xa1, 0xc8, 0x3e, 0xa4, 0x95, 0xad, 0xbd
                BitmapEncoderId = new Guid(0x1a34f5c1, 0x4a5a, 0x46dc, 0xb6, 0x44, 0x1f, 0x45, 0x67, 0xe7, 0xa6, 0x76)
            };

            using var page = pdf.GetPage((uint)pageIndex);
            using var memStream = new MemoryStream();
            using var renderStream = memStream.AsRandomAccessStream();
            await page.RenderToStreamAsync(renderStream, options);
            return memStream.ToArray();
        }

        //|
        //| private
        //|

        PdfDocument? pdf;
        FileStream? pdfStream;
        IRandomAccessStream? randomAccessStream;
    }
}
