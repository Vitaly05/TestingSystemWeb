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
            removePassword(ref users);
            return users;
        }

        public List<User> GetAllUsersWithRole(string role)
        {
            var users = _context.Users.Where(user => user.Role == role).ToList();
            removePassword(ref users);
            return users;
        }

        public List<User> GetAllUsersWithGroup(string group)
        {
            var users = _context.Users.Where(user => user.Group == group).ToList();
            removePassword(ref users);
            return users;
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
            removePassword(ref user);
            return user;
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


        private void removePassword(ref List<User> users)
        {
            foreach (var user in users)
                if (user is not null) user.Password = string.Empty;

        }
        private void removePassword(ref User user)
        {
            if (user is not null) user.Password = string.Empty;
        }
    }
}
