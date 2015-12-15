// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var TimerExpiredPageController = (function () {
    //Constructor.
    function TimerExpiredPageController($scope, $routeParams, $rootScope, $cookieStore, $location, introPageSevice, resultPageService, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$routeParams = $routeParams;
        this.$rootScope = $rootScope;
        this.$cookieStore = $cookieStore;
        this.$location = $location;
        this.introPageSevice = introPageSevice;
        this.resultPageService = resultPageService;
        this.$log = $log;
        $scope.title = "TimerExpiredPageController";
        this.hiddenCode = $routeParams.hiddenCode;
        this.quizResultSummaryId = $routeParams.quizResultSummaryId;
        this.userId = 1;
        this.finishQuizIsClicked = false;
        this.viewResultIsClicked = false;
        this.$scope.finishQuiz = function () { return _this.finishQuiz(); };
        this.$scope.viewResult = function () { return _this.viewResult(); };
        this.$scope.beginQuizName = "Resume Quiz";
        //Get cookies of IPBoard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        if (this.hiddenCode != null && this.quizResultSummaryId != null && this.quizResultSummaryId != 0 && this.hiddenCode != "undefined") {
            this.getQuizSettingDetails();
        }
        else {
            this.$log.log("TimerExpiredPageController - constructor - RouteParams are not defined");
        }
        //Broadcast from browserBackButtonForOtherPages directive.
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    TimerExpiredPageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked && !this.viewResultIsClicked && !this.finishQuizIsClicked) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Method to get Quizsettings
    TimerExpiredPageController.prototype.getQuizSettingDetails = function () {
        var _this = this;
        this.resultPageService.getQuizSettingDetails(this.hiddenCode).then(function (quizSettings) {
            if (quizSettings != null && quizSettings != undefined && quizSettings.result != "null") {
                _this.$scope.quizSettings = quizSettings.result;
                _this.$scope.pageDetails = true; //Show page details.
                _this.$scope.progressBarValue = false; //Hide prgressbar.
                _this.$scope.quizTitle = quizSettings.result.Name;
            }
            else {
                _this.$log.log("TimerExpiredPageController - getQuizSettingDetails() - Quiz settings are not available");
            }
        });
    };
    //View Result button click event to redirect it to Result page.
    TimerExpiredPageController.prototype.viewResult = function () {
        var _this = this;
        this.$rootScope.browserBackIsClicked = true;
        this.viewResultIsClicked = true;
        if (this.$scope.quizSettings.ShowResultsPage) {
            //If result page is to be shown.
            this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
            this.$location.path(this.$scope.path);
        }
        else {
            //If Result page is not to be shown then update QuizResultSummary table and redirect to endmessage page.
            this.resultPageService.getDetailsOnResultsPageLoad(this.hiddenCode, this.userId, "TimerExpiredPageController", this.quizResultSummaryId).then(function () {
                _this.$scope.path = "/quiz-endmessage/" + _this.hiddenCode;
                _this.$location.path(_this.$scope.path);
            });
        }
    };
    //Finish buton click event.
    TimerExpiredPageController.prototype.finishQuiz = function () {
        var _this = this;
        this.finishQuizIsClicked = true;
        this.$rootScope.browserBackIsClicked = true;
        //Check if quizquestions are remained  to attempt.
        this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then(function (quizResumed) {
            if (quizResumed.result != 0) {
                //If there are questions which are not attempted by user then get question number.
                _this.introPageSevice.getQuizPageQuestionToResumeQuiz(_this.hiddenCode, _this.userId).then(function (resumeQuizQuestion) {
                    var resultSummaryId = quizResumed.result;
                    if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {
                        var questionNo = resumeQuizQuestion.result.QuestionNumber;
                        _this.$scope.path = "/quiz-question/" + _this.hiddenCode + "/" + questionNo;
                        _this.$location.path(_this.$scope.path);
                    }
                    else {
                        //Check if questions are remained to self score.
                        _this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(_this.hiddenCode, _this.userId).then(function (selfScoring) {
                            if (!selfScoring.result) {
                                //$scope.redirectResultPageOrSelfScoring(quizResultSummaryId);
                                _this.introPageSevice.getSelfScoringQuestionsCount(_this.hiddenCode, resultSummaryId).then(function (selfScoringQuestion) {
                                    if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                                        var selfScoringQuestionCount = selfScoringQuestion.result;
                                        _this.$scope.path = "/quiz-selfscoringintro/" + _this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1;
                                        _this.$location.path(_this.$scope.path);
                                    }
                                    else {
                                        _this.$scope.path = "/quiz-result/" + _this.hiddenCode + "/" + _this.quizResultSummaryId;
                                        _this.$location.path(_this.$scope.path);
                                    }
                                });
                            }
                            else {
                                //If all the questions are attempted and self scored then let them to ResultPage.
                                _this.$scope.path = "/quiz-result/" + _this.hiddenCode + "/" + _this.quizResultSummaryId;
                                _this.$location.path(_this.$scope.path);
                            }
                        });
                    }
                });
            }
            else {
                _this.$log.log("TimerExpiredPageController - finishQuiz() - QuizResulSummaryId not found");
            }
        });
    };
    TimerExpiredPageController.controllerId = "TimerExpiredPageController";
    return TimerExpiredPageController;
})();
app.controller(TimerExpiredPageController.controllerId, ["$scope", "$routeParams", '$rootScope', '$cookieStore', '$location', 'introPageSevice', 'resultPageService', '$log', function ($scope, $routeParams, $rootScope, $cookieStore, $location, introPageSevice, resultPageService, $log) { return new TimerExpiredPageController($scope, $routeParams, $rootScope, $cookieStore, $location, introPageSevice, resultPageService, $log); }]);
//# sourceMappingURL=timerExpiredPageContoroller.js.map