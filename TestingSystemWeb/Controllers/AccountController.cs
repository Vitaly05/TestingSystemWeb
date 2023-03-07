using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TestingSystemWeb.Models;
using TestingSystemWeb.Models.DataBaseModels;
using TestingSystemWeb.Repositories;

namespace TestingSystemWeb.Controllers
{
    public class AccountController : ControllerBase
    {
        private UsersRepository _usersRepository;
        private HttpContext _context;

        public AccountController(UsersRepository usersRepository,
            IHttpContextAccessor accessor)
        {
            _usersRepository = usersRepository;
            _context = accessor.HttpContext;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
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
