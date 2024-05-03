using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using System.Threading.Tasks;
using static backend.NotesPaths;

namespace backend
{
    class History
    {
        /// <summary>
        /// <c>throw</c>しない
        /// </summary>
        public void Add(string id, string path, NotesPaths.PdfOrigin? origin = null, int? pages = null) {
            try
            {
                if (Items.FirstOrDefault()?.Id == id) return;
                origin ??= Items.FirstOrDefault(i => i.Id == id)?.Origin;
                pages ??= Items.FirstOrDefault(i => i.Id == id)?.Pages;
                Item item = new(
                    id,
                    Path.GetFullPath(path),
                    origin ?? NotesPaths.PdfOrigin.InsideTree,
                    pages ?? 0,
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
        public HttpServer.PdfItem[] GetHistory()
        {
            try
            {
                return Items.Select(i => 
                    new HttpServer.PdfItem(i.Id, Path.GetFileName(i.Path), pagesToString(i.Pages), prefix(i.Origin), i.AccessDate.ToString("yyyy-MM-dd HH:mm"))
                ).ToArray();
            }
            catch
            {
                return [];
            }
            static string pagesToString(int pages) => pages <= 0 ? "???" : pages.ToString();
            static string prefix(PdfOrigin origin) => origin switch
            {
                PdfOrigin.OutsideTree => "ツリー外",
                PdfOrigin.Web => "ウェブ",
                _ => "ツリー"
            };
        }

        /// <summary>
        /// <c>id</c>をPDFファイルパスに変換する。失敗したら<c>null</c>。
        /// </summary>
        public Item? GetItem(string id) => Items.FirstOrDefault(i => i.Id == id);

        public record Item(string Id, string Path, NotesPaths.PdfOrigin Origin, int Pages, DateTime AccessDate);


        //|
        //| private
        //|

        List<Item> Items = Read();

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
        static List<Item> Read()
        {
            try
            {
                string? json = PathUtils.ReadAllText(SettingsUtils.HistoryPath);
                if (json is null) return [];
                return JsonSerializer.Deserialize<List<Item>>(json, SerializerOptions) ?? [];
            }
            catch {
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
