// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var answerDrillPageService = (function () {
    //Constructor
    function answerDrillPageService($resource) {
        this.$resource = $resource;
        this.getTotalCountOfQuestions = this.$resource(apiPaths.getTotalNumberOfQuestions);
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getQuestionAndAnswersForAnswerDrillResultPage = this.$resource(apiPaths.getQuestionAndAnswerDetailsForAnswerDrillResultPage);
    }
    //Returns details of QuizManagerPage.
    answerDrillPageService.prototype.getTotalNumberOfQuestions = function (hiddenCode) {
        return this.getTotalCountOfQuestions.get({ hiddenCode: hiddenCode }).$promise;
    };
    answerDrillPageService.prototype.getCurrentQuizName = function (hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    };
    answerDrillPageService.prototype.getQuestionAndAnswerDetailsForAnswerDrillResultPage = function (hiddenCode, quizQuestionNo, userId, quizResultSummaryId) {
        return this.getQuestionAndAnswersForAnswerDrillResultPage.get({ hiddenCode: hiddenCode, quizQuestionNo: quizQuestionNo, userId: userId, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    answerDrillPageService.serviceId = "answerDrillPageService";
    return answerDrillPageService;
})();
app.factory(answerDrillPageService.serviceId, ['$resource', function ($resource) { return new answerDrillPageService($resource); }]);
//# sourceMappingURL=answerDrillPageService.js.map