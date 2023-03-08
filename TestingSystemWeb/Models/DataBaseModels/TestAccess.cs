using System.ComponentModel.DataAnnotations;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class TestAccess
    {
        [Key]
        public int Id { get; set; }

        public int TestId { get; set; }
        public Test Test { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int RemainingAttemptsAmount { get; set; }
    }
}
