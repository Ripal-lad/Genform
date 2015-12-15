using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TSFXGenform.DomainModel.Models
{
    public class MappingQuizResultDetails
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int MappingQuizResultDetailId { get; set; }

        public int QuizResultSummaryId { get; set; }

        public int QuizCompileId { get; set; }

        public int  QuizResultId { get; set; }
    }
}
