﻿using System.ComponentModel.DataAnnotations;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class Question
    {
        [Key]
        public int Id { get; set; }

        public int TestId { get; set; }

        public Test Test { get; set; }

        public string QuestionText { get; set; }

        public string Answer { get; set; }

        public string IncorrectAnswers { get; set; }
    }
}
