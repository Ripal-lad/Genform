// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var selfScoringIntroPageService = (function () {
    //Constructor
    function selfScoringIntroPageService($resource) {
        this.$resource = $resource;
        this.getSelfScoringQuestionNoToLoadPage = this.$resource(apiPaths.getFirstSelfScoringQuestionNo);
        this.getQuestionNoeAfterTimerExpiredToSelfScore = this.$resource(apiPaths.getQuestionNoToSelfScoreAfterTimerExpired);
        this.getTotalTimeTakenByUserToCompleteTheQuiz = this.$resource(apiPaths.getTotalTimeTakenByUser);
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
    }
    //Returns question number to self score.
    selfScoringIntroPageService.prototype.getFirstSelfScoringQuestionNo = function (hiddenCode, userId) {
        return this.getSelfScoringQuestionNoToLoadPage.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Returns question number to self score after timer gets expired.
    selfScoringIntroPageService.prototype.getQuestionNoToSelfScoreAfterTimerExpired = function (hiddenCode, quizResultSummaryId) {
        return this.getQuestionNoeAfterTimerExpiredToSelfScore.get({ hiddenCode: hiddenCode, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    //Returns totlal time taken by user to complete the quiz.
    selfScoringIntroPageService.prototype.getTotalTimeTakenByUser = function (hiddenCode, userId, quizResultSummaryId) {
        return this.getTotalTimeTakenByUserToCompleteTheQuiz.get({ hiddenCode: hiddenCode, userId: userId, quizResultSummaryId: quizResultSummaryId }).$promise;
    };
    //Returns current quiz name.
    selfScoringIntroPageService.prototype.getCurrentQuizName = function (hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    };
    selfScoringIntroPageService.serviceId = "selfScoringIntroPageService";
    return selfScoringIntroPageService;
})();
app.factory(selfScoringIntroPageService.serviceId, ['$resource', function ($resource) { return new selfScoringIntroPageService($resource); }]);
//# sourceMappingURL=selfScoringIntroPageService.js.map