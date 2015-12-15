using System;
using log4net;

namespace TSFXGenform.Utils.GlobalUtils
{
 
   public static class LogSystem
    {
        #region "Public Method(s)"
       
       
       /// <summary>
        /// Method to trace exception log in the text document.
       /// </summary>
       /// <param name="ex"></param>
       /// <param name="message"></param>
       public static void HandleLogException(Exception ex, string message)
        {
            var log = LogManager.GetLogger("FileLogger");
            if (!log.IsErrorEnabled)
                return;
            log.Error("Message : " + message + "\n\nException Message : " + ex.Message + "\nStack Trace : " + ex.StackTrace);
            
        }

       
       /// <summary>
       /// Method to trace exception log based on severity value in the mail/log file
       /// </summary>
       /// <param name="ex"></param>
       /// <param name="severity"></param>
       /// <param name="message"></param>
       public static void EmailLogException(Exception ex, int severity, string message)
       {
           var log = LogManager.GetLogger("EmailLogger");
         
           var severityvalue="";
           switch (severity)
           {
               case -1:
                   severityvalue = "System Startup";
                   break;
               case 0:
                   severityvalue = "Informational";
                   break;
               case 1:
                   severityvalue = "Important but issue may be localised";
                   break;
               case 2:
                   severityvalue = " Serious but issue may be localised";
                   break;
               case 3:
                   severityvalue = "Fatal";
                   break;
           }
       
           if (severity == 0 || severity == -1)
           {
               HandleLogException(ex,message);
           }
           else if (severity >= 1)
           {

               log.Error("An Error Has Been Logged on the TSFX Genform Handler." + "\n\nMessage : " + message + " - Severity = " + severityvalue + " - " + DateTime.Now + "\n\nException Message : " + ex.Message + "\nStack Trace : " + ex.StackTrace);
           
         }
       }

       
       /// <summary>
       /// Method to have message based on severity value - in mail/log file
       /// </summary>
       /// <param name="severity"></param>
       /// <param name="strMethodName"></param>
       /// <param name="message"></param>
       public static void EmailLogMessage(int severity, string strMethodName, string message)
       {
           if (!string.IsNullOrEmpty(strMethodName) && !string.IsNullOrEmpty(message))
           {
               var emailLog = LogManager.GetLogger("EmailLogger");
               var fileLog = LogManager.GetLogger("FileLogger");

               if (severity == 0)
               {
                   fileLog.Error("Method Name : " + strMethodName + "\n\n" + message);
               }
               else
               {
                   emailLog.Error("Method Name : " + strMethodName + "\n\n" + message);
               }

               
           }
       }



       #endregion
       
    }
}
