using System.Windows;

namespace backend
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            WindowStartupLocation = WindowStartupLocation.Manual;
            Top = SystemParameters.WorkArea.Height - Height;
            Left = SystemParameters.WorkArea.Width - Width;
        }
    }
}