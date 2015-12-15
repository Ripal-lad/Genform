

using System.Collections.Generic;

namespace TSFXGenform.DomainModel.ApplicationClasses
{
    public class QuizPageAndQuestionDetails
    {
        
        //public int PageType { get; set; }
        //public string PageQuestionId { get; set; }
        //public int PageNo { get; set; }
        public int QuestionId { get; set; }
        public int QuestionNumber { get; set; }
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
        public float TimeRemaining { get; set; }
        public float SolutionImageRequiredScaling { get; set; }
        public string QuestionImagePath { get; set; }
        public string SolutionImagePath { get; set; }
        public int QuizResultSummaryId { get; set; }        //This id is to be passed to result page so that result can be retrieve as per the quizResultSummaryid.
        public int UserId { get; set; }
        public string UserAnswer { get; set; }
        public bool AnsweredInTime { get; set; }
        public int? Score { get; set; }
        public float TimeTaken { get; set; }

        //New fields
        public bool SaveAndcompleteLaterLink { get; set; }
        public string QuestionImageName { get; set; }
        public string SolutionImageName { get; set; }
        public double IndentPx { get; set; }
        public string WriteSolutionInSpecificLocationMessage { get; set; }
        public List<int> QuestionIds { get; set; }
        public string HiddenCodeForQuiz { get; set; }


        //Fields for Resource.xml
        public int MediaHandlerId { get; set; }
        public string Title { get; set; }
        public string FileSizes { get; set; }
        public string FilePages { get; set; }
        public string FileNames { get; set; }
        public string HiddenCode { get; set; }
        public string URL { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }

        public string[] AudioVideoImagePath { get; set; }
        public bool IsAnsweringDone { get; set; } //It will be true on next button click event,save and complete later button click event and when timer gets expired if user does not wants to complete the quiz to indicate that the user has completed the question.

        public bool IsPeriodicCall { get; set; }    //To check whether the call to save answer is perodic.

        public bool IsTabNotActive { get; set; }    //To check whether this is periodic call from the current tab.
    }
}
