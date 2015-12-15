
using System.IO;
using System.Web.Hosting;

// ReSharper disable once CheckNamespace
namespace TSFXGenForm.Web.App_Start
{
    public class LogConfig
    {
        public static void RegisterLog4NetConfig()
        {
            var log4NetFileInfo =
                new FileInfo(Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "Conf\\log4net.config"));
            //log4net file info
            log4net.Config.XmlConfigurator.Configure(log4NetFileInfo); //log4net initializing configuration
        }
    }
}