using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

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

        private void OnExit(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void OnOpenBrowser(object sender, RoutedEventArgs e)
        {
        }
    }
}