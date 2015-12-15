using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TSFXGenform.DomainModel.Models
{
    public class QuizResultSummary
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int QuizResultSummaryId { get; set; }
         
        [Required]
        public int UserId { get; set; }

        [Required]
        public int QuizDefineId { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public int TotalScore { get; set; }

        [Required]
        [DefaultValue(0)]
        public int MaxScore { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public float TotalTimeTaken { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public int AttemptNumber { get; set; }

        [Required]
        public bool IsBestScore { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }

        [Required]
        public int ScoreSystem { get; set; }


        [ForeignKey("QuizDefineId")]
        public virtual QuizDefine QuizDefine { get; set; }
    }
}
