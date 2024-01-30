using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Windows.ApplicationModel.Contacts;

namespace backend
{
    class HttpServer
    {
        public string Port { get; set; } = "8080";

        public Task StartAsync()
        {
            return Task.Run(Start);
        }

        void Start()
        {
            try
            {
                using var listener = new HttpListener();
                listener.Prefixes.Add($"http://localhost:{Port}/");
                listener.Start();

                while (true)
                {
                    try
                    {
                        // リクエストを待つ
                        HttpListenerContext context = listener.GetContext();

                        // リクエストを取得
                        HttpListenerRequest request = context.Request;

                        // ファイルの中身を返す
                        using HttpListenerResponse response = context.Response;
                        using System.IO.Stream output = response.OutputStream;
                        byte[] bytes = Router(request.RawUrl);
                        output.Write(bytes, 0, bytes.Length);
                    }
                    catch
                    {
                    }
                }
            }
            catch
            {

            }
        }

        static byte[] Router(string? url)
        {
            Debug.WriteLine(url);
            ArgumentNullException.ThrowIfNull(url);

            string path = Path.GetFullPath("." + url);
            if (File.Exists(path))
            {
                return File.ReadAllBytes(path);
            }
            else
            {
                return Encoding.UTF8.GetBytes($"not found: \"{url}\"");
            }

        }
    }
}
