using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class AnswersModel
    {
        public Test Test { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
