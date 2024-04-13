using System.Windows;

namespace backend
{
    public partial class Browser : Window
    {
        public Browser()
        {
            InitializeComponent();
        }


        public static Uri Url { get => new(SettingsUtils.Url.TrimEnd('/')); }
        public static double PreferredWidth { get => SystemParameters.PrimaryScreenWidth * 0.6; }
        public static double PreferredHeight { get => SystemParameters.PrimaryScreenHeight * 0.9; }
    }
}
