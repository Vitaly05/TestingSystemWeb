using System.ComponentModel.DataAnnotations;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class Questions
    {
        [Key]
        public int Id { get; set; }

        public int TestId { get; set; }

        public string Data { get; set; }
    }
}
