﻿using TestingSystemWeb.Database;
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

        public bool HasAccess(int userId, int testId)
        {
            var user = _context.TestsAccesses.FirstOrDefault(a =>
                a.UserId == userId &&
                a.TestId == testId);
            if (user is null) return false;
            return true;
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

        public void UpdateAmountOfAttempts(int testId, int differenceOfAmountOfAttempts)
        {
            List<TestAccess> accesses = _context.TestsAccesses.Where(a => a.TestId == testId).ToList();
            foreach (var access in accesses)
            {
                access.RemainingAttemptsAmount += differenceOfAmountOfAttempts;
                if (access.RemainingAttemptsAmount < 0)
                    access.RemainingAttemptsAmount = 0;
            }
            _context.TestsAccesses.UpdateRange(accesses);
            _context.SaveChanges();
        }

        public int GetRemainingAttempts(int testId, int userId)
        {
            return _context.TestsAccesses.FirstOrDefault(
                x => x.UserId == userId &&
                x.TestId == testId).RemainingAttemptsAmount;
        }

        public void DecrementAttempts(int testId, int userId)
        {
            var access = _context.TestsAccesses.FirstOrDefault(
                x => x.UserId == userId &&
                x.TestId == testId);
            --access.RemainingAttemptsAmount;
            _context.TestsAccesses.Update(access);
            _context.SaveChanges();
        }
    }
}
