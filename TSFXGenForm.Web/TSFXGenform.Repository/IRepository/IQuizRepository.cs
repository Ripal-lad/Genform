using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.DomainModel.Models;

namespace TSFXGenform.Repository.IRepository
{
    public interface IQuizRepository : IDisposable
    {
        //bool CheckQuizUrlAndGetFormId(string hiddenCode);
        QuizRoot GetQuizEventDataXmlData(string strQuizFilePath);
        //bool CheckQuizPagesNotNull(QuizRoot quizRoot);
        //string GetCurrentQuizName(string hiddenCode, QuizRoot quizRoot);

        QuizRoot GetXmlFileDataFromCacheMemory(string hiddenCode);
        QuizRoot SetAndGetQuizXmlFileDataIntoCacheMemory(string xmlFilePath, string hiddenCode);
        bool CheckModifiedTimeStampOfXmlFileForQuiz(string xmlFilePath, string hiddenCode);

        #region "IntroPage "
        ValidateQuiz CheckQuizIsAvailableOrNot(string hiddenCode, Quiz quiz);
        Task<Quiz> GetQuizDetails(Quiz quiz, int userId);
        Task InitiateQuizDefine(Quiz quiz, int userId);
       // bool CheckQuizOpeningMessageNotNull(Quiz quiz);
     
        #endregion

        #region "QuestionPage "
        Task<int> InitializeQuizResultSummaryAndQuizCompilation(Quiz quiz,QuizPageQuestions quizPageQuestions, QuizQuestions quizQuestions, int userId);
        //QuizPageQuestion GetFirstQuestionNumberToLoadOnQuestionPage(QuizPageQuestions quizPageQuestions);
        QuizPageQuestion GetQuizPageOnQuestionpage(QuizPageQuestions quizPageQuestions, int quizQuestionNo);
        int CalculateMultipleChioceAnswerQuestionsScore(List<QuizPageAndQuestionDetails> questionAndResult,QuizQuestions quizQuestions);
        QuizPageQuestions CheckQuizPagesHavePageQuestionId(QuizPageQuestions quizPageQuestions);
        QuizQuestions GetMatchedQuizQuestionsFromQuizPage(QuizPageQuestion currentQuizPageQuestion, QuizQuestions quizQuestions);
        float CalculateRecommendedTimeForQuizQuestion(float timeAllotted);
        float CalculateTotalAllottedTimeFromRecommendedTime(QuizQuestions quizQuestions);
        QuizPageQuestion GetNextQuizPageDetails(QuizPageQuestion currentQuizPageQuestion,QuizPageQuestions quizPageQuestions);
        QuizPageQuestion GetPreviousQuizPageDetails(QuizPageQuestion currentQuizPageQuestion,QuizPageQuestions quizPageQuestions);
        bool SaveAnswerOfQuestion(Quiz quiz, QuizResult currentQuizResult, bool setAnswer, bool setScore,bool setIsAnsweringDone,bool setTime, int userId, ref int quizResultSummaryId);
        QuizResult GetQuizResultBasedOnQuizQuestion(Quiz quiz, QuizQuestion currentQuizQuestion, int userId, [Optional]int quizResultSummaryId);
        double CalculateTimeSpendForMultiShortQuestion(float marksOfQuestion, float totalMarksOfQuestion, float totalTimeTakenForAllQueOfPage);
        //int SetAndGetRemainingtime(int timeRemaing, bool setValue, string cacheKey);
        //int SetValueOfFirstQuestionToHidePreviousButton(int questionNo, bool setValue, string cacheKey);

        #endregion

        #region "ResultsPage "
        double GetRelativeRank(Quiz quiz, int iScoreSystem, int score, string strFieldName);
        int GetStateAverages(Quiz quiz, int iScoreSystem,int totalMaxScoreOfQuiz, ref int medianTimeTaken, int medianScore,int currentScore=0,int currentTimeTaken=0);
        ResultsPageDetailList GetResultsPageDetailListForQuiz(QuizQuestions quizQuestions,Quiz quiz,int quizResultSummaryId);
        double GetQuestionAnsweredCorrectly(Quiz quiz, QuizQuestion quizQuestion, int iScoreSystem);
        int GetTotalMaxScoreAfterQuizCompletion(string hiddenCode, QuizQuestions quizQuestions);
        int GetUserScoresAfterQuizCompletion(string hiddenCode, Quiz quiz,QuizQuestions quizQuestions, int userId, int quizResultSummaryId);
        Task<int> GetUserTimeTakenAfterQuizCompletion(Quiz quiz, QuizQuestions quizQuestions, int userId, int quizResultSummaryId);        
        bool UpdateQuizResultSummaryOnQuizCompletion(Quiz quiz, int totalUserScore, int totalMaxScoreForQuiz,
            int totalTimeTakenByUser, int userId,int quizResultSummaryId );
        string CheckQuestionBeenAnsweredAndUpdateQuizResSum(QuizQuestions quizQuestions, Quiz quiz,
            int userId, ref int totalTimeTaken);
        int GetUserQuizAttemptNo(int quizResultSummaryId, int userId);

        #endregion

        #region "AnswerDrillPage "
        Task<QuizQuestion> GetQuestionDetailsForQuizQuestionId(Quiz quiz, int questionId, QuizQuestions quizQuestions);
        int GetCurrentQuestionNumber(QuizPageQuestions quizPageQuestions, int questionId);
        Resource GetSolutionResourceDetailsForQuestion(QuizQuestion quizQuestion, string resourceFilePath);
        #endregion

        #region "QuizManager "
        Task<IEnumerable<QuizDefine>> GetListOfActiveQuizzes(int userId);
        Task<List<QuizManagerDetail>> GetQuizManagerDetailList(Quiz quiz, IEnumerable<QuizDefine> quizDefineList, int userId);

        #endregion

        #region "SelfScoringIntroPage "
        Task<int> GetSelfScoringQuestionsCount(Quiz quiz, QuizQuestions quizQuestions, QuizPageQuestions quizPageQuestions, int quizResultSummaryId);
        Task<QuizPageQuestion> GetFirstQuestionNoOnSelfScoringPageLoad(Quiz quiz, int userId, QuizPageQuestions quizPageQuestions,QuizQuestions quizQuestions);

        #endregion

        #region "SelfScoringQuestionPage "

        QuizPageQuestions CheckQuizPagesHaveSelfScoringPageType(QuizPageQuestions quizPageQuestions, QuizQuestions quizQuestions);
        QuizPageQuestion GetSelfScoringQuizPageBasedOnQuestionNo(QuizPageQuestions quizPageQuestions,int quizPageNo);

        Task<int> GetNextQuestionNumberForSelfScoringQuestionPage(Quiz quiz, QuizQuestions quizQuestions,QuizPageQuestions quizPageQuestions,
            int quizResultSummaryId, int currentQuestionNo);

        int GetPreviousQuestionNumberForSelfScoringQuestionPage(int currentQuestionNo, QuizQuestions quizquestions, QuizPageQuestions quizPageQuestions);

        #endregion

        #region "SaveAndPausedPage "
        Task<int> GetQuizResultSummaryIdForResumedQuiz(Quiz quiz, int userId);
        Task<QuizPageQuestion> GetQuizQuestionForResumeQuiz(int quizResultSummaryId, QuizPageQuestions quizPageQuestions,Quiz quiz);
        Task<bool> CheckScoreGivenToSelfScoringQuestionsForResumeQuiz(int userId, int quizResultSummaryId);

        #endregion

        #region "Quiz - Allotted Timer Expire Page between Self-scoring Que and Result Page"
        Task<bool> GetQuestionNoToSelfScoreAfterTimerExpired(string hiddenCode, int idOfQuiz, int resultSummaryId, QuizQuestions quizQuestions);

        #endregion
        void Dispose();
       
    }
}
