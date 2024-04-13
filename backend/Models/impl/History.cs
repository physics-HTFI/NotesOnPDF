using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend
{
    class History
    {
        /// <summary>
        /// <c>throw</c>しない
        /// </summary>
        public void Add(string id, string path) {
            try
            {
                Items.RemoveAll(i => i.Id == id);
                Items.Insert(0, new(id, Path.GetFullPath(path)));
                Items = Items.Take(100).ToList();
                Save();
            }
            catch { }
        }

        /// <summary>
        /// <c>throw</c>しない
        /// </summary>
        public HttpServer.HistoryItem[] GetHistory()
        {
            try
            {
                return Items.Select(i => new HttpServer.HistoryItem(i.Id, Path.GetFileName(i.Path))).ToArray();
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
        public record Item(string Id, string Path);

        /// <summary>
        /// 失敗したら<c>throw</c>
        /// </summary>
        void Save()
        {
            var options = new JsonSerializerOptions { WriteIndented = true };
            string json = JsonSerializer.Serialize(Items, options);
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
                return JsonSerializer.Deserialize<List<Item>>(json) ?? [];
            }
            catch {
                return [];
            }
        }
    }
}
