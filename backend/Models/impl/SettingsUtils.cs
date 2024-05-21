﻿using System.IO;

namespace backend
{
    internal class SettingsUtils
    {
        static public string Url => $"http://localhost:{Properties.Settings.Default.Port}/";
        static public string SettingsPath => Path.Combine(Properties.Settings.Default.RootDirectory, ".NotesOnPDF", "settings.json");
        static public string CoveragePath => Path.Combine(Properties.Settings.Default.RootDirectory, ".NotesOnPDF", "coverages.json");
        static public string HistoryPath => Path.Combine(Properties.Settings.Default.RootDirectory, ".NotesOnPDF", "history.desktop.json");
        static public string RootDirectory => Properties.Settings.Default.RootDirectory;
        static public string DownloadDirectory => Properties.Settings.Default.DownloadDirectory;
    }
}
