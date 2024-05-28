using Microsoft.Win32;
using System.IO;

namespace backend
{
    /// <summary>
    /// パスの選択やファイルの入出力を行う
    /// </summary>
    internal static class PathUtils
    {

        /// <summary>
        /// フォルダダイアログを表示してフォルダパスを取得する
        /// </summary>
        /// <param name="path">初期ディレクトリ</param>
        /// <param name="fallbackPath"><c>path</c>が存在しないときの初期ディレクトリ</param>
        /// <returns>選択されたパス。キャンセル時は<c>path</c>がそのまま返る。</returns>
        static public string SelectDirectory(string path, string fallbackPath)
        {
            // 初期ディレクトリのパスを取得
            string? initialDirectory;
            try
            {
                initialDirectory = Path.GetFullPath(path);
                if (!Path.Exists(initialDirectory))
                {
                    initialDirectory = Path.GetFullPath(fallbackPath);
                }
            }
            catch
            {
                initialDirectory = "";
            }

            // ダイアログを表示し、ディレクトリが選択されたらそのパスを返す
            var dialog = new OpenFolderDialog()
            {
                InitialDirectory = initialDirectory
            };
            if (dialog.ShowDialog() == true)
            {
                return dialog.FolderName;
            }
            return path;
        }

        /// <summary>
        /// ダイアログを表示してPDFファイルパスを取得する。キャンセル時は<c>null</c>。
        /// </summary>
        static public string? SelectPdf()
        {
            var dialog = new Microsoft.Win32.OpenFileDialog()
            {
                Title = "PDFファイルを開く",
                DefaultExt = ".pdf",
                Filter = "PDFファイル (.pdf)|*.pdf",
            };

            if(dialog.ShowDialog() == true)
            {
                return dialog.FileName;
            }
            return null;
        }

        /// <summary>
        /// パスからID文字列を生成する（フロントエンドからこのIDを使ってファイルを指定する）、
        /// </summary>
        static public string PathToId(string path) => MD5.FromString(path);



        /// <summary>
        /// テキストファイルを読み込んで返す。失敗したら<c>null</c>。
        /// </summary>
        static public string? ReadAllText(string? path)
        {
            try
            {
                if (path is null) return null;
                return File.ReadAllText(path);
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// テキストを出力する。失敗したら<c>throw</c>する。
        /// </summary>
        static public void WriteAllText(string? path, string body)
        {
            if (path is null) throw new Exception();
            if (Path.GetDirectoryName(path) is not string dir) throw new Exception();
            Directory.CreateDirectory(dir);
            File.WriteAllText(path, body);
        }

    }
}
