// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var SelfScoringIntroPageController = (function () {
    function SelfScoringIntroPageController($scope, $rootScope, $cookieStore, $routeParams, selfScoringIntroPageService, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$cookieStore = $cookieStore;
        this.$routeParams = $routeParams;
        this.selfScoringIntroPageService = selfScoringIntroPageService;
        this.$location = $location;
        this.$log = $log;
        this.userId = 1;
        $scope.title = "selfScoringIntroPageController";
        this.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.quizResultSummaryId = this.$routeParams.quizResultSummaryId;
        this.selfScoringQuestionCount = this.$routeParams.selfScoringQuestionCount;
        this.isTimerExpired = this.$routeParams.isTimerExpired;
        this.$scope.progressBarValue = true; //Start progress bar.
        this.$scope.pageDetailsValue = false; //Hide details.
        this.$scope.selfScoringQuestionsCount = 0;
        this.isContinueClick = false;
        this.$scope.continueClick = function () { return _this.continueClick(); };
        //Get cookies of IPBoard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        if (this.hiddenCode != null && this.isTimerExpired != null && this.selfScoringQuestionCount != null && this.hiddenCode != "undefined" && this.selfScoringQuestionCount != "undefined") {
            this.getTotalTimeTakenByUser();
            this.getCurrentQuizName();
            this.$scope.selfScoringQuestionsCount = this.selfScoringQuestionCount;
            if (this.isTimerExpired == 1) {
                //To check whether the timer was expired for any of the question.
                this.checkWhetherTheTimerGetExpired();
            }
            else if (this.isTimerExpired == 0) {
                this.$scope.titleMessage = "The Allotted Quiz Time has Elapsed";
            }
        }
        else {
            this.$log.log("SelfScoringIntroPageController : constructor - RouteParams are not defined.");
        }
        //Broadcast from browserBackButtonForOtherPages directive.
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    SelfScoringIntroPageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked && !this.isContinueClick) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Get current Quiz name.
    SelfScoringIntroPageController.prototype.getCurrentQuizName = function () {
        var _this = this;
        this.selfScoringIntroPageService.getCurrentQuizName(this.hiddenCode).then(function (quizName) {
            if (quizName.result != null && quizName.result != "" && quizName.result != "null") {
                _this.$scope.quizTitle = quizName.result;
            }
        });
    };
    //Get total time taken by user.
    SelfScoringIntroPageController.prototype.getTotalTimeTakenByUser = function () {
        var _this = this;
        this.selfScoringIntroPageService.getTotalTimeTakenByUser(this.hiddenCode, this.userId, this.quizResultSummaryId).then(function (timeTaken) {
            if (timeTaken.result != null && timeTaken.result != "") {
                _this.$scope.seconds = timeTaken.result % 60;
                _this.$scope.Math = Math;
                _this.$scope.minutes = Math.floor(timeTaken.result / 60);
                _this.$scope.progressBarValue = false; //Stop progress bar.
                _this.$scope.pageDetailsValue = true; //Show details.
            }
            else {
                _this.$log.log("SelfScoringIntroPageController : getTotalTimeTakenByUser - Total time taken by user is not available.");
            }
        });
    };
    //To check whether the timer was expired for any of the question.
    SelfScoringIntroPageController.prototype.checkWhetherTheTimerGetExpired = function () {
        var _this = this;
        this.selfScoringIntroPageService.getQuestionNoToSelfScoreAfterTimerExpired(this.hiddenCode, this.quizResultSummaryId).then(function (isTimerExpired) {
            if (isTimerExpired.result) {
                _this.$scope.titleMessage = "The Allotted Quiz Time has Elapsed";
            }
            else {
                _this.$scope.titleMessage = "You Have Completed the Quiz";
            }
        });
    };
    //Continue button click event.
    SelfScoringIntroPageController.prototype.continueClick = function () {
        var _this = this;
        this.$rootScope.backIsNotClicked = true;
        this.isContinueClick = true;
        //Get quizpage no for pagetype 7.
        this.selfScoringIntroPageService.getFirstSelfScoringQuestionNo(this.hiddenCode, this.userId).then(function (quizPage) {
            if (quizPage.result != null && quizPage.result != "") {
                var questionNumber = quizPage.result.QuestionNumber;
                _this.$rootScope.backIsNotClicked = true;
                _this.isContinueClick = true;
                _this.$location.path("/quiz-selfscoringquestion/" + _this.hiddenCode + "/" + questionNumber + "/" + _this.isTimerExpired);
            }
            else {
                _this.$log.log("SelfScoringIntroPageController : continueClick() - Self scoring questions are not available.");
            }
        });
    };
    SelfScoringIntroPageController.controllerId = "SelfScoringIntroPageController";
    return SelfScoringIntroPageController;
})();
app.controller(SelfScoringIntroPageController.controllerId, ['$scope', '$rootScope', '$cookieStore', '$routeParams', 'selfScoringIntroPageService', '$location', '$log', function ($scope, $rootScope, $cookieStore, $routeParams, selfScoringIntroPageService, $location, $log) { return new SelfScoringIntroPageController($scope, $rootScope, $cookieStore, $routeParams, selfScoringIntroPageService, $location, $log); }]);
//# sourceMappingURL=selfScoringIntroPageController.js.map