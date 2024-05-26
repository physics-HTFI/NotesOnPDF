using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Diagnostics;
using System.Windows;

namespace backend
{
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
        private string _DownloadDirectory = "";

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
        void OpenInBrowser()
        {
            try
            {
                OpenUrl.OpenInBrowser(SettingsUtils.Url);
                ToggleWindowVisibility();
            }
            catch { }
        }

        /// <summary>
        /// ウィンドウで開くコマンド
        /// </summary>
        [RelayCommand]
        void OpenWithWindow()
        {
            try
            {
                var window = new Browser();
                window.Closed += (_, _) => Visibility = Visibility.Visible;
                window.Show();
                ToggleWindowVisibility();
            }
            catch { }
        }

        /// <summary>
        /// 設定パネル設定OKコマンド
        /// </summary>
        [RelayCommand(CanExecute = nameof(CanUpdateSettings))]
        void UpdateSettings()
        {
            IsSettingsOpen = false;
            Properties.Settings.Default.RootDirectory = RootDirectory;
            Properties.Settings.Default.DownloadDirectory = DownloadDirectory;
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
            DownloadDirectory = Properties.Settings.Default.DownloadDirectory;
            PortIndex = Ports.IndexOf(Properties.Settings.Default.Port);
            if (PortIndex == -1)
            {
                PortIndex = 0;
            }
        }

        /// <summary>
        /// ルートディレクトリ選択コマンド
        /// </summary>
        [RelayCommand]
        void SelectRootDirectory()
        {
            RootDirectory = PathUtils.SelectDirectory(RootDirectory, Properties.Settings.Default.RootDirectory);
        }

        /// <summary>
        /// ダウンロードディレクトリ選択コマンド
        /// </summary>
        [RelayCommand]
        void SelectDownloadDirectory()
        {
            DownloadDirectory = PathUtils.SelectDirectory(DownloadDirectory, Properties.Settings.Default.DownloadDirectory);
        }
    }
}