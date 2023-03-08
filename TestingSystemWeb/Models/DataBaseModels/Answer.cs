﻿using System.ComponentModel.DataAnnotations;

namespace TestingSystemWeb.Models.DataBaseModels
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int QuestionId { get; set; }
        public Question Question { get; set; }

        public string AnswerText { get; set; }
    }
}
