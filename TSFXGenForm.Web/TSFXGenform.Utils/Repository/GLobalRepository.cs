using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TSFXGenform.Utils.IRepository;

namespace TSFXGenform.Utils.Repository
{
    public class GLobalRepository : IGLobalRepository
    {
        private readonly StringConstant _stringConstant;
        public GLobalRepository(StringConstant stringConstant)
        {
            _stringConstant = stringConstant;
        }

        /// <summary>
        /// Method to check whether file exist on http path.
        /// </summary>
        /// <param name="sourceFilePath"></param>
        /// <param name="listOfFile"></param>
        /// <returns></returns>
        public HttpWebResponse GetHttpWebResponseForFileExists(string sourceFilePath, string listOfFile)
        {
            HttpWebResponse response = null;
            var request = (HttpWebRequest)WebRequest.Create(sourceFilePath.Replace("\\", "/") + "/" + listOfFile);
            request.Method = "HEAD";

            try
            {
                response = (HttpWebResponse)request.GetResponse();
                return response;
            }
            catch (WebException ex)
            {
                return response;
            }
            finally
            {
                // To close response.
                if (response != null)
                {
                    response.Close();
                }
            }
        }
    }
}
