using TSFXGenform.DomainModel.Models;

namespace TSFXGenForm.Web
{
    public class DatabaseConfig
    {
        public static void InitializeDatabase()
        {
            using (var context = new TsfxDataContext())
            {
                context.Database.Initialize(false);
            }
        }
    }
}