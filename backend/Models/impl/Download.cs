using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace backend.Models.impl
{
    internal class Download
    {
        /// <summary>
        /// URLのPDFファイルをダウンロードフォルダに保存する。失敗したら<c>throw</c>。
        /// </summary>
        public static async Task<string> FromUrl(string url)
        {
            url = "https://ocw.kyoto-u.ac.jp/wp-content/uploads/2010/04/2010_toukeibutsurigaku_2.pdf";

            var uri = new Uri(url);
            string name = Path.GetFileName(uri.LocalPath);
            string path = Path.Combine(SettingsUtils.DownloadDirectory, name);
            if (!name.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)) throw new Exception();

            if (!File.Exists(path))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(path) ?? throw new Exception());
                using var s = await Http.GetStreamAsync(url);
                using var fs = new FileStream(path, FileMode.OpenOrCreate);
                s.CopyTo(fs);
            }
            return path;
        }

        /// <summary>
        /// <c>HttpClient</c>は生成したものを使いまわす。
        /// https://learn.microsoft.com/ja-jp/dotnet/fundamentals/runtime-libraries/system-net-http-httpclient
        /// </summary>
        static readonly HttpClient Http = new();
    }
}
