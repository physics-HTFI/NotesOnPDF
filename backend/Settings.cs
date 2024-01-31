using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    internal class Settings
    {
        static public string Url => $"http://localhost:{Properties.Settings.Default.Port}/";
    }
}
