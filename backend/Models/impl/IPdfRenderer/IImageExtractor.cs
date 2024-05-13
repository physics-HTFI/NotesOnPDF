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
    /// PDFから画像を抽出する。
    /// </summary>
    internal interface IImageExtractor
    {
        public Task Open(string path);
        public void Close();
        public bool IsOpened { get; }
        public int PageCount { get; }
        public PdfReader.Size GetSize(int pageIndex);


        public bool HasText(int pageIndex);
        public IEnumerable<(byte[], RectangleF)> ExtractImages(int pageIndex);
    }

}
