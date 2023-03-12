using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;
using TestingSystemWeb.Services;

namespace TestingSystemWeb.Controllers
{
    public class AccountController : ControllerBase
    {
        private UsersRepository _usersRepository;
        private AccountService _accountService;
        private HttpContext _context;

        public AccountController(UsersRepository usersRepository,
            AccountService accountService,
            IHttpContextAccessor accessor)
        {
            _usersRepository = usersRepository;
            _accountService = accountService;
            _context = accessor.HttpContext;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            model.Password = _accountService.EncryptPassword(model.Password);
            var user = _usersRepository.Login(model);

            if (user is null) return Unauthorized();

            await signInAsync(user);
            return Ok();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await _context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect("/login");
        }



        private async Task signInAsync(User user)
        {
            var claims = new List<Claim> 
            { 
                new Claim("login", user.Login),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role)
            };
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Cookies");

            await _context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));
        }
    }
}
