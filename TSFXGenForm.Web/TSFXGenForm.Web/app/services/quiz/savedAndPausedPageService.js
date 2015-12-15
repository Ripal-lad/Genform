// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var savedAndPausedPageService = (function () {
    //Constructor
    function savedAndPausedPageService($resource) {
        this.$resource = $resource;
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getTotalAllottedTimeToCompleteQuiz = this.$resource(apiPaths.getTotalAllottedTimeForQuiz);
        this.getTotalTimeTakenByUserToCompleteQuiz = this.$resource(apiPaths.getTotalTimeTakenByUser);
    }
    //Returns details of QuizManagerPage.
    savedAndPausedPageService.prototype.getCurrentQuizName = function (hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns details of QuizManagerPage.
    savedAndPausedPageService.prototype.getTotalAllottedTimeForQuiz = function (hiddenCode) {
        return this.getTotalAllottedTimeToCompleteQuiz.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns details of QuizManagerPage.
    savedAndPausedPageService.prototype.getTotalTimeTakenByUser = function (hiddenCode, userId, quizResultSummaryId) {
        return this.getTotalTimeTakenByUserToCompleteQuiz.get({ hiddenCode: hiddenCode, userId: userId, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    savedAndPausedPageService.serviceId = "savedAndPausedPageService";
    return savedAndPausedPageService;
})();
app.factory(savedAndPausedPageService.serviceId, ['$resource', function ($resource) { return new savedAndPausedPageService($resource); }]);
//# sourceMappingURL=savedAndPausedPageService.js.map