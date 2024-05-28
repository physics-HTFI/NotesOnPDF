
namespace backend.test
{
    public class PathUtils_Test
    {
        [Fact]
        public void PathToId_Test()
        {
            // フロントエンドでMD5の変換に使っているライブラリは：https://github.com/emn178/js-md5
            // ↑はオンラインで実行できる：https://emn178.github.io/online-tools/md5.html?input_type=utf-8&input=abc%2F%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A.pdf&hmac_input_type=utf-8&output_type=hex
            // ↑で変換した値と同じなることを確認する。
            PathUtils.PathToId("abc/あいうえお.pdf").Should().Be("07ce131c7ae49226db8eb8d3def3d8f7"[..10]);

        }

        [Fact]
        public void ReadAllText_WriteAllText_Test()
        {
            // 存在しないファイルを読もうとするとnullが返る
            {
                PathUtils.ReadAllText("dummy").Should().BeNull();
            }

            // ファイルパスの途中のサブディレクトリも生成する
            {
                string path = "PathUtils_Test/WriteAllText.txt";
                if (Path.GetDirectoryName(path) is string dir)
                {
                    if (Directory.Exists(dir))
                    {
                        Directory.Delete(dir, true);
                    }
                }

                string expect = "abcあいうえお";
                PathUtils.WriteAllText(path, expect);
                PathUtils.ReadAllText(path).Should().Be(expect);
            }

        }
    }
}