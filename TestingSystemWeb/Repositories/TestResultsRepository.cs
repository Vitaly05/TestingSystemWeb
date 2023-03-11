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


        public void WriteMark(int userId, int testId, double? mark, int attempt)
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

        public void UpdateMark(int testId, int userId, int attempt, double newMark)
        {
            var oldResult = _context.TestsResults.FirstOrDefault(x => 
                x.UserId == userId &&
                x.TestId == testId &&
                x.Attempt == attempt);
            oldResult.Mark = newMark;
            _context.TestsResults.Update(oldResult);
            _context.SaveChanges();
        }

        public List<TestResult> GetTestResults(int testId, int userId)
        {
            return _context.TestsResults.Where(
                x => x.TestId == testId &&
                x.UserId == userId).ToList();
        }

        public List<TestResult> GetTestResults(int testId)
        {
            return _context.TestsResults.Where(
                x => x.TestId == testId).ToList();
        }
    }
}
