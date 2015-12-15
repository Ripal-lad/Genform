using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Metadata;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NUnit.Framework;
using TSFXGenform.Core.Tests.Config;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.DomainModel.DataRepository;
using TSFXGenform.DomainModel.Models;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Repository.Repository;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;
using IContainer = Autofac.IContainer;

namespace TSFXGenform.Core.Tests.Lib
{
    [TestClass]
    public class QuizLibTest
    {
        #region "Private members"
        
        private IContainer _mainContainer;
        private IContainer _childContainer;
        private IQuizRepository _quizRepository;
        
        private Mock<IDataRepository<QuizDefine>> _mockQuizDefine;
        private Mock<IDataRepository<QuizCompilation>> _mockQuizCompilation;
        private Mock<IDataRepository<QuizResult>> _mockQuizResult;
        private Mock<IDataRepository<QuizResultSummary>> _mockQuizResultSummary;
        private Mock<IDataRepository<MappingQuizResultDetails>> _mockMappingQuizResultDetail;
        private Mock<IExecuteMySqlQueries> _mockExecuteMySqlQueries;

        const string Filepath = "D:/Projects/TSFX Genform/Genform/Source/forms/Data/AppRead/Quiz/yv2xdir3.xml"; 
        const string ResourceFilePath = "D:/Projects/TSFX Genform/Genform/Source/forms/Data/AppRead/Resource/resource.xml";
        private const int Id = 7;
        private const string HiddenCode = "yv2xdir3";
        private const int TimeAllotted = 300;
        private const int UserId = 1;
        const int QuizDefineId = 1;
        const int QuestionId = 4;
        const int QuizCompileId = 1;
        int _quizResultSummaryId = 1;
        private const int QuizResultId = 1;

        #endregion

        #region "SetUp & TearDown

        /// <summary>
        /// Setup method
        /// </summary>
        [SetUp]
        public void SetUp()
        {
            XmlDataFileTest.InitializeXmlDataForQuiz();
            TestDatabase.InitializeQuizDatabase();
            _mainContainer = IocConfig.RegisterDependencies();
            var childContainerBuilder = new ContainerBuilder();

            _mockQuizDefine = new Mock<IDataRepository<QuizDefine>>();
            _mockQuizCompilation = new Mock<IDataRepository<QuizCompilation>>();
            _mockQuizResult = new Mock<IDataRepository<QuizResult>>();
            _mockQuizResultSummary = new Mock<IDataRepository<QuizResultSummary>>();
            _mockMappingQuizResultDetail = new Mock<IDataRepository<MappingQuizResultDetails>>();
            _mockExecuteMySqlQueries = new Mock<IExecuteMySqlQueries>();

            childContainerBuilder.RegisterGeneric(typeof(XmlDataRepository<>)).As(typeof(IXmlDataRepository<>));
            childContainerBuilder.RegisterType<QuizRepository>().As<IQuizRepository>();
            childContainerBuilder.RegisterType<CacheMemoryRepository>().As<ICacheMemoryRepository>();

            childContainerBuilder.RegisterInstance(_mockExecuteMySqlQueries.Object).As<IExecuteMySqlQueries>();
            childContainerBuilder.RegisterInstance(_mockQuizDefine.Object).As<IDataRepository<QuizDefine>>();
            childContainerBuilder.RegisterInstance(_mockQuizCompilation.Object).As<IDataRepository<QuizCompilation>>();
            childContainerBuilder.RegisterInstance(_mockQuizResult.Object).As<IDataRepository<QuizResult>>();
            childContainerBuilder.RegisterInstance(_mockQuizResultSummary.Object)
                .As<IDataRepository<QuizResultSummary>>();
            childContainerBuilder.RegisterInstance(_mockMappingQuizResultDetail.Object)
               .As<IDataRepository<MappingQuizResultDetails>>();
            
            _childContainer = childContainerBuilder.Build();
            var resolver = new AutofacDependencyResolver(_childContainer);
            DependencyResolver.SetResolver(resolver);
        }

        /// <summary>
        /// Dispose method
        /// </summary>
        [TearDown]
        public void CleanUpTest()
        {
            if (_quizRepository != null)
                _quizRepository.Dispose();
        }
        
        #endregion

        #region "Quiz"

        
        /// <summary>
        /// Check if the Quiz URL is proper and has FormID
        /// </summary>
        //[Test]
        //public void Quiz_CheckQuizUrlAndGetFormId_IsNotZero()
        //{
        //    _quizRepository = _childContainer.Resolve<IQuizRepository>();
        //    var actual = _quizRepository.CheckQuizUrlAndGetFormId(HiddenCode);
        //    Assert.AreNotEqual(0, actual);
        //}

        
        /// <summary>
        /// Check if EventData XML file is not null
        /// </summary>
        [Test]
        public void Quiz_CheckEventData_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var actual = _quizRepository.GetQuizEventDataXmlData(Filepath);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if the QuizPageQuestions is not null & should have a record in it
        /// </summary>
        //[Test]
        //public void Quiz_CheckEventDataHaveQuizPages_IsNotNull()
        //{
        //    _quizRepository = _childContainer.Resolve<IQuizRepository>();
        //    var objEventData = new QuizRoot();
        //    var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
        //    objEventData.QuizPageQuestions = objQuizPages;
        //    var actual = _quizRepository.CheckQuizPagesNotNull(objEventData);
        //    Assert.AreEqual(true, actual);
        //}

        
        /// <summary>
        /// Check if Xml file is modified or not.
        /// </summary>
        //[Test]
        //public void Quiz_CheckModifiedTimeStampOfXmlFileForQuiz_IsNotNull()
        //{
        //    _quizRepository = _childContainer.Resolve<IQuizRepository>();

        //    var actual = _quizRepository.CheckModifiedTimeStampOfXmlFileForQuiz(Filepath, HiddenCode);
        //    Assert.AreNotEqual(null,actual);
        //}


        
        /// <summary>
        /// Check to get Xml file data and set it in cache memory
        /// </summary>
        [Test]
        public void Quiz_SetAndGetQuizXmlFileDataIntoCacheMemory_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            const string xmlFilePath = "D:/Projects/TSFX Genform/Genform/Source/forms/Data/AppRead/Quiz";
            var actual = _quizRepository.SetAndGetQuizXmlFileDataIntoCacheMemory(xmlFilePath, HiddenCode);
            Assert.AreNotEqual(null, actual);
        }

        
        /// <summary>
        /// Check to get Xml file data from cache memory
        /// </summary>
        //[Test]
        //public void Quiz_GetXmlFileDataFromCacheMemory_IsNotNull()
        //{
        //    _quizRepository = _childContainer.Resolve<IQuizRepository>();

        //    var actual = _quizRepository.GetXmlFileDataFromCacheMemory(HiddenCode);
        //    Assert.AreEqual(null, actual);
        //}

        #region "Quiz - IntroPage "
        
        
        /// <summary>
        /// Check if XML contains Quiz details for Intro page messages
        /// </summary>
        [Test]
        public void QuizIntroPage_CheckQuizPagesHavePageType1_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var actual = _quizRepository.GetQuizDetails(objQuiz,1);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if Intro page details are not null fields which are required to show on UI 
        /// </summary>
        //[Test]
        //public void QuizIntroPage_CheckQuizPageDetailsOfPageType1_IsNotNull()
        //{
        //    _quizRepository = _childContainer.Resolve<IQuizRepository>();
        //    var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
        //    var actual = _quizRepository.CheckQuizOpeningMessageNotNull(objQuiz);
        //    Assert.AreEqual(true, actual);
        //}


        
        /// <summary>
        /// Check if quiz is available or not. 
        /// </summary>
        [Test]
        public void QuizIntroPage_CheckQuizIsAvailableOrNot_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var actual = _quizRepository.CheckQuizIsAvailableOrNot(HiddenCode, objQuiz);
            Assert.AreEqual(true, actual);
        }

        #endregion

        #region "Quiz - QuestionPage "
        
        
        /// <summary>
        /// Check if Initialize Quiz inserts values in QuizDefine and QuizCompilation tables 
        /// </summary>
        [Test]
        public void QuizQuestionPage_InitiateQuizDefine_DoesCallSaveChanges()
        {
           _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var quiz = XmlDataFileTest.GetAll_QuizDetails();
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            _quizRepository.InitiateQuizDefine(quiz,UserId);
            _mockQuizDefine.Verify(x => x.SaveChanges(), Times.AtMostOnce);
            _mockQuizCompilation.Verify(y => y.SaveChanges(), Times.AtMostOnce);
        }

        
        /// <summary>
        /// Check if First QuizPageQuestion is not null 
        /// </summary>
        //[Test]
        //public void QuizQuestionPage_GetFirstQuestionNumberToLoadOnQuestionPage_IsNotNull()
        //{
        //    _quizRepository = _childContainer.Resolve<IQuizRepository>();
        //    var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
        //    var actual = _quizRepository.GetFirstQuestionNumberToLoadOnQuestionPage(objQuizPages);
        //    Assert.IsNotNull(actual);
        //}

        
        /// <summary>
        /// Check if QuizPageQuestions have PageQuestionId value - for Question page
        /// </summary>
        [Test]
        public void QuizQuestionPage_CheckQuizPagesHavePageQuestionId_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var actual = _quizRepository.CheckQuizPagesHavePageQuestionId(objQuizPages);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if QuizQuestions mapped by QuizPageQuestions are not null
        /// </summary>
        [Test]
        public void QuizQuestionPage_GetQuizPagesMatchedQuizQuestions_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizPage = new QuizPageQuestion
            {
                QuestionNumber = 1,
                QuestionIds=new List<int>(new[]{4})
            };

            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var actual = _quizRepository.GetMatchedQuizQuestionsFromQuizPage(objQuizPage, objQuizQuestions);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if count of Questions for Question page & PageQuestionId field are not null and matches with count of QuizQuestions count
        /// </summary>
        [Test]
        public void QuizQuestionPage_GetQuizPagesMatchedQuizQuestions_AreSame()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            #region Getting QuizPageQuestions 

            var objQuizPage = new QuizPageQuestion
            {
                QuestionNumber = 1,
                QuestionIds = new List<int>(new[] { 4 })
            };
            

            #endregion

            #region Getting QuizQuestions

            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objResQuizQuestions = _quizRepository.GetMatchedQuizQuestionsFromQuizPage(objQuizPage, objQuizQuestions);

            #endregion

            if (objResQuizQuestions != null &&
                objResQuizQuestions.ListOfQuizQuestions != null)
                Assert.AreNotEqual(0, objResQuizQuestions.ListOfQuizQuestions.Count);
            else
            {
                Assert.IsNotNull(objResQuizQuestions);
            }
        }

        
        /// <summary>
        /// Check to calculate user score for multiple choice questions
        /// </summary>
        [Test]
        public void QuizQuestionPage_CalculateMultipleChioceAnswerQuestionsScore()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var questionPageAndAnswerDetails = new QuizPageAndQuestionDetails
            {
                HiddenCodeForQuiz = "",
                QuestionId = 4,
                QuestionIds = new List<int>(new[] { 4 }),
                QuestionNumber = 1,
                CorrectAnswer = "C",
                UserAnswer = "C",
                AnsweredInTime = true,
                QuestionType = 1,
                PossibleAnswers = "ABCD",
                TimeTaken = 24,
                TimeToAnswer = 72,
                NumberOfMarks = 1,
            };
            var objQuizQuestion = XmlDataFileTest.GetAll_QuizQuestions();
            var quizAnswersAndPage = new List<QuizPageAndQuestionDetails> { questionPageAndAnswerDetails };
            var actual = _quizRepository.CalculateMultipleChioceAnswerQuestionsScore(quizAnswersAndPage, objQuizQuestion);
            Assert.AreEqual(actual, 1);
        }

        
        /// <summary>
        /// Check if calculated RecommendedTime from TimeAllotted is not zero
        /// </summary>
        [Test]
        public void QuizQuestionPage_CalculateRecommendedTimeForQuizQuestion_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var actual = _quizRepository.CalculateRecommendedTimeForQuizQuestion(TimeAllotted);
            Assert.AreNotEqual(0,actual);
        }

        
        /// <summary>
        /// Check if calculated Total AllottedTime is not zero
        /// </summary>
        [Test]
        public void QuizQuestionPage_GetTotalAllottedTimeFromRecommendedTime_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var actual = _quizRepository.CalculateTotalAllottedTimeFromRecommendedTime(objQuizQuestions);
            Assert.AreNotEqual(0, actual);
        }

        
        /// <summary>
        /// Check if Next QuizPageQuestion is not null
        /// </summary>
        [Test]
        public void QuizQuestionPage_GetNextQuizPageDetails_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var currentQuizPage = new QuizPageQuestion
            {
                QuestionNumber = 1,
                QuestionIds = new List<int>(new[] { 4 })
            };

            var actual = _quizRepository.GetNextQuizPageDetails(currentQuizPage, objQuizPages);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if Previous QuizPageQuestion is not null
        /// </summary>
        [Test]
        public void QuizQuestionPage_GetPreviousQuizPageDetails_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var currentQuizPage = new QuizPageQuestion
            {
                QuestionNumber = 2,
                QuestionIds = new List<int>(new[] { 16 })
            };
            var actual = _quizRepository.GetPreviousQuizPageDetails(currentQuizPage, objQuizPages);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if QuizResult for each QuizQuestion got saved or not
        /// </summary>
        [Test]
        public void QuizQuestionPage_SaveAnswerOfQuestion_DoesCallSaveChanges()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var quizResult = new QuizResult
            {
                QuizResultId = 0,
                UserId = 1,
                QuizDefineId = 1,
                QuestionId = 943,
                UserAnswer = "A",
                AnsweredInTime = true,
                Score = 3
            };

            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            _quizRepository.SaveAnswerOfQuestion(objQuiz, quizResult, true, true,true,true, UserId, ref _quizResultSummaryId);
            _mockQuizResult.Verify(x => x.SaveChanges(), Times.AtMostOnce);
            _mockMappingQuizResultDetail.Verify(x=>x.SaveChanges(),Times.AtMostOnce);

        }

        
        /// <summary>
        /// Check if previous QuizResult is not null
        /// </summary>
        [Test]
        public void QuizQuestionPage_GetQuizResultBasedOnQuizQuestion_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var quiz = XmlDataFileTest.GetAll_QuizDetails();
            var objCurrentQuizQuestion = new QuizQuestion
            {
                QuestionId = 4,
                QuestionType = 1,
                SolutionId = 946, 
                SolutionResourceId = 0,
                SolutionResourceTitle = null,
                NoOfAnswersRequired = 1,
                CorrectAnswer = "C",
                PossibleAnswers = "ABCD",
                QuestionImageName = "5FCD6LGGVL3N08K",
                QuestionImageWidthPx = 2157,
                QuestionImageHeightPx = 1704,
                SolutionImageName = "G776982WCA4G2IN",
                SolutionImageWidthPx = 3718,
                SolutionImageHeightPx = 1311,
                NumberOfMarks = 1,
                TimeToAnswer = 72,
                RecommendedTime = 2,
                SolutionImageRequiredScaling = 1,
                QuestionImagePath = "",
                SolutionImagePath = "",
                QuizResultSummaryId = 0,
                IndentPX = 0,
                WriteSolutionInSpecificLocationMessage = null
            };

            _mockQuizDefine.Setup(x => x.GetAll())
             .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == quiz.Id));

            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizCompilation()
                        .Where(x => x.QuizCompileId == QuizCompileId && x.QuestionId == QuestionId));

            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResult()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.QuizCompileId == QuizCompileId));

            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResultSummary()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.UserId == UserId && x.EndDate == null)
                        .OrderByDescending(x => x.EndDate));

            _mockMappingQuizResultDetail.Setup(x => x.GetAll()).Returns(TestDatabase.GetAll_MappingQuizResultDetails()
                .Where(x => x.QuizResultSummaryId == _quizResultSummaryId)
                .OrderByDescending(x => x.MappingQuizResultDetailId));

            var actual = _quizRepository.GetQuizResultBasedOnQuizQuestion(quiz, objCurrentQuizQuestion,UserId);
            Assert.IsNotNull(actual);

        }

        
        /// <summary>
        /// Check if time spend arbitrarily when page contains multiple short answers is not negative
        /// </summary>
        [Test]
        public void QuizQuestionPage_CalculateTimeSpendForMultiShortQuestion_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            const float marksOfQuestion = 2;
            const float totalMarksOfQuestion = 5;
            const float totalTimeSpendForQuesOfPage = 50;

            var actual = _quizRepository.CalculateTimeSpendForMultiShortQuestion(marksOfQuestion, totalMarksOfQuestion,
                totalTimeSpendForQuesOfPage);
            Assert.AreNotEqual(0, actual);
        }

        #endregion

        #region "Quiz - Results Page "
       
        
        /// <summary>
        /// Check if the RelativeRank is not zero
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_GetRelativeRank_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            _mockQuizDefine.Setup(x => x.GetAll())
               .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == Id));

            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResultSummary()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.EndDate != null && x.AttemptNumber == 1).OrderBy( x=> x.TotalScore));
           
            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResultSummary()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.EndDate != null && x.IsBestScore).OrderBy(x => x.TotalScore));

            var objOuiz = XmlDataFileTest.GetAll_QuizDetails();
            var actual = _quizRepository.GetRelativeRank(objOuiz, 1, 10, "Score");

            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if State Average is not zero
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_GetStateAverages_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var medianTimeTaken = 10;
            const int medianScore = 20;
            const int totalMaxScoreOfQuiz = 30;
            var objOuiz = XmlDataFileTest.GetAll_QuizDetails();

            _mockQuizDefine.Setup(x => x.GetAll())
               .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objOuiz.Id));

        
             var actualScore = _quizRepository.GetStateAverages(objQuiz, 1,totalMaxScoreOfQuiz, ref medianTimeTaken, medianScore);
            _mockExecuteMySqlQueries.Verify(
                x => x.ExecuteSqlQueryWithParamters<int>(It.IsAny<string>(), It.IsAny<object[]>()), Times.AtLeastOnce);
            
        }

        
        /// <summary>
        /// Check if the ResultsPageDetailList is not null
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_GetResultsPageDetailListForQuiz_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();

            _mockQuizDefine.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == Id));

            _mockQuizCompilation.Setup(x => x.GetAll())
             .Returns(TestDatabase.GetAll_QuizCompilation().Where(x => x.QuizDefineId == QuizDefineId));

            _mockQuizResult.Setup(x => x.GetAll())
             .Returns(TestDatabase.GetAll_QuizResult().Where(x => x.QuizDefineId == QuizDefineId));

            _mockQuizResultSummary.Setup(x => x.GetAll())
               .Returns(TestDatabase.GetAll_QuizResultSummary().Where(x => x.QuizDefineId == QuizDefineId));

            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizResultSummaryId == _quizResultSummaryId));

            var actual = _quizRepository.GetResultsPageDetailListForQuiz(objQuizQuestions, objQuiz,
                _quizResultSummaryId);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if the Total time taken by user after converting into minutes and seconds is not null
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_GetUserTimeTakenForCompletionOfQuiz_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
        
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            
            _mockQuizDefine.Setup(x => x.GetAll())
              .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == Id));
            
            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizCompilation()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.QuestionId == QuestionId));

            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResult()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.QuizCompileId == QuizCompileId));


            var actual = _quizRepository.GetUserTimeTakenAfterQuizCompletion(objQuiz, objQuizQuestions, UserId, _quizResultSummaryId);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if Max score of user after Quiz completion is not null
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_GetUserMaxScoreAfterQuizCompletion_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var actual = _quizRepository.GetTotalMaxScoreAfterQuizCompletion(HiddenCode, objQuizQuestions);
            Assert.AreNotSame(string.Empty, actual);
        }

        
        /// <summary>
        /// Check if QuizResultSummary is updated and save changes are done
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_UpdateQuizResultSummaryOnQuizCompletion_CallSaveChanges()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            const int totalUserScore = 10;
            const int totalMaxScoreForQuiz = 10;
            const int totalTimeTakenByUser = 300;
            var objOuiz = XmlDataFileTest.GetAll_QuizDetails();

            _mockQuizDefine.Setup(x => x.GetAll())
               .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objOuiz.Id));

            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResultSummary()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.UserId == UserId && x.EndDate == null)
                        .OrderByDescending(x => x.QuizResultSummaryId));
           
            var actual = _quizRepository.UpdateQuizResultSummaryOnQuizCompletion(objOuiz,totalUserScore,
                totalMaxScoreForQuiz, totalTimeTakenByUser, UserId,_quizResultSummaryId);

            _mockExecuteMySqlQueries.Verify(
                x => x.ExecuteSqlQueryWithParamters<int>(It.IsAny<string>(), It.IsAny<object[]>()), Times.AtLeastOnce);

            Assert.AreNotSame(false, actual);

        }

        
        /// <summary>
        /// Check if Questions has been answered and update to Quiz Result summary is done
        /// </summary>
        [Test]
        public void Quiz_ResultsPage_CheckQuestionBeenAnsweredAndUpdateQuizResSum_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var totalTimeTaken = 100;
            
            _mockQuizDefine.Setup(x => x.GetAll())
              .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == Id));

            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizCompilation()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.QuestionId == QuestionId));
            
            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResult()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.QuizCompileId == QuizCompileId));

            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizResultSummary().Where(x => x.QuizDefineId == QuizDefineId));
            
            _mockQuizResult.Setup(x => x.GetAll())
          .Returns(TestDatabase.GetAll_QuizResult().Where(x => x.QuizDefineId == QuizDefineId));

            var actual = _quizRepository.CheckQuestionBeenAnsweredAndUpdateQuizResSum(objQuizQuestions, objQuiz,
                UserId, ref totalTimeTaken);
            Assert.IsNotNull(actual);
        }


       #endregion

        #region "Quiz - Answer Drill Page "
        
        
        /// <summary>
        /// Check if QuestionId not returning null value for QuizQuestion 
        /// </summary>
        [Test]
        public void Quiz_AnswerDrillPage_GetQuestionDetailsForQuizQuestionId_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();

            _mockQuizDefine.Setup(x => x.GetAll())
               .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objQuiz.Id));
            const int questionId = 4;
          
            var actual = _quizRepository.GetQuestionDetailsForQuizQuestionId(objQuiz, questionId, objQuizQuestions);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check to get current Question number
        /// </summary>
        [Test]
        public void Quiz_AnswerDrillPage_GetCurrentQuestionNumber()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizPageQuestions = XmlDataFileTest.GetAll_QuizPages();
      
            const int questionId = 29;

            var actual = _quizRepository.GetCurrentQuestionNumber(objQuizPageQuestions, questionId);
            Assert.IsNotNull(actual);
            Assert.AreEqual(4,actual);
        }

        
        /// <summary>
        /// Check if method returns Resource details for a Question  based on SolutionResourceId value (for MediaHandler= 4 & 5) 
        /// </summary>
        [Test]
        public void Quiz_AnswerDrillPage_GetSoultionResourceDetailsForQuestion_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objCurrentQuizQuestion = new QuizQuestion
            {
                QuestionId = 29,
                QuestionType = 2,
                SolutionResourceId = 6254,
                SolutionResourceTitle = null,
                NoOfAnswersRequired = 1,
                CorrectAnswer = null,
                PossibleAnswers = null,
                QuestionImageWidthPx = 3707,
                QuestionImageHeightPx = 605,
                SolutionImageWidthPx = 4452,
                SolutionImageHeightPx = 4452,
                NumberOfMarks = 5,
                TimeToAnswer = 360,
                RecommendedTime = 6,
                QuestionImageName = "5FCD6LGGVL3N08K",
                SolutionImageName = "G776982WCA4G2IN",
                IndentPX = 0,
                WriteSolutionInSpecificLocationMessage = "",
                SolutionImageRequiredScaling = 1,
            };
            var actual = _quizRepository.GetSolutionResourceDetailsForQuestion(objCurrentQuizQuestion, ResourceFilePath);
            Assert.IsNotNull(actual);
        }


        #endregion

        #region "Quiz - Quiz Manager "

        
        /// <summary>
        /// Check if Quiz List is not null i.e Due Date is not null and Quiz date is not Expired
        /// </summary>
        [Test]
        public void Quiz_QuizManager_GetListOfActiveQuizzes_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            _mockQuizDefine.Setup(x => x.GetAll())
               .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.DueDateTime !=null));
            _mockQuizDefine.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.ExpiresDateTime >= DateTime.Now));

            var actual = _quizRepository.GetListOfActiveQuizzes(UserId);
            Assert.IsNotNull(actual);

        }

        
        /// <summary>
        /// Check if details got from QuizResultSummary for Quizzes is not null for a UserId
        /// </summary>
        [Test]
        public void Quiz_QuizManager_GetQuizResultSummaryDetails_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizDefineList = TestDatabase.GetAll_QuizDefine() as List<QuizDefine>;

            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResultSummary()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.UserId == UserId)
                        .OrderByDescending(x => x.QuizResultSummaryId));

            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var actual = _quizRepository.GetQuizManagerDetailList(objQuiz,objQuizDefineList, UserId);
            Assert.IsNotNull(actual);
        }

        #endregion

        #region "Quiz - Self Scoring Intro Page "

        
        /// <summary>
        /// Check if Quiz contains self scoring Questions
        /// </summary>
        [Test]
        public void Quiz_SelfScoringIntroPage_GetSelfScoringQuestionsCount_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            const int quizCompileId = 4;
            const int quizResultId = 4;
          _mockQuizDefine.Setup(x => x.GetAll())
             .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objQuiz.Id && x.ExpiresDateTime >= DateTime.Now));

          _mockMappingQuizResultDetail.Setup(x=>x.GetAll())
              .Returns(TestDatabase.GetAll_MappingQuizResultDetails()
                            .Where(x => x.QuizResultSummaryId == _quizResultSummaryId && x.QuizResultId > 0).ToList());

            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizCompilation()
                    .Where(x => x.QuizCompileId == quizCompileId && x.QuizDefineId == QuizDefineId));


            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizResult()
                    .Where(x => x.QuizResultId == quizResultId && x.QuizCompileId == quizCompileId && x.Score == null && x.IsAnsweringDone));

            
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objUizPageQuestion = XmlDataFileTest.GetAll_QuizPages();
            var actual = _quizRepository.GetSelfScoringQuestionsCount(objQuiz, objQuizQuestions, objUizPageQuestion, _quizResultSummaryId);
            Assert.AreNotEqual(0, actual);
        }


        
        /// <summary>
        /// Check to get first question number to self score 
        /// </summary>
        [Test]
        public void Quiz_SelfScoringQuestionPage_GetFirstQuestionNoOnSelfScoringPageLoad_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var objQuizQUestions = XmlDataFileTest.GetAll_QuizQuestions();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var questionId = 29;
            var quizResultId = 4;
            var quizCompileId = 4;


            _mockQuizDefine.Setup(x => x.GetAll())
             .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objQuiz.Id));

            _mockQuizResultSummary.Setup(x => x.GetAll())
           .Returns(TestDatabase.GetAll_QuizResultSummary().Where(x => x.QuizDefineId == QuizDefineId && x.UserId == UserId && x.EndDate == null));

            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
        .Returns(
            TestDatabase.GetAll_MappingQuizResultDetails()
                .Where(x => x.QuizResultSummaryId == _quizResultSummaryId));

            _mockQuizCompilation.Setup(x => x.GetAll())
           .Returns(TestDatabase.GetAll_QuizCompilation().Where(x => x.QuizDefineId == QuizDefineId && x.QuizCompileId == quizCompileId));


            _mockQuizCompilation.Setup(x => x.GetAll())
           .Returns(TestDatabase.GetAll_QuizCompilation().Where(x => x.QuizDefineId == QuizDefineId && x.QuestionId == questionId));


            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizResultSummaryId == _quizResultSummaryId && x.QuizCompileId == quizCompileId));

            _mockQuizResult.Setup(x => x.GetAll())
            .Returns(TestDatabase.GetAll_QuizResult().Where(x => x.QuizDefineId == QuizDefineId && x.QuizResultId == quizResultId && x.QuizCompileId == quizCompileId && x.QuizDefineId == QuizDefineId && x.Score == null));


            var actual = _quizRepository.GetFirstQuestionNoOnSelfScoringPageLoad(objQuiz, UserId, objQuizPages, objQuizQUestions);
            Assert.IsNotNull(actual);
        }

        #endregion

        #region "Quiz - Self Scoring Question Page "

        
        /// <summary>
        /// Check if Questions for Sels-Scoring question page are not null
        /// </summary>
        [Test]
        public void Quiz_SelfScoringQuestionPage_CheckQuizPagesHaveSelfScoringPageType_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            var actual = _quizRepository.CheckQuizPagesHaveSelfScoringPageType(objQuizPages, objQuizQuestions);
            Assert.IsNotNull(actual);
        }

        
        
        /// <summary>
        /// Check to get QuizPageQuestions based on Question No is not null 
        /// </summary>
        [Test]
        public void Quiz_SelfScoringQuestionPage_GetSelfScoringQuizPageBasedOnQuestionNo_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var actual = _quizRepository.GetSelfScoringQuizPageBasedOnQuestionNo(objQuizPages, 4);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check method to get next question number for SelfscoringQuestionPage
        /// </summary>
        [Test]
        public void Quiz_SelfScoringQuestionPage_GetNextQuestionNumberForSelfScoringQuestionPage_IsNotNull()
        {

            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizPage = XmlDataFileTest.GetAll_QuizPages();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            const int currentQuestionNo = 4;

            _mockQuizDefine.Setup(x => x.GetAll())
            .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objQuiz.Id));

            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizResultSummaryId == _quizResultSummaryId));

            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizCompilation()
                        .Where(x => x.QuestionNumber == 5 && x.QuizDefineId == QuizDefineId));
                      
            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizCompileId == 8 && x.QuizResultSummaryId == _quizResultSummaryId));

            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizResult()
                    .Where(x => x.QuizResultId == 8 && x.IsAnsweringDone));

            var actual = _quizRepository.GetNextQuestionNumberForSelfScoringQuestionPage(objQuiz, objQuizQuestions,
                objQuizPage, _quizResultSummaryId, currentQuestionNo);
            Assert.AreEqual(actual,5);
        }

        
        /// <summary>
        /// Check method to get previous question number for SelfscoringQuestionPage
        /// </summary>
        [Test]
        public void Quiz_SelfScoringQuestionPage_GetPreviousQuestionNumberForSelfScoringQuestionPage_IsNotNull()
        {

            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var objQuizPage = XmlDataFileTest.GetAll_QuizPages();
            var objQuizQuestions = XmlDataFileTest.GetAll_QuizQuestions();
            const int currentQuestionNo = 5;
            
            var actual = _quizRepository.GetPreviousQuestionNumberForSelfScoringQuestionPage(currentQuestionNo,objQuizQuestions,objQuizPage);
            Assert.AreEqual(actual, 4);
        }

        #endregion

        #region "Quiz - Save and Paused "

        
        /// <summary>
        /// Check if Quiz is Save and Paused
        /// </summary>
        [Test]
        public void Quiz_SaveAndPausedPage_GetQuizResultSummaryIdForResumedQuiz_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();

            _mockQuizDefine.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == objQuiz.Id));

            _mockQuizResultSummary.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResultSummary()
                        .Where(x => x.QuizDefineId == QuizDefineId && x.UserId == UserId && x.EndDate == null));

            var actual = _quizRepository.GetQuizResultSummaryIdForResumedQuiz(objQuiz, UserId);
            Assert.AreNotEqual(0, actual);
        }

        
        /// <summary>
        /// Check if QuizQuestion from where Quiz is Resumed is not null
        /// </summary>
        [Test]
        public void Quiz_SaveAndPausedPage_GetQuizQuestionForResumeQuiz_IsNotNull()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
           
            var objQuizPage = new QuizPageQuestion();
            const int compileId = 21;

            var objQuizPages = XmlDataFileTest.GetAll_QuizPages();
            var objQuiz = XmlDataFileTest.GetAll_QuizDetails();

            _mockQuizDefine.Setup(x => x.GetAll()).Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == Id));

            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizResultSummaryId == _quizResultSummaryId));

            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizCompilation().Where(x => x.QuizCompileId == compileId));

            var actual = _quizRepository.GetQuizQuestionForResumeQuiz(_quizResultSummaryId, objQuizPages, objQuiz);
            Assert.IsNotNull(objQuizPage);
            Assert.IsNotNull(actual);
            
        }
        
        
        /// <summary>
        /// Check if SelfScoring Question from where Quiz is Resumed is not null
        /// </summary>
        [Test]
        public void Quiz_SaveAndPausedPage_CheckSelfScoringQuestionPageIsSaveAndPausedGetSummaryId_IsNotZero()
        {
            _quizRepository = _childContainer.Resolve<IQuizRepository>();
            const int objQuizResultId = 1;

            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizResultSummaryId == _quizResultSummaryId));
            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizResult().Where(x => x.QuizResultId == objQuizResultId && x.Score == 0));

            var actual = _quizRepository.CheckScoreGivenToSelfScoringQuestionsForResumeQuiz(UserId,_quizResultSummaryId);
            Assert.AreNotEqual(actual,false);
        }

        #endregion

        #region "Quiz - Allotted Timer Expire Page between Self-scoring Que and Result Page"

        
        /// <summary>
        /// Check if Timer Expired for any short answer
        /// </summary>
        [Test]
        public void Quiz_AllottedTimerExpiredPage_CheckTimerExpiredForShortAnswer_IsNotFalse()
        {
            const int questionId = 29;
            const int quizCompileId = 4;
            const int quizResultId = 4;
            _quizRepository = _childContainer.Resolve<IQuizRepository>();

            var quizQuestions = XmlDataFileTest.GetAll_QuizQuestions();

            _mockQuizDefine.Setup(x => x.GetAll())
                .Returns(TestDatabase.GetAll_QuizDefine().Where(x => x.Id == Id && x.ExpiresDateTime >= DateTime.Now));

            _mockQuizCompilation.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizCompilation()
                        .Where(x => x.QuestionId == questionId && x.QuizDefineId == QuizDefineId));
            _mockMappingQuizResultDetail.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_MappingQuizResultDetails()
                        .Where(x => x.QuizResultSummaryId == _quizResultSummaryId && x.QuizCompileId == quizCompileId));

            _mockQuizResult.Setup(x => x.GetAll())
                .Returns(
                    TestDatabase.GetAll_QuizResult()
                        .Where(
                            x =>
                                x.QuizCompileId == quizCompileId && x.QuizResultId == quizResultId &&
                                x.QuizDefineId == QuizDefineId && x.AnsweredInTime == false));

            var actual = _quizRepository.GetQuestionNoToSelfScoreAfterTimerExpired(HiddenCode, Id, _quizResultSummaryId, quizQuestions);
            Assert.AreNotEqual(false,actual);
        }


        #endregion


        #endregion
    }
}
