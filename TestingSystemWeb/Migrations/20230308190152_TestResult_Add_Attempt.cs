using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TestingSystemWeb.Migrations
{
    public partial class TestResult_Add_Attempt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "Mark",
                table: "TestsResults",
                type: "float",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Attempt",
                table: "TestsResults",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attempt",
                table: "TestsResults");

            migrationBuilder.AlterColumn<double>(
                name: "Mark",
                table: "TestsResults",
                type: "float",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float");
        }
    }
}
