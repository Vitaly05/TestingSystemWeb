using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingSystemWeb.Migrations
{
    public partial class Add_CascadeDelete : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tests_Results_TestId",
                table: "Tests_Results",
                column: "TestId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_TestId",
                table: "Questions",
                column: "TestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Tests_TestId",
                table: "Questions",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tests_Results_Tests_TestId",
                table: "Tests_Results",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Tests_TestId",
                table: "Questions");

            migrationBuilder.DropForeignKey(
                name: "FK_Tests_Results_Tests_TestId",
                table: "Tests_Results");

            migrationBuilder.DropIndex(
                name: "IX_Tests_Results_TestId",
                table: "Tests_Results");

            migrationBuilder.DropIndex(
                name: "IX_Questions_TestId",
                table: "Questions");
        }
    }
}
