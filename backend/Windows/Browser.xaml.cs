﻿using Microsoft.Web.WebView2.Core;
using System.Diagnostics;
using System.Windows;
using System.Windows.Navigation;

namespace backend
{
    public partial class Browser : Window
    {
        public Browser()
        {
            InitializeComponent();
            if (!IsWebView2Installed)
            {
                webView.Visibility = Visibility.Collapsed;
                textNoWebView2.Visibility = Visibility.Visible;
                return;
            }
            webView.Loaded += async (_, _) =>
            {
                await webView.EnsureCoreWebView2Async();
                webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
                webView.CoreWebView2.NewWindowRequested += (_, e) =>
                {
                    // HTML内でリンクをクリックしたときは、ブラウザを立ち上げて開く
                    OpenUrl.OpenInBrowser(e.Uri);
                    e.Handled = true;
                };
            };
            Closing += (_, _) =>
            {
                // ブランクにしないと、server-sent eventが繋がったままになる
                webView.Source = new Uri("about:blank");
            };
        }


        public static Uri Url { get => new(SettingsUtils.Url.TrimEnd('/')); }
        public static double PreferredWidth { get => SystemParameters.PrimaryScreenWidth * 0.6; }
        public static double PreferredHeight { get => SystemParameters.PrimaryScreenHeight * 0.9; }

        void Hyperlink_RequestNavigate(object sender, RequestNavigateEventArgs e)
        {
            // WebView2のダウンロードページへのリンクをクリックしたときは、ブラウザを立ち上げて開く
            OpenUrl.OpenInBrowser(e.Uri.AbsoluteUri);
            e.Handled = true;
        }

        static bool IsWebView2Installed
        {
            get
            {
                // https://github.com/MicrosoftEdge/WebView2Feedback/issues/421#issuecomment-730279517
                try
                {
                    var version = CoreWebView2Environment.GetAvailableBrowserVersionString();
                    return true;
                }
                catch (WebView2RuntimeNotFoundException)
                {
                    return false;
                }
            }
        }
    }
}
