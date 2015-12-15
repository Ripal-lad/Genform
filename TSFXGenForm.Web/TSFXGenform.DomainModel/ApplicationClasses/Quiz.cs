using System;
using System.Xml.Serialization;

namespace TSFXGenform.DomainModel.ApplicationClasses
{

    public class Quiz
    {
        public int Id { get; set; }
        public string HiddenCodeForQuiz { get; set; }
        public string Name { get; set; }
        public float DefaultWidthPx { get; set; }

        [XmlIgnore]
        public DateTime? ExpiresDateTime { get; set; }

        [XmlElement("ExpiresDateTime", IsNullable = false)]
        public string FormattedExpiresDateTime
        {
            get { return ExpiresDateTime == null ? null : ExpiresDateTime.ToString(); }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    ExpiresDateTime = DateTime.Parse(value);
                }
                else
                {

                    ExpiresDateTime = null;
                }
            }
        }

        [XmlIgnore]
        public DateTime? DueDateTime { get; set; }

        [XmlElement("DueDateTime", IsNullable = false)]
        public string FormattedDueDateTime
        {
            get { return DueDateTime == null ? null : DueDateTime.ToString(); }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    DueDateTime = DateTime.Parse(value);
                }
                else
                {
                    DueDateTime = null;
                }
            }
        }

        public int AuthenticationType { get; set; }
        public string RequiredToCompleteGroupIds { get; set; }
        public bool ShowScoreBreakdown { get; set; }
        public bool ShowScoreAverages { get; set; }
        public bool ShowTimer { get; set; }
        public bool EnforceTimer { get; set; }
        public int AttemptsAllowed { get; set; }
        public int ScoreSystem { get; set; }
        public bool QuizBeingSavedAndPaused { get; set; }
        public int QuizPausedQuestionId { get; set; }
        public int ShowMaximumMarks { get; set; }
        public int TimerUpdateFrequency { get; set; }
        public int MaxScore { get; set; }

        //New fields
        [XmlIgnore]
        public DateTime? AvailableDateTime { get; set; }

        [XmlElement("AvailableDateTime", IsNullable = false)]
        public string FormattedAvailableDateTime
        {
            get { return AvailableDateTime == null ? null : AvailableDateTime.ToString(); }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    AvailableDateTime = DateTime.Parse(value);
                }
                else
                {
                    AvailableDateTime = null;
                }
            }
        }

        public bool AllowSaveAndComplete { get; set; }
        public bool ShowIntroductionPage { get; set; }
        public bool ShowResultsPage { get; set; }

        public double PageMinHeightRatio { get; set; }
        //public float PageTopImage { get; set; }
        //public string PageBottomImage { get; set; }
        public string OpeningMessageTitle { get; set; }
        public string OpeningMessage { get; set; }
        public string OpeningMessageEnd { get; set; }

        public string PreviousAttemptMessage { get; set; }
        public bool ShowStartCountDownTimer { get; set; }
        public string EndMessage { get; set; }


    }
}
