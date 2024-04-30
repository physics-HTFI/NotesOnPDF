using System.IO;
using System.Text.RegularExpressions;
using static backend.History;

namespace backend
{
    internal class NotesPaths
    {
        /// <summary>
        /// MD5 を注釈ファイルパスに変換する。失敗したら<c>throw</c>。
        /// </summary>
        public string GetNotesPath(string md5, string pdfPath, PdfOrigin origin)
        {
            if (items.FirstOrDefault(i => i.MD5 == md5) is Item item) return item.Path;

            // 注釈ファイルを新規作成する場合のパス
            string prefix = Prefix(origin);
            string name = Path.GetFileNameWithoutExtension(pdfPath);
            string notesPath = Path.Combine(
                SettingsUtils.NotesDirectory,
                $"{prefix}{name}.{md5}.json"
            );
            items.Add(new(notesPath, md5));
            return notesPath;

        }

        public enum PdfOrigin { InsideTree, OutsideTree, Web }

        static string Prefix(PdfOrigin origin) => origin switch
        {
            PdfOrigin.OutsideTree => "[ツリー外] ",
            PdfOrigin.Web => "[ウェブ] ",
            _ => ""
        };

        //|
        //| コンストラクタ
        //|

        public NotesPaths()
        {
            ReadItems();
            Properties.Settings.Default.PropertyChanged += BackendSettingsChanged;
        }

        /// <summary>
        /// デストラクタ
        /// </summary>
        ~NotesPaths()
        {
            Properties.Settings.Default.PropertyChanged -= BackendSettingsChanged;
        }

        /// <summary>
        /// バックエンド設定が変更されたときの処理
        /// </summary>
        void BackendSettingsChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName != nameof(Properties.Settings.Default.OutputDirectory)) return;
            ReadItems();
        }


        //|
        //| private
        //|

        /// <summary>
        /// <c>OutputDirectory</c>内の注釈ファイル
        /// </summary>
        readonly List<Item> items = [];

        record Item(string Path, string MD5);

        /// <summary>
        /// 初期化処理または<c>OutputDirectory</c>の変更時の処理。<c>throw</c>しない。
        /// </summary>
        void ReadItems()
        {
            try
            {
                items.Clear();
                Regex regex = new(@"([^/\\\.]+)\.json");
                foreach (var path in Directory.GetFiles(SettingsUtils.NotesDirectory))
                {
                    var match = regex.Match(path);
                    if (!match.Success) continue;
                    var md5 = match.Groups[1].Value;
                    items.Add(new(path, md5));
                }
            }
            catch { }
        }

    }
}
