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
        /// URLのPDFファイルをダウンロードフォルダに保存する。
        /// 既に存在する場合は何もしない。
        /// 失敗したら<c>throw</c>。
        /// </summary>
        public static async Task<string> FromUrl(string url)
        {
            string name = UrlToName(url);
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
        /// URLをダウンロード時のファイル名に変換する。
        /// 失敗したら<c>throw</c>。
        /// </summary>
        public static string UrlToName(string url)
        {
            var match = Regex.Match(url, @"^(.+)(\.[^.]*)$");
            var name = match.Groups[1].Value;
            var ext = match.Groups[2].Value;
            static bool invalid(char c) => c == '.' || Path.GetInvalidFileNameChars().Contains(c);
            return new string([.. name.Select(c => invalid(c) ? '_' : c)]) + ext;
        }

        //|
        //| private
        //|

        /// <summary>
        /// <c>HttpClient</c>は生成したものを使いまわす。
        /// https://learn.microsoft.com/ja-jp/dotnet/fundamentals/runtime-libraries/system-net-http-httpclient
        /// </summary>
        static readonly HttpClient Http = new();
    }
}
