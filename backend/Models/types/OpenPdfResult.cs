
namespace backend
{
    /// <summary>
    /// PDFを開いたときにフロントエンドに渡す情報
    /// </summary>
    public record OpenPdfResult(string name, Size[] sizes, string? notes);
}
