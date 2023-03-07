using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class TestResults
    {
        [Key]
        public int Id { get; set; }

        public int TestId { get; set; }

        public int UserId { get; set; }

        public double? Mark { get; set; }

        [NotMapped]
        public Test Test
        {
            get
            {
                //return DataBaseReader.GetTestById(test_id);
                return null;
            }
        }

        [NotMapped]
        public User Student
        {
            get
            {
                //return DataBaseReader.GetUserById(user_id);
                return null;
            }
        }
    }
}
