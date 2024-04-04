using Microsoft.Win32;
using System.IO;

namespace backend
{
    public static class PathUtils
    {

        /// <summary>
        /// フォルダダイアログを表示してフォルダパスを取得する
        /// </summary>
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
        /// テキストを読み込んで返す。失敗したら`null。
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
        /// テキストを出力する。`throw`しない。
        /// </summary>
        static public void WriteAllText(string? path, string body)
        {
            try
            {
                if (path is null) return;
                File.WriteAllText(path, body);
            }
            catch
            {
            }
        }

    }
}
