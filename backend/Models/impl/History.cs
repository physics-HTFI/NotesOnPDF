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
        /// <c>throw</c>しない
        /// </summary>
        public void Add(string id, string path, NotesPaths.PdfOrigin? type = null) {
            try
            {
                if (Items.FirstOrDefault()?.Id == id) return;
                Item item = new(
                    id,
                    Path.GetFullPath(path),
                    type ?? NotesPaths.PdfOrigin.InsideTree,
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
        public HttpServer.FileItem[] GetHistory()
        {
            try
            {
                return Items.Select(i => 
                    new HttpServer.FileItem(i.Id, getName(i), (int)i.Origin, i.AccessDate.ToString("yyyy-MM-dd HH:mm"))
                ).ToArray();

                static string getName(Item item)
                {
                    string prefix = NotesPaths.Prefix(item.Origin);
                    string name = Path.GetFileName(item.Path);
                    return $"{prefix}{name}";
                }
            }
            catch
            {
                return [];
            }
        }

        /// <summary>
        /// <c>id</c>をPDFファイルパスに変換する。失敗したら<c>null</c>。
        /// </summary>
        public Item? GetItem(string id) => Items.FirstOrDefault(i => i.Id == id);

        public record Item(string Id, string Path, NotesPaths.PdfOrigin Origin, DateTime AccessDate);


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
