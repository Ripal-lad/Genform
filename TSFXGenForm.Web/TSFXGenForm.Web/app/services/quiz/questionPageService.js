// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var questionPageService = (function () {
    //Constructor
    function questionPageService($resource) {
        this.$resource = $resource;
        this.getQuizSettings = this.$resource(apiPaths.getQuizSettingDetails);
        this.initializeQuizResultSummaryAndQuizCompilationEntities = this.$resource(apiPaths.initializeQuizResultSummaryAndQuizCompilation);
        this.getTotalCountOfQuestions = this.$resource(apiPaths.getTotalNumberOfQuestions);
        this.getTotalAllottedTimeToCompleteQuiz = this.$resource(apiPaths.getTotalAllottedTimeForQuiz);
        this.saveUserAnswersOfQuestions = this.$resource(apiPaths.saveAnswersOfQuestions);
        this.getPreviousQuizPageDetailsOfQuiz = this.$resource(apiPaths.getPreviousQuizPageOfQuiz);
        this.getTotalSelfScoringQuestionsCount = this.$resource(apiPaths.getSelfScoringQuestionsCount);
        this.checkIfQuizQuestionPageIsSaveAndPaused = this.$resource(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser);
        this.getTotalTimeTakenByUserToCompleteQuiz = this.$resource(apiPaths.getTotalTimeTakenByUser);
        this.getNextQuizPageDetailsOfQuiz = this.$resource(apiPaths.getNextQuizPageOfQuiz);
        this.setAndGetRemainingtimeFromCache = this.$resource(apiPaths.setAndGetRemainingtime);
        this.getQuestionAndPageDetails = this.$resource(apiPaths.getQuestionAndPageDetailsForQuestionPage);
        this.storeTimerExpired = this.$resource(apiPaths.storeTimerExpiredvalue);
        this.setValueOfQuestionToHidePreviousButton = this.$resource(apiPaths.setValueOfFirstQuestionToHidePreviousButton);
        this.getDetailsForResultsPageLoad = this.$resource(apiPaths.getDetailsOnResultsPageLoad);
    }
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getQuizSettingDetails = function (hiddenCode) {
        return this.getQuizSettings.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.initializeQuizResultSummaryAndQuizCompilation = function (hiddenCode, userId) {
        return this.initializeQuizResultSummaryAndQuizCompilationEntities.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getTotalNumberOfQuestions = function (hiddenCode) {
        return this.getTotalCountOfQuestions.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getTotalAllottedTimeForQuiz = function (hiddenCode) {
        return this.getTotalAllottedTimeToCompleteQuiz.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.saveAnswersOfQuestions = function (questionAndResult) {
        return this.saveUserAnswersOfQuestions.save(questionAndResult).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getPreviousQuizPageOfQuiz = function (hiddenCode, questionNumber) {
        return this.getPreviousQuizPageDetailsOfQuiz.get({ hiddenCode: hiddenCode, questionNumber: questionNumber }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getSelfScoringQuestionsCount = function (hiddenCode, resultSummaryId) {
        return this.getTotalSelfScoringQuestionsCount.get({ hiddenCode: hiddenCode, quizResultSummaryId: resultSummaryId }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.checkIfQuizQuestionPageIsSaveAndPausedByUser = function (hiddenCode, userId) {
        return this.checkIfQuizQuestionPageIsSaveAndPaused.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getTotalTimeTakenByUser = function (hiddenCode, userId, quizResultSummaryId) {
        return this.getTotalTimeTakenByUserToCompleteQuiz.get({ hiddenCode: hiddenCode, userId: userId, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    questionPageService.prototype.getNextQuizPageOfQuiz = function (questionAndResult) {
        return this.getNextQuizPageDetailsOfQuiz.save(questionAndResult).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.setAndGetRemainingtime = function (timeRemaining, setValue, hiddenCode, userId) {
        return this.setAndGetRemainingtimeFromCache.get({ timeRemaining: timeRemaining, setValue: setValue, hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getQuestionAndPageDetailsForQuestionPage = function (hiddenCode, questionNumber, userId) {
        return this.getQuestionAndPageDetails.query({ hiddenCode: hiddenCode, questionNumber: questionNumber, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.storeTimerExpiredvalue = function (isTimerExpired) {
        return this.storeTimerExpired.get({ isTimerExpired: isTimerExpired }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.setValueOfFirstQuestionToHidePreviousButton = function (questionNo, setValue, hiddenCode, userId) {
        return this.setValueOfQuestionToHidePreviousButton.get({ questionNo: questionNo, setValue: setValue, hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    questionPageService.prototype.getDetailsOnResultsPageLoad = function (hiddenCode, userId, prevRoutePageController, quizResultSummaryId) {
        return this.getDetailsForResultsPageLoad.get({ hiddenCode: hiddenCode, UserId: userId, prevRoutePageController: prevRoutePageController, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    questionPageService.serviceId = "questionPageService";
    return questionPageService;
})();
app.factory(questionPageService.serviceId, ['$resource', function ($resource) { return new questionPageService($resource); }]);
//# sourceMappingURL=questionPageService.js.map