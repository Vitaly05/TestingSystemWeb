using Microsoft.EntityFrameworkCore;
using TestingSystemWeb.Data.Structures;
using TestingSystemWeb.Database;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;

namespace TestingSystemWeb.Repositories
{
    public class UsersRepository
    {
        private ApplicationContext _context;

        public UsersRepository(ApplicationContext context)
        {
            _context = context;
        }


        public void AddUser(User newUser)
        {
            _context.Users.Add(newUser);
            _context.SaveChanges();
        }

        public void RemoveUser(int userId)
        {
            var removableUser = GetUserById(userId);
            _context.Users.Remove(removableUser);
            _context.SaveChanges();
        }

        public List<User> GetAllUsers()
        {
            var users = _context.Users.ToList();
            return removePassword(users);
        }

        public List<User> GetAllUsersWithRole(string role)
        {
            var users = _context.Users.Where(user => user.Role == role).ToList();
            return removePassword(users);
        }

        public List<User> GetAllStudentsWithGroup(string group)
        {
            var allStudents = GetAllUsersWithRole(Role.Student);
            var students = allStudents.Where(user => user.Group == group).ToList();
            return removePassword(students);
        }

        public User Login(LoginModel verificableUser)
        {
            return _context.Users.FirstOrDefault(user => 
                user.Login == verificableUser.Login &&
                user.Password == verificableUser.Password);
        }

        public User GetUserById(int id)
        {
            var user = _context.Users.Single(user => user.Id == id);
            return removePassword(user);
        }

        public List<string> GetAllGroups()
        {
            var result = GetAllUsersWithRole(Role.Student);


            List<string> allGroups = new List<string>();

            foreach (var student in result)
            {
                if (!allGroups.Contains(student.Group))
                {
                    allGroups.Add(student.Group);
                }
            }

            return allGroups;
        }


        private List<User> removePassword(List<User> users)
        {
            var usersWithoutPassword = new List<User>();
            foreach (var user in users)
                if (user is not null) usersWithoutPassword.Add(removePassword(user));
            return usersWithoutPassword;
        }
        private User removePassword(User user)
        {
            var userWithoutPassword = new User(user);
            if (userWithoutPassword is not null) userWithoutPassword.Password = string.Empty;
            return userWithoutPassword;
        }
    }
}
