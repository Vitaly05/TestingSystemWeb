using Microsoft.EntityFrameworkCore;
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
            return _context.Tests.AsNoTracking().Where(t => t.TeacherId == userId).ToList();
        }

        public Test GetTest(int testId)
        {
            return _context.Tests.AsNoTracking().FirstOrDefault(t => t.Id == testId);
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
