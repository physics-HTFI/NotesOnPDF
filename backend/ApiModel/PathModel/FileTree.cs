using System.IO;
using System.Text.Json;
using System.Windows;

namespace backend
{
    internal class FileTree
    {

        /// <summary>
        /// ルートフォルダ内の1つのファイル／フォルダの情報（フロントエンドに渡すので小文字にしている）
        /// </summary>
        /// <param name="id">ファイル／フォルダのID</param>
        /// <param name="path">ファイル／フォルダのパス</param>
        /// <param name="children">フォルダ中の子要素のID、ファイルの場合はnull</param>
        public record Item(string id, string path, string[]? children);


        //|
        //| public
        //|

        /// <summary>
        /// ルートフォルダ内のPDFファイル一覧（フロントエンドに渡す）。<c>throw</c>しない。
        /// </summary>
        public Item[] GetFileTree() => [.. items];

        /// <summary>
        /// <c>id</c>をPDFファイルパスに変換する。失敗したら<c>null</c>。
        /// </summary>
        public string? IdToPath(string id)
        {
            var item = items.FirstOrDefault(i => i.id == id);
            if (item is null || item.children != null) return null;
            return item.path;
        }


        //|
        //| コンストラクタ
        //|

        /// <summary>
        /// コンストラクタ
        /// </summary>
        public FileTree()
        {
            ReadItems();
            Properties.Settings.Default.PropertyChanged += BackendSettingsChanged;
        }

        /// <summary>
        /// デストラクタ
        /// </summary>
        ~FileTree()
        {
            Properties.Settings.Default.PropertyChanged -= BackendSettingsChanged;
        }

        /// <summary>
        /// バックエンド設定が変更されたときの処理
        /// </summary>
        void BackendSettingsChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName != nameof(Properties.Settings.Default.RootDirectory)) return;
            ReadItems();
        }


        //|
        //| private
        //|


        /// <summary>
        /// ルートディレクトリ内のフォルダとPDFファイル
        /// </summary>
        readonly List<Item> items = [];

        /// <summary>
        /// 初期化処理、またはルートディレクトリの変更時に呼ぶ。<c>throw</c>しない。
        /// </summary>
        void ReadItems()
        {
            try
            {
                items.Clear();
                addDirectory(SettingsUtils.RootDirectory);
            }
            catch
            {
                items.Clear();
            }
            return;

            void addDirectory(string dir)
            {
                // PDFファイルがあるフォルダのみ考慮する（フロントエンド側で空フォルダを表示するのが面倒なため）
                var dirs = Directory.GetDirectories(dir).Where(hasPdf);
                var pdfs = Directory.GetFiles(dir, "*.pdf");

                // `dir`を追加
                {
                    string[] children = dirs.Concat(pdfs).Select(toId).ToArray();
                    addItem(dir, children);
                }
                // `dir`内のファイルを追加
                foreach (var f in pdfs)
                {
                    addItem(f, null);
                }
                // `dir`内のフォルダを追加
                foreach (var d in dirs)
                {
                    addDirectory(d);
                }
            }

            bool hasPdf(string dir) => Directory.GetFiles(dir, "*.pdf", SearchOption.AllDirectories).Length != 0;
            void addItem(string path, string[]? children)
            {
                items.Add(new(toId(path), toRelative(path), children));
            }
            string toId(string path) => PathUtils.PathToId(toRelative(path));
            string toRelative(string path)
            {
                // ウェブ版とIDをそろえるために`RootDirectory`を取り除いて、デリミタを/にする
                if (!path.StartsWith(SettingsUtils.RootDirectory)) return path;
                return path[SettingsUtils.RootDirectory.Length..].Replace('\\', '/').TrimStart('/');
            }
        }
    }
}
