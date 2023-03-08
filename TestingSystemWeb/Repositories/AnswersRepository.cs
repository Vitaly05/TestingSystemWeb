using TestingSystemWeb.Database;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Repositories
{
    public class AnswersRepository
    {
        private ApplicationContext _context;

        public AnswersRepository(ApplicationContext context)
        {
            _context = context;
        }


        public void SaveAnswers(List<Answer> answers, int userId, int attempt)
        {
            foreach (var answer in answers)
            {
                answer.UserId = userId;
                answer.Attempt = attempt;
            }

            _context.Answers.AddRange(answers);
            _context.SaveChanges();
        }
    }
}
