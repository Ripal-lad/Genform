using System.Xml.Serialization;

namespace TSFXGenform.DomainModel.ApplicationClasses
{
    [XmlRoot("QuizRoot")]
    public class QuizRoot
    {
        [XmlElement("Quiz")]
        public Quiz Quiz { get; set; }
        public QuizQuestions QuizQuestions { get; set; }
        public QuizPageQuestions QuizPageQuestions { get; set; }

    }
}
