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

            mainWindow = new MainWindow();
            mainWindow.Show();

            taskTrayIcon = new(
                "icon.ico",
                onClick: ToggleWindowVisibility,
                onExit: Shutdown
                );
        }

        protected override void OnExit(ExitEventArgs e)
        {
            mutex?.Dispose();
            mainWindow?.Close();
            taskTrayIcon?.Dispose();
            base.OnExit(e);
        }


        //|
        //| private
        //|

        void ToggleWindowVisibility()
        {
            if (mainWindow == null) return;
            if (mainWindow.Visibility == Visibility.Collapsed)
            {
                mainWindow.Visibility = Visibility.Visible;
            }
            else
            {
                mainWindow.Visibility = Visibility.Collapsed;
            }
        }

    }

}
