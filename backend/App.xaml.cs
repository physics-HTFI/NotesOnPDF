using System.Windows;

namespace backend
{

    public partial class App : System.Windows.Application
    {
        Mutex? mutex;
        MainWindow? mainWindow;
        TaskTrayIcon? taskTrayIcon;
        HttpServer httpServer = new();

        protected override async void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // 二重起動防止
            mutex = new Mutex(true, "NotesOnPDF", out bool isNew);
            if (!isNew)
            {
                mutex?.Dispose();
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
                "icon.ico",
                onClick: () => mainWindowVM.ToggleWindowVisibility(),
                onExit: Shutdown
                );

            // サーバー起動
            await httpServer.StartAsync();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            mutex?.Dispose();
            mainWindow?.Close();
            taskTrayIcon?.Dispose();
            base.OnExit(e);
        }
    }
}
