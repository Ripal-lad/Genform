using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using System.Web.Http;
using AutoMapper;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.DomainModel.Models;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Repository.Repository;
using TSFXGenform.Utils;
using TSFXGenform.Utils.GlobalUtils;
using Timer = System.Timers.Timer;


namespace TSFXGenform.Core.Controllers
{
    public class QuizController : ApiController
    {
        #region "Private variable(s)"

        private readonly IQuizRepository _quizRepository;
        private readonly ICacheMemoryRepository _cacheMemoryRepository;
        private readonly StringConstant _stringConstant;

        //private static readonly string PathForFormsFolder =
        //    System.Web.Configuration.WebConfigurationManager.AppSettings["PathForFormsFolder"].ToString(
        //        CultureInfo.InvariantCulture);

        //private static readonly string QuizXmlFileFolderPath =
        //    System.Web.Configuration.WebConfigurationManager.AppSettings["QuizXMLFileFolderPath"].ToString(
        //        CultureInfo.InvariantCulture);

        //private static readonly string AppWriteWebReadFolderPath =
        //    System.Web.Configuration.WebConfigurationManager.AppSettings["AppWriteWebReadFolderPath"].ToString(
        //        CultureInfo.InvariantCulture);

        //private static readonly string QuizQuestionAndSolutionImagesPath =
        //    System.Web.Configuration.WebConfigurationManager.AppSettings["QuizQuestionAndSolutionImagesPath"].ToString(
        //        CultureInfo.InvariantCulture);

        //private static readonly string AppReadFolderPath =
        //    System.Web.Configuration.WebConfigurationManager.AppSettings["AppReadFolderPath"].ToString(
        //        CultureInfo.InvariantCulture);


        //private static readonly string XmlFileFolderPath =
        //    System.Web.Configuration.WebConfigurationManager.AppSettings["AppReadFolderPath"].ToString(
        //        CultureInfo.InvariantCulture);


        //private static readonly string ResourceXmlFilePath = System.Web.Configuration.WebConfigurationManager
        //    .AppSettings["ResourceXMLFilePath"].ToString(
        //        CultureInfo.InvariantCulture);

        //private static readonly string AppWriteWebReadResourceDataFolderPath = System.Web.Configuration
        //    .WebConfigurationManager.AppSettings["AppWriteWebReadResourceDataFolderPath"].ToString(
        //        CultureInfo.InvariantCulture);

        //private static readonly string BaseXmlFileFolderPath = System.Web.Configuration.WebConfigurationManager
        //    .AppSettings["BaseXmlFileFolderPath"].ToString(
        //        CultureInfo.InvariantCulture);


        public readonly string ResourceFilePath;//= BaseXmlFileFolderPath + "/" + XmlFileFolderPath + "/" +
        //ResourceXmlFilePath;

        public readonly string QuestionAndSolutionImagePath; //= Path.Combine(_stringConstant.PathForFormsFolder, _stringConstant.AppWriteWebReadFolderPath,
        // _stringConstant.QuizQuestionAndSolutionImagesPath);

        public readonly string QuizXmlFilePath;//= Path.Combine(BaseXmlFileFolderPath, AppReadFolderPath, QuizXmlFileFolderPath);

        //public QuizRoot ObjQuizRoot;

        #endregion

        #region "Public method(s)"

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="quizRepository"></param>
        /// <param name="globalUtilities"></param>
        /// <param name="stringConstant"></param>
        /// <param name="cacheMemoryRepository"></param>
        public QuizController(IQuizRepository quizRepository, GlobalPath globalUtilities,
            StringConstant stringConstant,
            ICacheMemoryRepository cacheMemoryRepository)
        {
            _quizRepository = quizRepository;
            _stringConstant = stringConstant;
            QuestionAndSolutionImagePath = Path.Combine(_stringConstant.PathForFormsFolder, _stringConstant.AppWriteWebReadFolderPath,
            _stringConstant.QuizQuestionAndSolutionImagesPath);
            ResourceFilePath = _stringConstant.BaseXmlFileFolderPath + "/" + _stringConstant.XmlFileFolderPath + "/" +
                               _stringConstant.ResourceXmlFilePath;
            QuizXmlFilePath = Path.Combine(_stringConstant.BaseXmlFileFolderPath, _stringConstant.XmlFileFolderPath, _stringConstant.QuizXmlFileFolderPath);
            _cacheMemoryRepository = cacheMemoryRepository;
        }

        #region "Root methods"


        /// <summary>
        /// Method call to get QuizName
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quizname")]
        [HttpGet]
        public IHttpActionResult GetCurrentQuizName(string hiddenCode)
        {
            string strQuizName = null;
            if (!string.IsNullOrEmpty(QuizXmlFilePath) && !string.IsNullOrEmpty(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);//GetXmlFileDataFromCacheMemory(QuizXmlFilePath, hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null)
                {
                    // var iFormId = quizFormId;
                    //strQuizName = _quizRepository.GetCurrentQuizName(hiddenCode, objQuizRoot);
                    strQuizName = objQuizRoot.Quiz.Name;
                }
            }
            return Ok(new { result = strQuizName });
        }


        /// <summary>
        /// Call method to check URL of Quiz and get FormId from it  // Will be removed.
        /// </summary>
        /// <param name="hiddencode"></param>
        /// <returns>IHttpActionResult</returns>
        //[Route("api/Quiz/CheckQuizUrlAndGetFormId")]
        //[HttpGet]
        //public IHttpActionResult CheckQuizUrlAndGetFormId(string hiddencode)
        //{
        //    try
        //    {
        //        var response = false;
        //        if (!string.IsNullOrEmpty(hiddencode))
        //        {
        //            response = _quizRepository.CheckQuizUrlAndGetFormId(hiddencode);
        //        }
        //        return Ok(response ? new {result = true} : new {result = false});
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuizUrlAndGetFormId");
        //        throw;
        //    }
        //}

        #region "IntroPage : PageType=1"


        /// <summary>
        /// Method to check whether the quiz is available or not
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/quizavailable")]
        [HttpGet]
        public IHttpActionResult CheckQuizIsAvailableOrNot(string hiddenCode)
        {
            ValidateQuiz response = null;
            if (!string.IsNullOrWhiteSpace(QuizXmlFilePath) && !string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null)
                {
                    response = _quizRepository.CheckQuizIsAvailableOrNot(hiddenCode,
                        objQuizRoot.Quiz);
                }
            }
            return Ok(new { result = response });

        }


        /// <summary>
        /// Method to call on load of 1st page of Quiz to load all the values in business
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/intropagedetailsonpageload")]
        [HttpGet]
        public IHttpActionResult GetDetailsOfQuizOnIntroLoadPage(string hiddenCode)
        {
            QuizRoot objQuizRoot = null;
           //GlobalUtilities.StoreTimeRemaining = 0;
            GlobalPath.StoreTimeRemaining = 0;
            if (hiddenCode.Length > 0 && !string.IsNullOrWhiteSpace(hiddenCode))
            {
                if (!string.IsNullOrWhiteSpace(_stringConstant.BaseXmlFileFolderPath) && !string.IsNullOrWhiteSpace(_stringConstant.QuizXmlFileFolderPath) &&
                    !string.IsNullOrWhiteSpace(_stringConstant.XmlFileFolderPath))
                {
                    var strQuizFormFullPath = Path.Combine(_stringConstant.BaseXmlFileFolderPath, _stringConstant.XmlFileFolderPath,
                        _stringConstant.QuizXmlFileFolderPath);

                    //Check if FormId folder exists in EventData folder 
                    var xmlFilePath = Path.Combine(strQuizFormFullPath, hiddenCode + ".xml");

                    //Check if Xml file exist.
                    if (File.Exists(xmlFilePath))
                    {
                        //If file has not been modified then retrieve data from Caceh memory.
                        objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                        if (objQuizRoot == null)
                        {
                            //If cache memory contains null value then read Xml file and store it in the Cache memory.
                            objQuizRoot = _cacheMemoryRepository.SetAndGetXmlFileDataIntoCacheMemoryOnLoad("QuizRoot", () => _quizRepository.GetQuizEventDataXmlData(xmlFilePath), xmlFilePath, hiddenCode);//SetAndGetQuizXmlFileDataIntoCacheMemory(strQuizFormFullPath,
                            //hiddenCode);
                        }
                        else
                        {
                            //Check whether the file has been modified or not.
                            // var isFileModiFied = CheckModifiedTimeStampOfXmlFileForQuiz(xmlFilePath, hiddenCode);

                            if (_quizRepository.CheckModifiedTimeStampOfXmlFileForQuiz(xmlFilePath, hiddenCode))
                            {
                                //If file has been modified read Xml file data and store it in cache memory.
                                objQuizRoot = _cacheMemoryRepository.SetAndGetXmlFileDataIntoCacheMemoryOnLoad("QuizRoot", () => _quizRepository.GetQuizEventDataXmlData(xmlFilePath), xmlFilePath, hiddenCode); //SetAndGetQuizXmlFileDataIntoCacheMemory(strQuizFormFullPath,
                                //hiddenCode);
                            }
                        }
                        //Call method to set xmlfile content from cache memory.
                        //objQuizRoot = SetAndGetQuizXmlFileDataIntoCacheMemory(strQuizFormFullPath, hiddenCode);
                        objQuizRoot.Quiz.HiddenCodeForQuiz = hiddenCode;
                    }
                    else
                    {
                        var ex = new Exception("File does not exist.");
                        LogSystem.EmailLogException(ex, 0,
                            "QuizController : GetDetailsOfQuizOnIntroLoadPage - Resource xml does not exist. ");
                    }
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(_stringConstant.BaseXmlFileFolderPath))
                    {
                        var ex = new Exception("Path does not exist.");
                        LogSystem.EmailLogException(ex, 0,
                            "QuizController : GetDetailsOfQuizOnIntroLoadPage - BaseXmlFileFolderPath does not exist ");
                    }
                    else if (string.IsNullOrWhiteSpace(_stringConstant.XmlFileFolderPath))
                    {
                        var ex = new Exception("Path does not exist.");
                        LogSystem.EmailLogException(ex, 0,
                            "QuizController : GetDetailsOfQuizOnIntroLoadPage - XmlFileFolderPath does not exist ");
                    }
                    else if (string.IsNullOrWhiteSpace(_stringConstant.QuizXmlFileFolderPath))
                    {
                        var ex = new Exception("Path does not exist.");
                        LogSystem.EmailLogException(ex, 0,
                            "QuizController : GetDetailsOfQuizOnIntroLoadPage - _quizXmlFileFolderPath does not exist ");
                    }
                }
            }
            return Ok(objQuizRoot != null ? new { result = true } : new { result = false });
        }

        //
        /// <summary>
        /// Method to have entries in Database for QuizDefine and QuizCompilation
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/initializequizdefine")]
        [HttpGet]
        public IHttpActionResult InitializeQuizDefineOnPageLoad(string hiddenCode)
        {
            if (!string.IsNullOrWhiteSpace(QuizXmlFilePath) && !string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    hiddenCode == objQuizRoot.Quiz.HiddenCodeForQuiz && objQuizRoot.QuizQuestions != null)
                {
                    //Currently passing staic value as 1 for UserId
                    //InitiateQuizDefine(objQuizRoot.Quiz, objQuizRoot.QuizQuestions, 1);
                    _quizRepository.InitiateQuizDefine(objQuizRoot.Quiz, 1);
                    return Ok(new { result = true });
                }
            }
            return Ok(new { result = false });
        }

        //
        /// <summary>
        /// Method to get values for IntroPage
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/intropagedetails")]
        [HttpGet]
        public async Task<IHttpActionResult> GetDetailsForIntroPage(string hiddenCode)
        {
            Quiz quizPageType1 = null;
            if (!string.IsNullOrWhiteSpace(QuizXmlFilePath) && !string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz.HiddenCodeForQuiz.Equals(hiddenCode))
                {
                    quizPageType1 = await _quizRepository.GetQuizDetails(objQuizRoot.Quiz, 1);
                    //GetQuizDetails(objQuizRoot.Quiz, objQuizRoot.QuizPageQuestions,
                    //1);

                    //Check if values are not null
                    //if (CheckQuizPageDetailsOfPageType1NotNull(quizPageType1))
                    //{
                    //    return Ok(new { result = quizPageType1 });
                    //}
                    //return Ok(new { result = "null" });
                }
            }
            return Ok(quizPageType1);
        }

        #endregion

        #region "QuestionPage "

        /// <summary>
        /// Method to get first Question number to display on QuestionPage.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>QuizPageQuestion</returns>
        [Route("api/quiz/firstquestionnumber")]
        [HttpGet]
        public QuizPageQuestion GetFirstQuestionNumberToLoadOnQuestionPage(string hiddenCode)
        {
            QuizPageQuestion objQuizPage = null;

            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0)
                {
                    //Get Quiz Question pages
                    objQuizPage = objQuizRoot.QuizPageQuestions.ListOfQuizPages.FirstOrDefault(x => x.QuestionIds != null && x.QuestionIds.Any() && x.QuestionNumber != 0);

                    //  objQuizPage = _quizRepository.GetFirstQuestionNumberToLoadOnQuestionPage(objQuizRoot.QuizPageQuestions);
                    //GetFirstQuestionNumberToLoadOnQuestionPage(objQuizRoot.QuizPageQuestions);
                }
            }
            return objQuizPage;
        }


        /// <summary>
        /// Method  to initialize Quiz and have DB transactio into QuizResultSummary and QuizCompilation. table
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/initializequizresultsummaryandquizcompilation")]
        [HttpGet]
        public async Task<IHttpActionResult> InitializeQuizResultSummaryAndQuizCompilation(string hiddenCode, int userId)
        {
            var quizResultSummaryId = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.QuizQuestions != null &&
                    objQuizRoot.QuizQuestions.ListOfQuizQuestions.Any() &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz.Equals(hiddenCode))
                {
                    if (objQuizRoot.Quiz != null)
                    {
                        //Method to insert values in QuizResultSummary table
                        quizResultSummaryId = await _quizRepository.InitializeQuizResultSummaryAndQuizCompilation(objQuizRoot.Quiz,
                              objQuizRoot.QuizPageQuestions, objQuizRoot.QuizQuestions, userId);

                    }
                }
            }
            return Ok(new { result = quizResultSummaryId });
        }


        /// <summary>
        /// Method to get Quiz class to have Quiz Settings on UI
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quizsettings")]
        [HttpGet]
        public IHttpActionResult GetQuizSettingDetails(string hiddenCode)
        {
            Quiz quizSettings = null;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);
                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz.Equals(hiddenCode))
                {
                    quizSettings = objQuizRoot.Quiz;

                }
            }
            return Ok(quizSettings);

        }


        /// <summary>
        /// Method to get Question(s) ,Page and result details.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="questionNumber"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/questionandpagedetails")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuestionAndPageDetailsForQuestionPage(string hiddenCode, int questionNumber,
            int userId)
        {
            var objQuizResultList = new List<QuizResult>();
            List<QuizPageAndQuestionDetails> quizPageAndQuestionDetailsList = null;

            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (questionNumber != 0 && userId != 0)
                {
                    if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                        objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                            objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0 &&
                            objQuizRoot.QuizQuestions != null &&
                            objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0)
                    {
                        //Get records whose PageQuestionId is not null
                        var objQuizPagesQuestions = _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizRoot.QuizPageQuestions);
                        // CheckQuizPagesHavePageQuestionId(objQuizRoot.QuizPageQuestions);

                        if (objQuizPagesQuestions != null &&
                            objQuizPagesQuestions.ListOfQuizPages.Count > 0)
                        {
                            //Getting the Quizpage
                            var objQuizPage = _quizRepository.GetQuizPageOnQuestionpage(objQuizPagesQuestions,
                                questionNumber);


                            if (objQuizPage != null)
                            {
                                //Getting QuizQuestion based on QuizPageQuestion
                                var objQuizQuestions = _quizRepository.GetMatchedQuizQuestionsFromQuizPage(objQuizPage, objQuizRoot.QuizQuestions);//GetMatchedQuizQuestionsFromQuizPage(objQuizPage,

                                //objQuizRoot.QuizQuestions);

                                if (!string.IsNullOrWhiteSpace(QuestionAndSolutionImagePath) & objQuizQuestions.ListOfQuizQuestions != null &&
                                        objQuizQuestions.ListOfQuizQuestions.Count > 0)
                                {
                                    //Getting result of QuizQuestion
                                    objQuizResultList.AddRange(
                                        objQuizQuestions.ListOfQuizQuestions.Select(
                                            currentQuizQuestion =>
                                                 _quizRepository.GetQuizResultBasedOnQuizQuestion(
                                                    objQuizRoot.Quiz,
                                                    currentQuizQuestion, userId)));

                                    #region Add questions ,result and page details in QuizPageAndQuestionDetails list

                                    var length = objQuizQuestions.ListOfQuizQuestions.Count;
                                    quizPageAndQuestionDetailsList = new List<QuizPageAndQuestionDetails>();
                                    for (var i = 0; i < length; i++)
                                    {
                                        Mapper.CreateMap<QuizQuestion, QuizPageAndQuestionDetails>();
                                        var quizPageAndQuestionDetails = Mapper.Map<QuizPageAndQuestionDetails>(objQuizQuestions.ListOfQuizQuestions[i]);

                                        quizPageAndQuestionDetails.QuestionImagePath =
                                            Path.Combine(QuestionAndSolutionImagePath,
                                                objQuizQuestions.ListOfQuizQuestions[i]
                                                    .QuestionImageName +
                                                ".png");
                                        quizPageAndQuestionDetails.SolutionImagePath =
                                            Path.Combine(QuestionAndSolutionImagePath,
                                                objQuizQuestions.ListOfQuizQuestions[i]
                                                    .SolutionImageName +
                                                ".png");
                                        quizPageAndQuestionDetails.QuestionIds = objQuizPage.QuestionIds;
                                        quizPageAndQuestionDetails.QuestionNumber = objQuizPage.QuestionNumber;
                                        //var quizPageAndQuestionDetails = new QuizPageAndQuestionDetails
                                        //{
                                        //    CorrectAnswer =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].CorrectAnswer,
                                        //    QuestionImageWidthPx =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .QuestionImageHeightPx,
                                        //    QuestionImageHeightPx =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .QuestionImageWidthPx,
                                        //    NumberOfMarks =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].NumberOfMarks,
                                        //    NoOfAnswersRequired =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .NoOfAnswersRequired,
                                        //    PossibleAnswers =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].PossibleAnswers,
                                        //    QuestionId =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].QuestionId,
                                        //    QuestionImagePath =
                                        //        Path.Combine(QuestionAndSolutionImagePath,
                                        //            objQuizQuestions.ListOfQuizQuestions[i]
                                        //                .QuestionImageName +
                                        //            ".png"),
                                        //    QuestionType =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].QuestionType,
                                        //    TimeToAnswer =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].TimeToAnswer,
                                        //    SolutionId =
                                        //        objQuizQuestions.ListOfQuizQuestions[i].SolutionId,
                                        //    SolutionImageHeightPx =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .SolutionImageHeightPx,
                                        //    SolutionImagePath =
                                        //        Path.Combine(QuestionAndSolutionImagePath,
                                        //            objQuizQuestions.ListOfQuizQuestions[i]
                                        //                .SolutionImageName +
                                        //            ".png"),
                                        //    SolutionImageRequiredScaling =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .SolutionImageRequiredScaling,
                                        //    SolutionResourceId =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .SolutionResourceId,
                                        //    SolutionResourceTitle =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .SolutionResourceTitle,
                                        //    WriteSolutionInSpecificLocationMessage =
                                        //        objQuizQuestions.ListOfQuizQuestions[i]
                                        //            .WriteSolutionInSpecificLocationMessage,
                                        //    IndentPx = objQuizQuestions.ListOfQuizQuestions[i].IndentPX,
                                        //    QuestionIds = objQuizPage.QuestionIds,
                                        //    QuestionNumber = objQuizPage.QuestionNumber
                                        //};

                                        //Add Quiz page details.

                                        if (objQuizResultList.Count > 0 && objQuizResultList.Any() &&
                                            objQuizResultList[i] != null)
                                        {
                                            quizPageAndQuestionDetails.UserAnswer =
                                                objQuizResultList[i].UserAnswer;
                                            quizPageAndQuestionDetails.TimeTaken =
                                                objQuizResultList[i].TimeTaken;
                                            quizPageAndQuestionDetails.IsAnsweringDone =
                                                objQuizResultList[i].IsAnsweringDone;
                                        }

                                        quizPageAndQuestionDetailsList.Add(quizPageAndQuestionDetails);
                                    }


                                    #endregion
                                }
                            }

                        }
                    }
                }
            }
            return Ok(quizPageAndQuestionDetailsList);

        }


        /// <summary>
        /// Method to save user answer and get next quiz page.
        /// </summary>
        /// <param name="questionAndResult"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/nextquizpage")]
        [HttpPost]
        public async Task<IHttpActionResult> GetNextQuizPageOfQuiz(List<QuizPageAndQuestionDetails> questionAndResult)
        {
            QuizPageQuestion objNextQuizPage = null;
            if (questionAndResult != null && questionAndResult.Count > 0 && questionAndResult.Any())
            {
                var currentQuestionNo = questionAndResult[0].QuestionNumber;
                var hiddenCode = questionAndResult[0].HiddenCodeForQuiz;
                var userId = questionAndResult[0].UserId;
                var quizResultSummary = 0;
                var totalMarksOfQuestion = 0;
                float totalTimeTakenForAllQuestion = 0;

                if (!string.IsNullOrWhiteSpace(hiddenCode))
                {
                    var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                    if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                        objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizQuestions != null &&
                        objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0)
                    {
                        //Calculate user score for multiple choice questions.
                        foreach (var quizResult in questionAndResult)
                        {
                            if (quizResult.QuestionType == 1)
                            {
                                #region "Calculate Score for MCQ"

                                if (quizResult.AnsweredInTime)
                                {
                                    //Call method to calculate user score for multiple choice questions.
                                    var userScore = _quizRepository.CalculateMultipleChioceAnswerQuestionsScore(questionAndResult,
                                            objQuizRoot.QuizQuestions);
                                    //CalculateMultipleChioceAnswerQuestionsScore(questionAndResult,
                                    //    objQuizRoot.QuizQuestions);
                                    quizResult.Score = userScore;
                                }
                                else if (!quizResult.AnsweredInTime)
                                {
                                    quizResult.Score = 0;

                                }

                                #endregion
                            }
                            else
                            {
                                #region "Get Time spend & marks for multiple short answers"

                                totalTimeTakenForAllQuestion = quizResult.TimeTaken;
                                totalMarksOfQuestion = totalMarksOfQuestion + quizResult.NumberOfMarks;

                                #endregion
                            }

                        }
                        if (objQuizRoot.QuizPageQuestions != null &&
                            objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0)
                        {
                            //Calculate time spend arbitarily for multiple short answer
                            foreach (
                                var quizResult in
                                    questionAndResult.Where(quizResult => quizResult.QuestionType == 2))
                            {
                                quizResult.TimeTaken = (float)_quizRepository.CalculateTimeSpendForMultiShortQuestion(quizResult.NumberOfMarks, totalMarksOfQuestion, totalTimeTakenForAllQuestion);//CalculateTimeSpendForMultiShortQuestion(
                                //quizResult.NumberOfMarks, totalMarksOfQuestion, totalTimeTakenForAllQuestion);
                            }

                            #region "Save current QuizResult"

                            foreach (
                                var currentQuizResult in questionAndResult.Select(quizResult => new QuizResult
                                {
                                    QuestionId = quizResult.QuestionId,
                                    AnsweredInTime = quizResult.AnsweredInTime,
                                    UserAnswer = quizResult.UserAnswer,
                                    UserId = quizResult.UserId,
                                    Score = quizResult.Score,
                                    TimeTaken = quizResult.TimeTaken,
                                    IsAnsweringDone = quizResult.IsAnsweringDone
                                }))
                            {

                                var isAnswerSavedForCurrentQue = _quizRepository.SaveAnswerOfQuestion(objQuizRoot.Quiz,
                                    currentQuizResult, true, true, true, true, userId, ref quizResultSummary);
                                //SaveAnswerOfQuestion(objQuizRoot.Quiz,
                                //currentQuizResult, true, true, true, true, userId, ref quizResultSummary);
                                if (!isAnswerSavedForCurrentQue)
                                {
                                    break;
                                }
                            }

                            #endregion

                            if (!questionAndResult[0].SaveAndcompleteLaterLink)
                            {

                                //Get records whose QuestionIds are not null
                                var objQuizPages =
                                    _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizRoot.QuizPageQuestions);

                                var currentQuizPage =
                                    objQuizRoot.QuizPageQuestions.ListOfQuizPages.FirstOrDefault(
                                        x => x.QuestionNumber == currentQuestionNo);

                                //Get Next QuizPageQuestion based on current QuizPageQuestion
                                objNextQuizPage = _quizRepository.GetNextQuizPageDetails(currentQuizPage, objQuizPages);
                                //GetNextQuizPageDetails(currentQuizPage, objQuizPages);
                                //if (objNextQuizPage != null)
                                //{
                                //    return Ok(new { result = objNextQuizPage });
                                //}
                            }
                        }
                    }
                }
            }
            return Ok(new { result = objNextQuizPage });
        }

        //
        /// <summary>
        /// Method to save user answer on periodic call and on click of next button.
        /// </summary>
        /// <param name="questionAndResult"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/saveanswer")]
        [HttpPost]
        public async Task<IHttpActionResult> SaveAnswersOfQuestions(List<QuizPageAndQuestionDetails> questionAndResult)
        {
            var isAnswerSavedForCurrentQue = false;
            if (questionAndResult != null && questionAndResult.Count > 0)
            {
                var hiddenCode = questionAndResult[0].HiddenCodeForQuiz;
                var totalMarksOfQuestion = 0;
                float totalTimeTakenForAllQuestion = 0;

                if (!string.IsNullOrWhiteSpace(hiddenCode))
                {
                    var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                    if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                        objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode &&
                        objQuizRoot.QuizQuestions != null &&
                        objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0)
                    {
                        //Calculate user score for multiple choice questions.
                        foreach (var quizResult in questionAndResult)
                        {
                            if (quizResult != null)
                            {
                                if (quizResult.QuestionType == 1)
                                {
                                    #region "Calculate Score for MCQ"

                                    if (quizResult.AnsweredInTime)
                                    {
                                        //Call method to calculate user score for multiple choice questions.
                                        var userScore =
                                            _quizRepository.CalculateMultipleChioceAnswerQuestionsScore(questionAndResult,
                                                objQuizRoot.QuizQuestions);
                                        quizResult.Score = userScore;
                                    }
                                    else if (!quizResult.AnsweredInTime)
                                    {
                                        quizResult.Score = 0;

                                    }

                                    #endregion
                                }
                                else
                                {
                                    #region "Get Time spend & marks for multiple short answers"

                                    totalTimeTakenForAllQuestion = quizResult.TimeTaken;

                                    if (!string.IsNullOrWhiteSpace(quizResult.UserAnswer))
                                    {
                                        totalMarksOfQuestion = totalMarksOfQuestion + quizResult.NumberOfMarks;
                                    }

                                    #endregion
                                }
                            }

                        }

                        if (objQuizRoot.QuizPageQuestions != null &&
                            objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0)
                        {
                            //Calculate time spend arbitarily for multiple short answer
                            foreach (
                                var quizResult in
                                    questionAndResult.Where(quizResult => quizResult.QuestionType == 2))
                            {

                                quizResult.TimeTaken = (float)_quizRepository.CalculateTimeSpendForMultiShortQuestion(
                                    quizResult.NumberOfMarks, totalMarksOfQuestion,
                                    totalTimeTakenForAllQuestion);

                            }

                            var quizResultSummary = 0;
                            var userId = questionAndResult[0].UserId;

                            #region "Save current QuizResult"

                            foreach (QuizPageAndQuestionDetails quizResult in questionAndResult)
                            {
                                var currentQuizResult = new QuizResult
                                {
                                    QuestionId = quizResult.QuestionId,
                                    AnsweredInTime = quizResult.AnsweredInTime,
                                    UserAnswer = quizResult.UserAnswer,
                                    UserId = quizResult.UserId,
                                    Score = quizResult.Score,
                                    TimeTaken = quizResult.TimeTaken,
                                    IsAnsweringDone = quizResult.IsAnsweringDone
                                };

                                if (quizResult.IsPeriodicCall)
                                {
                                    //Save user answer only if this a call from the current ta.b
                                    //if (!quizResult.IsTabNotActive)
                                    //{
                                        //If it is periodic call then nly save user answer.
                                        isAnswerSavedForCurrentQue = _quizRepository.SaveAnswerOfQuestion(objQuizRoot.Quiz,
                                            currentQuizResult, true, false, false, true, userId,
                                            ref quizResultSummary);
                                        if (!isAnswerSavedForCurrentQue)
                                        {
                                            break;
                                        }
                                    //}
                                }
                                else if (!quizResult.IsPeriodicCall)
                                {
                                    if (!string.IsNullOrEmpty(quizResult.UserAnswer))
                                    {
                                        //If it is previous button click event and user answer is not null then save user answer and user time taken and userscore.
                                        isAnswerSavedForCurrentQue =
                                            _quizRepository.SaveAnswerOfQuestion(objQuizRoot.Quiz,
                                                currentQuizResult, true, true, false, true, userId,
                                                ref quizResultSummary);
                                        if (!isAnswerSavedForCurrentQue)
                                        {
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        //If it is previous button click event and user answer is null.
                                        isAnswerSavedForCurrentQue =
                                            _quizRepository.SaveAnswerOfQuestion(objQuizRoot.Quiz,
                                                currentQuizResult, true, true, false, false, userId,
                                                ref quizResultSummary);
                                        if (!isAnswerSavedForCurrentQue)
                                        {
                                            break;
                                        }
                                    }
                                }
                            }

                            #endregion
                        }
                    }
                }
            }
            return Ok(new { result = isAnswerSavedForCurrentQue });

        }


        /// <summary>
        /// Method to get previous QuizPageQuestion on click of Previous button from UI
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="questionNumber"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/previousquizpage")]
        [HttpGet]
        public IHttpActionResult GetPreviousQuizPageOfQuiz(string hiddenCode, int questionNumber)
        {
            QuizPageQuestion objPreviousQuizPage = null;

            if (!string.IsNullOrWhiteSpace(hiddenCode) && questionNumber != 0)
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (!string.IsNullOrWhiteSpace(hiddenCode) && objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                            objQuizRoot.QuizPageQuestions.ListOfQuizPages.Any())
                {
                    //Get records whose QuestionIds are not null
                    var objQuizPages = _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizRoot.QuizPageQuestions);

                    var currentQuizPage =
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.FirstOrDefault(
                            x => x.QuestionNumber == questionNumber);

                    //Get Previous QuizPageQuestion based on current QuizPageQuestion
                    objPreviousQuizPage = _quizRepository.GetPreviousQuizPageDetails(currentQuizPage, objQuizPages);

                }
            }
            return Ok(new { result = objPreviousQuizPage });
        }



        /// <summary>
        /// Method to get total number of questions in quiz.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/totalquestioncount")]
        [HttpGet]
        public IHttpActionResult GetTotalNumberOfQuestions(string hiddenCode)
        {
            var count = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    hiddenCode == objQuizRoot.Quiz.HiddenCodeForQuiz && objQuizRoot.Quiz != null && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0)
                {
                    var totalQuestions =
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Where(
                            x => x.QuestionNumber != 0 && x.QuestionIds.Any());
                    count = totalQuestions.Count();
                }
            }
            return Ok(new { result = count });
        }



        /// <summary>
        /// Method to get Total Allotted Recommended time for Quiz
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/totalallottedtime")]
        [HttpGet]
        public IHttpActionResult GetTotalAllottedTimeForQuiz(string hiddenCode)
        {
            var totalAllottedTime = 0.0;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);
                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizQuestions != null &&
                    objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0)
                {
                    totalAllottedTime = _quizRepository.CalculateTotalAllottedTimeFromRecommendedTime(objQuizRoot.QuizQuestions);
                    // CalculateTotalAllottedTimeFromRecommendedTime(objQuizRoot.QuizQuestions);
                }
            }
            return Ok(new { result = totalAllottedTime });
        }


        /// <summary>
        /// Method to set and get time remainin value. 
        /// </summary>
        /// <param name="timeRemaining"></param>
        /// <param name="setValue"></param>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/remainingtime")]
        [HttpGet]
        public IHttpActionResult SetAndGetRemainingtime(int timeRemaining, bool setValue, string hiddenCode, int userId)
        {
            var remainingTime = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode) && userId != 0)
            {
                var cachekey = "TimeRemaining-" + hiddenCode + "-" + userId;

                remainingTime = _cacheMemoryRepository.SetAndGetRemainingtime(timeRemaining, setValue, cachekey);// SetAndGetRemainingtime(timeRemaining, setValue, cachekey);
                // GlobalUtilities.StoreTimeRemaining = timeRemaining;

            }
            return Ok(new { result = remainingTime });

        }



        /// <summary>
        /// Method to set 1st question number to check whether to hide previous button or not.
        /// </summary>
        /// <param name="questionNo"></param>
        /// <param name="setValue"></param>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quiz/storefirstquestionnumber")]
        [HttpGet]
        public IHttpActionResult SetValueOfFirstQuestionToHidePreviousButton(int questionNo, bool setValue,
            string hiddenCode, int userId)
        {
            var firstQuestionNo = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode) && userId != 0)
            {
                var cacheKey = "FirstQuestionNo-" + hiddenCode + "-" + userId;
                firstQuestionNo = _cacheMemoryRepository.SetValueOfFirstQuestionToHidePreviousButton(questionNo, setValue,
                    cacheKey);//SetValueOfFirstQuestionToHidePreviousButton(questionNo, setValue, cacheKey);
            }
            return Ok(new { result = firstQuestionNo });
        }

        #endregion

        #region "ResultsPage "


        /// <summary>
        /// Method to Set timer expired value to check whether to upadte enddateb into quizresultsummary table.
        /// </summary>
        /// <param name="isTimerExpired"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/storetimerexpiredvalue")]
        [HttpGet]
        public IHttpActionResult StoreTimerExpiredvalue(bool isTimerExpired)
        {
            GlobalPath.IsTimerExpired = isTimerExpired;
            return Ok();
        }

        /// <summary>
        /// Method to get details on Result page
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <param name="prevRoutePageController"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns></returns>
        [Route("api/resultdetails")]
        [HttpGet]
        public async Task<IHttpActionResult> GetDetailsOnResultsPageLoad(string hiddenCode, int userId,
            string prevRoutePageController, int quizResultSummaryId)
        {

            ResultPageScoreDetails resultPageScoreDetail = null;
                GlobalPath.StoreTimeRemaining = 0;
                GlobalPath.FirstQuestionNo = 0;
                if (!string.IsNullOrWhiteSpace(hiddenCode))
                {
                    var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);
                    if (!string.IsNullOrEmpty(hiddenCode) && objQuizRoot != null &&
                        objQuizRoot.QuizQuestions != null &&
                        objQuizRoot.QuizQuestions.ListOfQuizQuestions.Any())
                    {

                        //Get Total Max Score for Quiz
                        var totalMaxScoreForQuiz = _quizRepository.GetTotalMaxScoreAfterQuizCompletion(hiddenCode,
                            objQuizRoot.QuizQuestions);

                        //Get Total User Score for Quiz
                        var totalUserScoreFromQuizResult = _quizRepository.GetUserScoresAfterQuizCompletion(hiddenCode, objQuizRoot.Quiz,
                            objQuizRoot.QuizQuestions, userId, quizResultSummaryId);

                        //Get Total time taken bt user for Quiz.
                        var totalUserTimetakenFromQuizResult = await _quizRepository.GetUserTimeTakenAfterQuizCompletion(objQuizRoot.Quiz,
                            objQuizRoot.QuizQuestions, userId, quizResultSummaryId);

                        if (!string.IsNullOrEmpty(prevRoutePageController) &&
                            (prevRoutePageController.Equals("QuestionPageController") ||
                             prevRoutePageController.Equals("SelfScoringQuestionPageController") ||
                             prevRoutePageController.Equals("IntroPageController") ||
                             prevRoutePageController.Equals("QuizManagerPageController") ||
                             prevRoutePageController.Equals("HomeController") ||
                             prevRoutePageController.Equals("CountDownController") ||
                             prevRoutePageController.Equals("TimerExpiredPageController")))
                        {
                            //Update QuizResultSummary to reflect completion of Quiz
                            _quizRepository.UpdateQuizResultSummaryOnQuizCompletion(objQuizRoot.Quiz,
                                totalUserScoreFromQuizResult, totalMaxScoreForQuiz, totalUserTimetakenFromQuizResult,
                                userId, quizResultSummaryId);


                            //Check to see if Quiz is actually finished, and if not, clear the EndDate which marks its completion
                            //This scenerio should not happen but this is for safety measure
                            _quizRepository.CheckQuestionBeenAnsweredAndUpdateQuizResSum(objQuizRoot.QuizQuestions, objQuizRoot.Quiz,
                                userId,
                                ref totalUserTimetakenFromQuizResult);
                        }

                        //Get attempt number of quiz.
                        var attemptNumber = _quizRepository.GetUserQuizAttemptNo(quizResultSummaryId, userId);
                        resultPageScoreDetail=new ResultPageScoreDetails();
                        
                        if (objQuizRoot.Quiz.ShowScoreAverages)
                        {
                            var medianTimeTaken = 0;
                            const int medianScore = 0;
                            var relativeRank = _quizRepository.GetRelativeRank(objQuizRoot.Quiz, objQuizRoot.Quiz.ScoreSystem,
                                totalUserScoreFromQuizResult, "score");
                            var relativeRankTime = _quizRepository.GetRelativeRank(objQuizRoot.Quiz, objQuizRoot.Quiz.ScoreSystem,
                                totalUserTimetakenFromQuizResult, "totaltimetaken");
                            var stateavrages = _quizRepository.GetStateAverages(objQuizRoot.Quiz, objQuizRoot.Quiz.ScoreSystem,
                                totalMaxScoreForQuiz, ref medianTimeTaken, medianScore, totalUserScoreFromQuizResult,
                                totalUserTimetakenFromQuizResult);

                            resultPageScoreDetail.RelativeRank = relativeRank;
                            resultPageScoreDetail.RelativeRankTimeTaken = Convert.ToInt32(relativeRankTime);
                            resultPageScoreDetail.StateAverages = stateavrages;
                            resultPageScoreDetail.StateAveragesTimeTaken = medianTimeTaken;
                        }
                        resultPageScoreDetail.YourScore = totalUserScoreFromQuizResult;
                        resultPageScoreDetail.YourScoreTimeTaken = totalUserTimetakenFromQuizResult;
                        resultPageScoreDetail.MaxScore = totalMaxScoreForQuiz;
                        resultPageScoreDetail.AttemptNumber = attemptNumber;
                    }
                }
                return Ok(new { result = resultPageScoreDetail });
           
        }


        /// <summary>
        /// Method to call to get List of details on Results Page load
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/resultlist")]
        [HttpGet]
        public IHttpActionResult GetResultsPageListOnPageLoad(string hiddenCode, int quizResultSummaryId)
        {
            ResultsPageDetailList objResultsPageDetailLists = null;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (!string.IsNullOrEmpty(hiddenCode) && quizResultSummaryId != 0 && objQuizRoot != null &&
                    objQuizRoot.QuizQuestions != null &&
                    objQuizRoot.QuizQuestions.ListOfQuizQuestions.Any() &&
                    objQuizRoot.Quiz != null)
                {
                    //Pass QuizResultSummaryId
                    objResultsPageDetailLists = _quizRepository.GetResultsPageDetailListForQuiz(objQuizRoot.QuizQuestions,
                        objQuizRoot.Quiz, quizResultSummaryId);
                }
            }
            return Ok(new { result = objResultsPageDetailLists });
        }


        #endregion

        #region "AnswerDrillPage "


        /// <summary>
        /// Call method to get first Question(s) on start of Self-Scoring Question Page
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizQuestionNo"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns></returns>
        [Route("api/answerdrilldetails")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuestionAndAnswerDetailsForAnswerDrillResultPage(string hiddenCode,
            int quizQuestionNo, int userId, int quizResultSummaryId)
        {
            List<QuizPageAndQuestionDetails> quizPageAndQuestionDetailsList = null;

            if (!string.IsNullOrWhiteSpace(hiddenCode) && quizQuestionNo != 0 && userId != 0)
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0 &&
                        objQuizRoot.QuizQuestions != null &&
                        objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0)
                {
                    //Get records whose PageQuestionId is not null
                    var objQuizPagesQuesIdNtNull =
                       _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizRoot.QuizPageQuestions);

                    if (objQuizPagesQuesIdNtNull != null && objQuizPagesQuesIdNtNull.ListOfQuizPages.Count > 0)
                    {
                        //Getting the Quizpage of Self-Scoring Question page.
                        var objQuizPage = _quizRepository.GetQuizPageOnQuestionpage(objQuizPagesQuesIdNtNull,
                            quizQuestionNo);

                        //Getting Self Scoring QuizQuestion based on QuizPageQuestion
                        var objQuizQuestions = _quizRepository.GetMatchedQuizQuestionsFromQuizPage(objQuizPage,
                            objQuizRoot.QuizQuestions);

                        if (!string.IsNullOrEmpty(QuestionAndSolutionImagePath) && objQuizQuestions != null)
                        {
                            quizPageAndQuestionDetailsList = new List<QuizPageAndQuestionDetails>();
                            //Getting result of QuizQuestion

                            #region Add questions ,result and page details in QuizPageAndQuestionDetails list.

                            foreach (var quizQuestion in objQuizQuestions.ListOfQuizQuestions)
                            {
                                var objQuizResult =
                                    _quizRepository.GetQuizResultBasedOnQuizQuestion(objQuizRoot.Quiz,
                                        quizQuestion, userId, quizResultSummaryId);

                                //Get resource if solution contains Resources.
                                var objResourceDetails =
                                    _quizRepository.GetSolutionResourceDetailsForQuestion(quizQuestion,
                                        ResourceFilePath);

                                //var quizPageAndQuestionDetails = new QuizPageAndQuestionDetails();

                                Mapper.CreateMap<QuizQuestion, QuizPageAndQuestionDetails>();
                                var quizPageAndQuestionDetails = Mapper.Map<QuizPageAndQuestionDetails>(quizQuestion);

                                quizPageAndQuestionDetails.QuestionImagePath =
                                    Path.Combine(QuestionAndSolutionImagePath,
                                        quizQuestion.QuestionImageName +
                                        ".png");
                                quizPageAndQuestionDetails.SolutionImagePath =
                                    Path.Combine(QuestionAndSolutionImagePath,
                                        quizQuestion.SolutionImageName +
                                        ".png");
                                //quizPageAndQuestionDetails.CorrectAnswer =
                                //    quizQuestion.CorrectAnswer;
                                //quizPageAndQuestionDetails.QuestionImageHeightPx =
                                //    quizQuestion.QuestionImageHeightPx;
                                //quizPageAndQuestionDetails.QuestionImageWidthPx =
                                //    quizQuestion.QuestionImageWidthPx;
                                //quizPageAndQuestionDetails.NumberOfMarks =
                                //    quizQuestion.NumberOfMarks;
                                //quizPageAndQuestionDetails.NoOfAnswersRequired =
                                //    quizQuestion.NoOfAnswersRequired;
                                //quizPageAndQuestionDetails.PossibleAnswers =
                                //    quizQuestion.PossibleAnswers;
                                //quizPageAndQuestionDetails.QuestionId = quizQuestion.QuestionId;
                                //quizPageAndQuestionDetails.QuestionImagePath =
                                //    Path.Combine(QuestionAndSolutionImagePath,
                                //        quizQuestion.QuestionImageName + ".png");
                                //quizPageAndQuestionDetails.QuestionType = quizQuestion.QuestionType;
                                //quizPageAndQuestionDetails.TimeToAnswer = quizQuestion.TimeToAnswer;
                                //quizPageAndQuestionDetails.SolutionId = quizQuestion.SolutionId;
                                //quizPageAndQuestionDetails.SolutionImageHeightPx =
                                //    quizQuestion.SolutionImageHeightPx;
                                //quizPageAndQuestionDetails.SolutionImagePath =
                                //    Path.Combine(QuestionAndSolutionImagePath,
                                //        quizQuestion.SolutionImageName + ".png");
                                //quizPageAndQuestionDetails.SolutionImageRequiredScaling =
                                //    quizQuestion.SolutionImageRequiredScaling;
                                //quizPageAndQuestionDetails.SolutionResourceId =
                                //    quizQuestion.SolutionResourceId;
                                //quizPageAndQuestionDetails.SolutionResourceTitle =
                                //    quizQuestion.SolutionResourceTitle;
                                //quizPageAndQuestionDetails.IndentPx = quizQuestion.IndentPX;

                                //If question details are not null then assign them to class.
                                if (objQuizResult != null)
                                {
                                    quizPageAndQuestionDetails.UserAnswer = objQuizResult.UserAnswer;
                                    quizPageAndQuestionDetails.TimeTaken = objQuizResult.TimeTaken;
                                    quizPageAndQuestionDetails.UserId = objQuizResult.UserId;
                                    quizPageAndQuestionDetails.AnsweredInTime =
                                        objQuizResult.AnsweredInTime;
                                    quizPageAndQuestionDetails.Score = objQuizResult.Score;
                                }
                                //quizPageAndQuestionDetails.WriteSolutionInSpecificLocationMessage =
                                //    quizQuestion.WriteSolutionInSpecificLocationMessage;
                                //quizPageAndQuestionDetails.SolutionResourceTitle =
                                //    quizQuestion.SolutionResourceTitle;


                                //If resource details are not null then add them to class.
                                if (objResourceDetails != null)
                                {
                                    var splittedFiles = objResourceDetails.FileNames.Split('|');
                                    var resourceLength = splittedFiles.Count();
                                    quizPageAndQuestionDetails.AudioVideoImagePath =
                                        new string[resourceLength - 1];

                                    for (var j = 0; j < resourceLength - 1; j++)
                                    {
                                        //Video link from the path specified.
                                        if (objResourceDetails.MediaHandlerId == 4)
                                        {
                                            quizPageAndQuestionDetails.AudioVideoImagePath[j] =
                                                Path.Combine(_stringConstant.PathForFormsFolder,
                                                    _stringConstant.AppWriteWebReadFolderPath,
                                                    _stringConstant.AppWriteWebReadResourceDataFolderPath,
                                                    splittedFiles[j]);
                                        }
                                        //Vidoe link from youtube.
                                        else if (objResourceDetails.MediaHandlerId == 5)
                                        {
                                            quizPageAndQuestionDetails.AudioVideoImagePath[j] =
                                                splittedFiles[j];
                                        }
                                    }

                                    quizPageAndQuestionDetails.SolutionResourceId =
                                        objResourceDetails.Id;
                                    quizPageAndQuestionDetails.URL = objResourceDetails.URL;
                                    quizPageAndQuestionDetails.FileNames =
                                        objResourceDetails.FileNames;
                                    quizPageAndQuestionDetails.Description =
                                        objResourceDetails.Description;
                                    quizPageAndQuestionDetails.ShortDescription =
                                        objResourceDetails.ShortDescription;
                                }

                                quizPageAndQuestionDetailsList.Add(quizPageAndQuestionDetails);


                            }

                            //if (quizPageAndQuestionDetailsList.Count > 0 &&
                            //    quizPageAndQuestionDetailsList.Any())
                            //{
                            //    return Ok(new { result = quizPageAndQuestionDetailsList });
                            //}

                            #endregion


                        }

                    }
                }
            }

            return Ok(new { result = quizPageAndQuestionDetailsList });
        }


        #endregion

        #region "QuizManager "

        /// <summary>
        /// Method to get list details on Quiz Manager Page
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quizmanagerdetails")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuizDetailListForQuizManagerPage(string hiddenCode, int userId)
        {
            List<QuizManagerDetail> objQuizManagerDetailList = null;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);
                if (!string.IsNullOrWhiteSpace(hiddenCode) && userId != 0 && objQuizRoot != null &&
                    objQuizRoot.Quiz != null)
                {
                    //Get Active Quiz List for a user
                    var objQuizDefineList = await _quizRepository.GetListOfActiveQuizzes(userId);

                    //Get QuizResultSummary details based on active quiz list and userId
                    if (objQuizDefineList != null && objQuizDefineList.Any())
                    {
                        objQuizManagerDetailList = await _quizRepository.GetQuizManagerDetailList(objQuizRoot.Quiz, objQuizDefineList,
                            userId);
                    }
                }
            }
            return Ok(objQuizManagerDetailList);

        }

        #endregion

        #region "SelfScoringIntroPage "



        /// <summary>
        /// Method to get Total Time timaken by user for to complete Quiz
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns></returns>
        [Route("api/totaltimetakenbyuser")]
        [HttpGet]
        public async Task<IHttpActionResult> GetTotalTimeTakenByUser(string hiddenCode, int userId, int quizResultSummaryId)
        {
            var totalUserTimetakenFromQuizResult = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null &&
                    objQuizRoot.Quiz != null &&
                    objQuizRoot.QuizQuestions != null &&
                    objQuizRoot.QuizQuestions.ListOfQuizQuestions.Any() &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode)
                {
                    //Get Total time taken bt user for Quiz.
                    totalUserTimetakenFromQuizResult = await _quizRepository.GetUserTimeTakenAfterQuizCompletion(objQuizRoot.Quiz,
                        objQuizRoot.QuizQuestions, userId, quizResultSummaryId);//GetUserTimeTakenAfterQuizCompletion(objQuizRoot.Quiz,
                    //objQuizRoot.QuizQuestions, userId, quizResultSummaryId);
                }
            }
            return Ok(new { result = totalUserTimetakenFromQuizResult });
        }



        /// <summary>
        /// Method to get Self Scoring Question count 
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/selfscoringquestionscount")]
        [HttpGet]
        public async Task<IHttpActionResult> GetSelfScoringQuestionsCount(string hiddenCode, int quizResultSummaryId)
        {
            GlobalPath.StoreTimeRemaining = 0;
            var totalNumberOfshortAnswerQuestions = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode) &&
                quizResultSummaryId != 0)
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null &&
                    objQuizRoot.QuizPageQuestions != null &&
                    objQuizRoot.QuizPageQuestions.ListOfQuizPages.Any() &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode)
                {
                    //Get Total number of question type 2.
                    totalNumberOfshortAnswerQuestions = await _quizRepository.GetSelfScoringQuestionsCount(objQuizRoot.Quiz,
                        objQuizRoot.QuizQuestions, objQuizRoot.QuizPageQuestions, quizResultSummaryId);//GetSelfScoringQuestionsCount(objQuizRoot.Quiz,
                    //objQuizRoot.QuizQuestions, objQuizRoot.QuizPageQuestions, quizResultSummaryId);

                }
            }
            return Ok(new { result = totalNumberOfshortAnswerQuestions });

        }


        /// <summary>
        /// Method to get Self Scoring Question No for Self Scoring Question page.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/firstselfscoringquestionno")]
        [HttpGet]
        public async Task<IHttpActionResult> GetFirstSelfScoringQuestionNo(string hiddenCode, int userId)
        {
            QuizPageQuestion objQuizPage = null;
            GlobalPath.FirstQuestionNo = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                //Get xml data from cache memory.
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0 &&
                        objQuizRoot.QuizQuestions != null &&
                        objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0)
                {
                    //Get Quiz Pages to self score.
                    var objQuizPages = _quizRepository.
                        CheckQuizPagesHaveSelfScoringPageType(objQuizRoot.QuizPageQuestions,
                            objQuizRoot.QuizQuestions);

                    //Get records whose PageQuestionId is not null
                    var objQuizPagesQuesIdNtNull = _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizPages);

                    if (objQuizPagesQuesIdNtNull != null && objQuizPagesQuesIdNtNull.ListOfQuizPages.Count > 0)
                    {
                        //Getting first question no of Self-Scoring question page.
                        objQuizPage = await _quizRepository.GetFirstQuestionNoOnSelfScoringPageLoad(objQuizRoot.Quiz, userId,
                           objQuizRoot.QuizPageQuestions, objQuizRoot.QuizQuestions);
                    }
                }
            }
            return Ok(new { result = objQuizPage });
        }

        #endregion

        #region "SelfScoringQuestionPage "


        /// <summary>
        /// Call method to get first Question(s) on start of Self-Scoring Question Page
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizQuestionNo"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/questionforselfscoringquestionpage")]
        [HttpGet]
        public IHttpActionResult GetQuestionForSelfScoringQuestionPage(string hiddenCode, int quizQuestionNo, int userId)
        {
            List<QuizPageAndQuestionDetails> quizPageAndQuestionDetailsList = null;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                if (quizQuestionNo != 0 && userId != 0)
                {
                    var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                    if (objQuizRoot != null && objQuizRoot.Quiz != null &&
                        objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Any() &&
                        objQuizRoot.QuizQuestions != null &&
                        objQuizRoot.QuizQuestions.ListOfQuizQuestions.Any())
                    {
                        //Get Quiz Pages with PageType=7 are there
                        var objQuizPages =
                            _quizRepository.CheckQuizPagesHaveSelfScoringPageType(objQuizRoot.QuizPageQuestions,
                                objQuizRoot.QuizQuestions);

                        //Get records whose PageQuestionId is not null
                        var objQuizPagesQuesIdNtNull = _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizPages);

                        if (objQuizPagesQuesIdNtNull != null && objQuizPagesQuesIdNtNull.ListOfQuizPages.Any())
                        {
                            //Getting the Quizpage of Self-Scoring Question page.
                            var objQuizPage = _quizRepository.GetSelfScoringQuizPageBasedOnQuestionNo(objQuizPagesQuesIdNtNull,
                                quizQuestionNo);

                            //Getting Self Scoring QuizQuestion based on QuizPageQuestion
                            var objQuizQuestions = _quizRepository.GetMatchedQuizQuestionsFromQuizPage(objQuizPage,
                                objQuizRoot.QuizQuestions);

                            if (!string.IsNullOrWhiteSpace(QuestionAndSolutionImagePath))
                            {
                                if (objQuizQuestions != null && objQuizQuestions.ListOfQuizQuestions != null &&
                                    objQuizQuestions.ListOfQuizQuestions.Count > 0)
                                {
                                    //Getting result of QuizQuestion
                                    var objQuizResultList =
                                        objQuizQuestions.ListOfQuizQuestions.Select(
                                            objQuizQuestion =>
                                                _quizRepository.GetQuizResultBasedOnQuizQuestion(objQuizRoot.Quiz,
                                                    objQuizQuestion, userId))
                                            .Where(objQuizResult => objQuizResult != null)
                                            .ToList();

                                    #region Add questions ,result and page details in QuizPageAndQuestionDetails list

                                    if (objQuizResultList.Count > 0 && objQuizResultList.Any() &&
                                        objQuizPage != null)
                                    {
                                        var length = objQuizQuestions.ListOfQuizQuestions.Count;
                                        quizPageAndQuestionDetailsList = new List<QuizPageAndQuestionDetails>();
                                        for (var i = 0; i < length; i++)
                                        {
                                            //Call method to get Resource if solution is in audio or video format.
                                            var objResourceDetails =
                                                _quizRepository.GetSolutionResourceDetailsForQuestion(
                                                    objQuizQuestions.ListOfQuizQuestions[i], ResourceFilePath);

                                            // var quizPageAndQuestionDetails = new QuizPageAndQuestionDetails();

                                            Mapper.CreateMap<QuizQuestion, QuizPageAndQuestionDetails>();
                                            var quizPageAndQuestionDetails = Mapper.Map<QuizPageAndQuestionDetails>(objQuizQuestions.ListOfQuizQuestions[i]);

                                            quizPageAndQuestionDetails.QuestionImagePath =
                                                Path.Combine(QuestionAndSolutionImagePath,
                                                   objQuizQuestions.ListOfQuizQuestions[i].QuestionImageName +
                                                    ".png");
                                            quizPageAndQuestionDetails.SolutionImagePath =
                                                Path.Combine(QuestionAndSolutionImagePath,
                                                    objQuizQuestions.ListOfQuizQuestions[i].SolutionImageName +
                                                    ".png");
                                            //quizPageAndQuestionDetails.CorrectAnswer =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].CorrectAnswer;
                                            //quizPageAndQuestionDetails.QuestionImageHeightPx =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].QuestionImageHeightPx;
                                            //quizPageAndQuestionDetails.QuestionImageWidthPx =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].QuestionImageWidthPx;
                                            //quizPageAndQuestionDetails.NumberOfMarks =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].NumberOfMarks;
                                            //quizPageAndQuestionDetails.NoOfAnswersRequired =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].NoOfAnswersRequired;
                                            //quizPageAndQuestionDetails.PossibleAnswers =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].PossibleAnswers;
                                            //quizPageAndQuestionDetails.QuestionId =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].QuestionId;
                                            //quizPageAndQuestionDetails.QuestionImagePath =
                                            //    Path.Combine(QuestionAndSolutionImagePath,
                                            //        objQuizQuestions.ListOfQuizQuestions[i].QuestionImageName +
                                            //        ".png");
                                            //quizPageAndQuestionDetails.QuestionType =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].QuestionType;
                                            //quizPageAndQuestionDetails.TimeToAnswer =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].TimeToAnswer;
                                            //quizPageAndQuestionDetails.SolutionId =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].SolutionId;
                                            //quizPageAndQuestionDetails.SolutionImageHeightPx =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].SolutionImageHeightPx;
                                            //quizPageAndQuestionDetails.SolutionImagePath =
                                            //    Path.Combine(QuestionAndSolutionImagePath,
                                            //        objQuizQuestions.ListOfQuizQuestions[i].SolutionImageName +
                                            //        ".png");
                                            //quizPageAndQuestionDetails.SolutionImageRequiredScaling =
                                            //    objQuizQuestions.ListOfQuizQuestions[i]
                                            //        .SolutionImageRequiredScaling;
                                            //quizPageAndQuestionDetails.SolutionResourceId =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].SolutionResourceId;
                                            //quizPageAndQuestionDetails.SolutionResourceTitle =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].SolutionResourceTitle;
                                            quizPageAndQuestionDetails.UserAnswer =
                                                objQuizResultList[i].UserAnswer;
                                            quizPageAndQuestionDetails.TimeTaken =
                                               objQuizResultList[i].TimeTaken;
                                            quizPageAndQuestionDetails.UserId = objQuizResultList[i].UserId;
                                            quizPageAndQuestionDetails.AnsweredInTime =
                                                objQuizResultList[i].AnsweredInTime;
                                            quizPageAndQuestionDetails.Score = objQuizResultList[i].Score;
                                            //quizPageAndQuestionDetails.WriteSolutionInSpecificLocationMessage =
                                            //    objQuizQuestions.ListOfQuizQuestions[i]
                                            //        .WriteSolutionInSpecificLocationMessage;
                                            //quizPageAndQuestionDetails.SolutionResourceTitle =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].SolutionResourceTitle;
                                            quizPageAndQuestionDetails.AnsweredInTime =
                                                objQuizResultList[i].AnsweredInTime;
                                            //quizPageAndQuestionDetails.IndentPx =
                                            //    objQuizQuestions.ListOfQuizQuestions[i].IndentPX;

                                            //If resource details are not null then add them to class.
                                            if (objResourceDetails != null)
                                            {
                                                var splittedFiles = objResourceDetails.FileNames.Split('|');
                                                var resourceLength = splittedFiles.Count();
                                                quizPageAndQuestionDetails.AudioVideoImagePath =
                                                    new string[resourceLength - 1];

                                                for (var j = 0; j < resourceLength - 1; j++)
                                                {
                                                    //Video link from the path specified.
                                                    if (objResourceDetails.MediaHandlerId == 4)
                                                    {
                                                        quizPageAndQuestionDetails.AudioVideoImagePath[j] =
                                                            Path.Combine(_stringConstant.PathForFormsFolder,
                                                                _stringConstant.AppWriteWebReadFolderPath,
                                                                _stringConstant
                                                                    .AppWriteWebReadResourceDataFolderPath,
                                                                splittedFiles[j]);

                                                        //    quizPageAndQuestionDetails.AudioVideoImagePath[i]="http://localhost/forms/Data/AppWriteWebRead\\ResourceData\\Part 1.mp4";
                                                    }
                                                    //Vidoe link from youtube.
                                                    else if (objResourceDetails.MediaHandlerId == 5)
                                                    {
                                                        quizPageAndQuestionDetails.AudioVideoImagePath[j] =
                                                            splittedFiles[j];
                                                    }

                                                }

                                                quizPageAndQuestionDetails.SolutionResourceId =
                                                    objResourceDetails.Id;
                                                quizPageAndQuestionDetails.URL = objResourceDetails.URL;
                                                quizPageAndQuestionDetails.FileNames =
                                                    objResourceDetails.FileNames;
                                                quizPageAndQuestionDetails.Description =
                                                    objResourceDetails.Description;
                                                quizPageAndQuestionDetails.ShortDescription =
                                                    objResourceDetails.ShortDescription;
                                            }

                                            quizPageAndQuestionDetailsList.Add(quizPageAndQuestionDetails);
                                        }
                                    }

                                    #endregion
                                }

                            }

                        }
                    }
                }
            }
            return Ok(new { result = quizPageAndQuestionDetailsList });
        }

        //
        /// <summary>
        /// Method to get next QuizPageQuestion on click of Next button for Self-Scoring Question Page
        /// </summary>
        /// <param name="questionAndResult"></param>
        /// <returns>IHttpActionResult</returns>

        [Route("api/nextquizpageofselfscoringquestion")]
        [HttpPost]
        public async Task<IHttpActionResult> GetNextQuizPageOfSelfScoringQuestion(List<QuizPageAndQuestionDetails> questionAndResult)
        {
            var quizResultSummary = 0;
            var nextQuestionNo = 0;

            if (questionAndResult.Count > 0 && questionAndResult.Any())
            {
                var userId = questionAndResult[0].UserId;
                var quizQuestionNo = questionAndResult[0].QuestionNumber;
                var hiddenCode = questionAndResult[0].HiddenCodeForQuiz;

                if (!string.IsNullOrWhiteSpace(hiddenCode))
                {
                    var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                    if (objQuizRoot != null && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0)
                    {
                        //Save user score for short answer question.

                        #region "Save current QuizResult"

                        foreach (var currentQuizResult in questionAndResult.Select(quizResult => new QuizResult
                        {
                            QuestionId = quizResult.QuestionId,
                            AnsweredInTime = quizResult.AnsweredInTime,
                            UserAnswer = quizResult.UserAnswer,
                            UserId = quizResult.UserId,
                            Score = quizResult.Score,
                            //TimeTaken = quizResult.TimeTaken
                        }))
                        {
                            var isAnswerSavedForCurrentQue = _quizRepository.SaveAnswerOfQuestion(objQuizRoot.Quiz,
                                currentQuizResult, false,
                                true, false, false,
                                userId, ref quizResultSummary);
                            if (!isAnswerSavedForCurrentQue)
                            {
                                break;
                            }
                        }

                        #endregion

                        //Get Next Question based on current Question.
                        nextQuestionNo = await _quizRepository.GetNextQuestionNumberForSelfScoringQuestionPage(objQuizRoot.Quiz,
                            objQuizRoot.QuizQuestions, objQuizRoot.QuizPageQuestions, quizResultSummary,
                            quizQuestionNo);

                        //if (nextQuestionNo != 0)
                        //{
                        //    return Ok(new { result = nextQuestionNo });
                        //}

                    }
                }
            }
            return Ok(new { result = nextQuestionNo });
        }


        /// <summary>
        /// Method to get previous QuizPageQuestion on click of Previous button for Self-Scoring Question Page
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizQuestionNo"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/previousquizpageofselfscoringquestion")]
        [HttpGet]
        public IHttpActionResult GetPreviousQuizPageOfSelfScoringQuestion(string hiddenCode, int quizQuestionNo,
            int userId)
        {
            var objPreviousQuizPage = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode) && quizQuestionNo != 0 &&
                userId != 0)
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (quizQuestionNo != 0 && objQuizRoot != null &&
                    objQuizRoot.Quiz != null &&
                    objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode && objQuizRoot.QuizPageQuestions != null &&
                        objQuizRoot.QuizPageQuestions.ListOfQuizPages.Any())
                {
                    //Get Previous QuizPageQuestion based on current QuizPageQuestion
                    objPreviousQuizPage = _quizRepository.GetPreviousQuestionNumberForSelfScoringQuestionPage(
                        quizQuestionNo, objQuizRoot.QuizQuestions, objQuizRoot.QuizPageQuestions);

                }
            }
            return Ok(new { result = objPreviousQuizPage });
        }

        #endregion

        #region "SaveAndPausedPage "


        /// <summary>
        /// Method to get QuizResultSummaryId of a Resumed Quiz for QuizQuestion 
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [Route("api/checkifquizquestionpageissaveandpausedbyuser")]
        [HttpGet]
        public async Task<IHttpActionResult> CheckIfQuizQuestionPageIsSaveAndPausedByUser(string hiddenCode, int userId)
        {
            var objResumedQuizResultSummaryId = 0;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (userId != 0 && objQuizRoot != null &&
                    objQuizRoot.Quiz != null && objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode)
                {
                    objResumedQuizResultSummaryId = await _quizRepository.GetQuizResultSummaryIdForResumedQuiz(objQuizRoot.Quiz,
                         userId);
                }
            }
            return Ok(new { result = objResumedQuizResultSummaryId });
        }


        /// <summary>
        /// Method to check if Self Scoring Questions are resumed by user
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/checkifselfscoringquestionissaveandpausedbyuser")]
        [HttpGet]
        public async Task<IHttpActionResult> CheckIfSelfScoringQuestionIsSaveAndPausedByUser(string hiddenCode, int userId)
        {
            var isSelfScoringQuestionPaused = false;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (userId != 0 && objQuizRoot != null &&
                    objQuizRoot.Quiz != null && objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode)
                {
                    var objResumedQuizResultSummaryId = await _quizRepository.GetQuizResultSummaryIdForResumedQuiz(objQuizRoot.Quiz,
                        userId);

                    isSelfScoringQuestionPaused = await _quizRepository.CheckScoreGivenToSelfScoringQuestionsForResumeQuiz(userId,
                        objResumedQuizResultSummaryId);

                }
            }

            return Ok(new { result = isSelfScoringQuestionPaused });

        }

        //Method to get QuizQuestion and QuizPageQuestion - Quiz resumed for Questions
        /// <summary>
        /// 
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="userId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/quizpagetoresumequiz")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuizPageQuestionToResumeQuiz(string hiddenCode, int userId)
        {
            QuizPageQuestion objQuizPageQuestions = null;
            GlobalPath.IsTimerExpired = false;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (userId != 0 && objQuizRoot != null &&
                    objQuizRoot.Quiz != null && objQuizRoot.Quiz.HiddenCodeForQuiz == hiddenCode &&
                    objQuizRoot.QuizQuestions != null &&
                    objQuizRoot.QuizQuestions.ListOfQuizQuestions.Count > 0 &&
                    objQuizRoot.QuizPageQuestions != null &&
                    objQuizRoot.QuizPageQuestions.ListOfQuizPages.Count > 0)
                {
                    var objResumedQuizResultSummaryId = await _quizRepository.GetQuizResultSummaryIdForResumedQuiz(objQuizRoot.Quiz,
                        userId);

                    if (objResumedQuizResultSummaryId != 0)
                    {
                        objQuizPageQuestions = await _quizRepository.GetQuizQuestionForResumeQuiz(objResumedQuizResultSummaryId,
                           objQuizRoot.QuizPageQuestions, objQuizRoot.Quiz);
                    }
                }
            }
            return Ok(new { result = objQuizPageQuestions });
        }

        #endregion

        #region "SelScoringIntroPage after timer gets expired for short answer question"


        /// <summary>
        /// Method to get question number of short answer question afetr timer got expired.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/questionnotoselfscoreaftertimerexpired")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuestionNoToSelfScoreAfterTimerExpired(string hiddenCode, int quizResultSummaryId)
        {
            var isTimerExpired = false;
            if (!string.IsNullOrWhiteSpace(hiddenCode))
            {
                var objQuizRoot = _quizRepository.GetXmlFileDataFromCacheMemory(hiddenCode);

                if (quizResultSummaryId != 0
                    && objQuizRoot != null && objQuizRoot.Quiz != null
                    && objQuizRoot.QuizQuestions != null
                    && objQuizRoot.QuizQuestions.ListOfQuizQuestions.Any())
                {
                    isTimerExpired = await _quizRepository.GetQuestionNoToSelfScoreAfterTimerExpired(hiddenCode,
                       objQuizRoot.Quiz.Id,
                       quizResultSummaryId, objQuizRoot.QuizQuestions);
                }
            }

            return Ok(new { result = isTimerExpired });
        }

        #endregion


        #endregion


        /// <summary>
        /// Method to deserialise EventData XML file of Quiz based on passed hiddencode value.
        /// </summary>
        /// <param name="strQuizFilePath"></param>
        /// <returns>QuizRoot</returns>
        //public QuizRoot GetQuizEventDataXmlData(string strQuizFilePath)
        //{
        //    try
        //    {
        //        var eventData = _quizRepository.GetQuizEventDataXmlData(strQuizFilePath);
        //        return eventData;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizEventDataXmlData");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to check whether the Xml file has been modified.
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>bool</returns>
        //public bool CheckModifiedTimeStampOfXmlFileForQuiz(string xmlFilePath, string hiddenCode)
        //{
        //    try
        //    {
        //        var response = _quizRepository.CheckModifiedTimeStampOfXmlFileForQuiz(xmlFilePath, hiddenCode);
        //        return response;

        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckModifiedTimeStampOfXmlFileForQuiz");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to read data from XMl file and load it into cache memory.
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>QuizRoot</returns>
        //public QuizRoot SetAndGetQuizXmlFileDataIntoCacheMemory(string xmlFilePath, string hiddenCode)
        //{
        //    try
        //    {
        //        var resources = _quizRepository.SetAndGetQuizXmlFileDataIntoCacheMemory(xmlFilePath, hiddenCode);
        //        return resources;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : SetAndGetResourceDataIntoCacheMemory");
        //        throw;
        //    }
        //    return null;
        //}


        /// <summary>
        /// Method to get XMl file data from cache memory.
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>QuizRoot</returns>
        //public QuizRoot GetXmlFileDataFromCacheMemory(string xmlFilePath, string hiddenCode)
        //{
        //    try
        //    {
        //        var quizroot = _quizRepository.GetXmlFileDataFromCacheMemory(xmlFilePath, hiddenCode);
        //        return quizroot;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetXmlFileDataFromCacheMemory");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to check if QuizPageQuestions is not null and have some record
        /// </summary>
        /// <param name="quizRoot"></param>
        /// <returns></returns>
        //public bool CheckQuizPagesNotNull(QuizRoot quizRoot)
        //{
        //    try
        //    {
        //        var isQuizPagesNotNull = _quizRepository.CheckQuizPagesNotNull(quizRoot);
        //        return isQuizPagesNotNull;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuizPagesNotNull");
        //        throw;
        //    }
        //}

        #region "IntroPage "


        /// <summary>
        /// Method to get Quiz details which contains Intro page messages
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        //public Quiz GetQuizDetails(Quiz quiz, QuizPageQuestions quizPageQuestions, int userId)
        //{
        //    try
        //    {
        //        var quizPage = _quizRepository.GetQuizDetails(quiz, quizPageQuestions, userId);
        //        return quizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizPageWithPageType1");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to check if PageType=1 details is not null
        /// </summary>
        /// <param name="quiz"></param>
        /// <returns>bool</returns>
        //public bool CheckQuizPageDetailsOfPageType1NotNull(Quiz quiz)
        //{
        //    try
        //    {
        //        var isQuizPageOfPgType1NotNull = _quizRepository.CheckQuizOpeningMessageNotNull(quiz);
        //        return isQuizPageOfPgType1NotNull;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuizPageDetailsOfPageType1NotNull");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to call Initalise Quiz for DB transaction of insert in QuizDefine and QuizCompilation tables
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        //public void InitiateQuizDefine(Quiz quiz, QuizQuestions quizQuestions, int userId)
        //{
        //    try
        //    {
        //        _quizRepository.InitiateQuizDefine(quiz, userId);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : InitiateQuizDefine");
        //        throw;
        //    }
        //}

        #endregion

        #region "QuestionPage "


        /// <summary>
        /// Method to insert values in QuizResultSummary table while Quiz is initiated
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        //public void InitializeQuizResultSummaryAndQuizCompilation(Quiz quiz, QuizPageQuestions quizPageQuestions,
        //    QuizQuestions quizQuestions, int userId, ref int quizResultSummaryId)
        //{
        //    try
        //    {
        //        _quizRepository.InitializeQuizResultSummaryAndQuizCompilation(quiz, quizPageQuestions, quizQuestions,
        //            userId, ref quizResultSummaryId);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : InitiateQuizDefine");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get QuizPageQuestion based on pageno for Question page
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizPageNo"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetQuizPageOnQuestionpage(QuizPageQuestions quizPageQuestions, int quizPageNo)
        //{
        //    try
        //    {
        //        var objQuizPage = _quizRepository.GetQuizPageOnQuestionpage(quizPageQuestions, quizPageNo);
        //        return objQuizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController: GetFirstQuestionNumberToLoadOnQuestionPage");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method for to calculate user score for multiple choice question.
        /// </summary>
        /// <param name="questionAndResult"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>int</returns>
        //public int CalculateMultipleChioceAnswerQuestionsScore(List<QuizPageAndQuestionDetails> questionAndResult,
        //    QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var userScore = _quizRepository.CalculateMultipleChioceAnswerQuestionsScore(questionAndResult,
        //            quizQuestions);
        //        return userScore;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController: GetFirstQuestionNumberToLoadOnQuestionPage");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get first page of Quiz i.e QuizPage 
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetFirstQuestionNumberToLoadOnQuestionPage(QuizPageQuestions quizPageQuestions)
        //{
        //    try
        //    {
        //        var objQuizPage = _quizRepository.GetFirstQuestionNumberToLoadOnQuestionPage(quizPageQuestions);
        //        return objQuizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController: GetFirstQuestionNumberToLoadOnQuestionPage");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to check if QuizPageQuestions does not have PageQuestionId value as null 
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestions</returns>
        //public QuizPageQuestions CheckQuizPagesHavePageQuestionId(QuizPageQuestions quizPageQuestions)
        //{
        //    try
        //    {
        //        var objQuizPages = _quizRepository.CheckQuizPagesHavePageQuestionId(quizPageQuestions);
        //        return objQuizPages;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuizPagesHavePageQuestionId");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get QuizQuestions by mapping QuestionId with PageQuestionId for QuizPageQuestion - PageType=2
        /// </summary>
        /// <param name="currentQuizPagesQuestion"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizQuestions</returns>
        //public QuizQuestions GetMatchedQuizQuestionsFromQuizPage(QuizPageQuestion currentQuizPagesQuestion,
        //    QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var objQuizQuestions = _quizRepository.GetMatchedQuizQuestionsFromQuizPage(currentQuizPagesQuestion,
        //            quizQuestions);
        //        return objQuizQuestions;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetMatchedQuizQuestionsFromQuizPage");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to calculate recommended time based on TimeAllotted for particular QuizQuestion
        /// </summary>
        /// <param name="timeAllotted"></param>
        /// <returns>float</returns>
        public float CalculateRecommendedTimeForQuizQuestion(float timeAllotted)
        {
            try
            {
                var recommendedTime = _quizRepository.CalculateRecommendedTimeForQuizQuestion(timeAllotted);
                return recommendedTime;
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "QuizController : CalculateRecommendedTimeForQuizQuestion");
                throw;
            }
        }


        /// <summary>
        /// Method to calculate total allottedtime based on recommended time
        /// </summary>
        /// <param name="quizQuestions"></param>
        /// <returns>float</returns>
        //public float CalculateTotalAllottedTimeFromRecommendedTime(QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var totalAllottedTime = _quizRepository.CalculateTotalAllottedTimeFromRecommendedTime(quizQuestions);
        //        return totalAllottedTime;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetTotalAllottedTimeFromRecommendedTime");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get next QuizPageQuestion details based on current QuizPageQuestion details
        /// </summary>
        /// <param name="currentQuizPageQuestion"></param>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetNextQuizPageDetails(QuizPageQuestion currentQuizPageQuestion,
        //    QuizPageQuestions quizPageQuestions)
        //{
        //    try
        //    {
        //        var objNextQuizPage = _quizRepository.GetNextQuizPageDetails(currentQuizPageQuestion, quizPageQuestions);
        //        return objNextQuizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetNextQuizPageDetails");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get previous QuizPageQuestion details based on current QuizPageQuestion details
        /// </summary>
        /// <param name="currentQuizPageQuestion"></param>
        /// <param name="quizPageQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetPreviousQuizPageDetails(QuizPageQuestion currentQuizPageQuestion,
        //    QuizPageQuestions quizPageQuestions)
        //{
        //    try
        //    {
        //        var objPreviousQuizPage = _quizRepository.GetPreviousQuizPageDetails(currentQuizPageQuestion,
        //            quizPageQuestions);
        //        return objPreviousQuizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetPreviousQuizPageDetails");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to save Answer for a Question
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="currentQuizResult"></param>
        /// <param name="setAnswer"></param>
        /// <param name="setScore"></param>
        /// <param name="setIsAnsweringDone"></param>
        /// <param name="setTime"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummary"></param>
        /// <returns>bool</returns>
        //public bool SaveAnswerOfQuestion(Quiz quiz, QuizResult currentQuizResult, bool setAnswer, bool setScore,
        //    bool setIsAnsweringDone, bool setTime, int userId, ref int quizResultSummary)
        //{
        //    try
        //    {
        //        var isAnswerSaved = _quizRepository.SaveAnswerOfQuestion(quiz, currentQuizResult, setAnswer, setScore,
        //            setIsAnsweringDone, setTime, userId, ref quizResultSummary);
        //        return isAnswerSaved;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : SaveAnswerOfQuestion");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get QuizResult based on QuizQuestion 
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="currentQuizQuestion"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>QuizResult</returns>
        //public QuizResult GetQuizResultBasedOnQuizQuestion(Quiz quiz, QuizQuestion currentQuizQuestion, int userId,
        //    [Optional] int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var objQuizResult = _quizRepository.GetQuizResultBasedOnQuizQuestion(quiz, currentQuizQuestion, userId,
        //            quizResultSummaryId);
        //        return objQuizResult;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizResultBasedOnQuizQuestion");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get arbitarily time spend when page contains multiple short answer
        /// </summary>
        /// <param name="marksOfQuestion"></param>
        /// <param name="totalMarksOfQuestion"></param>
        /// <param name="totalTimeTakenForAllQueOfPage"></param>
        /// <returns>double</returns>
        //public double CalculateTimeSpendForMultiShortQuestion(float marksOfQuestion, float totalMarksOfQuestion,
        //    float totalTimeTakenForAllQueOfPage)
        //{
        //    try
        //    {
        //        var resTimeSpent = _quizRepository.CalculateTimeSpendForMultiShortQuestion(marksOfQuestion,
        //            totalMarksOfQuestion, totalTimeTakenForAllQueOfPage);
        //        return resTimeSpent;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CalculateTimeSpendForMultiShortQuestion");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get and set time remaining.
        /// </summary>
        /// <param name="timeRemaining"></param>
        /// <param name="setValue"></param>
        /// <param name="cacheKey"></param>
        /// <returns></returns>
        //public int SetAndGetRemainingtime(int timeRemaining, bool setValue, string cacheKey)
        //{
        //    try
        //    {
        //        var remainingTime = _quizRepository.SetAndGetRemainingtime(timeRemaining, setValue, cacheKey);
        //        return remainingTime;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : SetAndGetRemainingtime");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to set 1st question number to hide the previous button.
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
        //            var preQuestionNo = _quizRepository.SetValueOfFirstQuestionToHidePreviousButton(questionNo, setValue,
        //                cacheKey);
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
        /// Method to call Relative Rank
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="iScoreSystem"></param>
        /// <param name="score"></param>
        /// <param name="strFieldName"></param>
        /// <returns>double</returns>
        //public double GetRelativeRank(Quiz quiz, int iScoreSystem, int score, string strFieldName)
        //{
        //    try
        //    {
        //        var objRelativeRank = _quizRepository.GetRelativeRank(quiz, iScoreSystem, score, strFieldName);
        //        return objRelativeRank;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetRelativeRank");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to call State Average value
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="iScoreSystem"></param>
        /// <param name="totalMaxScoreForQuiz"></param>
        /// <param name="medianTimeTaken"></param>
        /// <param name="medianScore"></param>
        /// <param name="currentScore"></param>
        /// <param name="currentTimeTaken"></param>
        /// <returns>int</returns>
        //public int GetStateAverages(Quiz quiz, int iScoreSystem, int totalMaxScoreForQuiz, ref int medianTimeTaken,
        //    int medianScore, int currentScore = 0, int currentTimeTaken = 0)
        //{
        //    try
        //    {
        //        var stateAvgScore = _quizRepository.GetStateAverages(quiz, iScoreSystem, totalMaxScoreForQuiz,
        //            ref medianTimeTaken,
        //            medianScore, currentScore, currentTimeTaken);
        //        return stateAvgScore;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetStateAverages");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to call for to get Results Page List values of all Questions of a Quiz
        /// </summary>
        /// <param name="quizQuestions"></param>
        /// <param name="quiz"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>ResultsPageDetailList</returns>
        //public ResultsPageDetailList GetResultsPageDetailListForQuiz(QuizQuestions quizQuestions, Quiz quiz,
        //    int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var objResultsPageList = _quizRepository.GetResultsPageDetailListForQuiz(quizQuestions, quiz,
        //            quizResultSummaryId);
        //        return objResultsPageList;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetResultsPageDetailListForQuiz");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to call for to get Total Max Score for Quiz
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>int</returns>
        //public int GetTotalMaxScoreAfterQuizCompletion(string hiddenCode, QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var totalMaxScoreForQuiz = _quizRepository.GetTotalMaxScoreAfterQuizCompletion(hiddenCode, quizQuestions);
        //        return totalMaxScoreForQuiz;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetTotalMaxScoreAfterQuizCompletion");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to call for to get Total User Score for Quiz
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>int</returns>
        //public int GetUserScoresAfterQuizCompletion(string hiddenCode, Quiz quiz, QuizQuestions quizQuestions,
        //    int userId, int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var totalUserScore = _quizRepository.GetUserScoresAfterQuizCompletion(hiddenCode, quiz, quizQuestions,
        //            userId, quizResultSummaryId);
        //        return totalUserScore;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetUserScoresAfterQuizCompletion");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to call for to get Total User Score for Quiz
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>int</returns>
        //public int GetUserTimeTakenAfterQuizCompletion(Quiz quiz, QuizQuestions quizQuestions, int userId,
        //    int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var totalUserScore = _quizRepository.GetUserTimeTakenAfterQuizCompletion(quiz, quizQuestions, userId,
        //            quizResultSummaryId);
        //        return totalUserScore;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetUserTimeTakenAfterQuizCompletion");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method call for to update QuizResultSummary
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="totalUserScore"></param>
        /// <param name="totalMaxScoreForQuiz"></param>
        /// <param name="totalTimeTakenByUser"></param>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>bool</returns>
        //public bool UpdateQuizResultSummaryOnQuizCompletion(Quiz quiz, int totalUserScore, int totalMaxScoreForQuiz,
        //    int totalTimeTakenByUser, int userId, int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var isvaluesUpdated = _quizRepository.UpdateQuizResultSummaryOnQuizCompletion(quiz, totalUserScore,
        //            totalMaxScoreForQuiz, totalTimeTakenByUser, userId, quizResultSummaryId);
        //        return isvaluesUpdated;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : UpdateQuizResultSummaryOnQuizCompletion");
        //        throw;
        //    }

        //}

        /// <summary>
        /// Method to check if Questions has been answered and have QuizResultSumary table update
        /// </summary>
        /// <param name="quizQuestions"></param>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        /// <param name="totalTimeTaken"></param>
        /// <returns>string</returns>
        //public string CheckQuestionBeenAnsweredAndUpdateQuizResSum(QuizQuestions quizQuestions, Quiz quiz, int userId,
        //    ref int totalTimeTaken)
        //{
        //    try
        //    {
        //        var strScore = _quizRepository.CheckQuestionBeenAnsweredAndUpdateQuizResSum(quizQuestions, quiz,
        //            userId, ref totalTimeTaken);
        //        return strScore;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuestionBeenAnsweredAndUpdateQuizResSum");
        //        throw;
        //    }

        //}

        /// <summary>
        /// Method to get attempt number.
        /// </summary>
        /// <param name="quizResultSummaryId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        //public int GetUserQuizAttemptNo(int quizResultSummaryId, int userId)
        //{
        //    try
        //    {
        //        var attemptNumber = _quizRepository.GetUserQuizAttemptNo(quizResultSummaryId, userId);
        //        return attemptNumber;

        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuestionBeenAnsweredAndUpdateQuizResSum");
        //        throw;
        //    }

        //}

        #endregion

        #region "AnswerDrillPage "


        /// <summary>
        /// Method to get QuizQuestion details based on QuestionId
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="questionId"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizQuestion</returns>
        //public QuizQuestion GetQuestionDetailsForQuizQuestionId(Quiz quiz, int questionId, QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var objQuizQuestion = _quizRepository.GetQuestionDetailsForQuizQuestionId(quiz, questionId,
        //            quizQuestions);
        //        return objQuizQuestion;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuestionDetailsForQuizQuestionId");
        //        throw;
        //    }
        //}


        /// <summary>
        /// method to get Resource details based on SolutionResourceId value of a Question (for MediaHandler = 4 & 5)
        /// </summary>
        /// <param name="quizQuestion"></param>
        /// <param name="resourceFilePath"></param>
        /// <returns>Resource</returns>
        //public Resource GetSolutionResourceDetailsForQuestion(QuizQuestion quizQuestion, string resourceFilePath)
        //{
        //    try
        //    {
        //        var selectedResourceDetail = _quizRepository.GetSolutionResourceDetailsForQuestion(quizQuestion,
        //            resourceFilePath);
        //        return selectedResourceDetail;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetSolutionResourceDetailsForQuestion");
        //        throw;
        //    }
        //}

        #endregion

        #region "QuizManager "


        /// <summary>
        /// Method to get List of active Quizzes for a user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>List<QuizDefine></returns>
        //public List<QuizDefine> GetListOfActiveQuizzes(int userId)
        //{
        //    try
        //    {
        //        var objQuizDefineList = _quizRepository.GetListOfActiveQuizzes(userId);
        //        return objQuizDefineList;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetListOfActiveQuizzes");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get QuizResultSummary details for active quizzes
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizDefineList"></param>
        /// <param name="userId"></param>
        /// <returns>List<QuizManagerDetail></returns>
        //public List<QuizManagerDetail> GetQuizManagerDetailList(Quiz quiz, List<QuizDefine> quizDefineList, int userId)
        //{
        //    try
        //    {
        //        var objQuizResultSummaryList = _quizRepository.GetQuizManagerDetailList(quiz, quizDefineList,
        //            userId);
        //        return objQuizResultSummaryList;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizManagerDetailList");
        //        throw;
        //    }
        // }

        #endregion

        #region "Self-Scoring IntroPage "


        /// <summary>
        /// Method to get total number of Question with its Question type as short answer questions i.e QuestionType=2
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns>int</returns>
        //public int GetSelfScoringQuestionsCount(Quiz quiz, QuizQuestions quizQuestions,
        //    QuizPageQuestions quizPageQuestions, int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var count = _quizRepository.GetSelfScoringQuestionsCount(quiz, quizQuestions, quizPageQuestions,
        //            quizResultSummaryId);
        //        return count;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizPageWithResultsPage");
        //        throw;
        //    }
        //}

        #endregion

        #region "Self-Scoring Question Page "


        /// <summary>
        /// Method to get QuizPageQuestions for Self-Scoring Question page
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizPageQuestions</returns>
        //public QuizPageQuestions CheckQuizPagesHaveSelfScoringPageType(QuizPageQuestions quizPageQuestions,
        //    QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var objQuizPages = _quizRepository.CheckQuizPagesHaveSelfScoringPageType(quizPageQuestions,
        //            quizQuestions);
        //        return objQuizPages;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckQuizPagesHaveSelfScoringPageType");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get first Question for Self-Scoring Question page
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizQuestions"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetFirstQuestionNoOnSelfScoringPageLoad(Quiz quiz, int userId,
        //    QuizPageQuestions quizPageQuestions, QuizQuestions quizQuestions)
        //{
        //    try
        //    {
        //        var objQuizPage = _quizRepository.GetFirstQuestionNoOnSelfScoringPageLoad(quiz, userId,
        //            quizPageQuestions, quizQuestions);
        //        return objQuizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetFirstQuestionNoOnSelfScoringPageLoad");
        //        throw;
        //    }
        //}

        
        /// <summary>
        /// Method to get next QuestionNo for  Self-Scoring Question page
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="quizPageQuestion"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <param name="currentQuestionNo"></param>
        /// <returns>int</returns>
        //public int GetNextQuestionNumberForSelfScoringQuestionPage(Quiz quiz, QuizQuestions quizQuestions,
        //    QuizPageQuestions quizPageQuestion, int quizResultSummaryId, int currentQuestionNo)
        //{
        //    try
        //    {
        //        var nextQuestionNo = _quizRepository.GetNextQuestionNumberForSelfScoringQuestionPage(quiz, quizQuestions,
        //            quizPageQuestion, quizResultSummaryId, currentQuestionNo);
        //        return nextQuestionNo;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetNextQuestionNumberForSelfScoringQuestionPage");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get previous QuestionNo for Self-Scoring Question page
        /// </summary>
        /// <param name="currentQuestionNo"></param>
        /// <param name="quizQuestions"></param>
        /// <param name="quizPageQuestions"></param>
        /// <returns>int</returns>
        //public int GetPreviousQuestionNumberForSelfScoringQuestionPage(int currentQuestionNo,
        //    QuizQuestions quizQuestions, QuizPageQuestions quizPageQuestions)
        //{
        //    try
        //    {
        //        var nextQuestionNo =
        //            _quizRepository.GetPreviousQuestionNumberForSelfScoringQuestionPage(currentQuestionNo, quizQuestions,
        //                quizPageQuestions);
        //        return nextQuestionNo;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetNextQuestionNumberForSelfScoringQuestionPage");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get Question details based on QuestionNo for Self-Scoring Question page
        /// </summary>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quizPageNo"></param>
        /// <returns>QuizPageQuestion</returns>
        //public QuizPageQuestion GetSelfScoringQuizPageBasedOnQuestionNo(QuizPageQuestions quizPageQuestions,
        //    int quizPageNo)
        //{
        //    try
        //    {
        //        var objQuizPage = _quizRepository.GetSelfScoringQuizPageBasedOnQuestionNo(quizPageQuestions, quizPageNo);
        //        return objQuizPage;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetFirstQuestionNoOnSelfScoringPageLoad");
        //        throw;
        //    }
        //}


        #endregion

        #region "Save and Paused Page "


        /// <summary>
        /// Method to get QuizSummaryId of resumed quiz based on FormId,UserID and Sid
        /// </summary>
        /// <param name="quiz"></param>
        /// <param name="userId"></param>
        /// <returns>int</returns>
        //public int GetQuizResultSummaryIdForResumedQuiz(Quiz quiz, int userId)
        //{
        //    try
        //    {
        //        var objQuizResultSummaryId = _quizRepository.GetQuizResultSummaryIdForResumedQuiz(quiz, userId);
        //        return objQuizResultSummaryId;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizResultSummaryIdForResumedQuiz");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to get QuizQuestion and QuizPageQuestion of resumed Quiz
        /// </summary>
        /// <param name="quizResultSummaryId"></param>
        /// <param name="quizPageQuestions"></param>
        /// <param name="quiz"></param>
        /// <returns></returns>
        //public QuizPageQuestion GetQuizQuestionForResumeQuiz(int quizResultSummaryId,
        //    QuizPageQuestions quizPageQuestions, Quiz quiz)
        //{
        //    try
        //    {
        //        var objQuizQuestions = _quizRepository.GetQuizQuestionForResumeQuiz(quizResultSummaryId,
        //            quizPageQuestions, quiz);
        //        return objQuizQuestions;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : GetQuizQuestionForResumeQuiz");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to check if Self Scoring Questions have scores given by user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="quizResultSummaryId"></param>
        /// <returns></returns>
        //public bool CheckScoreGivenToSelfScoringQuestionsForResumeQuiz(int userId, int quizResultSummaryId)
        //{
        //    try
        //    {
        //        var isSelfScoringQuestionsHaveScore =
        //            _quizRepository.CheckScoreGivenToSelfScoringQuestionsForResumeQuiz(userId,
        //                quizResultSummaryId);
        //        return isSelfScoringQuestionsHaveScore;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "QuizController : CheckScoreGivenToSelfScoringQuestionsForResumeQuiz");
        //        throw;
        //    }
        //}

        #endregion


        #endregion

    }
}
