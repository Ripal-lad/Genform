// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var QuizManagerPageController = (function () {
    //Constructor.
    function QuizManagerPageController($scope, $timeout, $cookieStore, $routeParams, $rootScope, quizManagerPageService, introPageSevice, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$cookieStore = $cookieStore;
        this.$routeParams = $routeParams;
        this.$rootScope = $rootScope;
        this.quizManagerPageService = quizManagerPageService;
        this.introPageSevice = introPageSevice;
        this.$location = $location;
        this.$log = $log;
        this.userId = 1;
        $scope.title = "QuizManagerPageController";
        this.$scope.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.$scope.relativeRankAndScoreLable = false;
        this.$scope.footerValue = false;
        this.$scope.quizNameLink = false;
        this.$scope.quizName = true;
        this.$scope.quizManagerHeader = "";
        this.$scope.progressBarValue = true; //Start progress bar.
        this.$scope.quizManageDetailValue = false; //Hide quizmanagerpage details.
        this.$scope.quizManagerDetials = new Array();
        this.$scope.resultClick = function (quizDetails) { return _this.resultClick(quizDetails); };
        this.$scope.beginQuiz = function (quizDetails) { return _this.beginQuiz(quizDetails); };
        //Get cookies of IPboard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        $scope.path = "";
        if (this.$scope.hiddenCode != null && this.$scope.hiddenCode != undefined) {
            this.getQuizManagerPageDetails();
        }
        else {
            this.$log.log("Quizmanagercontroller - constructor - RouteParams are not defined");
        }
        //Broadcast from browserBackButtonForOtherPages directive.
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    QuizManagerPageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.$scope.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Get details of QuizManagerPage.
    QuizManagerPageController.prototype.getQuizManagerPageDetails = function () {
        var _this = this;
        //Get details of quizmanagerpage.
        this.quizManagerPageService.getQuizDetailListForQuizManagerPage(this.$scope.hiddenCode, this.userId).then(function (quizManagerResult) {
            if (quizManagerResult != null) {
                //Call method to bind details to UI.
                _this.bindDetailsToUi(quizManagerResult);
            }
            else {
                _this.$log.log("Quizmanagercontroller - getQuizManagerPageDetails - QuizManager class return null value");
                _this.$location.path('/');
            }
        });
    };
    //Bind data to quizmanager page.
    QuizManagerPageController.prototype.bindDetailsToUi = function (quizManagerResult) {
        var count = quizManagerResult.length;
        for (var i = 0; i < count; i++) {
            var relativeRankAndScoreValue = true;
            this.$scope.relativeRankAndScoreLable = true;
            this.$scope.footerValue = false;
            this.$scope.quizNameLink = false;
            this.$scope.quizName = true;
            this.$scope.quizManagerHeader = "My Quiz Results";
            //check whether user has completed quiz if not then show "In Progress."
            if (quizManagerResult[i].DueDate != null && quizManagerResult[i].EndDate == null && quizManagerResult[i].StartDate != null) {
                quizManagerResult[i].EndDate = "In Progress";
                relativeRankAndScoreValue = false;
            }
            //Check whether user has started quiz or not.
            if (quizManagerResult[i].DueDate != null && quizManagerResult[i].EndDate == null && quizManagerResult[i].StartDate == null) {
                this.$scope.relativeRankAndScoreLable = false;
                relativeRankAndScoreValue = false;
                this.$scope.quizManagerHeader = "Quizzes that Require Completion";
                this.$scope.footerValue = true;
                this.$scope.quizNameLink = true;
                this.$scope.quizName = false;
            }
            //Push data into array to display.
            this.$scope.quizManagerDetials.push({
                quizName: quizManagerResult[i].QuizTitle,
                dueDate: quizManagerResult[i].DueDate,
                endDate: quizManagerResult[i].EndDate,
                score: quizManagerResult[i].Score,
                relativeRank: quizManagerResult[i].RelativeRankValue,
                relativeAndScoreValue: relativeRankAndScoreValue,
                quizResultSummaryId: quizManagerResult[i].QuizResultSummaryId
            });
        }
        this.$scope.progressBarValue = false; //Stop progress bar.
        this.$scope.quizManageDetailValue = true; //show quizmanagerpage details to UI.
    };
    //Redirect to QuestionPage or SelfScoringIntroPage or Count down timer page.
    QuizManagerPageController.prototype.redirectToQuestionpageWithoutDisplayingIntroPage = function (quizdetails, quizSettings) {
        var _this = this;
        //If count down timer page is to be shown then redirect it to Count Down Timer Page.
        if (quizSettings.ShowStartCountDownTimer) {
            this.$scope.path = "/quiz-countdowntimer/" + this.$scope.hiddenCode;
            this.$location.path(this.$scope.path);
        }
        else {
            //If Count down timer page is to not be shown.
            //Get questiondetials to resume Quiz.
            this.introPageSevice.getQuizPageQuestionToResumeQuiz(this.$scope.hiddenCode, this.userId).then(function (resumeQuizQuestion) {
                if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {
                    var questionNumber = resumeQuizQuestion.result.QuestionNumber;
                    _this.$scope.path = "/quiz-question/" + _this.$scope.hiddenCode + "/" + questionNumber;
                    _this.$location.path(_this.$scope.path);
                }
                else {
                    //If all the questions of the Quiz are answered and not self scored yet.
                    _this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(_this.$scope.hiddenCode, _this.userId).then(function (selfScoring) {
                        if (!selfScoring.result) {
                            _this.introPageSevice.getSelfScoringQuestionsCount(_this.$scope.hiddenCode, quizdetails.quizResultSummaryId).then(function (selfScoringQuestion) {
                                if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                                    var selfScoringQuestionCount = selfScoringQuestion.result;
                                    _this.$scope.path = "/quiz-selfscoringintro/" + _this.$scope.hiddenCode + "/" + selfScoringQuestionCount + "/" + quizdetails.quizResultSummaryId + "/" + 1;
                                    _this.$location.path(_this.$scope.path);
                                }
                                else {
                                    _this.$log.log("Quizmanagercontroller - getQuizManagerPageDetails - selfScoringQuestion questions count not available");
                                }
                            });
                        }
                        else {
                            //Redirect to ResultPage.
                            _this.$scope.path = "/quiz-result/" + _this.$scope.hiddenCode + "/" + quizdetails.quizResultSummaryId;
                            _this.$location.path(_this.$scope.path);
                        }
                    });
                }
            });
        }
    };
    //Redirect to result page or Intro page.
    QuizManagerPageController.prototype.resultClick = function (quizdetails) {
        var _this = this;
        if (quizdetails != undefined && quizdetails != null) {
            //If Quiz is not completed by user.
            if (quizdetails.endDate == "In Progress" && quizdetails.endDate != null) {
                //get Quiz setting s to check whether to display intro page or not.
                this.introPageSevice.getDetailsForIntroPage(this.$scope.hiddenCode).then(function (quizSettings) {
                    if (quizSettings != null && quizSettings != undefined && quizSettings != "null") {
                        if (quizSettings.ShowIntroductionPage) {
                            //Redirect to intro page if Intro page is to be shown.
                            _this.$scope.path = "/quiz-intro/" + _this.$scope.hiddenCode + "/" + _this.ips4MemberId + "/" + _this.ips4IpSessionFront;
                            _this.$location.path(_this.$scope.path);
                        }
                        else {
                            //Redirect to Question page without displaying intro page.
                            _this.redirectToQuestionpageWithoutDisplayingIntroPage(quizdetails, quizSettings);
                        }
                    }
                });
            }
            else if (quizdetails.endDate != null && quizdetails.endDate != "In Progress") {
                var quizResultSummaryId = quizdetails.quizResultSummaryId;
                if (quizdetails.quizResultSummaryId != 0) {
                    this.$scope.path = "/quiz-result/" + this.$scope.hiddenCode + "/" + quizResultSummaryId;
                    this.$location.path(this.$scope.path);
                }
                else {
                    this.$log.log("Quizmanagercontroller - resultClick - SummaryId not found");
                }
            }
        }
        ;
    };
    //Redirect to intro page if user has not given any of the Quiz.
    QuizManagerPageController.prototype.beginQuiz = function (quizdetails) {
        var _this = this;
        if (quizdetails != undefined && quizdetails != null) {
            this.introPageSevice.getDetailsForIntroPage(this.$scope.hiddenCode).then(function (quizSettings) {
                //Check whether to show intro Page or not.
                if (quizSettings.ShowIntroductionPage) {
                    _this.$scope.path = "/quiz-intro/" + _this.$scope.hiddenCode + "/" + _this.ips4MemberId + "/" + _this.ips4IpSessionFront;
                    _this.$location.path(_this.$scope.path);
                }
                else {
                    //Check whether to show countDownTimer or not.
                    if (quizSettings.ShowStartCountDownTimer) {
                        _this.$scope.path = "/quiz-countdowntimer/" + _this.$scope.hiddenCode;
                        _this.$location.path(_this.$scope.path);
                    }
                    else {
                        //If intro page is not to be shown then redirect directly to Question page.
                        //Get first question number to redirect directly to question page.
                        _this.introPageSevice.getFirstQuestionNumberToLoadOnQuestionPage(_this.$scope.hiddenCode).then(function (firstQuestionPage) {
                            if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {
                                var questionNumber = firstQuestionPage.QuestionNumber;
                                _this.$scope.path = "/quiz-question/" + _this.$scope.hiddenCode + "/" + questionNumber;
                                _this.$location.path(_this.$scope.path);
                            }
                            else {
                                _this.$log.log("Quizmanagercontroller - beginQuiz -First question number not found.");
                            }
                        });
                    }
                }
            });
        }
    };
    QuizManagerPageController.controllerId = "QuizManagerPageController";
    return QuizManagerPageController;
})();
app.controller(QuizManagerPageController.controllerId, ['$scope', '$timeout', '$cookieStore', '$routeParams', '$rootScope', 'quizManagerPageService', 'introPageSevice', '$location', '$log', function ($scope, $timeout, $cookieStore, $routeParams, $rootScope, quizManagerPageService, introPageSevice, $location, $log) { return new QuizManagerPageController($scope, $timeout, $cookieStore, $routeParams, $rootScope, quizManagerPageService, introPageSevice, $location, $log); }]);
//# sourceMappingURL=quizManagerPageController.js.map