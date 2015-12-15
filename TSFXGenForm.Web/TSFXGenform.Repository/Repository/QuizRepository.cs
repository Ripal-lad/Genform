using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.DomainModel.DataRepository;
using TSFXGenform.DomainModel.Models;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Utils;
using TSFXGenform.Utils.GlobalUtils;

namespace TSFXGenform.Repository.Repository
{
    public class QuizRepository : IQuizRepository
    {
        #region "Private variable(s)"

        private readonly IXmlDataRepository<QuizRoot> _quizQuizXmlDataRepository;
        private readonly IDataRepository<QuizDefine> _quizDefineContext;
        private readonly IDataRepository<QuizCompilation> _quizCompilationContext;
        private readonly IDataRepository<QuizResult> _quizResultContext;
        private readonly IDataRepository<QuizResultSummary> _quizResultSummaryContext;
        private readonly IDataRepository<MappingQuizResultDetails> _mappingQuizResultContext;
        private readonly IExecuteMySqlQueries _executeMySqlQueries;
        private readonly IXmlDataRepository<Resources> _resourceXmlDataRepository;
        private readonly ICacheMemoryRepository _cacheMemoryRepository;
        private readonly StringConstant _stringConstant;

        #endregion


        #region "Public methods"

        public QuizRepository(IXmlDataRepository<QuizRoot> quizXmlDataRepository,
            IDataRepository<QuizDefine> quizDefineContext, IDataRepository<QuizCompilation> quizCompilationContext,
            IDataRepository<QuizResult> quizResultContext, IDataRepository<QuizResultSummary> quizResultSummaryContext,
            IExecuteMySqlQueries executeMySqlQueries, IDataRepository<MappingQuizResultDetails> mappingQuizResultContext,
            IXmlDataRepository<Resources> resourceXmlDataRepository, ICacheMemoryRepository quizCacheMemoryRepository,
             StringConstant stringConstant)
        {
            _quizQuizXmlDataRepository = quizXmlDataRepository;
            _quizDefineContext = quizDefineContext;
            _quizCompilationContext = quizCompilationContext;
            _quizResultContext = quizResultContext;
            _quizResultSummaryContext = quizResultSummaryContext;
            _mappingQuizResultContext = mappingQuizResultContext;
            _executeMySqlQueries = executeMySqlQueries;
            _resourceXmlDataRepository = resourceXmlDataRepository;
            _cacheMemoryRepository = quizCacheMemoryRepository;
            _stringConstant = stringConstant;

        }


        /// <summary>
        /// Method to check URL of Quiz and get FormId from it
        /// </summary>
        /// <param name="hiddencode"></param>
        /// <returns>bool</returns>
        //public bool CheckQuizUrlAndGetFormId(string hiddencode)
        //{
        //    try
        //    {
        //        if (hiddencode.Length <= 0)
        //        {
        //            return false;
        //        }
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : CheckQuizUrlAndGetFormId");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to deserialise EventData XML file of Quiz based on passed wid value i.e FormId
        /// </summary>
        /// <param name="strQuizFilePath"></param>
        /// <returns>QuizRoot</returns>
        public QuizRoot GetQuizEventDataXmlData(string strQuizFilePath)
        {
            return _quizQuizXmlDataRepository.DeserializeXmlData(strQuizFilePath);
        }


        /// <summary>
        /// Method to check if QuizPageQuestions is not null and have some record
        /// </summary>
        /// <param name="quizRoot"></param>
        /// <returns>bool</returns>
        //public bool CheckQuizPagesNotNull(QuizRoot quizRoot)
        //{GetFirstQuestionNumberToLoadOnQuestionPage
        //    try
        //    {
        //        if (quizRoot != null)
        //        {
        //            return quizRoot.QuizPageQuestions != null && quizRoot.QuizPageQuestions.ListOfQuizPages != null &&
        //                   quizRoot.QuizPageQuestions.ListOfQuizPages.Any();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : CheckQuizPagesNotNull");
        //        throw;
        //    }
        //    return false;
        //}


        /// <summary>
        /// Method to get name of Quiz throughout Quiz flow
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizRoot"></param>
        /// <returns>string</returns>
        //public string GetCurrentQuizName(string hiddenCode, QuizRoot quizRoot)
        //{
        //    try
        //    {
        //        if (quizRoot != null && quizRoot.Quiz != null && quizRoot.Quiz.HiddenCodeForQuiz == hiddenCode &&
        //            !string.IsNullOrEmpty(quizRoot.Quiz.Name))
        //        {
        //            return quizRoot.Quiz.Name;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : GetCurrentQuizName");
        //        throw;
        //    }
        //    return string.Empty;
        //}


        /// <summary>
        /// Method to call cache method for getting XML file data to cache memory
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>QuizRoot</returns>
        public QuizRoot GetXmlFileDataFromCacheMemory(string hiddenCode)
        {
            var cacheKey = "QuizRoot-" + hiddenCode;
            return _cacheMemoryRepository.GetXmlFileDataFromCacheMemory<QuizRoot>(cacheKey);
        }


        /// <summary>
        /// Method to read XML file for Quiz and load it to cache memory
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>QuizRoot</returns>
        public QuizRoot SetAndGetQuizXmlFileDataIntoCacheMemory(string filePath, string hiddenCode)
        {
            var xmlFilePath = Path.Combine(filePath, hiddenCode + ".xml");
            return _cacheMemoryRepository.SetAndGetXmlFileDataIntoCacheMemoryOnLoad("QuizRoot", () => GetQuizEventDataXmlData(xmlFilePath), xmlFilePath, hiddenCode);

        }


        /// <summary>
        /// Method to check modified time span of XML file 
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>bool</returns>
        public bool CheckModifiedTimeStampOfXmlFileForQuiz(string xmlFilePath, string hiddenCode)
        {
            var cacheKeyForQuiz = "quizXmlModifiedTimeStamp-" + hiddenCode;
            return _cacheMemoryRepository.CheckModifiedTimeStampOfXmlFile(xmlFilePath,
                  cacheKeyForQuiz, hiddenCode);
        }


        #region "IntroPage "


        /// <summary>
        /// Method to check Available date of Quiz i.e . Quiz is currently available or not
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quiz"></param>
        /// <returns>bool</returns>
        public ValidateQuiz CheckQuizIsAvailableOrNot(string hiddenCode, Quiz quiz)
        {
            var currentDate = DateTime.Now;
            var validate = new ValidateQuiz();
            if (!string.IsNullOrWhiteSpace(quiz.FormattedAvailableDateTime))
            {
                var availableDate = Convert.ToDateTime(quiz.FormattedAvailableDateTime);
                if (((availableDate).Subtract(currentDate)).TotalDays <= 0)
                {
                    validate.IsQuizValidated = true;
                }
                else
                {
                    validate.IsQuizValidated = false;
                    validate.Message = _stringConstant.QuizIsNotAvailableMessage;
                }
            }
            else if (quiz.ExpiresDateTime != null)
            {
                if (((currentDate).Subtract((DateTime)quiz.ExpiresDateTime)).TotalDays <= 0)
                {
                    validate.IsQuizValidated = true;
                }
                else
                {
                    validate.IsQuizValidated = false;
                    validate.Message = _stringConstant.QuizIsExpiredMessage;
                }
            }

            return validate;

        }


        /// <summary>
        /// Method to get Welcome message details which is on Intro Page 
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="userId"></param>
        /// <returns>Quiz</returns>
        public async Task<Quiz> GetQuizDetails(Quiz quiz, int userId)
        {
            if (quiz.OpeningMessage.Contains("||previousattempts||"))
            {
                var strPreviousAttemptMsg = await GetPreviousAttemptMessage(quiz.Id, userId);

                quiz.PreviousAttemptMessage = quiz.OpeningMessage.Replace("||previousattempts||", strPreviousAttemptMsg + "<br/>");

            }
            return quiz;
        }


        //public bool CheckQuizOpeningMessageNotNull(Quiz quiz)
        //{
        //    try
        //    {
        //        if (quiz != null)
        //        {
        //            return !string.IsNullOrEmpty(quiz.OpeningMessage) &&
        //                   !string.IsNullOrEmpty(quiz.OpeningMessageEnd) &&
        //                   !string.IsNullOrEmpty(quiz.OpeningMessageTitle);
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : CheckQuizOpeningMessageNotNull");
        //        throw;
        //    }
        //    return false;
        //}
        /// <summary>
        /// Method to check if Opening Messages on Intro page are not null
        /// </summary>
        /// <param name="quiz"></param>
        /// <returns>bool</returns>
        /// <summary>
        /// Method to get the previous attempt message on Intro page
        /// </summary>
        /// <param name="formId"></param>
        /// <param name="userId"></param>
        /// <returns>string</returns>
        public async Task<string> GetPreviousAttemptMessage(int formId, int userId)
        {
            string previousAttemptMsg = null;
            if (formId != 0 && userId != 0)
            {
                var lastStartDate = DateTime.MinValue;
                var completed = 0;
                var started = 0;

                var objQuizDef = await
                    _quizDefineContext.FirstOrDefaultAsync(x => x.Id == formId && x.ExpiresDateTime >= DateTime.Now);

                if (objQuizDef == null)
                {
                    previousAttemptMsg = "You have not previously attempted this quiz.";
                    return previousAttemptMsg;
                }
                else
                {
                    var objQuizResSumLst =
                        _quizResultSummaryContext.Fetch()
                            .Where(y => y.QuizDefineId == objQuizDef.QuizDefineId && y.UserId == userId)
                            .OrderBy(y => y.EndDate)
                            .ToList();

                    foreach (var quizResSum in objQuizResSumLst)
                    {
                        lastStartDate = quizResSum.StartDate;
                        if (quizResSum.EndDate != null)
                        {
                            completed += 1;
                        }
                        started += 1;
                    }


                    if (started == 0)
                    {
                        previousAttemptMsg = "You have not previously attempted this quiz.";
                    }
                    else if (completed == 0)
                    {
                        previousAttemptMsg = "You previously attempted but did not complete this quiz on " +
                                             lastStartDate.ToString("d MMMM yyyy") + ".";
                    }
                    else if (started == 1)
                    {
                        previousAttemptMsg = "You have previously completed this quiz on " +
                                             lastStartDate.ToString("d MMMM yyyy") + ".";
                    }
                    else
                    {
                        previousAttemptMsg = "You have previously attempted/completed this quiz on " + started +
                                             " occasions, the most recent attempt being on " +
                                             lastStartDate.ToString("d MMMM yyyy") + ".";
                    }
                }
            }
            return previousAttemptMsg;
        }


        /// <summary>
        /// Method to initiate Quiz and have DB transaction of QuizDefine table
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        public async Task InitiateQuizDefine(Quiz quiz, int userId)
        {
            try
            {
                #region "Load QuizDefine into MySQL"

                var objQuizDefine = await _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id);
                if (objQuizDefine != null)
                {
                    //Update QuizDefine
                    objQuizDefine.Id = quiz.Id;
                    objQuizDefine.QuizName = quiz.Name;
                    objQuizDefine.DueDateTime = Convert.ToDateTime(quiz.FormattedDueDateTime);
                    objQuizDefine.ExpiresDateTime = Convert.ToDateTime(quiz.FormattedExpiresDateTime);
                    objQuizDefine.AuthenticationType = quiz.AuthenticationType;
                    objQuizDefine.RequiredToCompleteGroupIds = quiz.RequiredToCompleteGroupIds;
                    objQuizDefine.CreateDate = DateTime.Now;

                    _quizDefineContext.Update(objQuizDefine);
                    await _quizDefineContext.SaveChangesAsync();

                }
                else
                {
                    //Insert QuizDefine
                    var objQuizDef = new QuizDefine
                    {
                        Id = quiz.Id,
                        QuizName = quiz.Name,
                        DueDateTime = Convert.ToDateTime(quiz.FormattedDueDateTime),
                        ExpiresDateTime = Convert.ToDateTime(quiz.FormattedExpiresDateTime),
                        CreateDate = DateTime.Now,
                        AuthenticationType = quiz.AuthenticationType,
                        RequiredToCompleteGroupIds = quiz.RequiredToCompleteGroupIds
                    };
                    _quizDefineContext.Add(objQuizDef);
                    await _quizDefineContext.SaveChangesAsync();
                }


                #endregion
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : InitiateQuizDefine");
                throw;
            }

        }


        /// <summary>
        /// Method to get first Question no. of Quiz to display on QuestionPage.
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetFirstQuestionNumberToLoadOnQuestionPage(QuizPageQuestions quizPageQuestions)
        //{
        //    try
        //    {
        //        if (quizPageQuestions != null && quizPageQuestions.ListOfQuizPages.Any())
        //        {
        //            var objFirstQuizPage = quizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionIds != null && x.QuestionIds.Any() && x.QuestionNumber != 0);
        //            return objFirstQuizPage;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : GetFirstQuestionNumberToLoadOnQuestionPage");
        //        throw;
        //    }
        //    return null;
        //}

        #endregion

        #region "QuestionPage "


        /// <summary>
        /// Method to do DB transaction for QuizResultSummary and QuizCompilation tables
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        public async Task<int> InitializeQuizResultSummaryAndQuizCompilation(Quiz quiz, QuizPageQuestions quizPageQuestions, QuizQuestions quizQuestions, int userId)
        {
            try
            {
                var quizResultSummaryId = 0;

                //Get record from QuizDefine
                var objQuizDefineDetail = await
                    _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

                if (objQuizDefineDetail == null) return quizResultSummaryId;

                var objQuizCompilationLst =
                    _quizCompilationContext.Fetch()
                        .Where(x => x.QuizDefineId == objQuizDefineDetail.QuizDefineId)
                        .ToList();

                #region "Load QuizCompilation into MySQL"

                var sameQuestionExists = false;


                #region "Check if the QuizCompilation table contains same Question which are already there with same NoOfAnswerRequired"

                foreach (
                    var objChkExistance in
                        from quizQuestion in quizQuestions.ListOfQuizQuestions
                        where quizQuestion != null
                        select objQuizCompilationLst.Find(x => x.QuestionId == quizQuestion.QuestionId &&
                                                               x.NoOfAnswersRequired ==
                                                               quizQuestion.NoOfAnswersRequired &&
                                                               x.QuizDefineId ==
                                                               objQuizDefineDetail.QuizDefineId))
                {
                    if (objChkExistance == null)
                    {
                        sameQuestionExists = false;
                        break;
                    }
                    else
                    {
                        sameQuestionExists = true;
                    }
                }

                #endregion

                #region "Delete record if it contains different QuizCompilation"

                if (sameQuestionExists == false)
                {
                    foreach (var quizCompilation in objQuizCompilationLst)
                    {
                        _quizCompilationContext.Delete(quizCompilation);
                    }
                    await _quizCompilationContext.SaveChangesAsync();
                }

                #endregion


                #region "Insert QuizCompilation values if it does not exists else don't"

                if (sameQuestionExists == false)
                {
                    foreach (var quizPage in quizPageQuestions.ListOfQuizPages)
                    {
                        foreach (var questionid in quizPage.QuestionIds)
                        {
                            foreach (var quizCompilation in from questionDetail in quizQuestions.ListOfQuizQuestions
                                                            where questionid == questionDetail.QuestionId
                                                            let quizPageQuestion = quizPage
                                                            where quizPageQuestion != null
                                                            select new QuizCompilation
                                                        {
                                                            QuizDefineId = objQuizDefineDetail.QuizDefineId,
                                                            QuestionId = questionDetail.QuestionId,
                                                            Answer = questionDetail.PossibleAnswers,
                                                            CorrectAnswer = questionDetail.CorrectAnswer,
                                                            NoOfAnswersRequired = questionDetail.NoOfAnswersRequired,
                                                            QuestionNumber = quizPageQuestion.QuestionNumber
                                                        })
                            {
                                _quizCompilationContext.Add(quizCompilation);
                                break;
                            }
                        }
                    }
                    await _quizCompilationContext.SaveChangesAsync();
                }

                #endregion

                #endregion

                //Check if QuizResultSummary does not have FormID with EndDate as null & if so then check from where to resume Quiz

                #region "Check if QuizResultSummary already exists, if not then insert it"

                var objQuiz = await _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id);
                if (objQuiz != null)
                {

                    var objQuizResSummary = await
                        _quizResultSummaryContext.Fetch(x => x.QuizDefineId == objQuiz.QuizDefineId && x.UserId == userId &&
                                    x.EndDate == null)
                            .OrderByDescending(x => x.QuizResultSummaryId)
                            .FirstOrDefaultAsync();

                    if (objQuizResSummary != null)
                    {

                        //Check where the Quiz was Resumed - on which Question and not inserting values in QuizCompilation table
                        var objQuizResSum = await
                        _quizResultSummaryContext.Fetch(x => x.QuizDefineId == objQuizDefineDetail.QuizDefineId && x.UserId == userId && x.EndDate == null)
                            .OrderByDescending(x => x.QuizResultSummaryId)
                            .FirstOrDefaultAsync();

                        //Update Start Date if QuizResultSummary record is already exists
                        if (objQuizResSum != null)
                        {
                            objQuizResSum.StartDate = DateTime.Now;
                            _quizResultSummaryContext.Update(objQuizResSum);
                            await _quizResultSummaryContext.SaveChangesAsync();
                        }

                    }
                    else
                    {
                        //Get the Attempts of Quiz based on QuizDefineId
                        var objAttemptCountForQuiz = await
                            _quizResultSummaryContext.Fetch(x =>
                                        x.QuizDefineId == objQuiz.QuizDefineId && x.EndDate != null &&
                                        x.UserId == userId)
                                .OrderByDescending(x => x.QuizResultSummaryId)
                                .FirstOrDefaultAsync();

                        #region "Insert values in QuizResultSummary"

                        if (objAttemptCountForQuiz != null)
                        {
                            #region "New attempt = Previous attempt + 1"

                            var objQuizResultSummary = new QuizResultSummary
                            {
                                UserId = userId,
                                QuizDefineId = objQuiz.QuizDefineId,
                                AttemptNumber = objAttemptCountForQuiz.AttemptNumber + 1,
                                StartDate = DateTime.Now,
                                ScoreSystem = quiz.ScoreSystem,
                                EndDate = null
                            };

                            _quizResultSummaryContext.Add(objQuizResultSummary);

                            #endregion
                        }
                        else
                        {
                            #region "First Attempt"

                            var objQuizResultSummary = new QuizResultSummary
                            {
                                UserId = userId,
                                QuizDefineId = objQuiz.QuizDefineId,
                                AttemptNumber = 1,
                                StartDate = DateTime.Now,
                                ScoreSystem = quiz.ScoreSystem,
                                EndDate = null
                            };

                            _quizResultSummaryContext.Add(objQuizResultSummary);

                            #endregion
                        }
                        await _quizResultSummaryContext.SaveChangesAsync();



                        #endregion

                        #region "Load MappingQuizResultDetails into MySQL"

                        var objQuizCompLst =
                            _quizCompilationContext.Fetch(x => x.QuizDefineId == objQuizDefineDetail.QuizDefineId)
                                .OrderBy(x => x.QuizCompileId)
                                .ToList();

                        var objQuizResSum = await
                            _quizResultSummaryContext.Fetch(x => x.QuizDefineId == objQuizDefineDetail.QuizDefineId && x.UserId == userId && x.EndDate == null)
                                .OrderByDescending(x => x.QuizResultSummaryId)
                                .FirstOrDefaultAsync();

                        if (objQuizResSum != null && objQuizResSum.QuizResultSummaryId != 0)
                        {
                            foreach (QuizCompilation quizCompilation in objQuizCompLst)
                            {
                                var objMappingQuiz = new MappingQuizResultDetails
                                {
                                    QuizCompileId = quizCompilation.QuizCompileId,
                                    QuizResultSummaryId = objQuizResSum.QuizResultSummaryId
                                };
                                _mappingQuizResultContext.Add(objMappingQuiz);
                            }

                            await _mappingQuizResultContext.SaveChangesAsync();
                        }

                        #endregion

                    }

                    var objQuizResultSum = await
                            _quizResultSummaryContext.Fetch(x => x.QuizDefineId == objQuizDefineDetail.QuizDefineId && x.UserId == userId && x.EndDate == null)
                                .OrderByDescending(x => x.QuizResultSummaryId)
                                .FirstOrDefaultAsync();

                    if (objQuizResultSum != null) quizResultSummaryId = objQuizResultSum.QuizResultSummaryId;
                }

                return quizResultSummaryId;

                #endregion
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : InitializeQuizResultSummaryAndQuizCompilation");
                throw;
            }
        }


        /// <summary>
        /// Method to get QuizPageQuestion based on Question no. passed for Question page
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestionNumber"></param>
        /// <returns>QuizPageQuestion</returns>
        public QuizPageQuestion GetQuizPageOnQuestionpage(QuizPageQuestions quizPageQuestions, int quizQuestionNumber)
        {
            return quizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionNumber == quizQuestionNumber);
        }


        /// <summary>
        /// Method to calculate user's score for Multiple Choice Questions
        /// </summary>
        /// <param name="questionAndResult"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>int</returns>
        public int CalculateMultipleChioceAnswerQuestionsScore(List<QuizPageAndQuestionDetails> questionAndResult, QuizQuestions quizQuestions)
        {
            var isScore = false;
            var userScore = 0;

            foreach (var quizResult in questionAndResult.Where(quizResult => quizResult != null && quizResult.QuestionType != 0))
            {
                if (quizResult.QuestionType == 1 && quizResult.AnsweredInTime)
                {
                    #region "Check Correct Answer and assign Score"

                    var quizQuestion =
                        quizQuestions.ListOfQuizQuestions
                            .FirstOrDefault(
                                x =>
                                    x.QuestionId == quizResult.QuestionId &&
                                    x.QuestionType == quizResult.QuestionType);

                    if (quizQuestion == null) continue;

                    if (string.IsNullOrEmpty(quizQuestion.CorrectAnswer) ||
                        string.IsNullOrEmpty(quizResult.UserAnswer)) continue;

                    if (quizQuestion.CorrectAnswer.Length == quizQuestion.NoOfAnswersRequired && quizResult.UserAnswer.Length == quizQuestion.NoOfAnswersRequired)
                    {
                        var length = quizQuestion.CorrectAnswer.Length;
                        foreach (var quizquestion in questionAndResult)
                        {
                            for (var i = 0; i < length; i++)
                            {
                                if (
                                    quizquestion.UserAnswer.Contains(
                                        quizQuestion.CorrectAnswer.Substring(i, 1)))
                                {
                                    isScore = true;
                                }
                                else
                                {
                                    isScore = false;
                                    break;
                                }
                            }
                        }
                    }
                    userScore = isScore ? quizQuestion.NumberOfMarks : 0;

                    #endregion
                }
                else if (quizResult.QuestionType == 1 && !quizResult.AnsweredInTime)
                {
                    userScore = 0;
                }
            }
            return userScore;
        }


        /// <summary>
        /// Method to check if QuizPageQuestions - QuestionId value is not null and to sort QuizPageQuestions based on QuestionNumber
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestions</returns>
        public QuizPageQuestions CheckQuizPagesHavePageQuestionId(QuizPageQuestions quizPageQuestions)
        {
            QuizPageQuestions objQuizPages = null;
            var resQuizPagesPageIdLst =
                quizPageQuestions.ListOfQuizPages.Where(
                    x => x.QuestionIds != null && x.QuestionIds.Any());
            objQuizPages = new QuizPageQuestions
            {
                ListOfQuizPages = resQuizPagesPageIdLst.OrderBy(x => x.QuestionNumber).ToList()
            };
            return objQuizPages;
        }


        /// <summary>
        /// Method to get QuizQuestions based on QuizPageQuestion
        /// </summary>
        /// <param name="currentQuizPageQuestion"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizQuestions</returns>
        public QuizQuestions GetMatchedQuizQuestionsFromQuizPage(QuizPageQuestion currentQuizPageQuestion, QuizQuestions quizQuestions)
        {
            var objResQuizQuestions = new QuizQuestions { ListOfQuizQuestions = new List<QuizQuestion>() };
            foreach (
                var objQuizQuestion in
                    currentQuizPageQuestion.QuestionIds.Select(
                        id => quizQuestions.ListOfQuizQuestions.FirstOrDefault(x => x.QuestionId == id)))
            {
                objResQuizQuestions.ListOfQuizQuestions.Add(objQuizQuestion);
            }
            return objResQuizQuestions;
        }


        /// <summary>
        /// Method to calculate RecommendedTime based on TimeAllotted for each QuizQuestion
        /// </summary>
        /// <param name="timeAllotted"></param>
        /// <returns>float</returns>
        public float CalculateRecommendedTimeForQuizQuestion(float timeAllotted)
        {
            if (timeAllotted > 0)
            {
                return timeAllotted / 60;
            }
            return 0;
        }


        /// <summary>
        /// Method to calculate TotalAllottedTime based on RecommendedTime of all questions
        /// </summary>
        /// <param name="quizQuestions"></param>
        /// <returns></returns>
        public float CalculateTotalAllottedTimeFromRecommendedTime(QuizQuestions quizQuestions)
        {
            const float totalAllottedTime = 0;
            return
                quizQuestions.ListOfQuizQuestions.Where(quizQuestion => quizQuestion != null)
                    .Aggregate(totalAllottedTime,
                        (current, quizQuestion) => current + quizQuestion.TimeToAnswer);
        }


        /// <summary>
        /// Method to get Next QuizPageQuestion details based on current QuizPageQuestion details
        /// </summary>
        /// <param name="currentQuizPageQuestion"></param>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        public QuizPageQuestion GetNextQuizPageDetails(QuizPageQuestion currentQuizPageQuestion, QuizPageQuestions quizPageQuestions)
        {
            return quizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionNumber == (currentQuizPageQuestion.QuestionNumber + 1));
        }


        /// <summary>
        /// Method to get Previous QuizPageQuestion details based on current QuizPageQuestion details
        /// </summary>
        /// <param name="currentQuizPageQuestion"></param>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        public QuizPageQuestion GetPreviousQuizPageDetails(QuizPageQuestion currentQuizPageQuestion, QuizPageQuestions quizPageQuestions)
        {
            return quizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionNumber == (currentQuizPageQuestion.QuestionNumber - 1));
        }


        /// <summary>
        /// Method to save answer of question and have DB transaction to QuizResult and MappingQuizResult
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="currentQuizResult"></param>
        /// <param name="setAnswer"></param>
        /// <param name="setScore"></param>
        /// <param name="setIsAnsweringDone"></param>
        /// <param name="setTime"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>bool</returns>
        public bool SaveAnswerOfQuestion(Quiz quiz, QuizResult currentQuizResult, bool setAnswer, bool setScore, bool setIsAnsweringDone, bool setTime,
            int userId, ref int quizResultSummaryId)
        {
            try
            {
                if (currentQuizResult == null && quiz != null && userId == 0) return false;

                var objQuizDefine =
                    _quizDefineContext.FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

                if (objQuizDefine != null)
                {
                    var objQuizResSummary =
                        _quizResultSummaryContext.Fetch(
                                x =>
                                    x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId &&
                                    x.EndDate == null).OrderByDescending(x => x.EndDate).FirstOrDefault();

                    //Get values from mapping table 
                    if (objQuizResSummary != null)
                    {
                        quizResultSummaryId = objQuizResSummary.QuizResultSummaryId;

                        var objMappingQuizDetailLst =
                            _mappingQuizResultContext.Fetch(x => x.QuizResultSummaryId == objQuizResSummary.QuizResultSummaryId)
                                .OrderByDescending(x => x.MappingQuizResultDetailId)
                                .ToList();

                        foreach (var mappingQuizResultDetail in objMappingQuizDetailLst)
                        {
                            //Getting CompileId from Mapping table
                            var objQuizCompilation =
                                 _quizCompilationContext.FirstOrDefault(
                                         x => x.QuizCompileId == mappingQuizResultDetail.QuizCompileId &&
                                              x.QuestionId == currentQuizResult.QuestionId);

                            if (objQuizCompilation != null && objQuizCompilation.QuizCompileId != 0)
                            {
                                var objQuizResult =
                                    _quizResultContext.FirstOrDefault(
                                            x =>
                                                x.QuizDefineId == objQuizDefine.QuizDefineId &&
                                                x.QuizCompileId == objQuizCompilation.QuizCompileId &&
                                                x.QuizResultId == mappingQuizResultDetail.QuizResultId);

                                #region "Load QuizResult & MappingQuizResultDetails in MySQL"

                                if (objQuizResult != null && objQuizResult.QuizResultId != 0 &&
                                    objQuizCompilation.QuizCompileId != 0 && currentQuizResult != null)
                                {
                                    #region "Update QuizResult"

                                    objQuizResult.QuizCompileId = objQuizCompilation.QuizCompileId;
                                    if (setAnswer)
                                    {
                                        objQuizResult.UserAnswer = currentQuizResult.UserAnswer;
                                    }


                                    if (setTime)
                                    {
                                        objQuizResult.TimeTaken = currentQuizResult.TimeTaken;
                                    }

                                    if (setIsAnsweringDone)
                                    {
                                        objQuizResult.IsAnsweringDone = currentQuizResult.IsAnsweringDone;
                                        objQuizResult.AnsweredInTime = currentQuizResult.AnsweredInTime;
                                    }
                                    if (setScore)
                                    {
                                        objQuizResult.Score = currentQuizResult.Score;
                                    }

                                    _quizResultContext.Update(objQuizResult);
                                    _quizResultContext.SaveChanges();

                                    #endregion
                                }
                                else
                                {
                                    if (currentQuizResult != null)
                                    {
                                        #region "Insert QuizResult"

                                        var objQuizRes = new QuizResult
                                        {
                                            QuestionId = currentQuizResult.QuestionId,
                                            QuizDefineId = objQuizDefine.QuizDefineId,
                                            // AnsweredInTime = currentQuizResult.AnsweredInTime,
                                            UserId = currentQuizResult.UserId,
                                            //   TimeTaken = currentQuizResult.TimeTaken,
                                            QuizCompileId = objQuizCompilation.QuizCompileId

                                        };

                                        if (setTime)
                                        {
                                            objQuizRes.TimeTaken = currentQuizResult.TimeTaken;
                                        }
                                        if (setIsAnsweringDone)
                                        {
                                            objQuizRes.IsAnsweringDone = currentQuizResult.IsAnsweringDone;
                                            objQuizRes.AnsweredInTime = currentQuizResult.AnsweredInTime;
                                        }
                                        if (setAnswer)
                                        {
                                            objQuizRes.UserAnswer = !string.IsNullOrEmpty(currentQuizResult.UserAnswer) ? currentQuizResult.UserAnswer : string.Empty;
                                        }
                                        if (setScore)
                                        {
                                            objQuizRes.Score = currentQuizResult.Score;

                                        }
                                        _quizResultContext.Add(objQuizRes);
                                        _quizResultContext.SaveChanges();

                                        #endregion

                                        #region "Update QuizResultId in MappingQuizResultDetails table"

                                        if (objQuizResSummary.QuizResultSummaryId != 0)
                                        {
                                            var objQuizResultInsertedFetch =
                                                _quizResultContext.Fetch(
                                                        x =>
                                                            x.QuizDefineId == objQuizDefine.QuizDefineId &&
                                                            x.QuizCompileId == objQuizCompilation.QuizCompileId)
                                                    .OrderByDescending(x => x.QuizResultId)
                                                    .FirstOrDefault();

                                            if (objQuizResultInsertedFetch != null)
                                            {
                                                mappingQuizResultDetail.QuizResultId =
                                                    objQuizResultInsertedFetch.QuizResultId;

                                                _mappingQuizResultContext.Update(mappingQuizResultDetail);
                                                _mappingQuizResultContext.SaveChanges();
                                            }
                                        }

                                        #endregion
                                    }
                                }

                                #endregion

                                break;
                            }

                        }

                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : SaveAnswerOfQuestion");
                throw;
            }

        }


        /// <summary>
        /// Method to get QuizResult based on QuizQuestion 
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="currentQuizQuestion"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>QuizResult</returns>
        public QuizResult GetQuizResultBasedOnQuizQuestion(Quiz quiz, QuizQuestion currentQuizQuestion, int userId, [Optional]int quizResultSummaryId)
        {
            QuizResult objQuizResult = null;

            var objQuizDefine =
                _quizDefineContext.FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDefine != null)
            {
                QuizResultSummary objQuizResSummary;
                if (quizResultSummaryId != 0)
                {
                    objQuizResSummary =
                        _quizResultSummaryContext.Fetch(
                                x =>
                                    x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId &&
                                    x.QuizResultSummaryId == quizResultSummaryId)
                            .OrderByDescending(x => x.EndDate)
                            .FirstOrDefault();
                }
                else
                {
                    objQuizResSummary =
                        _quizResultSummaryContext.Fetch(
                                x =>
                                    x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId &&
                                    x.EndDate == null)
                            .OrderByDescending(x => x.QuizResultSummaryId)
                            .FirstOrDefault();
                }
                if (objQuizResSummary != null)
                {
                    //Getting value from Mapping table for Result of current Quiz
                    var objMappingQuizResult =
                        _mappingQuizResultContext.Fetch(x => x.QuizResultSummaryId == objQuizResSummary.QuizResultSummaryId)
                            .OrderByDescending(x => x.MappingQuizResultDetailId)
                            .ToList();


                    foreach (var mappingQuizResultDetail in objMappingQuizResult)
                    {
                        var objQuizCompile =
                            _quizCompilationContext.FirstOrDefault(
                                    x => x.QuizCompileId == mappingQuizResultDetail.QuizCompileId &&
                                            x.QuestionId == currentQuizQuestion.QuestionId);
                        if (objQuizCompile == null) continue;

                        objQuizResult =
                            _quizResultContext.FirstOrDefault(
                                    x =>
                                        (x.QuizDefineId == objQuizDefine.QuizDefineId &&
                                            x.QuizCompileId == objQuizCompile.QuizCompileId &&
                                            x.QuizResultId == mappingQuizResultDetail.QuizResultId));

                    }


                }
            }
            return objQuizResult;

        }

        //
        /// <summary>
        /// Method to calculate time spend for multiple short answers
        /// </summary>
        /// <param name="marksOfQuestion"></param>
        /// <param name="totalMarksOfQuestion"></param>
        /// <param name="totalTimeTakenForAllQueOfPage"></param>
        /// <returns>double</returns>
        public double CalculateTimeSpendForMultiShortQuestion(float marksOfQuestion, float totalMarksOfQuestion, float totalTimeTakenForAllQueOfPage)
        {
            return (marksOfQuestion / totalMarksOfQuestion) * totalTimeTakenForAllQueOfPage;
        }


        /// <summary>
        /// Method to set and get Time Remaining
        /// </summary>
        /// <param name="timeRemaining"></param>
        /// <param name="setValue"></param>
        /// <param name="cacheKey"></param>
        /// <returns>int</returns>
        //public int SetAndGetRemainingtime(int timeRemaining, bool setValue, string cacheKey)
        //{
        //    try
        //    {
        //        if (!string.IsNullOrEmpty(cacheKey))
        //        {
        //            var remainingTime = _cacheMemoryRepository.SetAndGetRemainingtime(timeRemaining, setValue, cacheKey);
        //            return remainingTime;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : SetAndGetRemainingtime");
        //        throw;
        //    }
        //    return 0;
        //}

        //
        /// <summary>
        /// Method to set first Question no. to hide the previous button.
        /// </summary>
        /// <param name="questionNo"></param>
        /// <param name="setValue"></param>
        /// <param name="cacheKey"></param>
        /// <returns>int</returns>
        //public int SetValueOfFirstQuestionToHidePreviousButton(int questionNo, bool setValue, string cacheKey)
        //{
        //    try
        //    {
        //        if (!string.IsNullOrEmpty(cacheKey))
        //        {
        //            var preQuestionNo = _cacheMemoryRepository.SetValueOfFirstQuestionToHidePreviousButton(questionNo, setValue, cacheKey);
        //            return preQuestionNo;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizRepository : SetValueOfFirstQuestionToHidePreviousButton");
        //        throw;
        //    }
        //    return 0;
        //}

        #endregion

        #region "ResultsPage "


        /// <summary>
        /// Method to get Relative Rank (i.e Rank given to the user that works on ranking them relative to other users who have completed the quiz)
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="iScoreSystem"></param>
        /// <param name="score"></param>
        /// <param name="strFieldName"></param>
        /// <returns>double</returns>
        public double GetRelativeRank(Quiz quiz, int iScoreSystem, int score, string strFieldName)
        {
            try
            {
                var objTotalScoreList = new List<int>();
                var atEntries = 0.0;
                var maxEntries = 0.0;

                if (quiz != null && quiz.Id != 0 && iScoreSystem != 0 && !string.IsNullOrEmpty(strFieldName))
                {
                    var objQuizDef =
                        _quizDefineContext.GetAll()
                            .FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

                    var reverseOrder = strFieldName.ToLower() == "totaltimetaken" ? true : false;

                    if (objQuizDef != null)
                    {
                        switch (iScoreSystem)
                        {
                            //Score System - 1 = Score based on the first attempt.
                            case 1:
                                objTotalScoreList =
                                    _quizResultSummaryContext.GetAll()
                                        .Where(
                                            x =>
                                                x.QuizDefineId == objQuizDef.QuizDefineId && x.EndDate != null &&
                                                x.AttemptNumber == 1)
                                        .OrderBy(x => x.TotalScore)
                                        .Select(x => x.TotalScore)
                                        .ToList();
                                break;

                            //Score System - 2 = Score based on the best attempt.
                            case 2:
                                objTotalScoreList =
                                    _quizResultSummaryContext.GetAll()
                                        .Where(
                                            x =>
                                                x.QuizDefineId == objQuizDef.QuizDefineId && x.EndDate != null &&
                                                x.IsBestScore)
                                        .OrderBy(x => x.TotalScore)
                                        .Select(x => x.TotalScore)
                                        .ToList();
                                break;

                            //Score System - 3 = Score based on current attempt.
                            case 3:
                                {
                                    //Getting first record for each user with EndDate as Max value (i.e current attempt of all user)
                                    var objQuizResultSummary =
                                        _quizResultSummaryContext.GetAll()
                                            .Where(x => x.QuizDefineId == objQuizDef.QuizDefineId)
                                            .AsEnumerable()
                                            .GroupBy(x => x.UserId)
                                            .Select(x => x.OrderByDescending(y => y.EndDate).FirstOrDefault())
                                            .Select(e => e)
                                            .ToList();

                                    objTotalScoreList = objQuizResultSummary.Select(x => x.TotalScore).ToList();
                                }
                                break;
                        }

                        if (objTotalScoreList.Any())
                        {
                            foreach (var totalScore in objTotalScoreList)
                            {
                                if ((reverseOrder == false && totalScore <= score) ||
                                    (reverseOrder && totalScore < score))
                                {
                                    atEntries += 1;
                                }
                                maxEntries += 1;
                            }
                        }

                        if (maxEntries > 0)
                        {

                            var getRelativeRank = atEntries / maxEntries;
                            if (reverseOrder)
                            {
                                getRelativeRank = 1.0F - getRelativeRank;
                            }
                            return Math.Round(getRelativeRank *= 100.0F);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : GetRelativeRank");
                throw;
            }
            return 0;
        }


        /// <summary>
        /// Method to get State Average Score and TimeTaken 
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="iScoreSystem"></param>
        /// <param name="totalMaxScoreOfQuiz"></param>
        /// <param name="medianTimeTaken"></param>
        /// <param name="medianScore"></param>
        /// <param name="currentScore"></param>
        /// <param name="currentTimeTaken"></param>
        /// <returns>int</returns>
        public int GetStateAverages(Quiz quiz, int iScoreSystem, int totalMaxScoreOfQuiz, ref int medianTimeTaken, int medianScore, int currentScore = 0, int currentTimeTaken = 0)
        {
            try
            {
                if (quiz.Id != 0 && iScoreSystem != 0)
                {
                    var objQuizDef =
                        _quizDefineContext.GetAll()
                            .FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);
                    if (objQuizDef != null)
                    {
                        object[] param = { objQuizDef.QuizDefineId, objQuizDef.QuizDefineId };
                        if (iScoreSystem == 1)
                        {
                            //Execute query to get State Average Median Score
                            var objMedScore =
                                _executeMySqlQueries.ExecuteSqlQueryWithParamters<float>(
                                    MySqlQueries.GetStateAveragesForFirstAttemptMedScore, param);
                            medianScore = Convert.ToInt32(objMedScore * totalMaxScoreOfQuiz);

                            //Execute query to get State Average Median Time Take
                            var objMedTimeTaken =
                                _executeMySqlQueries.ExecuteSqlQueryWithParamters<int>(
                                    MySqlQueries.GetStateAveragesForFirstAttemptMedTimeTaken, param);
                            medianTimeTaken = Convert.ToInt32(objMedTimeTaken);

                        }
                        else if (iScoreSystem == 2)
                        {
                            //Execute query to get State Average Median Score
                            var objMedScore =
                                _executeMySqlQueries.ExecuteSqlQueryWithParamters<float>(
                                    MySqlQueries.GetStateAveragesForBestAttemptMedScore, param);
                            medianScore = Convert.ToInt32(objMedScore * totalMaxScoreOfQuiz);

                            //Execute query to get State Average Median Time Take
                            var objMedTimeTaken =
                                _executeMySqlQueries.ExecuteSqlQueryWithParamters<int>(
                                    MySqlQueries.GetStateAveragesForBestAttemptMedTimeTaken, param);
                            medianTimeTaken = Convert.ToInt32(objMedTimeTaken);

                        }
                        else if (iScoreSystem == 3)
                        {
                            //Execute query to get State Average Median Score
                            medianScore = currentScore;

                            //Execute query to get State Average Median Time Take
                            //var objMedTimeTaken =
                            //    _executeMySqlQueries.ExecuteSqlQueryWithParamters<int>(
                            //        MySqlQueries.GetStateAveragesForCurrentAttemptMedTimeTaken, param);
                            //medianTimeTaken = Convert.ToInt32(objMedTimeTaken);
                            medianTimeTaken = currentTimeTaken;

                        }

                        return medianScore;
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : GetStateAverages");
                throw;
            }
            return 0;
        }


        /// <summary>
        /// Method to get List of Results Page details i.e Question no.,UserScore/MaxScore for question and average of Questions answered correctly.
        /// </summary>
        /// <param name="quizQuestions"></param>
        /// <param name="quiz"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>ResultsPageDetailList</returns>
        public ResultsPageDetailList GetResultsPageDetailListForQuiz(QuizQuestions quizQuestions, Quiz quiz, int quizResultSummaryId)
        {
            try
            {
                var objResultsPageList = new ResultsPageDetailList
                {
                    ListOfResultsPageDetail = new List<ResultsPageDetail>()
                };

                if (quiz.Id != 0 && quizQuestions != null && quizQuestions.ListOfQuizQuestions.Any() &&
                    quizResultSummaryId != 0)
                {
                    var objQuizDef =
                        _quizDefineContext.GetAll()
                            .FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

                    if (objQuizDef != null)
                    {
                        foreach (var quizQuestion in quizQuestions.ListOfQuizQuestions)
                        {
                            //Getting the value from MappingQuizResult table

                            var objMappingQuizResult =
                                _mappingQuizResultContext.GetAll()
                                    .Where(x => x.QuizResultSummaryId == quizResultSummaryId)
                                    .ToList();

                            foreach (var mappingQuizResultDetail in objMappingQuizResult)
                            {
                                if (mappingQuizResultDetail == null || quizQuestion == null) continue;

                                var objQuizCompile =
                                    _quizCompilationContext.GetAll()
                                        .FirstOrDefault(y => y.QuizDefineId == objQuizDef.QuizDefineId &&
                                                             y.QuizCompileId ==
                                                             mappingQuizResultDetail.QuizCompileId &&
                                                             y.QuestionId == quizQuestion.QuestionId);

                                if (objQuizCompile == null) continue;

                                var objQuizResult =
                                    _quizResultContext.GetAll()
                                        .FirstOrDefault(z => z.QuizDefineId == objQuizDef.QuizDefineId &&
                                                             z.QuizCompileId == objQuizCompile.QuizCompileId &&
                                                             z.QuizResultId == mappingQuizResultDetail.QuizResultId);


                                //Assign values for Result Page detail

                                var objResultsPageDetail = new ResultsPageDetail
                                {
                                    QuestionNumber = objQuizCompile.QuestionNumber,
                                    QuestionType = quizQuestion.QuestionType,
                                    QuestionId = quizQuestion.QuestionId,
                                };

                                if (objQuizResult != null)
                                {
                                    objResultsPageDetail.IsQuizResultExists = true;
                                    objResultsPageDetail.IsQuestionAnsInTime =
                                        Convert.ToBoolean(objQuizResult.AnsweredInTime);

                                    #region "Calculate Score based on Question Type & showing icon on UI"

                                    switch (quizQuestion.QuestionType)
                                    {
                                        // For MCQ
                                        case 1:
                                            objResultsPageDetail.UserScoreOutOfMaxScore =
                                                Convert.ToString(objQuizResult.Score);
                                            break;
                                        //For short answer questions.
                                        case 2:
                                            if (objResultsPageDetail.IsQuizResultExists &&
                                                objResultsPageDetail.IsQuestionAnsInTime)
                                            {
                                                if (objQuizResult.Score == null)
                                                {
                                                    objQuizResult.Score = 0;
                                                }

                                                objResultsPageDetail.UserScoreOutOfMaxScore = objQuizResult.Score +
                                                                                              "/" +
                                                                                              quizQuestion.NumberOfMarks;
                                                objResultsPageDetail.UserScoreObtained = (int)objQuizResult.Score;

                                            }
                                            else
                                            {
                                                objResultsPageDetail.UserScoreOutOfMaxScore = objQuizResult.Score +
                                                                                      "/" +
                                                                                      quizQuestion.NumberOfMarks;

                                                if (objQuizResult.Score != null)
                                                    objResultsPageDetail.UserScoreObtained = (int)objQuizResult.Score;
                                            }
                                            objResultsPageDetail.TotalMarksOfQuestion = quizQuestion.NumberOfMarks;
                                            break;
                                    }
                                    objResultsPageDetail.Score = objQuizResult.Score;
                                    objResultsPageDetail.NumberOfMarks = quizQuestion.NumberOfMarks;

                                    #endregion
                                }
                                else
                                {
                                    objResultsPageDetail.IsQuizResultExists = false;
                                }

                                #region If list contains multiple "Question Number" then it should add result of its sub-questions else should calculate individually

                                if (objResultsPageList.ListOfResultsPageDetail.Count > 0 &&
                                    objResultsPageList.ListOfResultsPageDetail.Any(
                                        x => x.QuestionNumber == objResultsPageDetail.QuestionNumber))
                                {
                                    var index =
                                        objResultsPageList.ListOfResultsPageDetail.FindIndex(
                                            x => x.QuestionNumber == objResultsPageDetail.QuestionNumber);

                                    //Add Average scores
                                    objResultsPageList.ListOfResultsPageDetail[index].QuestionAnsweredCorrectly = Convert
                                        .ToString(
                                            Convert.ToDouble(
                                                objResultsPageList.ListOfResultsPageDetail[index]
                                                    .QuestionAnsweredCorrectly) +
                                            GetQuestionAnsweredCorrectly(quiz,
                                                quizQuestion, quiz.ScoreSystem));

                                    objResultsPageList.ListOfResultsPageDetail[index].NumberOfMarks =
                                        objResultsPageList.ListOfResultsPageDetail[index].NumberOfMarks +
                                        objResultsPageDetail.NumberOfMarks;

                                    //Add scores 
                                    if (objQuizResult != null)
                                    {
                                        objResultsPageList.ListOfResultsPageDetail[index].UserScoreObtained = (int)(objResultsPageList.ListOfResultsPageDetail[index].UserScoreObtained + objResultsPageDetail.Score);
                                        objResultsPageList.ListOfResultsPageDetail[index].TotalMarksOfQuestion = objResultsPageList.ListOfResultsPageDetail[index].TotalMarksOfQuestion + objResultsPageDetail.NumberOfMarks;

                                        objResultsPageList.ListOfResultsPageDetail[index].UserScoreOutOfMaxScore =
                                              objResultsPageList.ListOfResultsPageDetail[index].UserScoreObtained + "/" + objResultsPageList.ListOfResultsPageDetail[index].TotalMarksOfQuestion;

                                    }

                                }
                                else
                                {
                                    objResultsPageDetail.QuestionAnsweredCorrectly = Convert.ToString(
                                        GetQuestionAnsweredCorrectly(quiz,
                                            quizQuestion, quiz.ScoreSystem));
                                }

                                #endregion

                                if (
                                    objResultsPageList.ListOfResultsPageDetail.All(
                                        x => x.QuestionNumber != objResultsPageDetail.QuestionNumber))
                                    objResultsPageList.ListOfResultsPageDetail.Add(objResultsPageDetail);
                            }

                        }
                    }

                    //Assign mesage based on Question Type 
                    foreach (var objResultPage in objResultsPageList.ListOfResultsPageDetail)
                    {
                        var strQuestionAnsCorrect = string.Empty;
                        if (objResultPage != null)
                        {
                            switch (objResultPage.QuestionType)
                            {
                                case 1:
                                    strQuestionAnsCorrect = objResultPage.QuestionAnsweredCorrectly +
                                                            " % Answered Correctly";
                                    break;
                                case 2:
                                    strQuestionAnsCorrect = objResultPage.QuestionAnsweredCorrectly + "/" +
                                                            objResultPage.NumberOfMarks + " Average Score";
                                    break;
                            }

                            objResultPage.QuestionAnsweredCorrectly = strQuestionAnsCorrect;
                        }
                    }

                    return objResultsPageList;
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : GetResultsPageDetailListForQuiz");
                throw;
            }
            return null;
        }

        /// <summary>
        /// Method to calculate average score for to show on Result Page based on ScoreSystem
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestion"></param>
        /// <param name="iScoreSystem"></param>
        /// <returns>double</returns>
        public double GetQuestionAnsweredCorrectly(Quiz quiz, QuizQuestion quizQuestion, int iScoreSystem)
        {
            try
            {
                double answeredCorrectlyScore = 0;
                float objAverageScore = 0;
                if (quiz != null && quiz.Id != 0 && !string.IsNullOrEmpty(quiz.HiddenCodeForQuiz) && quizQuestion != null && iScoreSystem != 0)
                {
                    var objQuizDef =
                        _quizDefineContext.GetAll().FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

                    if (objQuizDef != null)
                    {
                        object[] param = { objQuizDef.Id, quizQuestion.QuestionId };
                        switch (iScoreSystem)
                        {
                            //Execute query to get Average score for ScoreSystem = 1 i.e First attempt
                            case 1:
                                objAverageScore =
                                    _executeMySqlQueries.ExecuteSqlQueryWithParamters<float>(
                                        MySqlQueries.GetAverageScoreBasedOnFirstAttempt, param);

                                break;

                            //Execute query to get Average score for ScoreSystem = 2 i.e Best attempt
                            case 2:
                                objAverageScore =
                                    _executeMySqlQueries.ExecuteSqlQueryWithParamters<float>(
                                        MySqlQueries.GetAverageScoreBasedOnBestScore, param);

                                break;

                            //Execute query to get Average score for ScoreSystem = 3 i.e Current attempt
                            case 3:
                                objAverageScore =
                                    _executeMySqlQueries.ExecuteSqlQueryWithParamters<float>(
                                        MySqlQueries.GetAverageScoreBasedOnCurrentScore, param);

                                break;
                        }

                        //Calculate values based on Question Type
                        switch (quizQuestion.QuestionType)
                        {
                            case 1:
                                answeredCorrectlyScore = Math.Round((100 * objAverageScore / quizQuestion.NumberOfMarks), 2);
                                break;
                            case 2:
                                answeredCorrectlyScore = Math.Round((objAverageScore / quizQuestion.NumberOfMarks), 2);
                                break;

                        }

                        return answeredCorrectlyScore;

                    }
                }


            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : GetQuestionAnsweredCorrectly");
                throw;
            }
            return 0;
        }


        /// <summary>
        /// Method to get total MaxScore of a Quiz after Quiz completion
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>int</returns>
        public int GetTotalMaxScoreAfterQuizCompletion(string hiddenCode, QuizQuestions quizQuestions)
        {
            try
            {
                var iTotalMaxScore = 0;
                if (!string.IsNullOrEmpty(hiddenCode) && quizQuestions != null && quizQuestions.ListOfQuizQuestions.Any())
                {
                    iTotalMaxScore = quizQuestions.ListOfQuizQuestions.Aggregate(iTotalMaxScore,
                        (current, quizQuestion) => current + quizQuestion.NumberOfMarks);
                    return iTotalMaxScore;
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "QuizRepository : GetTotalMaxScoreAfterQuizCompletion");
                throw;
            }
            return 0;
        }


        /// <summary>
        /// Method to get total UserScore for all Quiz Questions after completion of Quiz
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>int</returns>
        public int GetUserScoresAfterQuizCompletion(string hiddenCode, Quiz quiz, QuizQuestions quizQuestions, int userId, int quizResultSummaryId)
        {
            try
            {
                var totalUserScore = 0;
                if (!string.IsNullOrEmpty(hiddenCode) && quiz != null && quizQuestions != null && quizQuestions.ListOfQuizQuestions.Any() && userId != 0)
                {
                    var objQuizDef =
                        _quizDefineContext.Fetch()
                            .FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);
                    if (objQuizDef != null)
                    {
                        //Get record of QuizResultSummary of current Quiz
                        var objQuizResSum =
                            _quizResultSummaryContext.Fetch()
                                .Where(
                                    x =>
                                        x.QuizDefineId == objQuizDef.QuizDefineId && x.UserId == userId &&
                                        x.QuizResultSummaryId == quizResultSummaryId)
                                .OrderByDescending(x => x.QuizResultSummaryId).FirstOrDefault();

                        //Get records from MappingQuizResultDetail table to get corresponding QuizResult records and get total score

                        if (objQuizResSum == null) return totalUserScore;

                        var objMappingQuizResultDetailLst =
                            _mappingQuizResultContext.GetAll()
                                .Where(x => x.QuizResultSummaryId == objQuizResSum.QuizResultSummaryId)
                                .ToList();
                        if (objMappingQuizResultDetailLst.Any())
                        {
                            foreach (MappingQuizResultDetails mappingQuizResultDetail in objMappingQuizResultDetailLst)
                            {
                                if (mappingQuizResultDetail != null)
                                {
                                    QuizResult objQuizResult = _quizResultContext.GetAll().Where(x => x.QuizResultId == mappingQuizResultDetail.QuizResultId).OrderByDescending(x => x.QuizResultId).FirstOrDefault();

                                    if (objQuizResult != null)
                                    {
                                        if (objQuizResult.Score != null)
                                        {
                                            totalUserScore = (int)(totalUserScore + objQuizResult.Score);
                                        }
                                    }

                                }
                            }
                        }

                        return totalUserScore;
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : GetUserScoresAfterQuizCompletion");
                throw;
            }
            return 0;
        }


        /// <summary>
        /// Method to get total time taken by user for all Quiz Questions after completion of Quiz
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>int</returns>
        public async Task<int> GetUserTimeTakenAfterQuizCompletion(Quiz quiz, QuizQuestions quizQuestions, int userId, int quizResultSummaryId)
        {

            var totalTime = 0;


            var objQuizDef =
                await _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDef != null)
            {
                //Get record of QuizResultSummary of current Quiz
                var objQuizResSum = await
                    _quizResultSummaryContext.Fetch(
                            x =>
                                x.QuizDefineId == objQuizDef.QuizDefineId && x.UserId == userId &&
                                   x.QuizResultSummaryId == quizResultSummaryId)
                        .OrderByDescending(x => x.QuizResultSummaryId).FirstOrDefaultAsync();

                if (objQuizResSum == null) return totalTime;

                //Get records from MappingQuizResultDetail table to get corresponding QuizResult records and get total time
                var objMappingQuizResultDetailLst =
                    _mappingQuizResultContext.Fetch(x => x.QuizResultSummaryId == objQuizResSum.QuizResultSummaryId)
                        .ToList();

                var totalTimeTaken = 0.0;
                foreach (MappingQuizResultDetails mappingQuizResultDetail in objMappingQuizResultDetailLst)
                {
                    if (mappingQuizResultDetail != null)
                    {
                        QuizResult objQuizResult = await _quizResultContext.Fetch(x => x.QuizResultId == mappingQuizResultDetail.QuizResultId).OrderByDescending(x => x.QuizResultId).FirstOrDefaultAsync();
                        if (objQuizResult != null) totalTimeTaken = totalTimeTaken + objQuizResult.TimeTaken;
                    }
                }

                totalTime = Convert.ToInt32(totalTimeTaken);
            }
            return totalTime;
        }


        /// <summary>
        /// Method to complete Quiz and to do DB transaction of QuizResultSummary to update EndDate
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="totalUserScore"></param>
        /// <param name="totalMaxScoreForQuiz"></param>
        /// <param name="totalTimeTakenByUser"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>bool</returns>
        public bool UpdateQuizResultSummaryOnQuizCompletion(Quiz quiz, int totalUserScore, int totalMaxScoreForQuiz, int totalTimeTakenByUser, int userId, int quizResultSummaryId)
        {
            try
            {
                if (quiz != null && quiz.Id != 0 && userId != 0)
                {
                    var objQuizDef =
                        _quizDefineContext.GetAll()
                            .FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);
                    if (objQuizDef != null)
                    {
                        //Update QuizResultSummary to relfect completion of Quiz
                        var objQuizResultSummary =
                            _quizResultSummaryContext.GetAll()
                                .LastOrDefault(y => y.QuizDefineId == objQuizDef.QuizDefineId && y.UserId == userId);

                        if (objQuizResultSummary != null)
                        {
                            object[] param = { objQuizDef.QuizDefineId, userId };

                            //Get the highest score based on FormId and UserId
                            var objHighScoreQuizResSum =
                                _executeMySqlQueries.ExecuteSqlQueryWithParamters<int>(
                                    MySqlQueries.GetQuizResultSummaryHighScore, param);

                            var objUpdateQuizResSum =
                                _quizResultSummaryContext.Fetch()
                                    .Where(
                                        x =>
                                            x.QuizDefineId == objQuizDef.QuizDefineId && x.UserId == userId &&
                                            x.EndDate != null && x.IsBestScore)
                                    .OrderByDescending(x => x.EndDate)
                                    .FirstOrDefault();

                            //Check which one is greater,Highest score or total user score and update IsBestScore value from it
                            if (totalUserScore >= objHighScoreQuizResSum)
                            {
                                //Update with the IsBestScore value
                                if (objUpdateQuizResSum != null)
                                {
                                    objUpdateQuizResSum.IsBestScore = false;
                                    _quizResultSummaryContext.Update(objUpdateQuizResSum);
                                    _quizResultSummaryContext.SaveChanges();
                                }
                            }

                            //Finish the summary record and write out results
                            var objQuizResSum =
                                _quizResultSummaryContext.Fetch()
                                    .Where(
                                        x =>
                                            x.QuizDefineId == objQuizDef.QuizDefineId && x.UserId == userId &&
                                            x.EndDate == null && x.QuizResultSummaryId == quizResultSummaryId)
                                    .OrderByDescending(x => x.QuizResultSummaryId).FirstOrDefault();

                            if (objQuizResSum != null)
                            {
                                objQuizResSum.TotalScore = totalUserScore;
                                objQuizResSum.TotalTimeTaken = totalTimeTakenByUser;
                                objQuizResSum.MaxScore = totalMaxScoreForQuiz;
                                objQuizResSum.EndDate = DateTime.Now;

                                objQuizResSum.IsBestScore = totalUserScore >= objHighScoreQuizResSum;

                                _quizResultSummaryContext.Update(objQuizResSum);
                                _quizResultSummaryContext.SaveChanges();
                            }


                            return true;
                        }

                    }
                    return false;
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : UpdateQuizResultSummaryOnQuizCompletion");
                throw;
            }
            return false;
        }


        /// <summary>
        /// Method to check if QuizQuestions has been answered and have a DB transaction of update to QuizResultSummary table
        /// </summary>
        /// <param name="quizQuestions"></param>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        /// <param name="totalTimeTaken"></param>
        /// <returns>string</returns>
        public string CheckQuestionBeenAnsweredAndUpdateQuizResSum(QuizQuestions quizQuestions, Quiz quiz, int userId, ref int totalTimeTaken)
        {
            try
            {
                var attemptsCompleted = 0;
                var objQuizResSum = new QuizResultSummary();
                if (quiz != null && quiz.Id != 0 && quizQuestions != null && quizQuestions.ListOfQuizQuestions.Any() && quiz != null && userId != 0)
                {
                    var objQuizDefine =
                        _quizDefineContext.GetAll()
                            .FirstOrDefault(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);
                    if (objQuizDefine != null)
                    {
                        //Check if all questions has been answered
                        if (
                            quizQuestions.ListOfQuizQuestions.Select(
                                quizQuestion => HasQuestionBeenAnswered(quizQuestion, objQuizDefine.QuizDefineId))
                                .Any(isQueAnswered => isQueAnswered == false))
                        {
                            var objQuizResultSummary =
                                _quizResultSummaryContext.GetAll()
                                    .Where(y => y.QuizDefineId == objQuizDefine.QuizDefineId)
                                    .OrderByDescending(y => y.QuizResultSummaryId)
                                    .FirstOrDefault();
                        }

                        if (attemptsCompleted > 1)
                        {
                            switch (quiz.ScoreSystem)
                            {
                                case 1:
                                    objQuizResSum =
                                        _quizResultSummaryContext.GetAll()
                                            .Where(
                                                x =>
                                                    x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId &&
                                                    x.EndDate != null)
                                            .OrderBy(x => x.EndDate)
                                            .FirstOrDefault();
                                    break;
                                case 2:
                                    objQuizResSum =
                                        _quizResultSummaryContext.GetAll()
                                            .Where(
                                                x =>
                                                    x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId &&
                                                    x.EndDate != null)
                                            .OrderByDescending(x => x.TotalScore)
                                            .ThenBy(x => x.TotalTimeTaken)
                                            .FirstOrDefault();
                                    break;
                            }

                            if (objQuizResSum != null)
                            {
                                var strScore = Convert.ToString(objQuizResSum.TotalScore) + "out of " + objQuizResSum.MaxScore +
                                          " " +
                                          Convert.ToString(100 * objQuizResSum.TotalScore / objQuizResSum.MaxScore) + "%";

                                totalTimeTaken = Convert.ToInt32(objQuizResSum.TotalTimeTaken);

                                return strScore;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "QuizRepository : CheckQuestionBeenAnsweredAndUpdateQuizResSum");
                throw;
            }
            return string.Empty;
        }


        /// <summary>
        /// Method to check if Quiz Question has been answered by checking it in QuizResult table
        /// </summary>
        /// <param name="quizQuestion"></param>
        /// <param name="iQuizDefineId"></param>
        /// <returns>bool</returns>
        public bool HasQuestionBeenAnswered(QuizQuestion quizQuestion, int iQuizDefineId)
        {
            try
            {
                var hasBeenAnswered = false;
                if (quizQuestion != null && iQuizDefineId != 0)
                {
                    var objQuizCompile =
                        _quizCompilationContext.GetAll()
                            .FirstOrDefault(
                                x => x.QuizDefineId == iQuizDefineId && x.QuestionId == quizQuestion.QuestionId);

                    if (objQuizCompile == null) return false;

                    var objQuizResult =
                        _quizResultContext.GetAll().FirstOrDefault(x => x.QuizDefineId == iQuizDefineId &&
                                                                       x.QuizCompileId ==
                                                                       objQuizCompile.QuizCompileId);
                    if (objQuizResult == null) return false;

                    switch (quizQuestion.QuestionType)
                    {
                        case 1:
                            if (objQuizResult.UserAnswer.Length == quizQuestion.NoOfAnswersRequired)
                            {
                                hasBeenAnswered = true;
                            }
                            break;
                        case 2:
                            if (objQuizResult.UserAnswer.Length > 0)
                            {
                                hasBeenAnswered = true;
                            }
                            break;
                    }

                    return hasBeenAnswered;
                }

            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : HasQuestionBeenAnswered");
                throw;
            }
            return false;
        }


        /// <summary>
        /// Check if last Question is answered in time or not
        /// </summary>
        /// <param name="iFormId"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>bool</returns>
        public bool CheckIfQuizResultAnsweredInTime(int iFormId, int userId, int quizResultSummaryId)
        {
            try
            {
                if (iFormId != 0 && quizResultSummaryId != 0)
                {
                    var objQuizDef =
                        _quizDefineContext.GetAll()
                            .FirstOrDefault(x => x.Id == iFormId && x.ExpiresDateTime >= DateTime.Now);
                    if (objQuizDef != null)
                    {
                        //Get record of QuizResultSummary of current Quiz
                        var objQuizResSum =
                            _quizResultSummaryContext.GetAll()
                                .Where(
                                    x =>
                                        x.QuizDefineId == objQuizDef.QuizDefineId && x.UserId == userId &&
                                        x.QuizResultSummaryId == quizResultSummaryId)
                                .OrderByDescending(x => x.QuizResultSummaryId).FirstOrDefault();

                        //Get records from MappingQuizResultDetail table to get corresponding QuizResult records 
                        if (objQuizResSum != null)
                        {
                            var objMappingQuizResultDetail =
                                _mappingQuizResultContext.GetAll()
                                    .Where(x => x.QuizResultSummaryId == objQuizResSum.QuizResultSummaryId && x.QuizResultId != 0).OrderByDescending(x => x.MappingQuizResultDetailId)
                                    .FirstOrDefault();
                            if (objMappingQuizResultDetail != null)
                            {
                                var objAnsInTimeQuizRes =
                                    _quizResultContext.GetAll()
                                        .FirstOrDefault(x => x.QuizResultId == objMappingQuizResultDetail.QuizResultId);
                                if (objAnsInTimeQuizRes != null)
                                {
                                    return objAnsInTimeQuizRes.AnsweredInTime;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : CheckIfQuizResultAnsweredInTime");
                throw;
            }
            return false;
        }

        /// <summary>
        /// Get attempt number of the quiz.
        /// </summary>
        /// <param name="quizResultSummaryId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public int GetUserQuizAttemptNo(int quizResultSummaryId, int userId)
        {
            try
            {
                var objQuizResultSummary =
                    _quizResultSummaryContext.GetAll()
                        .FirstOrDefault(
                            x => x.QuizResultSummaryId == quizResultSummaryId && x.UserId == userId && x.EndDate != null);

                if (objQuizResultSummary != null)
                {
                    return objQuizResultSummary.AttemptNumber;
                }

            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizRepository : GetUserQuizAttemptNo");
                throw;
            }
            return 0;

        }


        #endregion

        #region "AnswerDrillPage "


        /// <summary>
        /// Method to get QuizQuestion details based on QuestionId passed 
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="questionId"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizQuestion</returns>
        public async Task<QuizQuestion> GetQuestionDetailsForQuizQuestionId(Quiz quiz, int questionId, QuizQuestions quizQuestions)
        {
            QuizQuestion objQuizQuestion = null;
            var objQuizDef = await
                _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDef != null)
            {
                objQuizQuestion =
                   quizQuestions.ListOfQuizQuestions.FirstOrDefault(x => x.QuestionId == questionId);

            }
            return objQuizQuestion;

        }

        /// <summary>
        /// Method to get current number based on Question id
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="questionId"></param>
        /// <returns>int</returns>
        public int GetCurrentQuestionNumber(QuizPageQuestions quizPageQuestions, int questionId)
        {
            foreach (var quizQuestion in quizPageQuestions.ListOfQuizPages)
            {
                foreach (var quizpageQuestionId in quizQuestion.QuestionIds)
                {
                    if (quizpageQuestionId == questionId)
                    {
                        if (quizQuestion.QuestionIds.Count() > 1)
                        {
                            return quizQuestion.QuestionNumber;
                        }
                        return quizQuestion.QuestionNumber;
                    }
                }
            }

            return 0;
        }

        //Method to get Resource details based on SolutionResourceId value of a Question (for MediaHandler = 4 & 5)
        public Resource GetSolutionResourceDetailsForQuestion(QuizQuestion quizQuestion, string resourceFilePath)
        {
            Resource selectedResource = null;
            var resources = _resourceXmlDataRepository.DeserializeXmlData(resourceFilePath);

            //Get matched resource details
            if (resources != null && resources.ListOfResourceses != null &&
                resources.ListOfResourceses.Count > 0)
            {
                selectedResource =
                      resources.ListOfResourceses.FirstOrDefault(
                          x => x.Id == quizQuestion.SolutionResourceId &&
                               (x.MediaHandlerId == 4 || x.MediaHandlerId == 5));
            }
            return selectedResource;
        }


        #endregion

        #region "QuizManager "


        /// <summary>
        /// Method to get list of active Quizzes whose Due Date is not null & Expire Date is greater than current DateTime
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>List<QuizDefine></returns>
        public async Task<IEnumerable<QuizDefine>> GetListOfActiveQuizzes(int userId)
        {
            IEnumerable<QuizDefine> result = null;
            //Get QuizDefine with DueDate is not null and ExpireDate is greater than current DateTime
            result = await _quizDefineContext.FetchAsync(x => x.ExpiresDateTime >= DateTime.Now);

            return result;
            //Check if Quiz is available to user - currently UserId is static so not checking it
        }


        /// <summary>
        /// Method to get list of QuizResultSummary based on List of QuizDefine and UserId
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizDefineList"></param>
        /// <param name="userId"></param>
        /// <returns>List<QuizManagerDetail></returns>
        public async Task<List<QuizManagerDetail>> GetQuizManagerDetailList(Quiz quiz, IEnumerable<QuizDefine> quizDefineList, int userId)
        {
            try
            {
                var objQuizManagerDetailList = new List<QuizManagerDetail>();

                var objQuizDefine = await _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime > DateTime.Now);

                var objQuizResultSummaryList = _quizResultSummaryContext.GetAll()
                    .Where(x => objQuizDefine != null && (x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId))
                    .OrderByDescending(x => x.QuizResultSummaryId)
                    .ToList();


                if (objQuizResultSummaryList.Any())
                {
                    #region "Assign values to a list properties and calculate Relative Rank for score"

                    objQuizManagerDetailList.AddRange(from quizResultSummary in objQuizResultSummaryList
                                                      where quizResultSummary != null
                                                      select new QuizManagerDetail
                                                      {
                                                          QuizTitle =
                                                              quizDefineList.Where(x => x.QuizDefineId == quizResultSummary.QuizDefineId)
                                                                  .Select(x => x.QuizName)
                                                                  .FirstOrDefault(),
                                                          DueDate =
                                                              quizDefineList.Where(x => x.QuizDefineId == quizResultSummary.QuizDefineId)
                                                                  .Select(x => x.DueDateTime.ToString("d MMM yyyy  hh:mm tt"))
                                                                  .FirstOrDefault(),
                                                          EndDate =
                                                              quizResultSummary.EndDate != null
                                                                  ? ((DateTime)quizResultSummary.EndDate).ToString("d MMM yyyy  hh:mm tt")
                                                                  : null,
                                                          StartDate = quizResultSummary.StartDate,
                                                          Score =
                                                              quizResultSummary.TotalScore != 0
                                                                  ? Convert.ToString(
                                                                      Convert.ToInt32(100 * quizResultSummary.TotalScore / quizResultSummary.MaxScore)) +
                                                                    "%"
                                                                  : "0%",
                                                          RelativeRankValue =
                                                              Convert.ToString(GetRelativeRank(quiz, quizResultSummary.ScoreSystem,
                                                                  quizResultSummary.TotalScore, "score")) + "%",
                                                          Id = quizDefineList.Where(x => x.QuizDefineId == quizResultSummary.QuizDefineId)
                                                              .Select(x => x.Id)
                                                              .FirstOrDefault(),
                                                          QuizResultSummaryId = quizResultSummary.QuizResultSummaryId
                                                      });

                    #endregion

                    return objQuizManagerDetailList;
                }
                else
                {
                    //Check from "RequiredToCompleteGroupIds" filed values if user has Completed Quiz or not
                    //Note : Currently user table and tynv table is not used so not checked for "RequiredToCompleteGroupIds"

                    #region "Assign values to a list properties if resultSummary does not have any entries."

                    objQuizManagerDetailList.AddRange(quizDefineList.Select(quizdefine => new QuizManagerDetail
                    {
                        Id = quizdefine.Id,
                        QuizTitle = quizdefine.QuizName,
                        DueDate = quizdefine.DueDateTime.ToString("d MMM yyyy  hh:mm tt")
                    }));

                    return objQuizManagerDetailList;

                    #endregion
                }
            }
            catch (Exception)
            {

                throw;
            }


        }


        #endregion

        #region "SelfScoringIntroPage "


        /// <summary>
        /// Method to get count of Short answers a Quiz contain
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>int</returns>
        public async Task<int> GetSelfScoringQuestionsCount(Quiz quiz, QuizQuestions quizQuestions, QuizPageQuestions quizPageQuestions, int quizResultSummaryId)
        {
            var questionSelfScoredCount = 0;
            var objList = new List<QuizCompilation>();
            // var objQuizPagesList = new List<QuizPageQuestion>();

            var objQuizDef = await
                     _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            #region "Get short answer Questions i.e QuestionType 2"

            //foreach (var quizPage in quizPageQuestions.ListOfQuizPages)
            //{
            //    foreach (var questionIds in quizPage.QuestionIds)
            //    {
            //        if (
            //            quizQuestions.ListOfQuizQuestions.Any(
            //                questions => questions.QuestionId == questionIds && questions.QuestionType == 2))
            //        {
            //            objQuizPagesList.Add(quizPage);
            //        }
            //        break;
            //    }
            //}

            #endregion

            if (objQuizDef != null)
            {
                var objMappingResult = await
                    _mappingQuizResultContext.FetchAsync(x => x.QuizResultSummaryId == quizResultSummaryId && x.QuizResultId > 0);

                var objShortAnswersList =
                    quizQuestions.ListOfQuizQuestions.Where(x => x.QuestionType == 2).ToList();

                if (objShortAnswersList.Any())
                {
                    objList.AddRange(from mappingQuizResult in objMappingResult
                                     where mappingQuizResult != null
                                     let objQuizCompile =
                                         _quizCompilationContext.FirstOrDefault(
                                                 x =>
                                                     x.QuizCompileId == mappingQuizResult.QuizCompileId &&
                                                     x.QuizDefineId == objQuizDef.QuizDefineId)
                                     where objQuizCompile != null
                                     let isShortAnswer =
                                         objShortAnswersList.Exists(x => x.QuestionId == objQuizCompile.QuestionId)
                                     where isShortAnswer
                                     let objQuizResult =
                                         _quizResultContext.FirstOrDefault(
                                                 x =>
                                                     x.QuizResultId == mappingQuizResult.QuizResultId &&
                                                     x.QuizCompileId == mappingQuizResult.QuizCompileId &&
                                                     x.Score == null && x.IsAnsweringDone)
                                     where objQuizResult != null
                                     select objQuizCompile);
                }

                var selfscoredQuestionList = objList.GroupBy(x => x.QuestionNumber);

                questionSelfScoredCount = selfscoredQuestionList.Count();

            }

            return questionSelfScoredCount;

        }


        /// <summary>
        /// Method to get first Question page of Self scoring
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        public async Task<QuizPageQuestion> GetFirstQuestionNoOnSelfScoringPageLoad(Quiz quiz, int userId, QuizPageQuestions quizPageQuestions, QuizQuestions quizQuestions)
        {
            var objQuizCompileLst = new List<QuizCompilation>();
            var objQuizPagesList = new List<QuizPageQuestion>();

            #region "Get  short answer Questions i.e QuestionType 2"

            foreach (var quizPage in quizPageQuestions.ListOfQuizPages)
            {
                foreach (var questionIds in quizPage.QuestionIds)
                {

                    if (quizQuestions.ListOfQuizQuestions.Any(questions => questions.QuestionId == questionIds && questions.QuestionType == 2))
                    {
                        objQuizPagesList.Add(quizPage);
                    }
                    break;
                }
            }
            #endregion

            //Check if score given for any Self-Scoring Question, if yes then need to get next Quiz Page

            var objQuizDefine = await
                       _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDefine != null)
            {
                var objQuizResSummary = await
                           _quizResultSummaryContext.Fetch(
                                   x =>
                                       x.QuizDefineId == objQuizDefine.QuizDefineId && x.UserId == userId &&
                                       x.EndDate == null)
                               .OrderByDescending(x => x.QuizResultSummaryId)
                               .FirstOrDefaultAsync();

                if (objQuizResSummary != null)
                {
                    var objMappingQuizResultLst = _mappingQuizResultContext.Fetch(x => x.QuizResultSummaryId == objQuizResSummary.QuizResultSummaryId)
                                 .ToList();

                    if (objMappingQuizResultLst.Count > 0)
                    {
                        //Get QuizCompile list based on MappingQuizResultDetail values
                        objQuizCompileLst.AddRange(
                            objMappingQuizResultLst.Select(
                                mappingQuizResultDetail =>
                                    _quizCompilationContext.FirstOrDefault(
                                            x =>
                                                x.QuizCompileId == mappingQuizResultDetail.QuizCompileId &&
                                                x.QuizDefineId == objQuizDefine.QuizDefineId)));

                        //Check for each QuizPageQuestion with PageType=7 , if QuestionId has its result scored as 0 then return that QuizPageQuestion
                        foreach (var quizPage in objQuizPagesList)
                        {
                            foreach (int questionId in quizPage.QuestionIds)
                            {
                                var objQuizCompile = objQuizCompileLst.FirstOrDefault(x => x.QuestionId == questionId && x.QuizDefineId == objQuizDefine.QuizDefineId);
                                if (objQuizCompile != null)
                                {
                                    var objGetResultIdFromMapping = objMappingQuizResultLst.FirstOrDefault(x => x.QuizResultSummaryId == objQuizResSummary.QuizResultSummaryId && x.QuizCompileId == objQuizCompile.QuizCompileId);
                                    if (objGetResultIdFromMapping != null)
                                    {
                                        var objQuizResult = await _quizResultContext.FirstOrDefaultAsync(y => y.QuizResultId == objGetResultIdFromMapping.QuizResultId && y.QuizCompileId == objQuizCompile.QuizCompileId && y.QuizDefineId == objQuizDefine.QuizDefineId && y.Score == null);
                                        if (objQuizResult != null)
                                        {
                                            return quizPage;
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
            return null;
        }


        #endregion

        #region "SelfScoringQuestionPage "


        /// <summary>
        /// Method to get list of QuizPageQuestion for self scoring question page
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizPageQuestions</returns>
        public QuizPageQuestions CheckQuizPagesHaveSelfScoringPageType(QuizPageQuestions quizPageQuestions, QuizQuestions quizQuestions)
        {
            var objQuizPagesList = new List<QuizPageQuestion>();
            foreach (var quizPage in quizPageQuestions.ListOfQuizPages)
            {
                foreach (var questionIds in quizPage.QuestionIds)
                {
                    foreach (QuizQuestion questions in quizQuestions.ListOfQuizQuestions)
                    {
                        if (questions.QuestionId == questionIds && questions.QuestionType == 2)
                        {
                            objQuizPagesList.Add(quizPage);
                            break;
                        }
                    }
                    break;
                }
            }

            //var objQuizPages = new QuizPageQuestions { ListOfQuizPages = objQuizPagesList.ToList() };
            return new QuizPageQuestions { ListOfQuizPages = objQuizPagesList };

        }


        /// <summary>
        /// Get selfscoring page no based on question number.
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestionNo"></param>
        /// <returns>QuizPageQuestion</returns>
        public QuizPageQuestion GetSelfScoringQuizPageBasedOnQuestionNo(QuizPageQuestions quizPageQuestions, int quizQuestionNo)
        {
            return quizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionNumber == quizQuestionNo && x.QuestionIds.Count > 0);
        }


        /// <summary>
        /// Method to get next QuestionNo for selfScoringQuestionPage.
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <param name="currentQuestionNo"></param>
        /// <returns>int</returns>
        public async Task<int> GetNextQuestionNumberForSelfScoringQuestionPage(Quiz quiz, QuizQuestions quizQuestions, QuizPageQuestions quizPageQuestions, int quizResultSummaryId, int currentQuestionNo)
        {

            var objQuizDefine = await
                       _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDefine != null)
            {
                var objNextQuizPage = quizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionNumber == currentQuestionNo + 1);
                if (objNextQuizPage != null)
                {
                    var objNextPageShortQuestionList = (from questionId in objNextQuizPage.QuestionIds
                                                        where questionId != 0
                                                        let objQuizQuestion =
                                                            quizQuestions.ListOfQuizQuestions.FirstOrDefault(
                                                                x => x.QuestionId == questionId && x.QuestionType == 2)
                                                        where objQuizQuestion != null
                                                        select questionId).ToList();

                    //Get next page questions - which are short answers


                    //Check if result exist
                    var objMappingQuizList = _mappingQuizResultContext.Fetch(x => x.QuizResultSummaryId == quizResultSummaryId).ToList();
                    foreach (var objNextQuizQuestion in objNextPageShortQuestionList)
                    {
                        var objQuizCompile = await _quizCompilationContext.FirstOrDefaultAsync(x => x.QuestionId == objNextQuizQuestion && x.QuizDefineId == objQuizDefine.QuizDefineId);
                        if (objQuizCompile != null)
                        {
                            var objMappingQuestionDetail = objMappingQuizList.FirstOrDefault(x => x.QuizCompileId == objQuizCompile.QuizCompileId && x.QuizResultSummaryId == quizResultSummaryId);
                            if (objMappingQuestionDetail != null && objMappingQuestionDetail.QuizResultId > 0)
                            {
                                var objQuizResult = await
                                    _quizResultContext.FirstOrDefaultAsync(x => x.QuizResultId == objMappingQuestionDetail.QuizResultId &&
                                                                                    x.IsAnsweringDone);
                                if (objQuizResult != null)
                                    return objNextQuizPage.QuestionNumber;
                                else
                                {
                                    return 0;
                                }
                            }
                            return 0;
                        }
                    }
                }
            }
            return 0;
        }

        /// <summary>
        /// Method to get the Question Number of previous question of self scoring question page
        /// </summary>
        /// <param name="currentQuestionNo"></param>
        /// <param name="quizquestions"></param>
        /// <param name="quizPageQuestions"></param>
        /// <returns>int</returns>
        public int GetPreviousQuestionNumberForSelfScoringQuestionPage(int currentQuestionNo, QuizQuestions quizquestions, QuizPageQuestions quizPageQuestions)
        {
            //var shortAnswerList = quizquestions.ListOfQuizQuestions.Where(x => x.QuestionType == 2).ToList();
            var objQuizPagesList = new List<QuizPageQuestion>();

            foreach (var quizPage in quizPageQuestions.ListOfQuizPages)
            {
                foreach (var questionIds in quizPage.QuestionIds)
                {
                    if (quizquestions.ListOfQuizQuestions.Any(questions => questions.QuestionId == questionIds && questions.QuestionType == 2))
                    {
                        objQuizPagesList.Add(quizPage);
                    }
                    break;
                }
            }

            var objCurrentQuizPage = objQuizPagesList.FirstOrDefault(x => x.QuestionNumber == currentQuestionNo);
            if (objCurrentQuizPage != null)
            {
                //Getting previous page.
                var objPreviousPage = objQuizPagesList.FirstOrDefault(x => x.QuestionNumber == objCurrentQuizPage.QuestionNumber - 1);
                if (objPreviousPage != null)
                {
                    return objPreviousPage.QuestionNumber;
                }
            }
            return 0;
        }

        #endregion

        #region "SaveAndPausedPage "


        /// <summary>
        /// Method to get QuizResultSummaryId of Paused Quiz
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        /// <returns>int</returns>
        public async Task<int> GetQuizResultSummaryIdForResumedQuiz(Quiz quiz, int userId)
        {
            //Get record from QuizDefine
            var objQuizDefineDetail = await
                _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDefineDetail != null)
            {
                var objQuizResSummary = await
                   _quizResultSummaryContext.Fetch(
                           x =>
                               x.QuizDefineId == objQuizDefineDetail.QuizDefineId && x.UserId == userId &&
                               x.EndDate == null)
                       .OrderByDescending(x => x.QuizResultSummaryId)
                       .FirstOrDefaultAsync();

                if (objQuizResSummary != null) return objQuizResSummary.QuizResultSummaryId;
            }

            return 0;
        }


        /// <summary>
        /// Method to get QuizQuestion and QuizPageQuestion from where the Quiz was paused
        /// </summary>
        /// <param name="quizResultSummaryId"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quiz"></param>
        /// <returns>QuizPageQuestion</returns>
        public async Task<QuizPageQuestion> GetQuizQuestionForResumeQuiz(int quizResultSummaryId, QuizPageQuestions quizPageQuestions, Quiz quiz)
        {
            QuizPageQuestion objQuizPage = null;

            //Get QuizDefine 
            var objQuizDefineDetail = await
               _quizDefineContext.FirstOrDefaultAsync(x => x.Id == quiz.Id && x.ExpiresDateTime >= DateTime.Now);

            if (objQuizDefineDetail != null)
            {
                var objMappingQuizResultLst = await
                      _mappingQuizResultContext.Fetch()
                          .Where(x => x.QuizResultSummaryId == quizResultSummaryId)
                          .OrderBy(x => x.MappingQuizResultDetailId)
                          .ToListAsync();

                foreach (var mappingQuizResultDetail in objMappingQuizResultLst)
                {
                    if (mappingQuizResultDetail.QuizResultId == 0)
                    {
                        #region "When QuizResultId is zero"

                        var objQuizCompile = await
                            _quizCompilationContext.FirstOrDefaultAsync(
                                    x =>
                                        x.QuizCompileId == mappingQuizResultDetail.QuizCompileId &&
                                        x.QuizDefineId == objQuizDefineDetail.QuizDefineId);

                        if (objQuizCompile != null && objQuizCompile.QuestionId != 0)
                        {
                            objQuizPage =
                                quizPageQuestions.ListOfQuizPages.FirstOrDefault(
                                    x =>
                                        x.QuestionIds.Any() &&
                                        x.QuestionIds.Contains(objQuizCompile.QuestionId));

                            return objQuizPage;
                        }

                        #endregion
                    }
                    else
                    {
                        #region "When IsAnsweringDone is false & QuizResultId is not zero"

                        var quizResultDetail = await
                            _quizResultContext.FirstOrDefaultAsync(
                                    x => x.QuizResultId == mappingQuizResultDetail.QuizResultId &&
                                         x.QuizCompileId == mappingQuizResultDetail.QuizCompileId &&
                                         x.IsAnsweringDone == false &&
                                         x.QuizDefineId == objQuizDefineDetail.QuizDefineId);

                        if (quizResultDetail != null)
                        {
                            var objQuizCompile = await
                                _quizCompilationContext.FirstOrDefaultAsync(
                                        x =>
                                            x.QuizCompileId == mappingQuizResultDetail.QuizCompileId &&
                                            x.QuizDefineId == objQuizDefineDetail.QuizDefineId);

                            if (objQuizCompile != null && objQuizCompile.QuestionId != 0)
                            {
                                objQuizPage =
                                   quizPageQuestions.ListOfQuizPages.FirstOrDefault(
                                       x =>
                                           x.QuestionIds.Any() &&
                                           x.QuestionIds.Contains(objQuizCompile.QuestionId));
                            }
                        }

                        #endregion
                    }
                }
            }

            return objQuizPage;
        }


        /// <summary>
        /// Method to get QuizResultSummaryId of Paused Quiz for Self-Scoring
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>bool</returns>
        public async Task<bool> CheckScoreGivenToSelfScoringQuestionsForResumeQuiz(int userId, int quizResultSummaryId)
        {
            var scoreGivenForSelfScoringQuestion = true;
            if (userId != 0 && quizResultSummaryId != 0)
            {
                //Get mapping table details 
                var objMappingQuizResultList = await
                    _mappingQuizResultContext.Fetch()
                        .Where(x => x.QuizResultSummaryId == quizResultSummaryId)
                        .ToListAsync();

                foreach (var objMappingQuizResult in objMappingQuizResultList)
                {
                    if (objMappingQuizResult != null)
                    {
                        var objQuizResult =
                            await
                                _quizResultContext.Fetch(
                                        x => x.QuizResultId == objMappingQuizResult.QuizResultId && x.Score == null)
                                    .OrderByDescending(x => x.QuizResultId)
                                    .FirstOrDefaultAsync();

                        if (objQuizResult != null && objQuizResult.QuizResultId != 0)
                        {
                            scoreGivenForSelfScoringQuestion = false;
                            break;
                        }
                    }
                }
            }
            return scoreGivenForSelfScoringQuestion;
        }

        #endregion

        #region "Allotted Timer Expire Page between Self-scoring Que and Result Page"

        /// <summary>
        /// Method to check Question no to self score after timer got expired 
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="idOfQuiz"></param>
        /// <param name="resultSummaryId"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>bool</returns>
        public async Task<bool> GetQuestionNoToSelfScoreAfterTimerExpired(string hiddenCode, int idOfQuiz, int resultSummaryId, QuizQuestions quizQuestions)
        {
            var shortQuestions = quizQuestions.ListOfQuizQuestions.Where(x => x.QuestionType == 2);
            if (shortQuestions.Any())
            {
                var objQuizDefine = await
                    _quizDefineContext.FirstOrDefaultAsync(x => x.Id == idOfQuiz && x.ExpiresDateTime >= DateTime.Now);

                if (objQuizDefine != null && objQuizDefine.QuizDefineId != 0)
                {
                    var mappingQuizResultList = new List<MappingQuizResultDetails>();
                    foreach (var quizQuestion in shortQuestions)
                    {
                        var quizCompile = await _quizCompilationContext.FirstOrDefaultAsync(y => y.QuestionId == quizQuestion.QuestionId && y.QuizDefineId == objQuizDefine.QuizDefineId);
                        if (quizCompile != null)
                        {
                            var mappingQuizResult = await _mappingQuizResultContext.FirstOrDefaultAsync(x => x.QuizResultSummaryId == resultSummaryId && x.QuizCompileId == quizCompile.QuizCompileId);
                            if (mappingQuizResult != null) mappingQuizResultList.Add(mappingQuizResult);
                        }
                    }

                    //Check if any record of QuizResult which are not AnsweredInTime
                    var quizResultList = new List<QuizResult>();
                    foreach (var mappingQuizResult in mappingQuizResultList)
                    {
                        var quizResult = await
                            _quizResultContext.FirstOrDefaultAsync(
                                    x =>
                                        x.QuizCompileId == mappingQuizResult.QuizCompileId &&
                                        x.QuizResultId == mappingQuizResult.QuizResultId &&
                                        x.QuizDefineId == objQuizDefine.QuizDefineId &&
                                        x.AnsweredInTime == false);

                        if (quizResult != null)
                        {
                            quizResultList.Add(quizResult);
                        }

                    }

                    if (quizResultList.Any() && quizResultList.Count > 0)
                        return true;
                    else
                        return false;
                }
            }
            return false;
        }

        #endregion

        #endregion

        #region "Dispose Method(s)"

        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            try
            {
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "QuizRepository : Dispose");
                throw;
            }

        }

        #endregion
    }
}
