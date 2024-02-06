using System.IO;
using System.Text.RegularExpressions;

namespace backend
{
    internal class NotesPaths
    {
        record Item(string Path, string MD5);

        /// <summary>
        /// `NotesDirectory`内の注釈ファイル
        /// </summary>
        readonly List<Item> items = [];

        public NotesPaths()
        {
            ReadItems();
            Properties.Settings.Default.PropertyChanged += BackendSettingsChanged;
        }

        /// <summary>
        /// 初期化処理、または`NotesDirectory`の変更時の処理
        /// </summary>
        public void ReadItems()
        {
            try
            {
                items.Clear();
                Regex regex = new(@".*\.([^/\\\.]+)\.json");
                foreach (var path in Directory.GetFiles(SettingsUtils.NotesDirectory))
                {
                    var match = regex.Match(path);
                    if (!match.Success) continue;
                    items.Add(new(path, match.Groups[1].Value));
                }
            }
            catch { }
        }

        /// <summary>
        /// PDFファイルの選択時の処理
        /// </summary>
        public void AddItem(string path, string md5)
        {
            if (items.Any(i => i.MD5 == md5)) return;
            items.Add(new(path, md5));
        }

        /// <summary>
        /// `MD5`を注釈ファイルパスに変換する。失敗したら`throw`。
        /// </summary>
        public string GetPath(string md5) => items.First(i => i.MD5 == md5).Path;


        #region private

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
            if (e.PropertyName == nameof(Properties.Settings.Default))
            {
                ReadItems();
            }
        }

        #endregion
    }
}
