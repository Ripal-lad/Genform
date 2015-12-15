using System;
using System.Xml;
using System.Xml.Serialization;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Utils.GlobalUtils;

namespace TSFXGenform.Repository.Repository
{
    public class XmlDataRepository<TDataSource> : IXmlDataRepository<TDataSource> where TDataSource : class
    {
        
        /// <summary>
        /// Deserialize Xml data.
        /// </summary>
        /// <param name="resourceFilePath"></param>
        /// <returns></returns>
        public TDataSource DeserializeXmlData(string resourceFilePath)
         {
             try
             {
                 if (string.IsNullOrWhiteSpace(resourceFilePath)) return null;

                 var xmlDoc = new XmlDocument();
                 xmlDoc.Load(resourceFilePath.Replace("\\","/"));


                 var rootElement = xmlDoc.DocumentElement;

                 if (rootElement != null)
                 {
                     var xmlList = rootElement.ChildNodes;

                     foreach (XmlNode nodeValue in xmlList)
                     {
                         switch (nodeValue.Name)
                         {
                             //case "QuizPageQuestions":
                             case "QuizQuestions":
                                 foreach (XmlNode xmlNodeValue in nodeValue)
                                 {
                                     EncodeXmlNodeValues(xmlNodeValue);

                                 }
                                 break;
                             case "Resource":
                             case "Quiz":
                                 EncodeXmlNodeValues(nodeValue);
                                 break;
                         }
                     }
                 }

                 var reader = new XmlNodeReader(xmlDoc);
                 var desSerializer = new XmlSerializer(typeof(TDataSource)); // deserialize data from the XML file.

                 var xmlResultData = (TDataSource)desSerializer.Deserialize(reader);
                 reader.Close();
                 return xmlResultData;
             }
             catch (Exception ex)
             {
                 LogSystem.EmailLogException(ex, 0, "XmlDataRepository : DeserializeXmlData");
                 throw ;
             }
         }

        /// <summary>
        /// Method to convert special char to ANSI value
        /// </summary>
        /// <param name="nodeValue"></param>
        private static void EncodeXmlNodeValues(XmlNode nodeValue)
        {
            try
            {
                foreach (XmlElement xmlElement in nodeValue)
                {
                    if (!xmlElement.InnerXml.Contains("<") && !xmlElement.InnerXml.Contains(">") &&
                        !xmlElement.InnerXml.Contains("\"") && !xmlElement.InnerXml.Contains("'"))
                        continue;

                    var encodedXml =
                        xmlElement.InnerXml.Replace("&", "&amp;")
                            .Replace("<", "&lt;")
                            .Replace(">", "&gt;")
                            .Replace("\"", "&quot;")
                            .Replace("'", "&apos;");
                    xmlElement.InnerXml = encodedXml;
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "XmlDataRepository : EncodeXmlNodeValues");
                throw;
            }

        }

        #region "Dispose Method(s)"

        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            try
            {
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "XmlDataRepository : Dispose");
                throw;
            }

        }

        #endregion

    }
}
