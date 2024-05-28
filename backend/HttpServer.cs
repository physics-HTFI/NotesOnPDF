using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

// https://rikoubou.hatenablog.com/entry/2023/11/09/130144
// https://qiita.com/washikawau/items/bfcd8babcffab30e6d26
// https://stackprobe.hateblo.jp/entry/2021/10/12/004217

// `listener.GetContex`の並列化
// https://stackoverflow.com/questions/28273345/how-to-process-multiple-connections-simultaneously-with-httplistener
// https://yryr.me/programming/local-http-server.html

namespace backend
{
    class HttpServer
    {
        HttpListener? listener;
        readonly ApiModel model = new();

        public async Task StartAsync()
        {
            while (true)
            {
                try
                {
                    listener = new HttpListener();
                    listener.Prefixes.Add(SettingsUtils.Url);
                    listener.Start();

                    while (listener.IsListening)
                    {
                        // リクエストを待つ
                        HttpListenerContext context = await listener.GetContextAsync();
                        if (!listener.IsListening) break;

                        // リクエストを取得
                        HttpListenerRequest request = context.Request;

                        using var response = context.Response;
                        response.AppendHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // 開発時にloclhost:5173からアクセスする必要がある
                        response.AppendHeader("Access-Control-Allow-Headers", "*"); // これがないとフロントエンド側でresponse.okが常にfalseになる
                        response.AppendHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); // PUT, DELETEを使うために必要

                        try
                        {
                            // GET
                            if (request.HttpMethod == "GET")
                            {
                                response.ContentLength64 = 0;
                                (byte[] bytes, string mime) = await ProcessGet(request.Url);
                                response.ContentLength64 = bytes.Length;
                                response.ContentType = mime;
                                response.ContentEncoding = Encoding.UTF8;
                                using Stream output = response.OutputStream;
                                await output.WriteAsync(bytes);
                            }

                            // POST
                            if (request.HttpMethod == "POST")
                            {
                                ProcessPost(request);
                            }

                            // PUT
                            if (request.HttpMethod == "PUT")
                            {
                                await ProcessPut(request);
                            }

                            // POST
                            if (request.HttpMethod == "DELETE")
                            {
                                ProcessDelete(request);
                            }
                        }
                        catch
                        {
                            response.StatusCode = (int)HttpStatusCode.BadRequest;
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


        async Task<Response> ProcessGet(Uri? uri)
        {
            ArgumentNullException.ThrowIfNull(uri);
            string url = uri.AbsolutePath; // クエリーを含まない
            if (url.Contains("..")) throw new Exception(); // 上の階層にアクセスできなくする

            // API
            // 致命的なエラーの場合は<c>throw</c>。
            // ファイルが未作成なだけの場合は文字列"null"が返る：<c>return "null"</c>。
            if (url == "/api/file-tree")
            {
                var res = model.GetFileTree();
                return getResponse(JsonSerializer.Serialize(res));
            }
            if (url == "/api/history")
            {
                var res = model.GetHistory();
                return getResponse(JsonSerializer.Serialize(res));
            }
            if (url == "/api/settings")
            {
                var res = model.GetFrontendSettings();
                return getResponse(res);
            }
            if (url == "/api/coverage")
            {
                var res = model.GetCoverage();
                return getResponse(res);
            }
            if (url == "/api/external-pdf-id")
            {
                var res = model.GetExternalPdfId();
                return getResponse(JsonSerializer.Serialize(res));
            }
            if (url == "/api/web-pdf-id")
            {
                string query = uri.GetComponents(UriComponents.Query, UriFormat.Unescaped);
                var res = await model.GetWebPdfId(query);
                return getResponse(JsonSerializer.Serialize(res));
            }
            if (Regex.IsMatch(url, @"/api/notes/[^/]+$"))
            {
                string id = url.Split('/')[3];
                var res = await model.GetPdfNotes(id);
                return getResponse(JsonSerializer.Serialize(res));
            }
            if (Regex.IsMatch(url, @"/api/images/[^/]+/[^/]+$"))
            {
                byte[] png = await model.GetPagePng(
                    id: url.Split('/')[3],
                    pageNum: int.Parse(url.Split('/')[4]),
                    width: int.Parse(Regex.Match(uri.Query, @"width=([^&]+)").Groups[1].Value),
                    height: int.Parse(Regex.Match(uri.Query, @"height=([^&]+)").Groups[1].Value)
                    );
                return new(png, MimeType(".jpg"));
            }
            static Response getResponse(string? body) => new(
                Encoding.UTF8.GetBytes(body ?? "null"),
                MimeType(".json")
                );


            // ファイル
            string file = url == "/" ? "index.html" : Path.GetFullPath(url.TrimStart('/'));
            return new(File.ReadAllBytes(file), MimeType(file));
        }

        void ProcessPost(HttpListenerRequest request)
        {
            throw new Exception();
        }

        async Task ProcessPut(HttpListenerRequest request)
        {
            using var stream = new StreamReader(request.InputStream, request.ContentEncoding);
            var body = stream.ReadToEnd();

            switch (request.RawUrl)
            {
                case "/api/settings":
                    model.SaveFrontendSettings(body);
                    return;
                case "/api/coverage":
                    model.SaveCoverage(body);
                    return;
                case string s when Regex.IsMatch(s, @"^/api/notes/[^/]+$"):
                    await model.SaveNotes(id: s.Split('/')[^1], body);
                    return;
                default:
                    throw new Exception();
            }
        }

        void ProcessDelete(HttpListenerRequest request)
        {
            switch (request.RawUrl)
            {
                case "/api/history":
                    model.DeleteHistory();
                    return;
                case string s when Regex.IsMatch(s, @"^/api/history/[^/]+$"):
                    model.DeleteHistory(id: s.Split('/')[^1]);
                    return;
                default:
                    throw new Exception();
            }
        }


        record Response(byte[] Bytes, string Mime);

        static string MimeType(string path)
        {
            return Path.GetExtension(path) switch
            {
                ".css" => "text/css",
                ".html" => "text/html",
                ".jpg" => "image/jpeg",
                ".js" => "application/x-javascript",
                ".json" => "application/json",
                ".pdf" => "application/pdf",
                ".svg" => "image/svg+xml",
                _ => throw new Exception()
            };
        }
    }
}
