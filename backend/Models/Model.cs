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
        /// 開けないときは<c>null</c>が返る。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<OpenPdfResult> OpenPdf(string id)
        {
            string path = pdfTree.GetPath(id);
            var sizes = await pdfReader.Open(path);
            string? notes = PathUtils.ReadAllText(await GetNotesPath(id));
            return new(sizes, notes);
        }


        /// <summary>
        /// PDFを開いたときにフロントエンドに渡す情報
        /// </summary>
        public record OpenPdfResult(PdfReader.Size[] sizes, string? notes);


        /// <summary>
        /// ページのPNGデータを取得する。
        /// 失敗したら<c>throw</c>する。
        /// </summary>
        public async Task<byte[]> GetPagePng(string id, uint pageNum, uint width)
        {
            string path = pdfTree.GetPath(id);
            return await pdfReader.GetPagePng(path, pageNum, width);
        }


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

        /// <summary>
        /// 注釈ファイルのパスを返す。失敗したら<c>throw</c>。
        /// </summary>
        private async Task<string> GetNotesPath(string id)
        {
            string pdfPath = pdfTree.GetPath(id);
            string md5 = await pdfReader.GetMD5(pdfPath);
            return notesPaths.GetNotesPath(pdfPath, md5);
        }
    }
}
