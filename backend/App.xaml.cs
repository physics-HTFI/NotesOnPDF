using System.Windows;

namespace backend
{

    public partial class App : System.Windows.Application
    {
        Mutex? mutex;
        MainWindow? mainWindow;
        TaskTrayIcon? taskTrayIcon;
        readonly HttpServer httpServer = new();

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // 二重起動防止
            mutex = new Mutex(true, "NotesOnPDF", out bool isNew);
            if (!isNew)
            {
                mutex?.Dispose();
                System.Windows.MessageBox.Show("すでに起動しています。\nタスクバーの通知領域内を探してください。", "NotesOnPDF");
                Shutdown();
                return;
            }

            // ウィンドウ表示
            var mainWindowVM = new MainWindowVM();
            mainWindow = new MainWindow
            {
                DataContext = mainWindowVM
            };
            mainWindow.Show();

            // タスクトレイアイコン表示
            taskTrayIcon = new(
                "NotesOnPDF",
                "icon.ico",
                onClick: () => mainWindowVM.ToggleWindowVisibility(),
                onExit: Shutdown
                );

            // サーバー起動
            bool isOk = httpServer.Start(() => Current.Dispatcher.Invoke(mainWindow.Show));
            if(!isOk)
            {
                System.Windows.MessageBox.Show("ポートが開けません。\nアプリを終了します。", "NotesOnPDF");
                Shutdown();
            }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            mutex?.Dispose();
            mainWindow?.Close();
            taskTrayIcon?.Dispose();
            httpServer.Dispose();
            base.OnExit(e);
        }
    }
}
