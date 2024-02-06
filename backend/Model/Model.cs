using Size = Windows.Foundation.Size;

namespace backend
{
    internal class Model
    {
        readonly PdfPaths pdfPaths = new();
        readonly NotesPaths notesPaths = new();
        readonly PdfReader pdfReader = new();
        readonly List<(string Id, string MD5)> openedPdfs = [];

        record OpenPdfResult(string? Notes, int PageNum, List<Size> Sizes);

        public PdfPaths.PdfInfo[] GetPdfPaths() => pdfPaths.GetPaths();

        public async Task<(uint pageNum, Size[] sizes)?> OpenPdf(string id)
        {
            try
            {
                string path = pdfPaths.GetPath(id);
                var (md5, pageNum, sizes) = await pdfReader.Open(path);
                notesPaths.AddItem(path, md5);
                openedPdfs.RemoveAll(i => i.Id == id);
                openedPdfs.Add(new(id, md5));
                return (pageNum, sizes);
            }
            catch
            {
                return null;
            }
        }

        async Task<byte[]?> GetPagePng(string id, uint pageNum, uint width)
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
        public string? GetNotes(string id) => PathUtils.ReadAllText(GetNotesPath(id));

        public void SaveFrontendSettings(string body) => PathUtils.WriteAllText(SettingsUtils.SettingsPath, body);
        public void SaveCoverage(string body) => PathUtils.WriteAllText(SettingsUtils.CoveragePath, body);
        public void SaveNotes(string id, string body) => PathUtils.WriteAllText(GetNotesPath(id), body);


        #region private

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
