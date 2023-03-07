using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TestingSystemWeb.Data.Structures;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;

namespace TestingSystemWeb.Controllers
{
    [ApiController]
    [Route("tests")]
    public class TestsController : ControllerBase
    {
        private TestsRepository _testsRepository;
        private QuestionsRepository _questionsRepository;
        private TestResultsRepository _testResultsRepository;
        private UsersRepository _usersRepository;

        private HttpContext _context;

        public TestsController(TestsRepository testsRepository,
            QuestionsRepository questionsRepository,
            TestResultsRepository testResultsRepository,
            UsersRepository usersRepository,
            IHttpContextAccessor accessor)
        {
            _testsRepository = testsRepository;
            _questionsRepository = questionsRepository;
            _testResultsRepository = testResultsRepository;
            _usersRepository = usersRepository;

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
            var tests = _testsRepository.GetAllTestsForStudent(userId);
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
            var addedStudentsId = _testResultsRepository.GetStudentsIdInTest(testId);

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
        [HttpPost("addStudent")]
        public IActionResult AddStudentInTest(TestResults data)
        {
            try
            {
                _testResultsRepository.AddStudentInTest(data.TestId, data.UserId);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Teacher)]
        [HttpPost("removeStudent")]
        public IActionResult RemoveStudentFromTest(TestResults data)
        {
            try
            {
                _testResultsRepository.RemoveStudentFromTest(data);
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

            TestModel testModel = new TestModel
            {
                Test = test
            };

            if (questions is not null)
            {
                var questionsList = JsonSerializer.Deserialize<List<Question>>(questions?.Data);
                if (_context.User.IsInRole(Role.Student))
                {
                    foreach (var question in questionsList)
                    {
                        if (question.IncorrectAnswers is not null)
                        {
                            question.IncorrectAnswers?.Add(question.Answer);
                            question.IncorrectAnswers = question.IncorrectAnswers?.OrderBy(q => Guid.NewGuid()).ToList();
                        }
                        question.Answer = null;
                    }
                }
                testModel.Questions = questionsList;
            }

            return Ok(testModel);
        }


        private int getCurrentUserId()
        {
            return int.Parse(_context.User.Claims.FirstOrDefault(c => c.Type == "id").Value);
        }
    }
}
