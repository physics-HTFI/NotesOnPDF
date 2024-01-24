using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    // TODO ポートが変わったら、サーバーに再起動が必要
    // フォルダが存在するかのバリデーションが必要


    internal partial class MainWindowVM : ObservableObject
    {
        public MainWindowVM()
        {
            ResetSettings();
        }

        //|
        //| プロパティ
        //|

        [ObservableProperty]
        private string rootDirectory = "";

        [ObservableProperty]
        private string notesDirectory = "";

        [ObservableProperty]
        private int portIndex = 0;

        [ObservableProperty]
        private bool isFlipped = false;

        //|
        //| コマンド
        //|

        [RelayCommand]
        private void OpenSettings()
        {
            IsFlipped = true;
        }

        [RelayCommand]
        private void UpdateSettings()
        {
            IsFlipped = false;
            Properties.Settings.Default.RootDirectory = RootDirectory;
            Properties.Settings.Default.NotesDirectory = NotesDirectory;
            Properties.Settings.Default.Port = Ports[(int)PortIndex];
            Properties.Settings.Default.Save();
        }

        [RelayCommand]
        private void ResetSettings()
        {
            IsFlipped = false;
            RootDirectory = Properties.Settings.Default.RootDirectory;
            NotesDirectory = Properties.Settings.Default.NotesDirectory;
            PortIndex = Ports.IndexOf(Properties.Settings.Default.Port);
            if (PortIndex == -1) { PortIndex = 0; }
        }

        [RelayCommand]
        private void SelectRootDirectory()
        {
            RootDirectory = SelectDirectory(RootDirectory, Properties.Settings.Default.RootDirectory);
        }

        [RelayCommand]
        private void SelectNotesDirectory()
        {
            NotesDirectory = SelectDirectory(NotesDirectory, Properties.Settings.Default.NotesDirectory);
        }

        //|
        //| private
        //|

        static readonly List<string> Ports = ["8080", "8081", "8082", "8083", "8084", "8085"];

        static string SelectDirectory(string path, string fallbackPath)
        {
            var initialDirectory = Path.GetFullPath(path);
            if (!Path.Exists(initialDirectory))
            {
                initialDirectory = Path.GetFullPath(fallbackPath);
            }

            var dialog = new OpenFolderDialog()
            {
                InitialDirectory = initialDirectory
            };
            if (dialog.ShowDialog() == true)
            {
                return dialog.FolderName;
            }
            return path;
        }
    }
}