using System.Text.Json;

namespace backend.test
{
    public class FileTree_Test
    {
        [Fact]
        public void GetFileTree_Test()
        {
            var fileTree = new FileTree();
            var expect = """[{"id":"d41d8cd98f","path":"","children":["55b558c7ef"]},{"id":"55b558c7ef","path":"resources","children":["0e0e3e272f"]},{"id":"0e0e3e272f","path":"resources/test.pdf","children":null}]""";
            {
                Properties.Settings.Default.RootDirectory = "./";
                var tree = fileTree.GetFileTree();
                JsonSerializer.Serialize(tree).Should().Be(expect);
            }
            {
                Properties.Settings.Default.RootDirectory = "."; // �Ō�ɃX���b�V�������邩�Ȃ����Ō��ʂ��ς��Ȃ�
                var tree = fileTree.GetFileTree();
                JsonSerializer.Serialize(tree).Should().Be(expect);
            }
            {
                Properties.Settings.Default.RootDirectory = Environment.CurrentDirectory; // �t���p�X�ł����ʂ��ς��Ȃ�
                var tree = fileTree.GetFileTree();
                JsonSerializer.Serialize(tree).Should().Be(expect);
            }
            {
                Properties.Settings.Default.RootDirectory = "dummy";
                var tree = fileTree.GetFileTree();
                JsonSerializer.Serialize(tree).Should().Be("[]");
            }
        }

        [Fact]
        public void IdToPath_Test()
        {
            Properties.Settings.Default.RootDirectory = "./";
            var fileTree = new FileTree();
            fileTree.IdToPath("dummy").Should().BeNull();
            fileTree.IdToPath("d41d8cd98f").Should().BeNull(); // �f�B���N�g���̏ꍇ��null
            fileTree.IdToPath("55b558c7ef").Should().BeNull();
            fileTree.IdToPath("0e0e3e272f").Should().Be("resources/test.pdf");
        }

    }
}