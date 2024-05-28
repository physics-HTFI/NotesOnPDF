using System.ComponentModel.DataAnnotations;
using System.IO;

namespace backend
{
    internal class DirectoryExistsAttribute : ValidationAttribute
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
