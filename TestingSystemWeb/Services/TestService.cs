using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;

namespace TestingSystemWeb.Services
{
    public class TestService
    {
        private QuestionsRepository _questionsRepository;
        private AnswersRepository _answersRepository;
        private TestResultsRepository _testResultsRepository;

        public TestService(QuestionsRepository questionsRepository,
            AnswersRepository answersRepository,
            TestResultsRepository testResultsRepository)
        {
            _questionsRepository = questionsRepository;
            _answersRepository = answersRepository;
            _testResultsRepository = testResultsRepository;
        }


        public double GetMark(List<Answer> answers, Test test)
        {
            return calculateMark(answers, test);
        }

        private double calculateMark(List<Answer> answers, Test test)
        {
            int questionsAmount = _questionsRepository.GetTestQuestions(test.Id).Count();
            int correctAnswersAmount = 0;

            foreach (var answer in answers)
            {
                var question = _questionsRepository.GetQuestion(answer.QuestionId);

                if (answer.AnswerText == question.Answer)
                    ++correctAnswersAmount;
            }

            if (correctAnswersAmount == 0) return 0;

            double mark = (double)test.MaxMark / questionsAmount * correctAnswersAmount;
            return Math.Round(mark, 1);
        }
    }
}
