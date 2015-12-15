using System;
using System.Collections.Generic;
using TSFXGenform.DomainModel.ApplicationClasses;

namespace TSFXGenform.Core.Tests
{
    public class XmlDataFileTest
    {
        #region "Resources Method(s)"

        private static List<Resource> _resource;
        
        public static void InitializeXmlDataForResources()
        {

            _resource = new List<Resource>
            {
                new Resource
                {
                    Id = 3915,
                    MediaHandlerId = 6,
                    Title = "Performance Report - Pathways Printing",
                    FileNames = "VCE-Accounting_Yr 12-Essays and Projects-3915.pdf|",
                    FilePages = "1095848|",
                    FileSizes = "1095848|",
                    HiddenCode = "mbgiolku",
                    CreateDateTime = new DateTime(2015, 12, 01, 16, 42, 54),
                    URL = "",
                    Description = "",
                    ShortDescription = "",
                },
                new Resource
                {
                    Id = 7379,
                    MediaHandlerId = 6,
                    Title = "Bride's special dance will probably make you cry ",
                    FileNames =
                        "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry",
                    FilePages = "",
                    FileSizes = "",
                    HiddenCode = "wmbhwquq",
                    CreateDateTime = new DateTime(2015, 12, 01, 16, 42, 54),
                    URL = 
                        "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry| ",
                    Description = 
                        "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog ",
                    ShortDescription = "",
                },
                new Resource
                {
                    Id = 7377,
                    MediaHandlerId = 9,
                    Title = "General Chemistry Online",
                    FileNames = "http://antoine.frostburg.edu/chem/senese/101/index.shtml|",
                    FilePages = "",
                    FileSizes = "",
                    HiddenCode = "uwybuyuj ",
                    CreateDateTime = new DateTime(2015, 12, 01, 16, 42, 54),
                    URL = "http://antoine.frostburg.edu/chem/senese/101/index.shtml ",
                    Description = 
                        "Common Compound LibraryA searchable database of over 800 common compound names, formulas, structures, and properties",
                    ShortDescription = "",
                },
                new Resource
                {
                    Id = 4701,
                    MediaHandlerId = 1,
                    Title = "Maths Methods - Unit 4 - Exam 2 - 2005 ",
                    FileNames = "VCE-Maths Methods_Yr 12-Exam Papers-4701.pdf|",
                    FilePages = "18|",
                    FileSizes = "188258| ",
                    HiddenCode = "wbtqbuac ",
                    CreateDateTime = new DateTime(2015, 12, 01, 16, 42, 54),
                    URL= "",
                    Description = "",
                    ShortDescription = "",
                },
                new Resource
                {
                    Id = 7475,
                    MediaHandlerId = 8,
                    Title = "A Collection of Files ",
                    FileNames = "vic-sample-notes-biology.pdf|MyEng.pdf|",
                    FilePages = "13|10| ",
                    FileSizes = "365133|259741|",
                    HiddenCode = "ssvnsouh",
                    CreateDateTime = DateTime.Now,
                    URL = "",
                    Description = "",
                    ShortDescription = "",
                },


            };
        }

        public static List<Resource> GetAll()
        {
            return _resource;
        }
        
        #endregion

        #region "Quiz method"

        private static Quiz _quiz;
        private static QuizQuestions _quizQuestions;
        private static QuizPageQuestions _quizPageQuestions;
        public static void InitializeXmlDataForQuiz()
        {
            #region Set values for Quiz

            _quiz = new Quiz
            {
                Id =7,
                Name = "Biol Quick",
                HiddenCodeForQuiz = "yv2xdir3",
                DefaultWidthPx = 660,
                AvailableDateTime = new DateTime(2015, 01, 19, 0, 0, 0),
                ExpiresDateTime = new DateTime(2015,09,19,0,0,0),
                DueDateTime = new DateTime(2014, 07, 11, 0, 0, 0),
                AuthenticationType = 0,
                RequiredToCompleteGroupIds = null,
                ShowScoreBreakdown = true,
                ShowScoreAverages = true,
                ShowTimer = true,
                EnforceTimer = true,
                AllowSaveAndComplete =true,
                ShowIntroductionPage =true,
                ShowResultsPage =true,
                TimerUpdateFrequency = 0,
                ShowMaximumMarks = 1,
                AttemptsAllowed = 0,
                PageMinHeightRatio =0.3787879,
                OpeningMessageTitle ="Welcome to the TSFX Quiz Master",
                OpeningMessage ="The following quiz consists of <strong>4 questions</strong> and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.<br/><br/>||previousattempts||",
                OpeningMessageEnd = "The Quiz Master has been proudly developed by <strong>TSFX</strong>",
                EndMessage = "Thank you for completing this Quiz.",
                ScoreSystem = 1,
            };

            #endregion

            #region Set values for QuizQuestions

            _quizQuestions = new QuizQuestions
            {
                ListOfQuizQuestions = new List<QuizQuestion>
                {
                    new QuizQuestion
                    {
                        QuestionId = 4,
                        QuestionType = 1,
                        SolutionId = 946,           //Will be remove.
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = "C",
                        PossibleAnswers = "ABCD",
                        QuestionImageName="5FCD6LGGVL3N08K",
                        QuestionImageWidthPx = 2157,
                        QuestionImageHeightPx = 1704,
                        SolutionImageName="G776982WCA4G2IN",
                        SolutionImageWidthPx = 3718,
                        SolutionImageHeightPx = 1311,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX= 0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                    new QuizQuestion
                    {
                        QuestionId = 16,
                        QuestionType = 1,
                        SolutionId = 946,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = "C",
                        PossibleAnswers = "ABCD",
                        QuestionImageName="OU9CGFEQ2JI353P",
                        QuestionImageWidthPx = 3707,
                        QuestionImageHeightPx = 605,
                        SolutionImageName="FO0K7HOJJ1H54KE",
                        SolutionImageWidthPx = 4452,
                        SolutionImageHeightPx = 4452,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                         QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                    new QuizQuestion
                    {
                        QuestionId = 18,
                        QuestionType = 1,
                        SolutionId = 895,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = "A",
                        PossibleAnswers = "ABCD",
                        QuestionImageName="FTM1ONPMNLHNPFA",
                        QuestionImageWidthPx = 1494,
                        QuestionImageHeightPx = 619,
                        SolutionImageName="LDC5FPU0SZ8RCAT",
                        SolutionImageWidthPx = 3562,
                        SolutionImageHeightPx = 1130,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                     new QuizQuestion
                    {
                        QuestionId = 29,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="KI2OKKTLJWB1Q3O",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="CM2AECMO5GE4SWY",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                       new QuizQuestion
                    {
                        QuestionId = 30,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="W357HOO0A1N35EY",
                        QuestionImageWidthPx = 1746,
                        QuestionImageHeightPx = 84,
                        SolutionImageName="7X2CGAST1RUG25O",
                        SolutionImageWidthPx = 3463,
                        SolutionImageHeightPx = 297,
                        NumberOfMarks = 2,
                        TimeToAnswer = 144,
                        RecommendedTime = 3,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                       new QuizQuestion
                    {
                        QuestionId = 31,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="BNZEMHH999JDEN3",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="RJJMMOA6TQF8OAH",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 32,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="41I9LDF4OG8KQ46",
                        QuestionImageWidthPx = 3490,
                        QuestionImageHeightPx = 84,
                        SolutionImageName="EQ4CGXL1DLGZ177",
                        SolutionImageWidthPx = 3658,
                        SolutionImageHeightPx = 901,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 33,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="CGNWE2VIWURBHB1",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="SD3SIA70JRH8RH6",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 34,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="VX2SFCVB1DIICUX",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="RJJMMOA6TQF8OAH",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=297.637795275591,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 35,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="55DES93CUB6GNU4",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="4I1K3PESJ8A3D4V",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=297.637795275591,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 36,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="OJT6V4YLAY9CHCP",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="OP43K5RNM1926EB",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 37,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="JQT2HKIM1MO9YO3",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="I3RSWKNFINWA4L2",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },  new QuizQuestion
                    {
                        QuestionId = 38,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="3DZPRD1LHHB4Y7V",
                        QuestionImageWidthPx = 2915,
                        QuestionImageHeightPx = 84,
                        SolutionImageName="M6J7U2HUHKU4285",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=297.637795275591,
                        WriteSolutionInSpecificLocationMessage=null
                      
                    },
                      new QuizQuestion
                    {
                        QuestionId = 39,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="U5CZVN7ICLV7BUQ",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="RJJMMOA6TQF8OAH",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=297.637795275591,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 49,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="6H6SHJBMFPUTE9A",
                        QuestionImageWidthPx = 4016,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="UPEP4MSHDIL15AB",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                      new QuizQuestion
                    {
                        QuestionId = 50,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="WI6M69MKVWHR1EJ",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="CIS4IIC303O39ZE",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                       new QuizQuestion
                    {
                        QuestionId = 51,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="W3QRBNWRUJTE688",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="5DKHPUUU53U40X7",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                       new QuizQuestion
                    {
                        QuestionId = 52,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="BV75V9Z92D3S9NU",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="V34TAD5B7FJIKPT",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                       new QuizQuestion
                    {
                        QuestionId = 53,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="K8ML1RJHMA838KC",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="6YIABROCLYCVKCG",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=297.637795275591,
                        WriteSolutionInSpecificLocationMessage=null
                    },
                       new QuizQuestion
                    {
                        QuestionId = 54,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="3NA5MKBAU1MH4X7",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="68HXVHS44IL53U9",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                     },
                      new QuizQuestion
                    {
                        QuestionId = 55,
                        QuestionType = 2,
                        SolutionId = 897,
                        SolutionResourceId = 0,
                        SolutionResourceTitle = null,
                        NoOfAnswersRequired = 1,
                        CorrectAnswer = null,
                        PossibleAnswers = "ABCD",
                        QuestionImageName="ESB3KOWTYXYEDNC",
                        QuestionImageWidthPx = 4103,
                        QuestionImageHeightPx = 2593,
                        SolutionImageName="YUT464SBLST3PB5",
                        SolutionImageWidthPx = 3865,
                        SolutionImageHeightPx = 3865,
                        NumberOfMarks = 1,
                        TimeToAnswer = 72,
                        RecommendedTime = 2,
                        SolutionImageRequiredScaling = 1,
                        QuestionImagePath="",
                        SolutionImagePath="",
                        QuizResultSummaryId=0,
                        IndentPX=0,
                        WriteSolutionInSpecificLocationMessage=null
                    },

                }
            };

            #endregion

            #region Set values for QuizPageQuestions

            _quizPageQuestions = new QuizPageQuestions
            {
                ListOfQuizPages = new List<QuizPageQuestion>
                {
                    new QuizPageQuestion
                    {
                        QuestionNumber = 1,
                        QuestionIds=new List<int>(new[]{4})
                    },
                    new QuizPageQuestion
                    {
                        QuestionNumber = 2,
                        QuestionIds=new List<int>(new[]{16})
                    },
                    new QuizPageQuestion
                    {
                      QuestionNumber = 3,
                      QuestionIds=new List<int>(new[]{18})
                    },
                    new QuizPageQuestion
                    {
                       QuestionNumber = 4,
                       QuestionIds=new List<int>(new[]{29,30,31,32})
                    },
                    new QuizPageQuestion
                    {
                       QuestionNumber = 5,
                       QuestionIds=new List<int>(new[]{33,34,35,36,37,38,39})
                    },
                    new QuizPageQuestion
                    {
                       QuestionNumber = 6,
                       QuestionIds=new List<int>(new[]{49,50,51,52,53,54,55})
                    },
                }
            };

            #endregion

        }

        public static Quiz GetAll_QuizDetails()
        {
            return _quiz;
        }

        public static QuizQuestions GetAll_QuizQuestions()
        {
            return _quizQuestions;
        }

        public static QuizPageQuestions GetAll_QuizPages()
        {
            return _quizPageQuestions;
        }

        #endregion
    }
}
