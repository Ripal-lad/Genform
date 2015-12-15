using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace TSFXGenform.Utils.IRepository
{
    public interface IGLobalRepository
    {
        HttpWebResponse GetHttpWebResponseForFileExists(string sourceFilePath, string listOfFile);      
    }
}
