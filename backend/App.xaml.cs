using System.Diagnostics.Metrics;
using System.Threading;
using System.Windows;
using System.Windows.Forms;

namespace backend
{

    public partial class App : System.Windows.Application
    {
        private Mutex? _mutex;
        private MainWindow? _mainWindow;
        private TaskTrayIcon? _taskTrayIcon;

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // 二重起動防止
            _mutex = new Mutex(true, "NotesOnPDF", out bool isNew);
            if (!isNew)
            {
                _mutex?.Dispose();
                Shutdown();
                return;
            }

            _mainWindow = new MainWindow();
            _mainWindow.Show();

            _taskTrayIcon = new(
                onClick: ToggleWindowVisibility,
                onExit: Shutdown
                );
        }

        protected override void OnExit(ExitEventArgs e)
        {
            _mutex?.Dispose();
            _mainWindow?.Close();
            _taskTrayIcon?.Dispose();
            base.OnExit(e);
        }


        //|
        //| private
        //|

        void ToggleWindowVisibility()
        {
            if (_mainWindow == null) return;
            if (_mainWindow.Visibility == Visibility.Collapsed)
            {
                _mainWindow.Visibility = Visibility.Visible;
            }
            else
            {
                _mainWindow.Visibility = Visibility.Collapsed;
            }
        }

    }

}
