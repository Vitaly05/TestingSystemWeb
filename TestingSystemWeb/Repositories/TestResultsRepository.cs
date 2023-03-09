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

        public List<TestResult> GetTestResults(int testId, int userId)
        {
            return _context.TestsResults.Where(
                x => x.TestId == testId &&
                x.UserId == userId).ToList();
        }
    }
}
