using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TSFXGenform.DomainModel.Models
{
    public class QuizResult
    {
        public QuizResult()
        {
            AnsweredInTime = true;
        }


        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int QuizResultId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int QuizDefineId { get; set; }

        [Required]
        public int QuizCompileId { get; set; }

        [Required]
        [DefaultValue(0)]
        public int QuestionId { get; set; }
       
        [DefaultValue("")]
        public string UserAnswer { get; set; }

        [Required] 
        [DefaultValue(true)]
        private bool _answeredInTime = true;
        public bool AnsweredInTime {
            get { return _answeredInTime; } 
            set { _answeredInTime = value; } 
        }



        public int? Score { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public float TimeTaken { get; set; }
      
        [Required]
        public bool IsAnsweringDone { get; set; }

        [ForeignKey("QuizDefineId")]
        public virtual QuizDefine QuizDefine { get; set; }

        [ForeignKey("QuizCompileId")]
        public virtual QuizCompilation QuizCompilation { get; set; }
    }
}
