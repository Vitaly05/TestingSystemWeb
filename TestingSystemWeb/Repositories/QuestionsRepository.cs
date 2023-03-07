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
            var addedQuestions = new Questions
            {
                TestId = testId,
                Data = JsonSerializer.Serialize(questions)
            };
            _context.Questions.Add(addedQuestions);
            _context.SaveChanges();
        }

        public void UpdateQuestions(List<Question> questions, int testId)
        {
            foreach (var question in questions)
            {
                if (question.IncorrectAnswers?.Count == 0)
                {
                    question.IncorrectAnswers = null;
                }
            }

            var updatedQuestions = GetTestQuestions(testId);
            updatedQuestions.Data = JsonSerializer.Serialize(questions);

            _context.Questions.Update(updatedQuestions);
            _context.SaveChanges();
        }

        public Questions GetTestQuestions(int testId)
        {
            return _context.Questions.FirstOrDefault(q => q.TestId == testId);
        }
    }
}
