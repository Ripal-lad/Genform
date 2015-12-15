using System;

namespace TSFXGenform.DomainModel.ApplicationClasses
{

    public class QuizManagerDetail
    {
       public string QuizTitle { get; set; }
       public string DueDate { get; set; }
       public string EndDate { get; set; }
       public string Score { get; set; }
       public string RelativeRankValue { get; set; }
       public int Id { get; set; }
       public DateTime? StartDate { get; set; }
       public int QuizResultSummaryId { get; set; }

    }
}
