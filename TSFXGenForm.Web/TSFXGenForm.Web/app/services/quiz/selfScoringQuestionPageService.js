var selfScoringQuestionPageService = (function () {
    //Constructor
    function selfScoringQuestionPageService($resource) {
        this.$resource = $resource;
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getQuestionDetailsForSelfScoringQuestionPage = this.$resource(apiPaths.getQuestionForSelfScoringQuestionPage);
        this.getNextQuizPageDetailsOfSelfScoringQuestion = this.$resource(apiPaths.getNextQuizPageOfSelfScoringQuestion);
        this.getPreviousQuizPageDetailsOfSelfScoringQuestion = this.$resource(apiPaths.getPreviousQuizPageOfSelfScoringQuestion);
        this.getTotalSelfScoringQuestionsCount = this.$resource(apiPaths.getSelfScoringQuestionsCount);
        this.checkIfQuizIsSaveAndPausedByUser = this.$resource(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser);
        this.setValueOfFirstQuestionToHidePreviousButtonOnFirstQuestion = this.$resource(apiPaths.setValueOfFirstQuestionToHidePreviousButton);
    }
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.getCurrentQuizName = function (hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.getQuestionForSelfScoringQuestionPage = function (hiddenCode, quizQuestionNo, userId) {
        return this.getQuestionDetailsForSelfScoringQuestionPage.get({ hiddenCode: hiddenCode, quizQuestionNo: quizQuestionNo, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.getNextQuizPageOfSelfScoringQuestion = function (quizQuestionsAndAnswerDetails) {
        return this.getNextQuizPageDetailsOfSelfScoringQuestion.save(quizQuestionsAndAnswerDetails).$promise;
    };
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.getPreviousQuizPageOfSelfScoringQuestion = function (hiddenCode, quizQuestionNo, userId) {
        return this.getPreviousQuizPageDetailsOfSelfScoringQuestion.get({ hiddenCode: hiddenCode, quizQuestionNo: quizQuestionNo, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.getSelfScoringQuestionsCount = function (hiddenCode, quizResultSummaryId) {
        return this.getTotalSelfScoringQuestionsCount.get({ hiddenCode: hiddenCode, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.checkIfQuizQuestionPageIsSaveAndPausedByUser = function (hiddenCode, userId) {
        return this.checkIfQuizIsSaveAndPausedByUser.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Returns details of QuizManagerPage.
    selfScoringQuestionPageService.prototype.setValueOfFirstQuestionToHidePreviousButton = function (questionNo, setValue, hiddenCode, userId) {
        return this.setValueOfFirstQuestionToHidePreviousButtonOnFirstQuestion.get({ questionNo: questionNo, setValue: setValue, hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    selfScoringQuestionPageService.serviceId = "selfScoringQuestionPageService";
    return selfScoringQuestionPageService;
})();
app.factory(selfScoringQuestionPageService.serviceId, ['$resource', function ($resource) { return new selfScoringQuestionPageService($resource); }]);
//# sourceMappingURL=selfScoringQuestionPageService.js.map