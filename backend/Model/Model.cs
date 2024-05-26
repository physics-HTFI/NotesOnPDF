using backend.Models.impl;

namespace backend
{
    internal class Model
    {

        /// <summary>
        /// PDFを開いたときにフロントエンドに渡す情報。
        /// フロントエンドに渡すので、小文字にしている。
        /// </summary>
        public record ResultGetPdfNotes(string name, PdfReader.Size[] pageSizes, string? pdfNotes);


        //|
        //| public
        //|

        /// <summary>
        /// 現在のルートフォルダ内のPDF一覧を取得。
        /// ルートフォルダが変更されている場合は、呼び直せば最新のものになる。
        /// <c>throw</c>しない。
        /// </summary>
        public FileTree.Item[] GetFileTree() => pathModel.GetFileTree();


        /// <summary>
        /// PDFファイルを開く。
        /// 注釈ファイルがないときは<c>retval.notes = null</c>になる。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<ResultGetPdfNotes> OpenPdf(string id)
        {
            var paths = await pathModel.GetPaths(id);
            var sizes = await pdfReader.GetSizes(paths.PdfPath);
            string? notes = PathUtils.ReadAllText(paths.NotesPath);
            await pathModel.AddHistory(id, sizes.Length);
            return new(paths.Name, sizes, notes);
        }


        /// <summary>
        /// ダイアログを開いて、ツリー外のPDFファイルの<c>id</c>を取得する。
        /// キャンセル時は<c>""</c>。
        /// </summary>
        public string GetExternalPdfId()
        {
            string? path = PathUtils.SelectPdf();
            if (path is null) return "";
            string id = PathUtils.PathToId(path);
            pathModel.AddHistory(id, path, History.Origin.OutsideTree);
            return id;
        }


        /// <summary>
        /// URLからPDFファイルをダウンロードした後<c>id</c>を取得する。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<string> GetWebPdfId(string url)
        {
            await DownloadPdf.FromUrlIfNeeded(url);
            string id = PathUtils.PathToId(url);
            pathModel.AddHistory(id, url, History.Origin.Web);
            return id;
        }


        /// <summary>
        /// ページのPNGデータを取得する。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<byte[]> GetPagePng(string id, int pageNum, int width, int height)
        {
            string path = (await pathModel.GetPaths(id)).PdfPath;
            return await pdfReader.GetPagePng(path, pageNum, width, height);
        }


        /// <summary>
        /// 過去に開いたファイルの<c>id</c>とファイル名のリストを返す。
        /// <c>throw</c>しない。
        /// </summary>
        public History.Item[] GetHistory() => pathModel.GetHistory();

        /// <summary>
        /// 履歴を消去。
        /// <c>throw</c>しない。
        /// </summary>
        public void DeleteHistory(string? id = null) => pathModel.DeleteHistory(id);


        /// <summary>
        /// <c>settings.json</c>の中身を返す。
        /// 存在しない場合は<c>null</c>を返す。
        /// <c>throw</c>しない。
        /// </summary>
        public string? GetFrontendSettings() => PathUtils.ReadAllText(SettingsUtils.SettingsPath);


        /// <summary>
        /// <c>coverage.json</c>の中身を返す。
        /// 存在しない場合は<c>null</c>を返す。
        /// <c>throw</c>しない。
        /// </summary>
        public string? GetCoverage() => PathUtils.ReadAllText(SettingsUtils.CoveragePath);


        public void SaveFrontendSettings(string body) => PathUtils.WriteAllText(SettingsUtils.SettingsPath, body);
        public void SaveCoverage(string body) => PathUtils.WriteAllText(SettingsUtils.CoveragePath, body);
        public async Task SaveNotes(string id, string body) => PathUtils.WriteAllText((await pathModel.GetPaths(id)).NotesPath, body);


        //|
        //| private
        //|

        readonly PathModel pathModel = new();
        readonly PdfReader pdfReader = new();
    }
}
