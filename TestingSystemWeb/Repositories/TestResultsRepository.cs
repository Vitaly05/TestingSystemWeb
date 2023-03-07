﻿using TestingSystemWeb.Database;
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
            _context.Tests_Results.Add(new TestResults
            {
                TestId = testId,
                UserId = studentId
            });
            _context.SaveChanges();
        }

        public void RemoveStudentFromTest(TestResults testResults)
        {
            var removableTestResult = _context.Tests_Results
                .FirstOrDefault(x => x.UserId == testResults.UserId && 
                x.TestId == testResults.TestId);

            _context.Tests_Results.Remove(removableTestResult);
            _context.SaveChanges();
        }

        public List<int> GetStudentsIdInTest(int testId)
        {
            //var f = _context.Tests_Results.Where(p => p.TestId == testId).ToList();
            return (from p in _context.Tests_Results
                   where p.TestId == testId
                   select p.UserId).ToList();
        }
    }
}
