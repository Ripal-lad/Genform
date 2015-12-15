using System.Configuration;

namespace TSFXGenform.Utils
{
    public class StringConstant
    {
        #region "Web config keys"

        public readonly string ResourceXmlFilePath = ConfigurationManager.AppSettings["ResourceXMLFilePath"];

        public readonly string LocalOutPutFolderPath =ConfigurationManager.AppSettings["LocalOutPutFolderPath"];

        public readonly string HiddenCodeLength =ConfigurationManager.AppSettings["HiddenCodeLength"];
       
        public readonly string AppWriteWebReadResourceDataFolderPath = ConfigurationManager.AppSettings["AppWriteWebReadResourceDataFolderPath"];

        public readonly string XmlFileFolderPath =ConfigurationManager.AppSettings["AppReadFolderPath"];

        public readonly string PathForFormsFolder =ConfigurationManager.AppSettings["PathForFormsFolder"];            

        public readonly string AppWriteWebReadFolderPath =ConfigurationManager.AppSettings["AppWriteWebReadFolderPath"];          

        public readonly string ServerOutPutFolderPath =ConfigurationManager.AppSettings["ServerOutPutFolderPath"];
           
        public readonly string BaseXmlFileFolderPath =ConfigurationManager.AppSettings["BaseXmlFileFolderPath"];
          
        public readonly string HostNameForDownloadFile = ConfigurationManager.AppSettings["HostNameForDownloadFile"];
                     
        public readonly string StrIpBoardConnectionString =ConfigurationManager.AppSettings["IPBoardConnectionString"];

        public readonly string ResourceImageName =ConfigurationManager.AppSettings["ResourceImageName"];     

        public readonly string QuizXmlFileFolderPath =ConfigurationManager.AppSettings["QuizXMLFileFolderPath"]; 

        public readonly string QuizQuestionAndSolutionImagesPath =ConfigurationManager.AppSettings["QuizQuestionAndSolutionImagesPath"]; 

        

        #endregion
        
        #region "Resource"
        
        public string ResourceXmlFileCacheKey = "ResourceModifiedTimeStamp";
        public string InValidPreviewCode = "Invalid Preview Code.";
        public int PdfFileSizeInBytes = 1024;
        public string InkscapeFilePath = "inkscape.exe";
        
        #endregion

        #region "Messages"

        public readonly string QuizIsNotAvailableMessage = "Unfortunately, this quiz is not yet available.";
        public readonly string QuizIsExpiredMessage = "Unfortunately, this quiz is  expired";

        #endregion
    }
}
