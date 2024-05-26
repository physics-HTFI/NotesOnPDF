using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    internal interface IPdfRenderer
    {

        public Task Open(string path);
        public void Close();

        public bool IsOpened { get; }
        public int PageCount { get; }
        public SizeF GetSize(int index);
        public Task<byte[]?> Render(int pageIndex, int width, int height);
    }
}
