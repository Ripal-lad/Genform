

using System.Collections.Generic;
using System.Xml.Serialization;

namespace TSFXGenform.DomainModel.ApplicationClasses
{
    [XmlRoot("QuizQuestions")]
    public class QuizQuestions
    {
        [XmlElement("QuizQuestion")]
        public List<QuizQuestion> ListOfQuizQuestions { get; set; }
    }

    public class QuizQuestion
    {
        public int QuestionId { get; set; }

        public int QuestionType { get; set; }
        public int SolutionId { get; set; }
        public int SolutionResourceId { get; set; }
        public string SolutionResourceTitle { get; set; }
        public int NoOfAnswersRequired { get; set; }
        public string CorrectAnswer { get; set; }
        public string PossibleAnswers { get; set; }
        public int QuestionImageWidthPx { get; set; }
        public int QuestionImageHeightPx { get; set; }
        public int SolutionImageWidthPx { get; set; }
        public int SolutionImageHeightPx { get; set; }
        public int NumberOfMarks { get; set; }
        public float TimeToAnswer { get; set; }
        public int RecommendedTime { get; set; }
        public float SolutionImageRequiredScaling { get; set; }
        public string QuestionImagePath { get; set; }
        public string SolutionImagePath { get; set; }
        public int QuizResultSummaryId { get; set; }
        //This id is to be passed to result page so that result can be retrieve as per the quizResultSummaryid.


        //New fields
        public string QuestionImageName { get; set; }
        public string SolutionImageName { get; set; }
        public double IndentPX { get; set; }
        public string WriteSolutionInSpecificLocationMessage { get; set; }
    }
}
