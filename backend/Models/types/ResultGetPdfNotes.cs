
namespace backend
{
    /// <summary>
    /// PDFを開いたときにフロントエンドに渡す情報。
    /// フロントエンドに渡すので、小文字にしている。
    /// </summary>
    public record ResultGetPdfNotes(string name, Size[] pageSizes, string? pdfNotes);
}
