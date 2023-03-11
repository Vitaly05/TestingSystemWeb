using System.ComponentModel.DataAnnotations;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public int TestId { get; set; }
        public Test Test { get; set; }

        public string AnswerText { get; set; }

        public bool? IsCorrect { get; set; }

        public int Attempt { get; set; }
    }
}
