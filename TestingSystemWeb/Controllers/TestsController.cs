using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Nodes;
using TestingSystemWeb.Data.Structures;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;
using TestingSystemWeb.Services;

namespace TestingSystemWeb.Controllers
{
    [ApiController]
    [Route("tests")]
    public class TestsController : ControllerBase
    {
        private TestsRepository _testsRepository;
        private QuestionsRepository _questionsRepository;
        private TestsAccessesRepository _accessesRepository;
        private TestResultsRepository _testResultsRepository;
        private UsersRepository _usersRepository;
        private AnswersRepository _answersRepository;

        private TestService _testSerivce;

        private HttpContext _context;

        public TestsController(TestsRepository testsRepository,
            QuestionsRepository questionsRepository,
            TestsAccessesRepository accessesRepository,
            TestResultsRepository testResultsRepository,
            UsersRepository usersRepository,
            TestService testService,
            AnswersRepository answersRepository,
            IHttpContextAccessor accessor)
        {
            _testsRepository = testsRepository;
            _questionsRepository = questionsRepository;
            _accessesRepository = accessesRepository;
            _testResultsRepository = testResultsRepository;
            _usersRepository = usersRepository;
            _answersRepository = answersRepository;

            _testSerivce = testService;

            _context = accessor.HttpContext;
        }


        [Authorize(Roles = Role.Teacher)]
        [HttpGet]
        public IActionResult GetAllTestsForCurrentTeacher()
        {
            int userId = getCurrentUserId();
            var tests = _testsRepository.GetAllTestsCreatedThisTeacher(userId);
            if (tests is null) return NotFound();
            return Ok(tests);
        }

        [Authorize(Roles = Role.Student)]
        [HttpGet("forMe")]
        public IActionResult GetAllTestsForCurrentStudent()
        {
            int userId = getCurrentUserId();
            var tests = _accessesRepository.GetAllTestsForStudent(userId);
            if (tests is null) return NotFound();
            return Ok(tests);
        }


        [Authorize(Roles = Role.Teacher)]
        [HttpPost("add")]
        public IActionResult AddTest(TestModel testModel)
        {
            var test = testModel.Test;
            test.TeacherId = getCurrentUserId();
            test.CreateDate = DateTime.Now;

            try
            {
                _testsRepository.AddTest(test);
                _questionsRepository.AddQuestions(testModel.Questions, test.Id);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("update")]
        public IActionResult UpdateTest(TestModel testModel)
        {
            var test = testModel.Test;
            test.TeacherId = getCurrentUserId();
            test.CreateDate = DateTime.Now;
            try
            {
                _testsRepository.UpdateTest(test);
                _questionsRepository.UpdateQuestions(testModel.Questions, test.Id);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpDelete("remove/{id}")]
        public IActionResult RemoveTest(int id)
        {
            try
            {
                _testsRepository.RemoveTest(id);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpGet("{testId}/getStudents")]
        public IActionResult GetStudentsInTest(int testId)
        {
            StudentsInTestModel studentsInTestModel = new();

            var allStudents = _usersRepository.GetAllUsersWithRole(Role.Student);

            var addedStudentsId = _accessesRepository.GetStudentsIdInTest(testId);

            studentsInTestModel.NotAddedStudents = allStudents;

            foreach (var id in addedStudentsId)
            {
                var student = allStudents.FirstOrDefault(s => s.Id == id);

                if (student is not null)
                {
                    studentsInTestModel.AddedStudents.Add(student);
                    studentsInTestModel.NotAddedStudents.Remove(student);
                }
            }

            return Ok(studentsInTestModel);
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("{testId}/addGroup")]
        public IActionResult AddGroupInTest(int testId, [FromBody] JsonObject group)
        {
            try
            {
                var g = (string)group["group"];
                var users = _usersRepository.GetAllStudentsWithGroup(g);
                var test = _testsRepository.GetTest(testId);

                foreach (var user in users)
                {
                    if (!_accessesRepository.HasAccess(user.Id, test.Id))
                        _accessesRepository.AddStudentInTest(test, user.Id);
                }
                return Ok();
            }
            catch { return BadRequest(); }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("{testId}/removeGroup")]
        public IActionResult RemoveGroupInTest(int testId, [FromBody] JsonObject group)
        {
            try
            {
                var g = (string)group["group"];
                var users = _usersRepository.GetAllStudentsWithGroup(g);
                var test = _testsRepository.GetTest(testId);

                foreach (var user in users)
                {
                    if (_accessesRepository.HasAccess(user.Id, test.Id))
                        removeUserFromTest(new TestAccess
                        {
                            TestId = testId,
                            UserId = user.Id,
                        });
                }
                return Ok();
            }
            catch { return BadRequest(); }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("addStudent")]
        public IActionResult AddStudentInTest(TestAccess data)
        {
            try
            {
                data.Test = _testsRepository.GetTest(data.TestId);
                _accessesRepository.AddStudentInTest(data.Test, data.UserId);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("removeStudent")]
        public IActionResult RemoveStudentFromTest(TestAccess data)
        {
            try
            {
                removeUserFromTest(data);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = $"{Role.Teacher}, {Role.Student}")]
        [HttpGet("{id}")]
        public IActionResult GetTest(int id)
        {
            var test = _testsRepository.GetTest(id);
            var questions = _questionsRepository.GetTestQuestions(id);

            if (_context.User.IsInRole(Role.Student))
            {
                if (_accessesRepository.GetRemainingAttempts(test.Id, getCurrentUserId()) > 0)
                    return getQuestionsForStudent(test, questions);
                else return BadRequest();
            }

            TestModel testModel = new TestModel
            {
                Test = test,
                Questions = questions
            };

            return Ok(testModel);
        }

        [Authorize(Roles = Role.Student)]
        [HttpPost("writeAnswers")]
        public IActionResult WriteAnswers(AnswersModel answersModel)
        {
            try
            {
                var currentUserId = getCurrentUserId();
                _testSerivce.WriteAnswers(answersModel.Answers, answersModel.Test, currentUserId);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = $"{Role.Student}, {Role.Teacher}")]
        [HttpGet("{testId}/results")]
        public IActionResult GetTestResults(int testId)
        {
            if (_context.User.IsInRole(Role.Student))
            {
                var testResults = _testResultsRepository.GetTestResults(testId, getCurrentUserId());
                return Ok(testResults);

            }
            
            List<StudentResultModel> studentsResults = new();

            var allTestResults = _testResultsRepository.GetTestResults(testId);
            foreach (var testResult in allTestResults)
            {
                var student = _usersRepository.GetUserById(testResult.UserId);
                studentsResults.Add(new StudentResultModel
                {
                    Student = student,
                    TestResult = testResult
                });
            }

            return Ok(studentsResults);
        }

        [Authorize(Roles = Role.Student)]
        [HttpGet("{testId}/{attempt}")]
        public IActionResult GetStudentAttempt(int testId, int attempt)
        {
            var questions = _questionsRepository.GetTestQuestions(testId);
            List<Answer> answers = new List<Answer>();
            int currentUserId = getCurrentUserId();

            try
            {
                foreach (var question in questions)
                {
                    var answer = _answersRepository.GetAnswer(question.Id, currentUserId, attempt);
                    answers.Add(answer);
                }

                return Ok(answers);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpGet("{testId}/{userId}/{attempt}")]
        public IActionResult GetStudentAttempt(int testId, int userId, int attempt)
        {
            var questions = _questionsRepository.GetTestQuestions(testId);
            List<Answer> answers = new List<Answer>();

            try
            {
                foreach (var question in questions)
                {
                    var answer = _answersRepository.GetAnswer(question.Id, userId, attempt);
                    answers.Add(answer);
                }

                return Ok(answers);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("{userId}/{attempt}/setMark")]
        public IActionResult SetMark(CheckTestModel checkTestModel, int userId, int attempt)
        {
            try
            {
                _testSerivce.UpdateAnswers(checkTestModel.Answers, checkTestModel.Test, userId, attempt);
                return Ok();
            }
            catch { return BadRequest(); }
        }



        private int getCurrentUserId()
        {
            return int.Parse(_context.User.Claims.FirstOrDefault(c => c.Type == "id").Value);
        }

        private IActionResult getQuestionsForStudent(Test test, List<Question> questions)
        {
            QuestionsModel questionsModel = new QuestionsModel
            {
                Test = test
            };

            foreach (var question in questions)
            {
                QuestionModel questionModel = new QuestionModel
                {
                    Question = question.QuestionText,
                    Id = question.Id
                };

                if (question?.IncorrectAnswers is not null)
                {
                    var incorrectAnswers = JsonSerializer.Deserialize<List<string>>(question.IncorrectAnswers);
                    List<string> answersVariants = new();

                    foreach (var incorrectAnswer in incorrectAnswers)
                        questionModel.AnswersVariants.Add(incorrectAnswer);

                    questionModel.AnswersVariants.Add(question.Answer);
                    questionModel.AnswersVariants = questionModel.AnswersVariants.OrderBy(x => Guid.NewGuid()).ToList();
                }
                questionsModel.Questions.Add(questionModel);
            }

            return Ok(questionsModel);
        }

        private void removeUserFromTest(TestAccess data)
        {
            _testResultsRepository.RemoveResult(data.TestId, data.UserId);
            _answersRepository.RemoveAnswers(data.TestId, data.UserId);
            _accessesRepository.RemoveStudentFromTest(data);
        }
    }
}
