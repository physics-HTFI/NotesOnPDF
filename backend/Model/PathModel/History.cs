using backend.Models.impl;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using System.Threading.Tasks;

namespace backend
{
    class History
    {

        /// <summary>
        /// フロントエンドに渡す1ファイル分の履歴情報。
        /// <c>origin</c>は"ツリー内", "ツリー外", "ウェブ"のいずれか
        /// </summary>
        public record Item(string id, string name, string pages, string origin, string accessDate);

        public enum Origin { InsideTree, OutsideTree, Web }

        //|
        //| public
        //|

        /// <summary>
        /// <c>origin==Origin.Web</c>の場合、<c>path</c>はURL、それ以外はPDFへのフルパス。
        /// <c>throw</c>しない。
        /// </summary>
        public void Add(string id, string pathOrUrl, Origin origin, int? pages = null)
        {
            try
            {
                PdfItem item = new(
                    id,
                    pathOrUrl,
                    origin,
                    pages ?? Items.FirstOrDefault(i => i.Id == id)?.Pages,
                    DateTime.Now
                );
                Items.RemoveAll(i => i.Id == id);
                Items.Insert(0, item);
                Items = Items.Take(100).ToList();
                Save();
            }
            catch { }
        }

        /// <summary>
        /// <c>throw</c>しない
        /// </summary>
        public Item[] GetHistory()
        {
            try
            {
                return Items.Select(i =>
                    new Item(i.Id, toName(i), pagesToString(i.Pages), originToString(i.Origin), i.AccessDate.ToString("yyyy-MM-dd HH:mm"))
                ).ToArray();
            }
            catch
            {
                return [];
            }

            static string toName(PdfItem i) => i.Origin == Origin.Web ? i.PathOrUrl : Path.GetFileName(i.PathOrUrl);
            static string pagesToString(int? pages) => pages?.ToString() ?? "???";
            static string originToString(Origin origin) => origin switch
            {
                Origin.OutsideTree => "ツリー外",
                Origin.Web => "ウェブ",
                _ => "ツリー"
            };
        }

        /// <summary>
        /// 引数を省略すると全消去
        /// 失敗したら<c>throw</c>
        /// </summary>
        public void DeleteHistory(string? id = null)
        {
            if (id is null)
            {
                Items.Clear();
            }
            else
            {
                Items.RemoveAll(i => i.Id == id);
            }
            Save();
        }

        /// <summary>
        /// <c>id</c>をPDFパスまたはURLに変換する。失敗したら<c>null</c>。
        /// </summary>
        public (string pathOrUrl, Origin origin)? IdToPath(string id)
        {
            var item = Items.FirstOrDefault(i => i.Id == id);
            if (item is null) return null;
            return new(item.PathOrUrl, item.Origin);
        }


        //|
        //| private
        //|

        public record PdfItem(string Id, string PathOrUrl, Origin Origin, int? Pages, DateTime AccessDate);


        List<PdfItem> Items = Read();

        /// <summary>
        /// 失敗したら<c>throw</c>
        /// </summary>
        void Save()
        {
            string json = JsonSerializer.Serialize(Items, SerializerOptions);
            PathUtils.WriteAllText(SettingsUtils.HistoryPath, json);
        }

        /// <summary>
        /// 失敗したら<c>[]</c>
        /// </summary>
        static List<PdfItem> Read()
        {
            try
            {
                string? json = PathUtils.ReadAllText(SettingsUtils.HistoryPath);
                if (json is null) return [];
                return JsonSerializer.Deserialize<List<PdfItem>>(json, SerializerOptions) ?? [];
            }
            catch
            {
                return [];
            }
        }

        static JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)
        };
    }
}
