using System.Text.Json.Serialization;

namespace TestingSystemWeb.Models
{
    public class Question
    {
        public string QuestionText { get; set; }

        public string Answer { get; set; }

        public List<string> IncorrectAnswers { get; set; }
    }
}
