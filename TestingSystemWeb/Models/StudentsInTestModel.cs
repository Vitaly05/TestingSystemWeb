using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Models
{
    public class StudentsInTestModel
    {
        public List<User> AddedStudents { get; set; } = new List<User>();
        public List<User> NotAddedStudents { get; set; } = new List<User>();
    }
}
