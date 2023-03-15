using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class TestInfo
    {
        public Test Test { get; set; }

        public int PassedOnce { get; set; }
        public double? MaxMark { get; set; }
    }
}
