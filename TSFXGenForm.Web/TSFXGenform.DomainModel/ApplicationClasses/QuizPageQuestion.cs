

using System.Collections.Generic;
using System.Xml.Serialization;

namespace TSFXGenform.DomainModel.ApplicationClasses
{
    [XmlRoot("QuizPageQuestions")]
    public class QuizPageQuestions
    {
        [XmlElement("QuizPageQuestion")]
        public List<QuizPageQuestion> ListOfQuizPages { get; set; }
    }

     
    public class QuizPageQuestion
    {
       
        [XmlElement("QuestionNumber")]
        public int QuestionNumber { get; set; }

        [XmlArrayItem("QuestionId", IsNullable = false)]
        public List<int> QuestionIds { get; set; }

       
     }

}
