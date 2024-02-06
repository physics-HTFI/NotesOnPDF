using System.IO;

namespace backend
{
    internal class SettingsUtils
    {
        static public string Url => $"http://localhost:{Properties.Settings.Default.Port}/";
        static public string SettingsPath => Path.Combine(Properties.Settings.Default.NotesDirectory, "settings.json");
        static public string CoveragePath => Path.Combine(Properties.Settings.Default.NotesDirectory, "coverage.json");
        static public string NotesDirectory => Properties.Settings.Default.NotesDirectory;
        static public string RootDirectory => Properties.Settings.Default.RootDirectory;
    }
}
