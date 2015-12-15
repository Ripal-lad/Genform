using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace TSFXGenform.DomainModel.Models
{
    public class TsfxDataContext : DbContext
    {
        public TsfxDataContext() : base("TSFXContext")
        {
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<TsfxDataContext,Configuration>());
            Database.SetInitializer(new CreateDatabaseIfNotExists<TsfxDataContext>());
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<QuizDefine> QuizDefine { get; set; }
        public DbSet<QuizCompilation> QuizCompilation { get; set; }
        public DbSet<QuizResult> QuizResult { get; set; }
        public DbSet<QuizResultSummary> QuizResultSummary { get; set; }

        public DbSet<MappingQuizResultDetails> MappingQuizResultDetails { get; set; }

    }
}
