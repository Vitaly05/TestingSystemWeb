using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestingSystemWeb.Data.Structures;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;
using TestingSystemWeb.Services;

namespace TestingSystemWeb.Controllers
{

    [ApiController]
    [Authorize]
    [Route("/users")]
    public class UsersController : ControllerBase
    {
        private UsersRepository _usersRepository;
        private AccountService _accountService;

        public UsersController(UsersRepository usersRepository,
            AccountService accountService)
        {
            _usersRepository = usersRepository;
            _accountService = accountService;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var users = _usersRepository.GetAllUsers();
            if (users is null) return NotFound();
            return Ok(users);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("add")]
        public IActionResult AddUser(User user)
        {
            try
            {
                if (!user.IsValid())
                    return BadRequest();


                user.Password = _accountService.EncryptPassword(user.Password);
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

        [Authorize(Roles = Role.Teacher)]
        [HttpGet("allGroups")]
        public IActionResult GetAllGroups()
        {
            try
            {
                var groups = _usersRepository.GetAllGroups();
                return Ok(groups);
            }
            catch { return BadRequest(); }
        }
    }
}
