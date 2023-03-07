using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json.Serialization;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class Test
    {
        [Key]
        public int Id { get; set; }

        public int TeacherId { get; set; }

        [MaxLength(45)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string Description { get; set; }

        public int MaxMark { get; set; }

        public bool AutoCheck { get; set; } = true;

        public int? TimeToPass { get; set; }

        public int AmountOfAttampts { get; set; } = 1;

        public DateTime CreateDate { get; set; }

        [JsonIgnore]
        [NotMapped]
        public TestResults TestInfoForThisStudent
        {
            get
            {
                //return DataBaseReader.GetTestInfoForThisStudent(id, Authorization.LoggedUser);
                return null;
            }
        }
    }
}
