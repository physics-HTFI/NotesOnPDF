using System.Diagnostics;
using System.IO;
using System.Net;
using System.Text;

// `listener.GetContex`の並列化
// https://stackoverflow.com/questions/28273345/how-to-process-multiple-connections-simultaneously-with-httplistener
// https://yryr.me/programming/local-http-server.html

namespace backend
{
    class HttpServer
    {
        HttpListener? listener;

        public async Task StartAsync()
        {
            while (true)
            {
                try
                {
                    listener = new HttpListener();
                    listener.Prefixes.Add(Settings.Url);
                    listener.Start();

                    while (listener.IsListening)
                    {
                        try
                        {
                            // リクエストを待つ
                            HttpListenerContext context = await listener.GetContextAsync();
                            if (!listener.IsListening) break;

                            // リクエストを取得
                            HttpListenerRequest request = context.Request;

                            // ファイルの中身を返す
                            if (request.HttpMethod == "GET")
                            {
                                using HttpListenerResponse response = context.Response;
                                response.ContentLength64 = 0;
                                using System.IO.Stream output = response.OutputStream;
                                if (Get(request.RawUrl) is (byte[] bytes, string mime))
                                {
                                    response.ContentLength64 = bytes.Length;
                                    response.ContentType = mime;
                                    response.ContentEncoding = Encoding.UTF8;
                                    await output.WriteAsync(bytes);
                                }
                                else
                                {
                                    response.StatusCode = 400;
                                }

                                if (request.RawUrl == "/api/app-settings")
                                {
                                }
                                if (request.RawUrl == "/api/notes/{id}")
                                {
                                }
                                if (request.RawUrl == "/api/coverage")
                                {
                                }
                                if (request.RawUrl == "/images/{pdf-id}/{page}?size=xxx")
                                {
                                }
                                if (request.RawUrl == "/file-tree")
                                {
                                }
                            }

                            // 
                            if (request.HttpMethod == "POST")
                            {
                                if (request.RawUrl == "/api/app-settings")
                                {
                                }
                                if (request.RawUrl == "/api/notes/{id}")
                                {
                                }
                                if (request.RawUrl == "/api/coverage")
                                {
                                }
                            }
                        }
                        catch
                        {
                        }
                    }
                }
                catch
                {
                }
                finally
                {
                    Stop();
                }
            }
        }

        void Stop()
        {
            listener?.Stop();
            listener?.Close();
        }


        Response? Get(string? request)
        {
            ArgumentNullException.ThrowIfNull(request);
            Debug.WriteLine(request);
            string[] parsed = request.Split('?', '&');

            string url = WebUtility.UrlDecode(parsed[0].TrimStart('/'));
            // string[] queries = parsed[1..];

            if (url.Contains("..")) return null;
            string path = string.IsNullOrEmpty(url) ? "index.html" : Path.GetFullPath(url);
            if (File.Exists(path))
            {
                return new(File.ReadAllBytes(path), MimeType(path));
            }
            else
            {
                return new(Encoding.UTF8.GetBytes($"not found: \"{url}\""), "");
            }

        }

        record Response(byte[] Bytes, string Mime);

        static string MimeType(string path)
        {
            return Path.GetExtension(path) switch
            {
                ".css" => "text/css",
                ".gif" => "image/gif",
                ".gz" => "application/x-gzip",
                ".htm" => "text/html",
                ".html" => "text/html",
                ".ico" => "image/x-icon",
                ".jpeg" => "image/jpeg",
                ".jpg" => "image/jpeg",
                ".js" => "application/x-javascript",
                ".json" => "application/json",
                ".pdf" => "application/pdf",
                ".png" => "image/png",
                ".svg" => "image/svg+xml",
                ".tar" => "application/x-tar",
                ".tgz" => "application/x-compressed",
                ".txt" => "text/plain",
                ".zip" => "application/zip",
                _ => "application/octet-stream",
            };
        }
    }
}
