using CommunityToolkit.Mvvm.Messaging;
using System.Collections.Concurrent;
using System.IO;

namespace backend
{
    /// <summary>
    /// `Settings.NotesDirectory`内のファイル名とMD5を対応させるクラス
    /// <code>
    /// var notePaths = new NotePaths();
    /// var md5 = "aaaaa";
    /// var path = notePaths[md5];
    /// </code>
    /// </summary>
    internal class NotePaths
    {

        public NotePaths()
        {
            SetPath();

            WeakReferenceMessenger.Default.Register<Message_SettingsChanged>(this, (_, _) =>
            {
                if (notesDirectory == SettingsUtils.NotesDirectory) return;
                notesDirectory = SettingsUtils.NotesDirectory;
                SetPath();
            });
            WeakReferenceMessenger.Default.Register<Message_PdfChanged>(this, (_, value) =>
            {
                AddPath($"{Path.GetFileNameWithoutExtension(value.pdfPath)}.{value.md5}.json");
            });
        }

        public string? GetPath(string md5) => paths.GetValueOrDefault(md5);

        //
        // private
        //

        /// <summary>
        /// `path[md5] = <jsonファイルパス>`
        /// </summary>
        readonly ConcurrentDictionary<string, string> paths = [];

        string notesDirectory = SettingsUtils.NotesDirectory;

        void SetPath()
        {
            paths.Clear();
            try
            {
                Directory
                    .GetFiles(notesDirectory)
                    .ToList()
                    .ForEach(AddPath);
            }
            catch { }
        }

        /// <summary>
        ///  `path`は`<filename>.<md5>.json`の形になっているとする
        /// </summary>
        void AddPath(string path)
        {
            string file = Path.GetFileName(path);
            if (file.Count(c => c == '.') <= 1) return;
            var md5 = file.Split('.')[^2];
            paths[md5] = file;
        }

        public record Message_SettingsChanged();
        public record Message_PdfChanged(string pdfPath, string md5);
    }
}
