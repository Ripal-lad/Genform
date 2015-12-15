using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TSFXGenform.DomainModel.ApplicationClasses
{
    public class ResultsPageDetailList
    {
        public List<ResultsPageDetail> ListOfResultsPageDetail { get; set; }
    }
    public class ResultsPageDetail
    {
        public int QuestionNumber { get; set; }
        public string UserScoreOutOfMaxScore { get; set; }
        public string QuestionAnsweredCorrectly { get; set; }
        public int QuestionType { get;set;}
        public int QuestionId { get; set; }
        public int QuizResultSummaryId { get; set; }
        public bool IsQuizResultExists { get; set; }
        public bool IsQuestionAnsInTime { get; set; }
        public int? Score { get; set; }
        public int NumberOfMarks { get; set; }

        public int UserScoreObtained { get; set; }
        public int TotalMarksOfQuestion { get; set; }
    }

    public class ResultPageScoreDetails 
    {
        public double RelativeRank { get; set; }
        public int StateAverages { get; set; }
        public int StateAveragesTimeTaken { get; set; }
        public int RelativeRankTimeTaken { get; set; }
        public int YourScore{get;set;}
        public int YourScoreTimeTaken { get; set; }
        public int MaxScore { get; set; }
        public int AttemptNumber { get; set; }

    }
}
