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
            var oldQuestions = GetTestQuestions(testId);
            _context.Questions.RemoveRange(oldQuestions);

            SetTestId(ref newQuestions, testId);

            _context.Questions.UpdateRange(newQuestions);
            _context.SaveChanges();
        }

        public Question GetQuestion(int id)
        {
            return _context.Questions.FirstOrDefault(x => x.Id == id);
        }

        public List<Question> GetTestQuestions(int testId)
        {
            return _context.Questions.Where(q => q.TestId == testId).ToList();
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
