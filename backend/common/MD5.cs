using System.IO;
using System.Text;

namespace backend
{
    /// <summary>
    /// MD5 を計算する
    /// </summary>
    internal static class MD5
    {
        /// <summary>
        /// ファイルの MD5 を計算する。
        /// 失敗時は<c>null</c>。
        /// </summary>
        public static string? FromFile(string path)
        {
            try
            {
                return FromBytes(File.ReadAllBytes(path));
            }
            catch { return null; }
        }

        /// <summary>
        /// <c>byte[]</c>から MD5 を計算する。
        /// </summary>
        public static string FromBytes(byte[] bytes)
        {
            return BitConverter.ToString(System.Security.Cryptography.MD5.HashData(bytes)).Replace("-", "")[..10].ToLower();
        }

        /// <summary>
        /// テキストから MD5 を計算する。
        /// </summary>
        public static string FromString(string str)
        {
            return FromBytes(Encoding.UTF8.GetBytes(str));
        }
    }
}
