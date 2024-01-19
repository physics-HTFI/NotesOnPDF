using Microsoft.Toolkit.Uwp.Notifications;
using System.Windows;
using System.Windows.Forms;

namespace backend
{

    public partial class App : System.Windows.Application
    {
        private ContextMenuStrip? _menu;
        private NotifyIcon? _notifyIcon;
        private MainWindow? _win = null;

        /// <summary>
        /// 常駐開始時の初期化処理
        /// </summary>
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            _menu = new ContextMenuStrip();
            _menu.Items.Add("設定", null, (s, e) => {  });
            _menu.Items.Add("終了", null, (s, e) => { Shutdown(); });

            var icon = GetResourceStream(new Uri("icon.ico", UriKind.Relative)).Stream;
            _notifyIcon = new() 
            {
                Visible = true,
                Icon = new Icon(icon),
                Text = "NotesOnPDF",
                ContextMenuStrip = _menu,
            };

            _notifyIcon.MouseClick += (s, e) =>
            {
                if (e.Button == MouseButtons.Left)
                {
                    // TODO ウィンドウが複数表示されないようにする
                    // TODO アプリを複数起動できないようにする: 
                }
            };

            // https://learn.microsoft.com/ja-jp/windows/apps/design/shell/tiles-and-notifications/adaptive-interactive-toasts?tabs=appsdk
            new ToastContentBuilder()
                .AddArgument("action", "viewConversation")
                .AddArgument("conversationId", 9813)
                .AddText("Andrew sent you a picture")
                .AddText("Check this out, The Enchantments in Washington!")
                .Show();
        }

        /// <summary>
        /// 常駐終了時の処理
        /// </summary>
        protected override void OnExit(ExitEventArgs e)
        {
            _menu?.Dispose();
            _notifyIcon?.Dispose();
            base.OnExit(e);
        }
    }

}
