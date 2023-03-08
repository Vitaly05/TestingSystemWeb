using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingSystemWeb.Migrations
{
    public partial class Answer_Add_Attempt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Attempt",
                table: "Answers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attempt",
                table: "Answers");
        }
    }
}
