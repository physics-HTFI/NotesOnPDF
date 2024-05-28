using System.Text.Json;
using static backend.History;

namespace backend.test
{
    [Collection("history")] // 並列実行すると、history.jsonに同時アクセスしてエラーになるので逐次実行する
    public class History_Test
    {
        [Fact]
        public void Get_Test()
        {
            var history = ConstructHistory();
            var items = history.Get();
            items.Length.Should().Be(3);

            items[0].id.Should().Be("id3");
            items[0].name.Should().Be("https://path/to/3.pdf"); // ウェブの場合はURL
            items[0].pages.Should().Be("333");
            items[0].origin.Should().Be("ウェブ");

            items[1].id.Should().Be("id2");
            items[1].name.Should().Be("2.pdf");
            items[1].pages.Should().Be("???"); // ページ数が不明な場合
            items[1].origin.Should().Be("ツリー外");

            items[2].id.Should().Be("id1");
            items[2].name.Should().Be("1.pdf");
            items[2].pages.Should().Be("111");
            items[2].origin.Should().Be("ツリー");
        }

        [Fact]
        public void Delete_Test()
        {
            {
                var history = ConstructHistory();
                history.Delete();
                history.Get().Should().BeEmpty();
            }
            {
                var history = ConstructHistory();
                history.Delete("id2");
                history.Get().Length.Should().Be(2);
                history.IdToPath("id2").Should().BeNull();
            }
        }


        [Fact]
        public void IdToPath_Test()
        {
            var history = ConstructHistory();

            history.IdToPath("id1")?.pathOrUrl.Should().Be("path/to/1.pdf");
            history.IdToPath("id2")?.pathOrUrl.Should().Be(@"c:\path/to/2.pdf");
            history.IdToPath("id3")?.pathOrUrl.Should().Be("https://path/to/3.pdf");
            history.IdToPath("id4").Should().BeNull();
        }


        //|
        //| private
        //|

        History ConstructHistory()
        {
            Properties.Settings.Default.RootDirectory = "./";
            var history = new History();
            history.Delete();
            history.Add("id1", "path/to/1.pdf", Origin.InsideTree, 111);
            history.Add("id2", @"c:\path/to/2.pdf", Origin.OutsideTree);
            history.Add("id3", "https://path/to/3.pdf", Origin.Web, 333);
            return history;
        }


    }
}