﻿using Cube.Pdf.Pdfium;
using Cube.Pdf.Extensions;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.Intrinsics.Arm;

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
            pdf= new DocumentRenderer(path);
            pdf.RenderOption.Background = Color.White;
            return Task.CompletedTask;
        }

        public void Close()
        {
            pdf = null;
            pdf?.Dispose();
        }

        public bool IsOpened  => pdf is not null; 

        public int PageCount => pdf?.File.Count ?? 0;

        public PdfReader.Size GetSize(int pageIndex)
        {
            if(pdf is null) return new PdfReader.Size(0, 0);
            var page = pdf.GetPage(pageIndex + 1);
            return new PdfReader.Size(page.Size.Width, page.Size.Height);
        }

        public Task<byte[]?> Render(int pageIndex, int width)
        {
            if (pdf is null) return Task.FromResult<byte[]?>(null);
            var page = pdf.GetPage(pageIndex + 1);
            using var bmp = pdf.Render(page, new SizeF(width, (float)Math.Floor(width * page.Size.Height / page.Size.Width)));
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
