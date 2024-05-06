using backend.Models.impl;
using System.IO;
using static backend.NotesPaths;

namespace backend
{
    internal class Model
    {

        /// <summary>
        /// 現在のルートフォルダ内のPDF一覧を取得。
        /// ルートフォルダが変更されている場合は、呼び直せば最新のものになる。
        /// <c>throw</c>しない。
        /// </summary>
        public PdfTree.Item[] GetPdfTree() => pdfTree.GetPdfTree();


        /// <summary>
        /// PDFファイルを開く。
        /// 注釈ファイルがないときは<c>retval.notes = null</c>になる。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<HttpServer.OpenPdfResult> OpenPdf(string id)
        {
            (var path, var origin) = GetPath(id);
            var sizes = await pdfReader.Open(path, origin);
            string? notes = PathUtils.ReadAllText(await GetNotesPath(id));
            history.Add(id, path, origin, sizes.Length);
            var name = origin == PdfOrigin.Web ? path : Path.GetFileNameWithoutExtension(path);
            return new(name, sizes, notes);
        }


        /// <summary>
        /// ダイアログを開いて、ツリー外のPDFファイルの<c>id</c>を取得する。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public string GetExternalPdfId()
        {
            string path = PathUtils.SelectPdf() ?? throw new Exception();
            string id = PathUtils.Path2Id(path);
            history.Add(id, path, PdfOrigin.OutsideTree);
            return id;
        }


        /// <summary>
        /// URLからPDFファイルをダウンロードした後<c>id</c>を取得する。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public string GetWebPdfId(string url)
        {
            string id = PathUtils.Path2Id(url);
            history.Add(id, url, PdfOrigin.Web);
            return id;
        }


        /// <summary>
        /// ページのPNGデータを取得する。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<byte[]> GetPagePng(string id, uint pageNum, uint width)
        {
            (var path, var origin) = GetPath(id);
            return await pdfReader.GetPagePng(path, origin, pageNum, width);
        }


        /// <summary>
        /// 過去に開いたファイルの<c>id</c>とファイル名のリストを返す
        /// </summary>
        public HttpServer.PdfItem[] GetHistory() => history.GetHistory();


        /// <summary>
        /// <c>settings.json</c>の中身を返す。
        /// <c>throw</c>しない。
        /// </summary>
        public string? GetFrontendSettings() => PathUtils.ReadAllText(SettingsUtils.SettingsPath);


        /// <summary>
        /// <c>coverage.json</c>の中身を返す。
        /// <c>throw</c>しない。
        /// </summary>
        public string? GetCoverage() => PathUtils.ReadAllText(SettingsUtils.CoveragePath);


        public void SaveFrontendSettings(string body) => PathUtils.WriteAllText(SettingsUtils.SettingsPath, body);
        public void SaveCoverage(string body) => PathUtils.WriteAllText(SettingsUtils.CoveragePath, body);
        public async Task SaveNotes(string id, string body) => PathUtils.WriteAllText(await GetNotesPath(id), body);


        //|
        //| private
        //|

        readonly PdfTree pdfTree = new();
        readonly NotesPaths notesPaths = new();
        readonly PdfReader pdfReader = new();
        readonly History history = new();

        /// <summary>
        /// 注釈ファイルのパスを返す。失敗したら<c>throw</c>。
        /// </summary>
        async Task<string> GetNotesPath(string id)
        {
            (string pdfPath, PdfOrigin origin) = GetPath(id);
            string md5 = await pdfReader.GetMD5(pdfPath, origin);
            return notesPaths.GetNotesPath(md5, pdfPath, origin);
        }

        (string path, PdfOrigin origin) GetPath(string id)
        {
            if (pdfTree.GetPath(id) is string path)
            {
                return new(path, PdfOrigin.InsideTree);
            }
            if (history.GetItem(id) is History.Item item)
            {
                return new(item.Path, item.Origin);
            }
            throw new Exception();
        }
    }
}
