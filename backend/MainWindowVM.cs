using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend
{
    internal partial class MainWindowVM : ObservableObject
    {
        [ObservableProperty]
        private string name = "abcdefg";

        [RelayCommand]
        private void Greet(string user)
        {
            Debug.WriteLine($"Hello {user}!");
        }
    }
}
