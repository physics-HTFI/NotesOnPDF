using System.IO;

namespace backend
{
    internal class SettingsUtils
    {
        static public string Url => $"http://localhost:{Properties.Settings.Default.Port}/";
        static public string SettingsPath => Path.Combine(Properties.Settings.Default.OutputDirectory, "settings.json");
        static public string CoveragePath => Path.Combine(Properties.Settings.Default.OutputDirectory, "coverage.json");
        static public string OutputDirectory => Properties.Settings.Default.OutputDirectory;
        static public string NotesDirectory => Path.Combine(OutputDirectory, "notes");
        static public string RootDirectory => Properties.Settings.Default.RootDirectory;
    }
}
