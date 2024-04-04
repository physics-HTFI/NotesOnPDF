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
                string? md5 = MD5.FromFile(value.pdfPath);
                if (md5 is null) return;
                AddPath($"{value.pdfPath[..^4]}.{md5}.json");
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
            if (path.Count(c => c == '.') < 3) return;
            var md5 = path.Split('.')[^2];
            paths[md5] = path;
        }

        public record Message_SettingsChanged();
        public record Message_PdfChanged(string pdfPath);
    }
}
