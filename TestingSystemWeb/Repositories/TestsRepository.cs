using System.Net;
using TestingSystemWeb.Database;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Repositories
{
    public class TestsRepository
    {
        private ApplicationContext _context;

        public TestsRepository(ApplicationContext context)
        {
            _context = context;
        }


        public List<Test> GetAllTestsCreatedThisTeacher(int userId)
        {
            return _context.Tests.Where(t => t.TeacherId == userId).ToList();
        }

        public List<Test> GetAllTestsForStudent(int userId)
        {
            var accessList = _context.Tests_Results
                .Where(t => t.UserId == userId).ToList();

            List<Test> availableTests = new List<Test>();

            foreach (var access in accessList)
            {
                var test = _context.Tests
                    .FirstOrDefault(t => t.Id == access.TestId);

                availableTests.Add(test);
            }

            return availableTests;
        }

        public Test GetTest(int testId)
        {
            return _context.Tests.FirstOrDefault(t => t.Id == testId);
        }


        public void AddTest(Test newTest)
        {
            _context.Tests.Add(newTest);
            _context.SaveChanges();
        }

        public void UpdateTest(Test test)
        {
            _context.Tests.Update(test);
            _context.SaveChanges();
        }

        public void RemoveTest(int id)
        {
            _context.Tests.Remove(new Test { Id = id });
            _context.SaveChanges();
        }
    }
}
