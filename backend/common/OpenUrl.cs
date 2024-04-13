using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    class OpenUrl
    {
        public static void OpenInBrowser(string url)
        {
            ProcessStartInfo pi = new()
            {
                FileName = url,
                UseShellExecute = true,
            };
            Process.Start(pi);
        }
    }
}
