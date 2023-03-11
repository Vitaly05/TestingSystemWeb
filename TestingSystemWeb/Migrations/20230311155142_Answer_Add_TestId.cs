using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingSystemWeb.Migrations
{
    public partial class Answer_Add_TestId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TestId",
                table: "Answers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Answers_TestId",
                table: "Answers",
                column: "TestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Tests_TestId",
                table: "Answers",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Tests_TestId",
                table: "Answers");

            migrationBuilder.DropIndex(
                name: "IX_Answers_TestId",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "TestId",
                table: "Answers");
        }
    }
}
