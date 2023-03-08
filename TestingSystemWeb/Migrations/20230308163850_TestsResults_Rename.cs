using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingSystemWeb.Migrations
{
    public partial class TestsResults_Rename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tests_Results_Tests_TestId",
                table: "Tests_Results");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tests_Results",
                table: "Tests_Results");

            migrationBuilder.RenameTable(
                name: "Tests_Results",
                newName: "TestsResults");

            migrationBuilder.RenameIndex(
                name: "IX_Tests_Results_TestId",
                table: "TestsResults",
                newName: "IX_TestsResults_TestId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestsResults",
                table: "TestsResults",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TestsResults_Tests_TestId",
                table: "TestsResults",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestsResults_Tests_TestId",
                table: "TestsResults");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TestsResults",
                table: "TestsResults");

            migrationBuilder.RenameTable(
                name: "TestsResults",
                newName: "Tests_Results");

            migrationBuilder.RenameIndex(
                name: "IX_TestsResults_TestId",
                table: "Tests_Results",
                newName: "IX_Tests_Results_TestId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tests_Results",
                table: "Tests_Results",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tests_Results_Tests_TestId",
                table: "Tests_Results",
                column: "TestId",
                principalTable: "Tests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
