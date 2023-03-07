using TestingSystemWeb.Data;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class TestModel
    {
        public Test Test { get; set; }

        public List<Question> Questions { get; set; }
    }
}
