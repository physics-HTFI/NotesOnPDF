using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    internal class Settings
    {
        static public string Url => $"http://localhost:{Properties.Settings.Default.Port}/";
        static public string SettingsPath => Path.Combine(Properties.Settings.Default.NotesDirectory, "settings.json");
        static public string CoveragePath => Path.Combine(Properties.Settings.Default.NotesDirectory, "coverage.json");
        static public string NotesDirectory => Properties.Settings.Default.NotesDirectory;
        static public string RootDirectory => Properties.Settings.Default.RootDirectory;
    }
}
