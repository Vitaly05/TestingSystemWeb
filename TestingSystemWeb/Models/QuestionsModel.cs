﻿namespace TestingSystemWeb.Models
{
    public class QuestionsModel
    {
        public List<QuestionModel> Questions { get; set; } = new List<QuestionModel>();
    }
    public class QuestionModel
    {
        public string Question { get; set; }
        public List<string> AnswersVariants { get; set; } = new List<string>();
    }
}
