using System.Windows;
using System.Windows.Forms;

namespace backend
{

    public partial class App : System.Windows.Application
    {
        private TaskTrayIcon? _taskTrayIcon;

        /// <summary>
        /// 常駐開始時
        /// </summary>
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            _taskTrayIcon = new(
                onClick: () => {
                    // TODO ウィンドウが複数表示されないようにする
                    // TODO アプリを複数起動できないようにする: 
                },
                onExit: Shutdown
                );

        }

        /// <summary>
        /// 常駐終了時
        /// </summary>
        protected override void OnExit(ExitEventArgs e)
        {
            _taskTrayIcon?.Dispose();
            base.OnExit(e);
        }
    }

}
