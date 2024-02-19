﻿using System.Diagnostics;
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
        readonly NotePaths notePaths = new();
        readonly Model model = new();

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
                        try
                        {
                            // リクエストを待つ
                            HttpListenerContext context = await listener.GetContextAsync();
                            if (!listener.IsListening) break;

                            // リクエストを取得
                            HttpListenerRequest request = context.Request;

                            // GET
                            if (request.HttpMethod == "GET")
                            {
                                using HttpListenerResponse response = context.Response;
                                response.ContentLength64 = 0;
                                using System.IO.Stream output = response.OutputStream;
                                if (await ProcessGet(request.Url) is (byte[] bytes, string mime))
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
                            }

                            // POST
                            if (request.HttpMethod == "POST")
                            {
                                ProcessPost(request);
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


        async Task<Response?> ProcessGet(Uri? uri)
        {
            ArgumentNullException.ThrowIfNull(uri);
            string url = uri.AbsolutePath;
            if (url.Contains("..")) return null; // 上の階層にアクセスできなくする

            // API
            if (url == "/api/file-tree")
            {
                return getJsonResponse(model.GetPdfPaths());
            }
            if (url == "/api/app-settings")
            {
                return getJsonResponse(model.GetFrontendSettings());
            }
            if (url == "/api/coverage")
            {
                return getJsonResponse(model.GetCoverage());
            }
            if (url.StartsWith("/api/notes/"))
            {
                if (uri.Segments.Length != 4) return null;
                string id = uri.Segments[3]; // ["/", "api/", "notes/", "{id}"]
                var body = await model.OpenPdf(id);
                if (body is null) return null;
                return getJsonResponse(body);
            }
            if (url.StartsWith("/api/images/"))
            {
                try
                {
                    byte[]? png = await model.GetPagePng(
                        id: uri.Segments[3][..^1],  // ["/", "api/", "images/", "{id}/", "{page}"]
                        pageNum: uint.Parse(uri.Segments[4]),
                        width: uint.Parse(Regex.Match(uri.Query, @"size=([^&]+)").Groups[1].Value)
                        );
                    if (png == null) return null;
                    return new(png, MimeType(".png"));
                }
                catch
                {
                    return null;
                }
            }
            Response getJsonResponse<T>(T body) => new(
                Encoding.UTF8.GetBytes(JsonSerializer.Serialize(body)),
                MimeType(".json")
                );


            // ファイル
            string path = url == "/" ? "index.html" : Path.GetFullPath(url);
            if (File.Exists(path))
            {
                return new(File.ReadAllBytes(path), MimeType(path));
            }
            else
            {
                return new(Encoding.UTF8.GetBytes($"not found: \"{uri}\""), "");
            }
        }

        void ProcessPost(HttpListenerRequest request)
        {
            string path = request.RawUrl switch
            {
                "/api/app-settings" => SettingsUtils.SettingsPath,
                "/api/coverage" => SettingsUtils.CoveragePath,
                string s when s.StartsWith("/api/notes/") => notePaths.GetPath(s.Replace("/api/notes/", "")) ?? throw new Exception(),
                _ => throw new Exception()
            };

            using var stream = new StreamReader(request.InputStream, request.ContentEncoding);
            File.WriteAllText(path, stream.ReadToEnd());
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
