using TestingSystemWeb.Database;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Repositories
{
    public class TestResultsRepository
    {
        private ApplicationContext _context;

        public TestResultsRepository(ApplicationContext context)
        {
            _context = context;
        }


        public void WriteMark(int userId, int testId, double mark, int attempt)
        {
            TestResult testResult = new TestResult
            {
                UserId = userId,
                TestId = testId,
                Mark = mark,
                Attempt = attempt
            };

            _context.TestsResults.Add(testResult);
            _context.SaveChanges();
        }
    }
}
