using System.Text.Json;
using Windows.Devices.Geolocation;
using static backend.History;

namespace backend.test
{
    [Collection("history")] // 並列実行すると、history.jsonに同時アクセスしてエラーになるので逐次実行する
    public class PathModel_Test
    {
        [Fact]
        public async Task GetPaths_Test()
        {
            Properties.Settings.Default.RootDirectory = "./";
            var pathModel = new PathModel();
            pathModel.DeleteHistory();

            // 履歴追加
            new Action(() => pathModel.AddHistoryWithPath("id1", "path/to/1.pdf", Origin.InsideTree)).Should().Throw<Exception>(); // ツリー内ファイルの追加はこのメソッドを使わない
            pathModel.AddHistoryWithPath("id2", @"c:\path/to/2.pdf", Origin.OutsideTree);
            pathModel.AddHistoryWithPath("id3", "https://path/to/3.pdf", Origin.Web);            
            await pathModel.AddHistoryWithPages("0e0e3e272f", 111); // ツリー内ファイルの追加はこのメソッドを使う
            await pathModel.AddHistoryWithPages("id2", 222);            
            await new Func<Task>(async () => await pathModel.AddHistoryWithPages("id3", 333)).Should().ThrowAsync<Exception>(); // ダウンロード失敗
            await new Func<Task>(async () => await pathModel.AddHistoryWithPages("dummy", 999)).Should().ThrowAsync<Exception>();


            await new Func<Task>(async () => await pathModel.GetPaths("id1")).Should().ThrowAsync<Exception>(); // 追加に失敗しているはず

            var paths2 = await pathModel.GetPaths("id2");
            paths2.Name.Should().Be("2");
            paths2.PdfPath.Should().Be(@"c:\path/to/2.pdf");
            paths2.NotesPath.Should().Be(@"c:\path/to/2.pdf.json");

            await new Func<Task>(async () => await pathModel.GetPaths("id3")).Should().ThrowAsync<Exception>(); // ダウンロードが発生して失敗する

            var paths4 = await pathModel.GetPaths("0e0e3e272f");
            paths4.Name.Should().Be("test");
            paths4.PdfPath.Should().Be(Path.GetFullPath("resources/test.pdf"));
            paths4.NotesPath.Should().Be(Path.GetFullPath("resources/test.pdf.json"));
        }
    }
}