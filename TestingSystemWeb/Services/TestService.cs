using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;
using static System.Net.Mime.MediaTypeNames;

namespace TestingSystemWeb.Services
{
    public class TestService
    {
        private QuestionsRepository _questionsRepository;
        private AnswersRepository _answersRepository;
        private TestsAccessesRepository _testsAccessesRepository;
        private TestResultsRepository _testResultsRepository;

        public TestService(QuestionsRepository questionsRepository,
            AnswersRepository answersRepository,
            TestsAccessesRepository testsAccessesRepository,
            TestResultsRepository testResultsRepository)
        {
            _questionsRepository = questionsRepository;
            _answersRepository = answersRepository;
            _testsAccessesRepository = testsAccessesRepository;
            _testResultsRepository = testResultsRepository;
        }


        public void WriteAnswers(List<Answer> answers, Test test, int userId)
        {
            var currentAttempt = _testResultsRepository.GetAttemptsAmount(test.Id, userId) + 1;


            CheckAnswers(ref answers, checkAll: test.AutoCheck);
            

            _answersRepository.SaveAnswers(answers, userId, currentAttempt);
            _testsAccessesRepository.DecrementAttempts(test.Id, userId);
            
            WriteMark(answers, test, userId, currentAttempt);
        }

        public void UpdateAnswers(List<Answer> answers, Test test, int userId, int attempt)
        {
            List<Answer> newAnswers = new();

            foreach (var answer in answers)
            {
                var oldAnswer = _answersRepository.GetAnswer(answer.Id);
                oldAnswer.IsCorrect = answer.IsCorrect;
                newAnswers.Add(oldAnswer);
            }

            _answersRepository.UpdateAnswers(answers);

            var newMark = calculateMark(answers, test);
            _testResultsRepository.UpdateMark(test.Id, userId, attempt, newMark);
            
        }

        public int GetCurrentAttempt(Test test, int userId)
        {
            var amountOfAttampts = test.AmountOfAttampts;
            var remainingAttemptsAmount = _testsAccessesRepository.GetRemainingAttempts(test.Id, userId);
            return amountOfAttampts - remainingAttemptsAmount + 1;
        }

        public double? GetStudentMaxMark(int testId, int userId)
        {
            var testResults = _testResultsRepository.GetTestResults(testId, userId);

            double? maxMark = null;
            foreach (var result in testResults)
            {
                if (maxMark is null && result is not null)
                    maxMark = result.Mark;
                if (result.Mark > maxMark)
                    maxMark = result.Mark;
            }

            return maxMark;
        }
        
        
        private void CheckAnswers(ref List<Answer> answers, bool checkAll)
        {
            foreach (var answer in answers)
            {
                var question = _questionsRepository.GetQuestion(answer.QuestionId);

                if (checkAll)
                    answer.IsCorrect = CheckAnswer(answer, question);
                else if (question.IncorrectAnswers?.Count() >= 0)
                    answer.IsCorrect = CheckAnswer(answer, question);
            }
        }

        private bool CheckAnswer(Answer answer, Question question)
        {
            if (question.Answer == answer.AnswerText)
                return true;
            else
                return false;
        }

        private void WriteMark(List<Answer> answers, Test test, int userId, int attempt)
        {
            double? mark = null;

            if (test.AutoCheck)
                mark = calculateMark(answers, test);

            _testResultsRepository.WriteMark(userId, test.Id, mark, attempt);
        }

        private double calculateMark(List<Answer> answers, Test test)
        {
            int questionsAmount = _questionsRepository.GetTestQuestions(test.Id).Count();
            int correctAnswersAmount = 0;

            foreach (var answer in answers)
                if (answer.IsCorrect == true)
                    ++correctAnswersAmount;

            if (correctAnswersAmount == 0) return 0;

            double mark = (double)test.MaxMark / questionsAmount * correctAnswersAmount;
            return Math.Round(mark, 1);
        }
    }
}
