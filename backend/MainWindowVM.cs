using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    // TODO ポートが変わったら、サーバーに再起動が必要
    // フォルダが存在するかのバリデーションが必要


    internal partial class MainWindowVM : ObservableObject
    {
        [ObservableProperty]
        private string? rootDirectory;

        [ObservableProperty]
        private string? notesDirectory;

        [ObservableProperty]
        private int? portIndex;

        [RelayCommand]
        private void UpdateSettings()
        {
            if (RootDirectory == null || NotesDirectory == null || PortIndex == null) return;
            Properties.Settings.Default.RootDirectory = RootDirectory;
            Properties.Settings.Default.NotesDirectory = NotesDirectory;
            Properties.Settings.Default.Port = ports[(int)PortIndex];
            Properties.Settings.Default.Save();
        }


        [RelayCommand]
        private void ResetSettings()
        {
            RootDirectory = Properties.Settings.Default.RootDirectory;
            NotesDirectory = Properties.Settings.Default.NotesDirectory;
            PortIndex = ports.ToList().IndexOf( Properties.Settings.Default.Port);
        }

        public MainWindowVM()
        {
            ResetSettings();
        }

        static readonly string[] ports = ["8080", "8081", "8082", "8083", "8084", "8085"];
    }
}
