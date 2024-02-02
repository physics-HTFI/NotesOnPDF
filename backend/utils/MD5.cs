using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Shapes;

namespace backend
{
    internal static class MD5
    {
        public static string? FromFile(string path)
        {
            try
            {
                return FromBytes(File.ReadAllBytes(path));
            }
            catch { return null; }
        }

        public static string FromBytes(byte[] bytes)
        {
            return BitConverter.ToString(System.Security.Cryptography.MD5.HashData(bytes)).Replace("-", "")[..5].ToLower();
        }

        public static string FromString(string str)
        {
            return FromBytes(Encoding.UTF8.GetBytes(str));
        }
    }
}
