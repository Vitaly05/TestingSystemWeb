using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TestingSystemWeb.Database;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Repositories
{
    public class QuestionsRepository
    {
        private ApplicationContext _context;

        public QuestionsRepository(ApplicationContext context)
        {
            _context = context;
        }

        public void AddQuestions(List<Question> questions, int testId)
        {
            SetTestId(ref questions, testId);
            _context.Questions.AddRange(questions);
            _context.SaveChanges();
        }

        public void UpdateQuestions(List<Question> newQuestions, int testId)
        {
            List<Question> oldQuestions = GetTestQuestions(testId);
            List<int> removableQuestionsIds = new();

            int oldQuestionsCount = oldQuestions.Count();
            for (int iii = 0; iii < oldQuestionsCount; ++iii)
            {
                bool isUpdated = false;
                foreach (var newQuestion in newQuestions)
                {
                    if (oldQuestions[iii].Id == newQuestion.Id)
                        isUpdated = true;

                }
                if (!isUpdated)
                    removableQuestionsIds.Add(oldQuestions[iii].Id);
            }

            foreach (int id in removableQuestionsIds)
            {
                _context.Questions.Remove(GetQuestion(id));
            }
            
            SetTestId(ref newQuestions, testId);

            _context.Questions.UpdateRange(newQuestions);
            _context.SaveChanges();
        }

        public Question GetQuestion(int id)
        {
            return _context.Questions.AsNoTracking().FirstOrDefault(x => x.Id == id);
        }

        public List<Question> GetTestQuestions(int testId)
        {
            return _context.Questions.AsNoTracking().Where(q => q.TestId == testId).ToList();
        }

        private void SetTestId(ref List<Question> questions, int testId)
        {
            foreach (var question in questions)
            {
                question.TestId = testId;
            }
        }
    }
}
