using System.IO;
using System.Text.Json;

namespace backend
{
    internal class PdfTree
    {
        //|
        //| public
        //|

        /// <summary>
        /// ルートフォルダ内のPDFファイル一覧（フロントエンドに渡す情報）。<c>throw</c>しない。
        /// </summary>
        public Item[] GetPdfTree()
        {
            ReadItems();
            return [.. items];
        }

        /// <summary>
        /// ルートフォルダ内の1つのファイル／フォルダの情報（フロントエンドに渡すので小文字にしている）
        /// </summary>
        /// <param name="id">ファイル／フォルダのID</param>
        /// <param name="path">ファイル／フォルダのパス</param>
        /// <param name="children"></param>
        public record Item(string id, string path, string[]? children);

        /// <summary>
        /// `id`をPDFファイルパスに変換する。失敗したら<c>throw</c>。
        /// </summary>
        public string GetPath(string id)
        {
            if(items.Count == 0) ReadItems();
            return items.First(i => i.id == id).path;
        }


        //|
        //| コンストラクタ
        //|

        /// <summary>
        /// コンストラクタ
        /// </summary>
        public PdfTree()
        {
            Properties.Settings.Default.PropertyChanged += BackendSettingsChanged;
        }

        /// <summary>
        /// デストラクタ
        /// </summary>
        ~PdfTree()
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
            catch { }

            void addDirectory(string dir)
            {
                // PDFファイルがあるフォルダのみ考慮する（フロントエンド側で空フォルダを表示するのが面倒なため）
                var dirs = Directory.GetDirectories(dir).Where(hasPdf);
                var pdfs = Directory.GetFiles(dir, "*.pdf");

                // `dir`を追加
                {
                    string id = path2Id(dir);
                    string[] children = dirs.Concat(pdfs).Select(path2Id).ToArray();
                    items.Add(new(id, dir, children));
                }
                // `dir`内のファイルを追加
                foreach (var f in pdfs)
                {
                    items.Add(new(path2Id(f), f, null));
                }
                // `dir`内のフォルダを追加
                foreach (var d in dirs)
                {
                    addDirectory(d);
                }
            }

            bool hasPdf(string dir) => Directory.GetFiles(dir, "*.pdf", SearchOption.AllDirectories).Length != 0;
            static string path2Id(string path) => MD5.FromString(path);

        }
    }
}
