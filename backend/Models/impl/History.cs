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
        public void Add(string id, string path, FileFrom? type = null) {
            try
            {
                if (Items.FirstOrDefault()?.Id == id) return;
                Item item = new(
                    id,
                    Path.GetFullPath(path),
                    type ?? FileFrom.InsideTree
                );
                Items.RemoveAll(i => i.Id == id);
                Items.Insert(0, item);
                Items = Items.Take(100).ToList();
                Save();
            }
            catch { }
        }

        public enum FileFrom { InsideTree, OutsideTree, Web }

        /// <summary>
        /// <c>throw</c>しない
        /// </summary>
        public HttpServer.FileItem[] GetHistory()
        {
            try
            {
                return Items.Select(i => new HttpServer.FileItem(i.Id, getName(i))).ToArray();

                static string getName(Item item)
                {
                    string prefix = item.Type switch
                    {
                        FileFrom.OutsideTree => "[ツリー外] ",
                        FileFrom.Web => "[ウェブ] ",
                        _ => ""
                    };
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
        public string? GetPath(string id) => Items.FirstOrDefault(i => i.Id == id)?.Path;        


        //|
        //| private
        //|

        List<Item> Items = Read();
        public record Item(string Id, string Path, FileFrom Type);

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
