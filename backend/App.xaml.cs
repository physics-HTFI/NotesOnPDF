using System.Diagnostics.Metrics;
using System.Threading;
using System.Windows;
using System.Windows.Forms;

namespace backend
{

    public partial class App : System.Windows.Application
    {
        private Mutex? mutex;
        private MainWindow? mainWindow;
        private TaskTrayIcon? taskTrayIcon;

        protected override void OnStartup(StartupEventArgs e)
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

            var mainWindowVM = new MainWindowVM();
            mainWindow = new MainWindow
            {
                DataContext = mainWindowVM
            };
            mainWindow.Show();

            taskTrayIcon = new(
                "icon.ico",
                onClick: () => mainWindowVM.ToggleWindowVisibility(),
                onExit: Shutdown
                );

            HttpServer.StartListener();
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
