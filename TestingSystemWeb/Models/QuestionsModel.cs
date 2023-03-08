using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class QuestionsModel
    {
        public Test Test { get; set; }
        public List<QuestionModel> Questions { get; set; } = new List<QuestionModel>();
    }
    public class QuestionModel
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public List<string> AnswersVariants { get; set; } = new List<string>();
    }
}
