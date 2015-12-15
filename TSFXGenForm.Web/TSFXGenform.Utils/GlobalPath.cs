using System;
using System.IO;
using System.Configuration;
using TSFXGenform.DomainModel.ApplicationClasses;
using System.Net;


namespace TSFXGenform.Utils.GlobalUtils
{
    public class GlobalPath
    {

        #region "Key values from Web.config"

        public static readonly bool IsRunningLocally =
            Convert.ToBoolean(ConfigurationManager.AppSettings["IsRunningLocally"]);

        public static readonly string InkscapePathLocally =
            ConfigurationManager.AppSettings["InkscapePathLocally"];

        public static readonly string InkscapePathServer =
            ConfigurationManager.AppSettings["InkscapePathServer"];

        public static readonly string LocalOutPutFolderPath = ConfigurationManager.AppSettings["LocalOutPutFolderPath"];

        public static readonly string FtpUrl = ConfigurationManager.AppSettings["FTPUrl"];
        public static readonly string FtpUserName = ConfigurationManager.AppSettings["FTPUserName"];
        public static readonly string FtpPassword = ConfigurationManager.AppSettings["FTPPassword"];

        public static readonly string PathForFormsFolder = ConfigurationManager.AppSettings["PathForFormsFolder"];

        public static readonly string AppWriteWebReadFolderPath =
            ConfigurationManager.AppSettings["AppWriteWebReadFolderPath"];

        public static readonly string AppWriteWebReadResourceFolderPath =
            ConfigurationManager.AppSettings["AppWriteWebReadResourceFolderPath"];

        public static readonly string ServerOutPutFolderPath =
            ConfigurationManager.AppSettings["ServerOutPutFolderPath"];

        public static readonly string AppWriteWebWriteFolderPath =
            ConfigurationManager.AppSettings["AppWriteWebWriteFolderPath"];

        #endregion
        
        #region "Public method(s)"

        public static QuizRoot ObjQuizRoot;
        public static string InkscapePath = string.Empty;
        public static string SourcePath = string.Empty;
        public static string DestPdfFilePath = string.Empty;
        public static string AppWriteWebWriteTempFilesFolderPath = string.Empty;
        public static string AppWriteWebReadWithResourceFolderPath = string.Empty;
        public static string AppWriteWebReadPath = string.Empty;
        public static string ApplicationCurrentDomainPath = AppDomain.CurrentDomain.BaseDirectory;
        public static bool IsTimerExpired = false;
        public static int StoreTimeRemaining = 0; //To store time remaining value for timer.
        public static int FirstQuestionNo = 0; //Store 1st question number to hide previous button 1st question. 

        
        /// <summary>
        /// Method to get Path for Notes Preview based on IsRunningLocally property
        /// </summary>
        public static void Path()
        {

            if (IsRunningLocally)
            {
                if (string.IsNullOrEmpty(PathForFormsFolder) ||
                    string.IsNullOrEmpty(InkscapePathLocally)) return;

                DestPdfFilePath = System.IO.Path.Combine(PathForFormsFolder, AppWriteWebReadFolderPath,
                    AppWriteWebReadResourceFolderPath);
                AppWriteWebReadWithResourceFolderPath = System.IO.Path.Combine(LocalOutPutFolderPath,
                    AppWriteWebReadFolderPath, AppWriteWebReadResourceFolderPath);
                AppWriteWebWriteTempFilesFolderPath = System.IO.Path.Combine(LocalOutPutFolderPath,
                    AppWriteWebWriteFolderPath);
                AppWriteWebReadPath = System.IO.Path.Combine(LocalOutPutFolderPath, AppWriteWebReadFolderPath,
                    AppWriteWebReadResourceFolderPath);
                InkscapePath = InkscapePathLocally;
            }
            else
            {
                if (!string.IsNullOrEmpty(LocalOutPutFolderPath)
                    && !string.IsNullOrEmpty(InkscapePathServer))
                {
                    DestPdfFilePath = System.IO.Path.Combine(PathForFormsFolder, AppWriteWebReadFolderPath,
                        AppWriteWebReadResourceFolderPath);
                    AppWriteWebReadWithResourceFolderPath = System.IO.Path.Combine(LocalOutPutFolderPath,
                        AppWriteWebReadFolderPath, AppWriteWebReadResourceFolderPath);
                    AppWriteWebWriteTempFilesFolderPath = System.IO.Path.Combine(LocalOutPutFolderPath,
                        AppWriteWebWriteFolderPath);
                    AppWriteWebReadPath = System.IO.Path.Combine(LocalOutPutFolderPath, AppWriteWebReadFolderPath,
                        AppWriteWebReadResourceFolderPath);
                    InkscapePath = InkscapePathServer;
                }
            }

        }

        #endregion
    }
}

  