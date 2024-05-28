

namespace backend.test
{
    public class MD5_Test
    {
        [Fact]
        public void FromString_Test()
        {
            // �t�����g�G���h��MD5�̕ϊ��Ɏg���Ă��郉�C�u�����́Fhttps://github.com/emn178/js-md5
            // ���̓I�����C���Ŏ��s�ł���Fhttps://emn178.github.io/online-tools/md5.html?input_type=utf-8&input=abc%2F%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A.pdf&hmac_input_type=utf-8&output_type=hex
            // ���ŕϊ������l�Ɠ����Ȃ邱�Ƃ��m�F����B
            MD5.FromString("abc/����������.pdf").Should().Be("07ce131c7ae49226db8eb8d3def3d8f7"[..10]);
        }
    }
}