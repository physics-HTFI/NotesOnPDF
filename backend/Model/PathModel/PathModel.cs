using backend.Models.impl;
using System.IO;
using System.Security.Policy;

namespace backend
{
    internal class PathModel
    {
        /// <summary>
        /// <c>Name</c>は、フロントエンドの<c>PdfNotes</c>の題名として使用される
        /// </summary>
        public record Paths(string Id, string Name, string PdfPath, string NotesPath, string PathOrUrl, History.Origin Origin);


        //|
        //| public
        //|

        /// <summary>
        /// 現在のルートフォルダ内のPDF一覧を取得。
        /// ルートフォルダが変更されている場合は、呼び直せば最新のものになる。
        /// <c>throw</c>しない。
        /// </summary>
        public FileTree.Item[] GetFileTree() => fileTree.GeFileTree();


        /// <summary>
        /// ツリー外ファイルやWebファイルを履歴の最上位に追加する。
        /// <c>origin==Origin.Web</c>の場合、<c>path</c>はURL、それ以外はPDFへのフルパス。
        /// 失敗したら<c>throw</c>
        /// </summary>
        public void AddHistory(string id, string pathOrUrl, History.Origin origin)
        {
            history.Add(id, pathOrUrl, origin);
        }

        /// <summary>
        /// ファイルツリー内か履歴内のファイルを履歴の最上位に追加する。
        /// 失敗したら<c>throw</c>
        /// </summary>
        public async Task AddHistory(string id, int pages)
        {
            var paths = await GetPaths(id);
            var pathOrUrl = paths.Origin == History.Origin.Web ? paths.PathOrUrl : paths.PdfPath;
            history.Add(id, pathOrUrl, paths.Origin, pages);
        }

        /// <summary>
        /// 過去に開いたファイルの<c>id</c>とファイル名のリストを返す。
        /// <c>throw</c>しない。
        /// </summary>
        public History.Item[] GetHistory() => history.GetHistory();

        /// <summary>
        /// 履歴を消去。
        /// <c>throw</c>しない。
        /// </summary>
        public void DeleteHistory(string? id = null) => history.DeleteHistory(id);


        public async Task<Paths> GetPaths(string id)
        {
            if (id == paths?.Id) return paths;

            paths = null;
            if (fileTree.IdToPath(id) is string tPath)
            {
                var name = Path.GetFileNameWithoutExtension(tPath);
                string pdfPath = Path.Combine(Environment.CurrentDirectory, SettingsUtils.RootDirectory, tPath);
                paths = new(id, name, pdfPath, pdfPath + ".json", tPath, History.Origin.InsideTree);
            }
            if (history.IdToPath(id) is (string hPathOrUrl, History.Origin hOrigin))
            {
                if (hOrigin == History.Origin.Web)
                {
                    string pdfPath = await DownloadPdf.FromUrlIfNeeded(hPathOrUrl);
                    paths = new(id, hPathOrUrl, pdfPath, pdfPath + ".json", hPathOrUrl, hOrigin);
                }
                else
                {
                    var name = Path.GetFileNameWithoutExtension(hPathOrUrl);
                    paths = new(id, name, hPathOrUrl, hPathOrUrl + ".json", hPathOrUrl, hOrigin);

                }
            }

            return paths ?? throw new Exception();
        }


        //|
        //| private
        //|

        readonly FileTree fileTree = new();
        readonly History history = new();
        Paths? paths;
    }
}
