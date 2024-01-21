﻿using System;
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
            _menu = GetMenu(onExit);
            _notifyIcon = GetNotifyIcon("icon.ico", _menu, onClick);
        }

        public void Dispose()
        {
            _menu?.Dispose();
            _notifyIcon?.Dispose();
        }


        //|
        //| static private
        //|

        static ContextMenuStrip GetMenu(Action onExit)
        {
            var menu = new ContextMenuStrip();
            menu.Items.Add("終了", null, (s, e) => { onExit(); });
            return menu;
        }

        static NotifyIcon GetNotifyIcon(string iconFile, ContextMenuStrip menu, Action onClick)
        {
            var icon = System.Windows.Application.GetResourceStream(new Uri(iconFile, UriKind.Relative)).Stream;
            var notifyIcon = new NotifyIcon()
            {
                Visible = true,
                Icon = new Icon(icon),
                Text = "NotesOnPDF",
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
