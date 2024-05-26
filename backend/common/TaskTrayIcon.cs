namespace backend
{
    /// <summary>
    /// タスクトレイにアイコンを追加する
    /// </summary>
    class TaskTrayIcon : IDisposable
    {
        public TaskTrayIcon(string text, string icon, Action onClick, Action onExit)
        {
            _menu = GetMenu(onExit);
            _notifyIcon = GetNotifyIcon(text, icon, _menu, onClick);
        }

        public void Dispose()
        {
            _menu?.Dispose();
            _notifyIcon?.Dispose();
        }

        //|
        //| private
        //|

        private readonly ContextMenuStrip _menu;
        private readonly NotifyIcon _notifyIcon;

        //|
        //| static private
        //|

        static ContextMenuStrip GetMenu(Action onExit)
        {
            var menu = new ContextMenuStrip();
            menu.Items.Add("終了", null, (s, e) => { onExit(); });
            return menu;
        }

        static NotifyIcon GetNotifyIcon(string text, string iconFile, ContextMenuStrip menu, Action onClick)
        {
            var icon = System.Windows.Application.GetResourceStream(new Uri(iconFile, UriKind.Relative)).Stream;
            var notifyIcon = new NotifyIcon()
            {
                Visible = true,
                Icon = new Icon(icon),
                Text = text,
                ContextMenuStrip = menu,
            };
            notifyIcon.MouseClick += (s, e) =>
            {
                if (e.Button != MouseButtons.Left) return;
                onClick();
            };

            return notifyIcon;
        }
    }
}
