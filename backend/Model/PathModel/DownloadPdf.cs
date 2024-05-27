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
    internal class DownloadPdf
    {
        //|
        //| public
        //|

        /// <summary>
        /// URLのPDFファイルをダウンロードフォルダに保存して、そのパスを返す。
        /// 既に存在する場合はパスだけ返す。
        /// 失敗したら<c>throw</c>。
        /// URLが<c>.pdf</c>で終わらない場合も<c>throw</c>。
        /// </summary>
        /// <returns>ダウンロードしたPDFファイルのパス</returns>
        public static async Task<string> FromUrlIfNeeded(string url)
        {
            if (!url.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)) throw new Exception();

            string path = Path.Combine(SettingsUtils.DownloadDirectory, UrlToName(url));
            if (!File.Exists(path))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(path) ?? throw new Exception());
                using var s = await Http.GetStreamAsync(url);
                using var fs = new FileStream(path, FileMode.OpenOrCreate);
                s.CopyTo(fs);
            }
            return path;
        }

        //|
        //| private
        //|


        /// <summary>
        /// URLをダウンロード時のファイル名に変換する。
        /// 失敗したら<c>throw</c>。
        /// <code>
        /// "http://www.aaa.bbb.ac.jp/ccc/ddd.pdf"
        /// ↓
        /// "http___www_aaa_bbb_ac_jp_ccc_ddd.pdf"
        /// </code>
        /// </summary>
        static string UrlToName(string url)
        {
            var match = Regex.Match(url, @"^(.+)(\.[^.]*)$");
            var name = match.Groups[1].Value;
            var ext = match.Groups[2].Value;
            return new string([.. name.Select(c => invalid(c) ? '_' : c)]) + ext;

            static bool invalid(char c) => c == '.' || Path.GetInvalidFileNameChars().Contains(c);
        }

        /// <summary>
        /// <c>HttpClient</c>は生成したものを使いまわす。
        /// https://learn.microsoft.com/ja-jp/dotnet/fundamentals/runtime-libraries/system-net-http-httpclient
        /// </summary>
        static readonly HttpClient Http;

        static DownloadPdf()
        {
            Http = new();
            // エージェントを偽装しないとダウンロードできない場合への対応。
            // 例えば) https://opac.ll.chiba-u.jp/da/curator/900121233/qm_a.pdf
            Http.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0");
        }
    }
}
