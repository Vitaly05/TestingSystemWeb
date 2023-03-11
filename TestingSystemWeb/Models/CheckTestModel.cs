using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class CheckTestModel
    {
        public Test Test { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
