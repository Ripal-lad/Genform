using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TSFXGenform.DomainModel.Models;

namespace TSFXGenform.Core.Tests
{
    public class TestDatabase
    {
        private static IEnumerable<QuizDefine> _quizDefine;
        private static IEnumerable<QuizCompilation> _quizCompilation;
        private static IEnumerable<QuizResult> _quizResult;
        private static IEnumerable<QuizResultSummary> _quizResultSummary;
        private static IEnumerable<MappingQuizResultDetails> _mappingQuizResultDetails; 

        public static void InitializeQuizDatabase()
        {
            #region "Set values for QuizDefine"


           _quizDefine = new List<QuizDefine>()
                {
                    new QuizDefine
                    {
                        QuizDefineId = 1,
                        Id = 7,
                        QuizName = "Biol Quick",
                        DueDateTime = new DateTime(2014, 07, 11, 0, 0, 0),
                        ExpiresDateTime = DateTime.Now.AddDays(10),
                        AuthenticationType = 0,
                        RequiredToCompleteGroupIds = null,
                        CreateDate = DateTime.Now

                    },

                };

                #endregion

            #region "Set values for QuizCompilation"

            _quizCompilation = new List<QuizCompilation>()
            {
                new QuizCompilation
                {
                    QuizCompileId = 1,
                    QuizDefineId = 1,
                    QuestionId = 4,
                    Answer = "ABCD",
                    CorrectAnswer = "C",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 1 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 2,
                    QuizDefineId = 1,
                    QuestionId = 16,
                    Answer = "ABCD",
                    CorrectAnswer = "C",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 6,
                    QuestionNumber = 2
                },
                new QuizCompilation
                {
                    QuizCompileId = 3,
                    QuizDefineId = 1,
                    QuestionId = 18,
                    Answer = "ABCD",
                    CorrectAnswer = "A",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 3 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 4,
                    QuizDefineId = 1,
                    QuestionId = 29,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 4 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 5,
                    QuizDefineId = 1,
                    QuestionId = 30,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 4 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 6,
                    QuizDefineId = 1,
                    QuestionId = 31,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 4 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 7,
                    QuizDefineId = 1,
                    QuestionId = 32,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 4 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 8,
                    QuizDefineId = 1,
                    QuestionId = 33,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 9,
                    QuizDefineId = 1,
                    QuestionId = 34,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 10,
                    QuizDefineId = 1,
                    QuestionId = 35,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 11,
                    QuizDefineId = 1,
                    QuestionId = 36,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 12,
                    QuizDefineId = 1,
                    QuestionId = 37,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 12,
                    QuizDefineId = 1,
                    QuestionId = 37,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 13,
                    QuizDefineId = 1,
                    QuestionId = 38,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 14,
                    QuizDefineId = 1,
                    QuestionId = 39,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 5 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 15,
                    QuizDefineId = 1,
                    QuestionId = 49,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 16,
                    QuizDefineId = 1,
                    QuestionId = 50,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 17,
                    QuizDefineId = 1,
                    QuestionId = 51,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 18,
                    QuizDefineId = 1,
                    QuestionId = 52,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 19,
                    QuizDefineId = 1,
                    QuestionId = 53,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 20,
                    QuizDefineId = 1,
                    QuestionId = 54,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                },
                new QuizCompilation
                {
                    QuizCompileId = 21,
                    QuizDefineId = 1,
                    QuestionId = 55,
                    Answer = "ABCD",
                    CorrectAnswer = "",
                    NoOfAnswersRequired = 1,
                    RecommendedTime = 5,
                    QuestionNumber = 6 //Will be removed.
                }
            };

            #endregion

            #region "Set values for QuizResult"

            _quizResult = new List<QuizResult>()
            {
                new QuizResult
                {
                    QuizResultId = 1,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 1,
                    QuestionId = 4,
                    UserAnswer = "C",
                    AnsweredInTime = false,
                    IsAnsweringDone = true,
                    Score = 1,
                    TimeTaken = 3
                },
                new QuizResult
                {
                    QuizResultId = 2,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 2,
                    QuestionId = 16,
                    UserAnswer = "C",
                    AnsweredInTime = true,
                    IsAnsweringDone = true,
                    Score = 1,
                    TimeTaken = 2
                },
                new QuizResult
                {
                    QuizResultId = 3,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 2,
                    QuestionId = 18,
                    UserAnswer = "C",
                    AnsweredInTime = true,
                    Score = 0,
                    TimeTaken = 5
                },
                new QuizResult
                {
                    QuizResultId = 4,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 4,
                    QuestionId = 29,
                    UserAnswer = "<p>2342354</p>",
                    AnsweredInTime = false,
                    IsAnsweringDone = true,
                    Score = null,
                    TimeTaken = 2
                },
                new QuizResult
                {
                    QuizResultId = 5,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 5,
                    QuestionId = 30,
                    //UserAnswer = "<p>2342354</p>",
                    AnsweredInTime = false,
                    IsAnsweringDone = true,
                    Score = 1,
                    TimeTaken = 4
                },
                new QuizResult
                {
                    QuizResultId = 5,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 5,
                    QuestionId = 30,
                    //UserAnswer = "<p>2342354</p>",
                    AnsweredInTime = false,
                    IsAnsweringDone = true,
                    Score = 1,
                    TimeTaken = 4
                },
                new QuizResult
                {
                    QuizResultId = 6,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 6,
                    QuestionId = 31,
                    //UserAnswer = "<p>2342354</p>",
                    AnsweredInTime = false,
                    Score = 1,
                    TimeTaken = 4
                },
                new QuizResult
                {
                    QuizResultId = 7,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 7,
                    QuestionId = 32,
                    //UserAnswer = "<p>2342354</p>",
                    AnsweredInTime = false,
                    IsAnsweringDone = true,
                    Score = 1,
                    TimeTaken = 7
                },
                 new QuizResult
                {
                    QuizResultId = 8,
                    UserId = 1,
                    QuizDefineId = 1,
                    QuizCompileId = 8,
                    QuestionId = 32,
                    AnsweredInTime = false,
                    IsAnsweringDone = true,
                    Score = 1,
                    TimeTaken = 7
                }


            };

            #endregion

            #region "Set values for QuizResultSummary"

            _quizResultSummary = new List<QuizResultSummary>()
            {
                new QuizResultSummary
                {
                    QuizResultSummaryId = 1,
                    UserId = 1,
                    QuizDefineId = 1,
                    TotalScore = 20,
                    MaxScore = 26,
                    TotalTimeTaken = 56,
                    AttemptNumber = 1,
                    IsBestScore = true,
                    StartDate = DateTime.Now,
                    EndDate =null
                }
            };

            #endregion

            #region "Set values for MappingQuizResultDetails"

            _mappingQuizResultDetails = new List<MappingQuizResultDetails>
            {
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 1,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 1,
                    QuizResultId = 1
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 2,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 2,
                    QuizResultId = 2
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 3,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 3,
                    QuizResultId = 3
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 4,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 4,
                    QuizResultId = 4
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 5,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 5,
                    QuizResultId = 5
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 6,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 6,
                    QuizResultId = 6
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 7,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 7,
                    QuizResultId = 7
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 8,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 8,
                    QuizResultId = 8
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 9,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 9,
                    QuizResultId = 9
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 10,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 10,
                    QuizResultId = 10
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 11,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 11,
                    QuizResultId = 11
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 12,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 12,
                    QuizResultId = 12
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 13,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 13,
                    QuizResultId = 13
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 14,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 14,
                    QuizResultId = 14
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 15,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 15,
                    QuizResultId = 15
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 16,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 16,
                    QuizResultId = 16
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 17,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 17,
                    QuizResultId = 17
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 18,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 18,
                    QuizResultId = 18
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 19,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 19,
                    QuizResultId = 19
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 20,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 20,
                    QuizResultId = 20
                },
                new MappingQuizResultDetails
                {
                    MappingQuizResultDetailId = 21,
                    QuizResultSummaryId = 1,
                    QuizCompileId = 21,
                    QuizResultId = 0
                }
            };

            #endregion
        }

        public static IEnumerable<QuizDefine> GetAll_QuizDefine()
        {
            return _quizDefine;
        }

        public static IEnumerable<QuizCompilation> GetAll_QuizCompilation()
        {
            return _quizCompilation;
        }

        public static IEnumerable<QuizResult> GetAll_QuizResult()
        {
            return _quizResult;
        }

        public static IEnumerable<QuizResultSummary> GetAll_QuizResultSummary()
        {
            return _quizResultSummary;
        }

        public static IEnumerable<MappingQuizResultDetails> GetAll_MappingQuizResultDetails()
        {
            return _mappingQuizResultDetails;
        }
    }
}
