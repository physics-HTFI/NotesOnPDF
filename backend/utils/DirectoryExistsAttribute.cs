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
    public class DirectoryExistsAttribute : ValidationAttribute
    {

        protected override ValidationResult? IsValid(object? value, ValidationContext context)
        {
            try
            {
                if (value is string str && Directory.Exists(Path.GetFullPath(str)))
                {
                    return ValidationResult.Success;
                }
            }
            catch
            {
            }
            return new ValidationResult("ディレクトリが存在しません");
        }
    }
}
