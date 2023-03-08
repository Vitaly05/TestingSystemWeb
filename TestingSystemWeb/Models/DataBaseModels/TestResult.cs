using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Components;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class TestResult
    {
        [Key]
        public int Id { get; set; }

        public int TestId { get; set; }

        public Test Test { get; set; }
        
        public int UserId { get; set; }

        public double Mark { get; set; }

        public int Attempt { get; set; }
    }
}
