using System.IO;

namespace backend
{
    internal class SettingsUtils
    {
        static public int Port = 8080;
        static public string Url =>
            Port switch
            {
                80 => "http://localhost/",
                _ => $"http://localhost:{Port}/"
            };


        static public string SettingsPath => Path.Combine(Properties.Settings.Default.RootDirectory, ".NotesOnPDF", "settings.json");
        static public string CoveragePath => Path.Combine(Properties.Settings.Default.RootDirectory, ".NotesOnPDF", "coverages.json");
        static public string HistoryPath => Path.Combine(Properties.Settings.Default.RootDirectory, ".NotesOnPDF", "history.desktop.json");
        static public string RootDirectory => Properties.Settings.Default.RootDirectory;
        static public string DownloadDirectory => Properties.Settings.Default.DownloadDirectory;
    }
}
