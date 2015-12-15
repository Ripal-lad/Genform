// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var resultPageService = (function () {
    //Constructor
    function resultPageService($resource) {
        this.$resource = $resource;
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getResultsPageList = this.$resource(apiPaths.getResultsPageListOnPageLoad);
        this.getDetailsOfResults = this.$resource(apiPaths.getDetailsOnResultsPageLoad);
        this.getQuizSettings = this.$resource(apiPaths.getQuizSettingDetails);
    }
    //Returns current quiz name.
    resultPageService.prototype.getCurrentQuizName = function (hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Initialize quiz into QuizDefine table.
    resultPageService.prototype.getResultsPageListOnPageLoad = function (hiddenCode, quizResultSummaryId) {
        return this.getResultsPageList.get({ hiddenCode: hiddenCode, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    //Get details of quizintor page.
    resultPageService.prototype.getDetailsOnResultsPageLoad = function (hiddenCode, userId, prevRoutePageController, quizResultSummaryId) {
        return this.getDetailsOfResults.get({ hiddenCode: hiddenCode, UserId: userId, prevRoutePageController: prevRoutePageController, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    //Check if quiz is saved and paused by user.
    resultPageService.prototype.getQuizSettingDetails = function (hiddenCode) {
        return this.getQuizSettings.get({ hiddenCode: hiddenCode }).$promise;
    };
    resultPageService.serviceId = "resultPageService";
    return resultPageService;
})();
app.factory(resultPageService.serviceId, ['$resource', function ($resource) { return new resultPageService($resource); }]);
//# sourceMappingURL=resultPageService.js.map