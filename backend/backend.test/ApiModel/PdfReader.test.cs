
namespace backend.test
{
    public class PdfReader_Test
    {
        [Fact]
        public async Task GetSizes_Test()
        {
            var reader = new PdfReader();
            var sizes = await reader.GetSizes("resources/test.pdf");
            sizes.Should().NotBeNull();
            sizes.Length.Should().Be(29);
            sizes[0].width.Should().BeApproximately(419.53, 0.01);
            sizes[0].height.Should().BeApproximately(595.28, 0.01);
        }

        [Fact]
        public async Task GetPagePng_Test()
        {
            var reader = new PdfReader();
            var png = await reader.GetPagePng("resources/test.pdf", 3, 419, 595);
            png.Should().NotBeNull();
            File.WriteAllBytes("resources/test.png", png);
        }
    }
}