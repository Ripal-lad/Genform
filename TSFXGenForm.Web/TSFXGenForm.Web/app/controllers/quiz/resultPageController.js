/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
var ResultPageController = (function () {
    //Constructor.
    function ResultPageController($scope, $rootScope, $cookieStore, prevRoutePromiseGetter, $sce, $routeParams, resultPageService, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$cookieStore = $cookieStore;
        this.prevRoutePromiseGetter = prevRoutePromiseGetter;
        this.$sce = $sce;
        this.$routeParams = $routeParams;
        this.resultPageService = resultPageService;
        this.$location = $location;
        this.$log = $log;
        $scope.title = "ResultPageController";
        this.hiddenCode = $routeParams.hiddenCode;
        this.quizResultSummaryId = $routeParams.quizResultSummaryId;
        this.$scope.questionResultDetails = new Array();
        this.$scope.answerDrillPage = function (question) { return _this.answerDrillPage(question); };
        this.$scope.myQuizzes = function () { return _this.myQuizzes(); };
        this.$scope.beginQuiz = function () { return _this.beginQuiz(); };
        this.userId = 1;
        //Get cookies of IPBoard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        if (this.hiddenCode != null && this.hiddenCode != undefined && this.quizResultSummaryId != null && this.quizResultSummaryId != undefined) {
            //Get the previous route.
            prevRoutePromiseGetter().then(function (prevRoute) {
                _this.prevRoutePageController = prevRoute;
                _this.getQuizSettings();
            });
        }
        else {
            this.$log.log("ResultPageController - construtor - RouteParams are not defined");
        }
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    ResultPageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Get quiz settings.
    ResultPageController.prototype.getQuizSettings = function () {
        var _this = this;
        //Get quizSettings details details.
        this.resultPageService.getQuizSettingDetails(this.hiddenCode).then(function (quizSettingdetails) {
            if (quizSettingdetails != null && quizSettingdetails != undefined) {
                _this.getDetailsOfResultHeader(_this.prevRoutePageController, quizSettingdetails.AttemptsAllowed);
                var quizSettings = quizSettingdetails;
                _this.$scope.quizSettings = quizSettings;
                _this.$scope.quizName = quizSettings.Name;
                //Check to display question rows.
                if (quizSettings.ShowScoreBreakdown) {
                    _this.$scope.showScoreBreakDownValue = true;
                }
                else {
                    _this.$scope.showScoreBreakDownValue = false;
                }
                //Check to display Relative rank and state averages.
                if (quizSettings.ShowScoreAverages) {
                    _this.$scope.showScoreAveragesValue = true;
                }
                else {
                    _this.$scope.showScoreAveragesValue = false;
                }
                if (quizSettings.ScoreSystem == 1) {
                    _this.$scope.attempt = "First";
                }
                else if (quizSettings.ScoreSystem == 2) {
                    _this.$scope.attempt = "Best";
                }
                else if (quizSettings.ScoreSystem == 3) {
                    _this.$scope.attempt = "Current";
                }
            }
            else {
                _this.$log.log("ResultPageController - getQuizSettings() - Quiz setings are not available");
            }
        });
    };
    //Get list of questions to dispaly in a raw.
    ResultPageController.prototype.getResultDetailsListForQuestionRaws = function () {
        var _this = this;
        //Get details of result page for questionraw.
        this.resultPageService.getResultsPageListOnPageLoad(this.hiddenCode, this.quizResultSummaryId).then(function (quizResult) {
            var shortAnswerQuestionTimerExpired;
            var multipleChoiceTimerExpiredValue;
            var shortAnswerMarks;
            var multipleChoiceImage;
            if (quizResult.result != undefined && quizResult.result != null && quizResult.result != "" && quizResult.result.ListOfResultsPageDetail.length > 0) {
                var count = quizResult.result.ListOfResultsPageDetail.length;
                for (var i = 0; i < count; i++) {
                    //If user has given all the answers in time.
                    if (quizResult.result.ListOfResultsPageDetail[i].IsQuestionAnsInTime) {
                        shortAnswerQuestionTimerExpired = false;
                        multipleChoiceTimerExpiredValue = false;
                        shortAnswerMarks = true;
                        multipleChoiceImage = false;
                        if (quizResult.result.ListOfResultsPageDetail[i].QuestionType == 1) {
                            shortAnswerMarks = false;
                            multipleChoiceImage = true;
                            if (quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore == 0) {
                                _this.$scope.wrongAnswerValue = true;
                                _this.$scope.correctAnswerValue = false;
                            }
                            else if (quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore >= 1) {
                                _this.$scope.wrongAnswerValue = false;
                                _this.$scope.correctAnswerValue = true;
                            }
                        }
                        _this.$scope.questionResultDetails.push({ questionNumber: quizResult.result.ListOfResultsPageDetail[i].QuestionNumber, questionId: quizResult.result.ListOfResultsPageDetail[i].QuestionId, userScoreOutOfMaxScore: quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore, questionAnsweredCorrectly: quizResult.result.ListOfResultsPageDetail[i].QuestionAnsweredCorrectly, questionType: quizResult.result.ListOfResultsPageDetail[i].QuestionType, shortAnswerQuestionTimerExpiredValue: shortAnswerQuestionTimerExpired, multipleChoiceTimerExpiredValue: multipleChoiceTimerExpiredValue, shortAnswerMarksValue: shortAnswerMarks, multipleChoiceImageValue: multipleChoiceImage, correctAnswerValue: _this.$scope.correctAnswerValue, wrongAnswerValue: _this.$scope.wrongAnswerValue });
                    }
                    else {
                        //  if (quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore == null || quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore == 0) {
                        if (quizResult.result.ListOfResultsPageDetail[i].IsQuizResultExists) {
                            //If user has not answered in time.
                            if (quizResult.result.ListOfResultsPageDetail[i].QuestionType == 1) {
                                shortAnswerQuestionTimerExpired = false;
                                multipleChoiceTimerExpiredValue = true;
                                shortAnswerMarks = false;
                                multipleChoiceImage = false;
                            }
                            else if (quizResult.result.ListOfResultsPageDetail[i].QuestionType == 2) {
                                var splittedScore = quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore.split("/");
                                //If user has selected View Result options from the confirm box if once timer gets expired.
                                if (splittedScore[0] == "") {
                                    splittedScore[0] = splittedScore[1];
                                }
                                if (splittedScore[0] <= 1) {
                                    _this.$scope.userScore = splittedScore[0] + " mark"; //Bind score to tooltip.
                                }
                                else {
                                    _this.$scope.userScore = splittedScore[0] + " marks";
                                }
                                _this.$scope.maxScore = splittedScore[1]; //Bind score to tooltip.
                                shortAnswerQuestionTimerExpired = true;
                                multipleChoiceTimerExpiredValue = false;
                                shortAnswerMarks = false;
                                multipleChoiceImage = false;
                            }
                        }
                        else {
                            //If user has not answered the questions.
                            _this.$scope.wrongAnswerValue = true;
                            shortAnswerQuestionTimerExpired = false;
                            multipleChoiceTimerExpiredValue = false;
                            shortAnswerMarks = false;
                            multipleChoiceImage = true;
                        }
                        _this.$scope.questionResultDetails.push({ questionNumber: quizResult.result.ListOfResultsPageDetail[i].QuestionNumber, questionId: quizResult.result.ListOfResultsPageDetail[i].QuestionId, userScoreOutOfMaxScore: quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore, questionAnsweredCorrectly: quizResult.result.ListOfResultsPageDetail[i].QuestionAnsweredCorrectly, questionType: quizResult.result.ListOfResultsPageDetail[i].QuestionType, shortAnswerQuestionTimerExpiredValue: shortAnswerQuestionTimerExpired, multipleChoiceTimerExpiredValue: multipleChoiceTimerExpiredValue, shortAnswerMarksValue: shortAnswerMarks, multipleChoiceImageValue: multipleChoiceImage, wrongAnswerValue: _this.$scope.wrongAnswerValue, maxScore: _this.$scope.maxScore, userScore: _this.$scope.userScore });
                    }
                }
                _this.$scope.resultPageDetailsValue = true;
                _this.$scope.progressBarValue = false;
            }
            else {
                _this.$log.log("ResultPageController - GetResultsPageListOnPageLoad() - returned null value");
            }
        });
    };
    //Get details to display state averages and relative score at header.
    ResultPageController.prototype.getDetailsOfResultHeader = function (prevRoutePageController, attemptsAllowed) {
        var _this = this;
        //Load quiz result page.
        this.resultPageService.getDetailsOnResultsPageLoad(this.hiddenCode, this.userId, prevRoutePageController, this.quizResultSummaryId).then(function (relativeAndStateAverages) {
            if (relativeAndStateAverages.result != null && relativeAndStateAverages.result != undefined && relativeAndStateAverages.result != "") {
                //Call function to get details of the questions raws.
                _this.getResultDetailsListForQuestionRaws();
                _this.$scope.relativeRank = relativeAndStateAverages.result.RelativeRank;
                _this.$scope.relativeRankTimeTaken = relativeAndStateAverages.result.RelativeRankTimeTaken;
                //Calculations for your score.
                //Score
                var yourScore = relativeAndStateAverages.result.YourScore;
                var maxScore = relativeAndStateAverages.result.MaxScore;
                _this.$scope.yourScorePercentage = Math.round((yourScore * 100) / maxScore);
                _this.$scope.yourScoreString = yourScore + " out of " + maxScore + " ";
                //Time
                var yourScoreTime = relativeAndStateAverages.result.YourScoreTimeTaken;
                _this.$scope.yourScoreTimeInSeconds = yourScoreTime % 60;
                _this.$scope.Math = Math;
                _this.$scope.yourScoreTimeInMinutes = Math.floor(yourScoreTime / 60);
                //Calculations for stateaverages.
                //Score
                var stateAverage = relativeAndStateAverages.result.StateAverages;
                _this.$scope.stateAveragePercentage = Math.round((stateAverage * 100) / maxScore);
                _this.$scope.stateAverageString = stateAverage + " out of " + maxScore + " (";
                //Time
                var stateAverageTime = relativeAndStateAverages.result.StateAveragesTimeTaken;
                _this.$scope.stateAverageTimeInSeconds = stateAverageTime % 60;
                _this.$scope.Math = Math;
                _this.$scope.stateAverageTimeInMinutes = Math.floor(stateAverageTime / 60);
                //Whether user is allowed to attempt the quiz again.
                if (attemptsAllowed > relativeAndStateAverages.result.AttemptNumber || attemptsAllowed == 0) {
                    _this.$scope.showTryAgainButton = true;
                }
                else {
                    _this.$scope.showTryAgainButton = false;
                }
            }
            else {
                _this.$log.log("ResultPageController - GetDetailsOnResultsPageLoad() - returned null value");
            }
        });
    };
    //Answer link click event.
    ResultPageController.prototype.answerDrillPage = function (question) {
        var questionNumber = question.questionNumber;
        var path = "#/quiz-answerdrill/" + this.hiddenCode + "/" + questionNumber + "/" + this.quizResultSummaryId;
        return path;
    };
    //MyQuizzes button click event.
    ResultPageController.prototype.myQuizzes = function () {
        var path = "/quiz-quizmanager/" + this.hiddenCode;
        this.$location.path(path);
    };
    //Begin quiz when user clicks on Try again.
    ResultPageController.prototype.beginQuiz = function () {
        //Redirect to intro page.
        this.$scope.path = "/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront;
        this.$location.path(this.$scope.path);
        ////Check whether to display Intro page or not.
        //if ($scope.quizSettings.ShowIntroductionPage) {
        //    //Redirect to intro page.
        //    $scope.path = "/quiz-intro/" + hiddenCode;
        //    $location.path($scope.path);
        //} else {
        //    if ($scope.quizSettings.ShowStartCountDownTimer) {
        //        $scope.path = "/quiz-countdowntimer/" + hiddenCode;
        //        $location.path($scope.path);
        //    } else {
        //        //If intro page is not to be shown then redirect directly to Question page.
        //        //Get first question number to redirect directly to question page.
        //        resultPageService.GetFirstQuestionNumberToLoadOnQuestionPage(hiddenCode).then(function (firstQuestionPage) {
        //            if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {
        //                var questionNumber = firstQuestionPage.QuestionNumber;
        //                $scope.path = "/quiz-question/" + hiddenCode + "/" + questionNumber;
        //                $location.path($scope.path);
        //            } else {
        //            this.$log.log("ResultPageController - beginQuiz() - First question number not found");
        //            }
        //        });
        //    }
        //}
    };
    ResultPageController.controllerId = "ResultPageController";
    return ResultPageController;
})();
app.controller(ResultPageController.controllerId, ['$scope', '$rootScope', '$cookieStore', 'prevRoutePromiseGetter', '$sce', '$routeParams', 'resultPageService', '$location', '$log', function ($scope, $rootScope, $cookieStore, prevRoutePromiseGetter, $sce, $routeParams, resultPageService, $location, $log) { return new ResultPageController($scope, $rootScope, $cookieStore, prevRoutePromiseGetter, $sce, $routeParams, resultPageService, $location, $log); }]);
//# sourceMappingURL=resultPageController.js.map