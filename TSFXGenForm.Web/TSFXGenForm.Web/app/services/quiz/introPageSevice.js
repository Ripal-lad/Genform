// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var introPageSevice = (function () {
    //Constructor
    function introPageSevice($resource) {
        this.$resource = $resource;
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.checkIfQuizIsAvailableOrNot = this.$resource(apiPaths.checkQuizIsAvailableOrNot);
        this.initializeQuizDefineTable = this.$resource(apiPaths.initializeQuizDefineOnPageLoad);
        this.getDetailsToBindOnIntroPage = this.$resource(apiPaths.getDetailsForIntroPage);
        this.checkIfQuizIsSaveAndPausedByUser = this.$resource(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser);
        this.getFirstQuestionNumberOfQuiz = this.$resource(apiPaths.getFirstQuestionNumberToLoadOnQuestionPage);
        this.getQuestionNoToResumeQuiz = this.$resource(apiPaths.getQuizPageQuestionToResumeQuiz);
        this.checkIfSelfScoringQuestionIsSaveAndPaused = this.$resource(apiPaths.checkIfSelfScoringQuestionIsSaveAndPausedByUser);
        this.getCountOfSelfScoringQuestions = this.$resource(apiPaths.getSelfScoringQuestionsCount);
        this.permissionForIpBoardGroup = this.$resource(apiPaths.ipBoardGroupPermission);
    }
    //Returns current quiz name.
    introPageSevice.prototype.getCurrentQuizName = function (hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Check whether the quiz is available or not.
    introPageSevice.prototype.checkQuizIsAvailableOrNot = function (hiddenCode) {
        return this.checkIfQuizIsAvailableOrNot.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Initialize quiz into QuizDefine table.
    introPageSevice.prototype.initializeQuizDefineOnPageLoad = function (hiddenCode) {
        return this.initializeQuizDefineTable.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Get details of quizintor page.
    introPageSevice.prototype.getDetailsForIntroPage = function (hiddenCode) {
        return this.getDetailsToBindOnIntroPage.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Check if quiz is saved and paused by user.
    introPageSevice.prototype.checkIfQuizQuestionPageIsSaveAndPausedByUser = function (hiddenCode, userId) {
        return this.checkIfQuizIsSaveAndPausedByUser.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Get first question number.
    introPageSevice.prototype.getFirstQuestionNumberToLoadOnQuestionPage = function (hiddenCode) {
        return this.getFirstQuestionNumberOfQuiz.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Get question number if quiz is resumed.
    introPageSevice.prototype.getQuizPageQuestionToResumeQuiz = function (hiddenCode, userId) {
        return this.getQuestionNoToResumeQuiz.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Check if all the questions of the quiz is completed by user by self scroing is remained.
    introPageSevice.prototype.checkIfSelfScoringQuestionIsSaveAndPausedByUser = function (hiddenCode, userId) {
        return this.checkIfSelfScoringQuestionIsSaveAndPaused.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    //Get total number of self scoring question count.
    introPageSevice.prototype.getSelfScoringQuestionsCount = function (hiddenCode, resultSummaryId) {
        return this.getCountOfSelfScoringQuestions.get({ hiddenCode: hiddenCode, quizResultSummaryId: resultSummaryId }).$promise;
    };
    //Check whether the user has permission to view quiz.
    introPageSevice.prototype.ipBoardGroupPermission = function (ipBoardMemberId, ipCurrentUserSession) {
        return this.permissionForIpBoardGroup.get({ ipBoardMemberId: ipBoardMemberId, ipCurrentUserSession: ipCurrentUserSession }).$promise;
    };
    introPageSevice.serviceId = "introPageSevice";
    return introPageSevice;
})();
app.factory(introPageSevice.serviceId, ['$resource', function ($resource) { return new introPageSevice($resource); }]);
//# sourceMappingURL=introPageSevice.js.map