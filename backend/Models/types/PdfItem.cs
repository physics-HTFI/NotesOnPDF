
namespace backend
{
    /// <summary>
    /// フロントエンドに渡す1ファイル分の情報。
    /// <c>origin</c>は0:ツリー内のファイル、1:ツリー外のファイル、2:ウェブから取得したファイル
    /// </summary>
    public record PdfItem(string id, string name, string pages, string origin, string accessDate);
}
