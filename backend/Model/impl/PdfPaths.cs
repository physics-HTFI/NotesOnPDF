using System.IO;
using System.Text.Json;

namespace backend
{
    internal class PdfPaths
    {

        /// <summary>
        /// フロントエンドに渡す情報
        /// </summary>
        public record PdfInfo(string Id, string Path, string[] Children);

        /// <summary>
        /// コンストラクタ
        /// </summary>
        public PdfPaths()
        {
            ReadItems();
            Properties.Settings.Default.PropertyChanged += BackendSettingsChanged;
        }

        /// <summary>
        /// フロントエンドに渡す情報
        /// </summary>
        public PdfInfo[] GetPaths() => items.Select(i => new PdfInfo(i.Id, i.Path, i.Children)).ToArray();

        /// <summary>
        /// `id`をPDFファイルパスに変換する。失敗したら`throw`。
        /// </summary>
        public string GetPath(string id) => items.First(i => i.Id == id).Path;

        public string Json
        {
            get
            {
                try
                {
                    return JsonSerializer.Serialize(items);
                }
                catch
                {
                    return "[]";
                }

            }
        }


        #region private

        /// <summary>
        /// 1つのPDFファイルを表す
        /// </summary>
        record Item(string Id, string Path, string FullPath, string[] Children);


        /// <summary>
        /// ルートディレクトリ内のフォルダとPDFファイル
        /// </summary>
        readonly List<Item> items = [];

        /// <summary>
        /// 初期化処理、またはルートディレクトリの変更時に呼ぶ
        /// </summary>
        void ReadItems()
        {
            try
            {
                items.Clear();
                addDirectory(SettingsUtils.RootDirectory);
            }
            catch { }

            void addDirectory(string dir)
            {
                string[] dirs = Directory.GetDirectories(dir);
                string[] files = Directory.GetFiles(dir, "*.pdf");

                // `dir`を追加
                {
                    string id = MD5.FromString(dir);
                    string[] children = dirs.Concat(files).Select(MD5.FromString).ToArray();
                    items.Add(new(id, dir, dir, children));
                }
                // `dir`内のファイルを追加
                foreach (var f in files)
                {
                    items.Add(new(MD5.FromString(dir), f, f, []));
                }
                // `dir`内のフォルダを追加
                foreach (var d in dirs)
                {
                    addDirectory(d);
                }
            }
        }

        /// <summary>
        /// バックエンド設定が変更されたときの処理
        /// </summary>
        void BackendSettingsChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(Properties.Settings.Default.RootDirectory))
            {
                ReadItems();
            }
        }

        /// <summary>
        /// デストラクタ
        /// </summary>
        ~PdfPaths()
        {
            Properties.Settings.Default.PropertyChanged -= BackendSettingsChanged;
        }

        #endregion
    }
}
