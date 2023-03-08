using Microsoft.EntityFrameworkCore;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Database
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Test> Tests { get; set; }
        public DbSet<TestAccess> TestsAccesses { get; set; }
        public DbSet<TestResult> TestsResults { get; set; }

        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }


        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options) { }
    }
}
