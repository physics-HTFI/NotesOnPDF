using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace backend
{
    public static class PathUtils
    {

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
    }
}
