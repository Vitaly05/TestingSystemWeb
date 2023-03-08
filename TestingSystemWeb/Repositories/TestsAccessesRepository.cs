using TestingSystemWeb.Database;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Repositories
{
    public class TestsAccessesRepository
    {
        private ApplicationContext _context;

        public TestsAccessesRepository(ApplicationContext context)
        {
            _context = context;
        }


        public void AddStudentInTest(Test test, int studentId)
        {
            _context.TestsAccesses.Add(new TestAccess
            {
                TestId = test.Id,
                UserId = studentId,
                RemainingAttemptsAmount = test.AmountOfAttampts
            });
            _context.SaveChanges();
        }

        public void RemoveStudentFromTest(TestAccess testAccess)
        {
            var removableTestResult = _context.TestsAccesses
                .FirstOrDefault(x => x.UserId == testAccess.UserId &&
                x.TestId == testAccess.TestId);

            _context.TestsAccesses.Remove(removableTestResult);
            _context.SaveChanges();
        }

        public List<Test> GetAllTestsForStudent(int userId)
        {
            var accessList = _context.TestsAccesses
                .Where(x => x.UserId == userId).ToList();

            List<Test> availableTests = new List<Test>();

            foreach (var access in accessList)
            {
                var test = _context.Tests
                    .FirstOrDefault(t => t.Id == access.TestId);

                availableTests.Add(test);
            }

            return availableTests;
        }

        public List<int> GetStudentsIdInTest(int testId)
        {
            return (from p in _context.TestsAccesses
                    where p.TestId == testId
                    select p.UserId).ToList();
        }
    }
}
