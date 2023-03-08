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


        public void AddStudentInTest(int testId, int studentId)
        {
            _context.Tests_Results.Add(new TestResult
            {
                TestId = testId,
                UserId = studentId
            });
            _context.SaveChanges();
        }

        public void RemoveStudentFromTest(TestResult testResults)
        {
            var removableTestResult = _context.Tests_Results
                .FirstOrDefault(x => x.UserId == testResults.UserId && 
                x.TestId == testResults.TestId);

            _context.Tests_Results.Remove(removableTestResult);
            _context.SaveChanges();
        }

        public void WriteMark(int userId, double mark)
        {
            var result = _context.Tests_Results.FirstOrDefault(x => x.UserId == userId);
            result.Mark = mark;
            _context.Tests_Results.Update(result);
            _context.SaveChanges();
        }

        public List<int> GetStudentsIdInTest(int testId)
        {
            return (from p in _context.Tests_Results
                   where p.TestId == testId
                   select p.UserId).ToList();
        }
    }
}
