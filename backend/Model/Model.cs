using Size = Windows.Foundation.Size;

namespace backend
{
    internal class Model
    {
        /// <summary>
        /// 現在のルートフォルダ内のPDF一覧を取得。
        /// ルートフォルダが変更されている場合は、呼びなおせば最新のものになる。
        /// `throw`しない。
        /// </summary>
        public PdfPaths.PdfInfo[] GetPdfPaths() => pdfPaths.GetPaths();

        /// <summary>
        /// PDFファイルを開く。
        /// 開けないときは`null`が返る。
        /// `throw`しない。
        /// </summary>
        // TODO ルートフォルダ以外のPDFを開けるようにする
        public async Task<OpenPdfResult?> OpenPdf(string id)
        {
            try
            {
                string path = pdfPaths.GetPath(id);
                var (md5, sizes) = await pdfReader.Open(path);
                notesPaths.AddItem(path, md5);
                openedPdfs.RemoveAll(i => i.Id == id);
                openedPdfs.Add(new(id, md5));
                string? notes = PathUtils.ReadAllText(GetNotesPath(id));
                return new(sizes, notes);
            }
            catch
            {
                return null;
            }
        }

        public record OpenPdfResult(PdfReader.Size[] sizes, string? notes);

        /// <summary>
        /// ページのPNGデータを取得する。
        /// `throw`しない。
        /// </summary>
        public async Task<byte[]?> GetPagePng(string id, uint pageNum, uint width)
        {
            try
            {
                string path = pdfPaths.GetPath(id);
                return await pdfReader.GetPagePng(path, pageNum, width);
            }
            catch { return null; }
        }

        public string? GetFrontendSettings() => PathUtils.ReadAllText(SettingsUtils.SettingsPath);
        public string? GetCoverage() => PathUtils.ReadAllText(SettingsUtils.CoveragePath);

        public void SaveFrontendSettings(string body) => PathUtils.WriteAllText(SettingsUtils.SettingsPath, body);
        public void SaveCoverage(string body) => PathUtils.WriteAllText(SettingsUtils.CoveragePath, body);
        public void SaveNotes(string id, string body) => PathUtils.WriteAllText(GetNotesPath(id), body);


        #region private

        readonly PdfPaths pdfPaths = new();
        readonly NotesPaths notesPaths = new();
        readonly PdfReader pdfReader = new();
        readonly List<(string Id, string MD5)> openedPdfs = [];

        private string? GetNotesPath(string id)
        {
            try
            {
                string md5 = openedPdfs.First(p => p.Id == id).MD5;
                string path = notesPaths.GetPath(md5);
                return path;
            }
            catch { return null; }
        }

        #endregion
    }
}
