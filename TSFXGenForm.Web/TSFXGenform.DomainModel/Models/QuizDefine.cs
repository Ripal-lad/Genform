using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TSFXGenform.DomainModel.Models
{
    public class QuizDefine
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int QuizDefineId { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public int Id { get; set; }

        [Required]
        [DefaultValue("")]
        public string QuizName { get; set; }
        public DateTime DueDateTime { get; set; }
        public DateTime ExpiresDateTime { get; set; }
        
        [Required]
        [DefaultValue(0)]
        public int AuthenticationType { get; set; }
        
        public string RequiredToCompleteGroupIds { get; set; }
        
        [Required]
        public DateTime CreateDate { get; set; }

    }
}
