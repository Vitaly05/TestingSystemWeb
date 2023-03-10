using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class StudentResultModel
    {
        public User Student { get; set; }
        public TestResult TestResult { get; set; }
    }
}
