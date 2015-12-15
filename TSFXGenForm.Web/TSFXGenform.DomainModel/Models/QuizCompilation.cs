using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TSFXGenform.DomainModel.Models
{
    public class QuizCompilation
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int QuizCompileId { get; set; }

        [Required]
        public int QuizDefineId { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public int QuestionId { get; set; }

        [MaxLength(10)]
        public string Answer { get; set; }

        [MaxLength(10)]
        public string CorrectAnswer { get; set; }

        [Required]
        [DefaultValue(0)]
        public int NoOfAnswersRequired { get; set; }

        [Required]
        [DefaultValue(0)]
        public int RecommendedTime { get; set; }

        [Required]
        [DefaultValue(0)]
        public int QuestionNumber { get; set; }


        [ForeignKey("QuizDefineId")]
        public virtual QuizDefine QuizDefine { get; set; }
    }
}
