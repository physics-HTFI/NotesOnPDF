using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    class TaskTrayIcon : IDisposable
    {
        private readonly ContextMenuStrip _menu;
        private readonly NotifyIcon _notifyIcon;

        public TaskTrayIcon(Action onClick, Action onExit)
        {
            _menu = new ContextMenuStrip();
            _menu.Items.Add("終了", null, (s, e) => { onExit(); });

            var icon = System.Windows.Application.GetResourceStream(new Uri("icon.ico", UriKind.Relative)).Stream;
            _notifyIcon = new()
            {
                Visible = true,
                Icon = new Icon(icon),
                Text = "NotesOnPDF",
                ContextMenuStrip = _menu,
            };
            _notifyIcon.MouseClick += (s, e) =>
            {
                if (e.Button != MouseButtons.Left) return;
                onClick();
            };
        }

        public void Dispose()
        {
            _menu?.Dispose();
            _notifyIcon?.Dispose();
        }
    }
}
