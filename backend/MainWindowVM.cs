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
using System.Windows;

namespace backend
{
    // TODO ポートが変わったら、サーバーに再起動が必要

    internal partial class MainWindowVM : ObservableValidator
    {
        public MainWindowVM()
        {
            ResetSettings();
        }

        static readonly List<string> Ports = ["8080", "8081", "8082", "8083", "8084", "8085"];

        //|
        //| プロパティ
        //|


        [ObservableProperty]
        private Visibility _Visibility = Visibility.Visible;

        [ObservableProperty]
        private bool _IsSettingsOpen = false;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [DirectoryExists]
        [NotifyCanExecuteChangedFor(nameof(UpdateSettingsCommand))]
        private string _RootDirectory = "";

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [DirectoryExists]
        [NotifyCanExecuteChangedFor(nameof(UpdateSettingsCommand))]
        private string _NotesDirectory = "";

        [ObservableProperty]
        private int _PortIndex = 0;

        //|
        //| コマンド
        //|

        /// <summary>
        /// ウィンドウの表示／非表示切替コマンド
        /// </summary>
        [RelayCommand]
        public void ToggleWindowVisibility()
        {
            Visibility = Visibility == Visibility.Collapsed ? Visibility.Visible : Visibility.Collapsed;
        }

        /// <summary>
        /// 終了コマンド
        /// </summary>
        [RelayCommand]
        void Exit()
        {
            System.Windows.Application.Current.Shutdown();
        }

        /// <summary>
        /// 設定パネルを開くコマンド
        /// </summary>
        [RelayCommand]
        void OpenSettings()
        {
            IsSettingsOpen = true;
        }

        /// <summary>
        /// ブラウザで開くコマンド
        /// </summary>
        [RelayCommand]
        void OpenWithBrowser()
        {
        }

        /// <summary>
        /// 設定パネル設定OKコマンド
        /// </summary>
        [RelayCommand(CanExecute = nameof(CanUpdateSettings))]
        void UpdateSettings()
        {
            IsSettingsOpen = false;
            Properties.Settings.Default.RootDirectory = RootDirectory;
            Properties.Settings.Default.NotesDirectory = NotesDirectory;
            Properties.Settings.Default.Port = Ports[(int)PortIndex];
            Properties.Settings.Default.Save();
        }
        bool CanUpdateSettings()
        {
            return !HasErrors;
        }

        /// <summary>
        /// 設定パネル設定キャンセルコマンド
        /// </summary>
        [RelayCommand]
        void ResetSettings()
        {
            IsSettingsOpen = false;
            RootDirectory = Properties.Settings.Default.RootDirectory;
            NotesDirectory = Properties.Settings.Default.NotesDirectory;
            PortIndex = Ports.IndexOf(Properties.Settings.Default.Port);
            if (PortIndex == -1)
            {
                PortIndex = 0;
            }
        }

        /// <summary>
        /// ルートディレクトリ設定コマンド
        /// </summary>
        [RelayCommand]
        void SelectRootDirectory()
        {
            RootDirectory = PathUtils.SelectDirectory(RootDirectory, Properties.Settings.Default.RootDirectory);
        }

        /// <summary>
        /// 注釈保存ディレクトリ設定コマンド
        /// </summary>
        [RelayCommand]
        void SelectNotesDirectory()
        {
            NotesDirectory = PathUtils.SelectDirectory(NotesDirectory, Properties.Settings.Default.NotesDirectory);
        }
    }
}