using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestingSystemWeb.Data.Structures;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;

namespace TestingSystemWeb.Controllers
{

    [ApiController]
    [Authorize]
    [Route("/users")]
    public class UsersController : ControllerBase
    {
        private UsersRepository _usersRepository;

        public UsersController(UsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var users = _usersRepository.GetAllUsers();
            if (users is null) return NotFound();
            return Ok(users);
        }

        [Authorize(Roles = $"{Role.Admin}, {Role.Teacher}")]
        [HttpGet("{role}")]
        public IActionResult GetUsersWithRole(string role)
        {
            var users = _usersRepository.GetAllUsersWithRole(role);
            if (users is null) return NotFound();
            return Ok(users);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("search")]
        public IActionResult SearchUser([FromBody] SearchUserModel model)
        {
            List<User> users = new();
            string searchText = model.SearchText.Trim();

            switch (model.Filter)
            {
                case "byLogin":
                    users = _usersRepository.FindByLogin(searchText);
                    break;
                case "bySurname":
                    users = _usersRepository.FindBySurname(searchText);
                    break;
                case "byGroup":
                    users = _usersRepository.FindByGroup(searchText);
                    break;
                default:
                    return BadRequest();
            }
            return Ok(users);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("add")]
        public IActionResult AddUser(User user)
        {
            try
            {
                _usersRepository.AddUser(user);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Roles = Role.Admin)]
        [HttpDelete("remove/{id}")]
        public IActionResult RemoveUser(int id)
        {
            try
            {
                _usersRepository.RemoveUser(id);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
