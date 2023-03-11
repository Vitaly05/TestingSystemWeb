using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TestingSystemWeb.Data.Structures;
using TestingSystemWeb.Database;
using TestingSystemWeb.Repositories;
using TestingSystemWeb.Services;

var builder = WebApplication.CreateBuilder(args);

string connetcion = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connetcion));


builder.Services.AddScoped<ApplicationContext>();

builder.Services.AddScoped<UsersRepository>();
builder.Services.AddScoped<TestsRepository>();
builder.Services.AddScoped<QuestionsRepository>();
builder.Services.AddScoped<TestsAccessesRepository>();
builder.Services.AddScoped<TestResultsRepository>();
builder.Services.AddScoped<AnswersRepository>();

builder.Services.AddScoped<TestService>();

builder.Services.AddControllers();

builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login";
        options.AccessDeniedPath = "/accessdenied";
    });


var app = builder.Build();


app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.MapGet("/accessdenied", () => "Access denied!");
app.MapGet("/login", async (context) => await context.Response.SendFileAsync("wwwroot/login.html"));

app.MapGet("/testConfiguration", [Authorize(Roles = Role.Teacher)] async (context) => await context.Response.SendFileAsync("wwwroot/testConfiguration.html"));
app.MapGet("/addStudents", [Authorize(Roles = Role.Teacher)] async (context) => await context.Response.SendFileAsync("wwwroot/addStudents.html"));
app.MapGet("/studentsResults", [Authorize(Roles = Role.Teacher)] async (context) => await context.Response.SendFileAsync("wwwroot/studentsResults.html"));
app.MapGet("/checkAnswers", [Authorize(Roles = Role.Teacher)] async (context) => await context.Response.SendFileAsync("wwwroot/checkAnswers.html"));

app.MapGet("/passingTest", [Authorize(Roles = Role.Student)] async (context) => await context.Response.SendFileAsync("wwwroot/passingTest.html"));
app.MapGet("/testResults", [Authorize(Roles = Role.Student)] async (context) => await context.Response.SendFileAsync("wwwroot/testResults.html"));
app.MapGet("/viewingAttempt", [Authorize(Roles = Role.Student)] async (context) => await context.Response.SendFileAsync("wwwroot/viewingAttempt.html"));

app.MapGet("/", [Authorize] async (context) =>
{
    var role = context.User.Claims
        .FirstOrDefault(p => p.Type == ClaimsIdentity.DefaultRoleClaimType)
        .Value;

    switch (role)
    {
        case Role.Admin:
            await context.Response.SendFileAsync("wwwroot/admin.html");
            break;
        case Role.Teacher:
            await context.Response.SendFileAsync("wwwroot/teacher.html");
            break;
        case Role.Student:
            await context.Response.SendFileAsync("wwwroot/student.html");
            break;
        default:
            await context.Response.WriteAsync("Unknown role!");
            break;
    }
});


app.Run();
