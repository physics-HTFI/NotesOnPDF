using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    // TODO ポートが変わったら、サーバーに再起動が必要

    internal partial class MainWindowVM : ObservableValidator
    {
        public MainWindowVM()
        {
            ResetSettings();
        }

        //|
        //| プロパティ
        //|

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [DirectoryExists]
        [NotifyCanExecuteChangedFor(nameof(UpdateSettingsCommand))]
        private string rootDirectory = "";

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [DirectoryExists]
        [NotifyCanExecuteChangedFor(nameof(UpdateSettingsCommand))]
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

        [RelayCommand(CanExecute = nameof(CanUpdateSettings))]
        private void UpdateSettings()
        {
            IsFlipped = false;
            Properties.Settings.Default.RootDirectory = RootDirectory;
            Properties.Settings.Default.NotesDirectory = NotesDirectory;
            Properties.Settings.Default.Port = Ports[(int)PortIndex];
            Properties.Settings.Default.Save();
        }
        bool CanUpdateSettings()
        {
            return !HasErrors;
        }

        [RelayCommand]
        private void ResetSettings()
        {
            IsFlipped = false;
            RootDirectory = Properties.Settings.Default.RootDirectory;
            NotesDirectory = Properties.Settings.Default.NotesDirectory;
            PortIndex = Ports.IndexOf(Properties.Settings.Default.Port);
            if (PortIndex == -1)
            {
                PortIndex = 0;
            }
        }

        [RelayCommand]
        private void SelectRootDirectory()
        {
            RootDirectory = PathUtils.SelectDirectory(RootDirectory, Properties.Settings.Default.RootDirectory);
        }

        [RelayCommand]
        private void SelectNotesDirectory()
        {
            NotesDirectory = PathUtils.SelectDirectory(NotesDirectory, Properties.Settings.Default.NotesDirectory);
        }


        public static ValidationResult? Validate(string value, ValidationContext _)
        {
            try
            {
                if (Path.Exists(Path.GetFullPath((string)value)))
                {
                    return ValidationResult.Success;
                }
            }
            catch
            {
            }
            return new("ディレクトリが存在しません");
        }

        //|
        //| private
        //|

        static readonly List<string> Ports = ["8080", "8081", "8082", "8083", "8084", "8085"];

    }
}