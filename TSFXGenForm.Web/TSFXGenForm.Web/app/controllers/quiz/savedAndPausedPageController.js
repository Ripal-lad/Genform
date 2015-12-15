// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var App;
(function (App) {
    "use strict";
    var SavedAndPausedPageController = (function () {
        function SavedAndPausedPageController($scope, $rootScope, $cookieStore, $routeParams, savedAndPausedPageService, introPageSevice, $location, $log) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$cookieStore = $cookieStore;
            this.$routeParams = $routeParams;
            this.savedAndPausedPageService = savedAndPausedPageService;
            this.introPageSevice = introPageSevice;
            this.$location = $location;
            this.$log = $log;
            $scope.title = "SavedAndPausedPageController";
            this.hiddenCode = $routeParams.hiddenCode;
            this.quizResultSummaryId = $routeParams.quizResultSummaryId;
            this.userId = 1;
            this.$scope.progressBarValue = false; //Start progress bar.
            this.$scope.pageDetailsValue = true; //Hide quizmanagerpage details to UI.
            this.$scope.beginQuizName = "Resume Quiz";
            this.$scope.myQuizzes = function () { return _this.myQuizzes(); };
            this.$scope.resumeQuiz = function () { return _this.resumeQuiz(); };
            //Get cookies of IPBoard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            if (this.hiddenCode != null && this.quizResultSummaryId != null && this.quizResultSummaryId != 0 && this.quizResultSummaryId != "undefined" && this.hiddenCode != "undefined") {
                this.getQuizName();
                this.getTotalAllottedtime();
            }
            else {
                this.$log.log("SavedAndPausedPageController - Constructor - RouteParams are not defined");
            }
            //Broadcast from browserBackButtonForOtherPages directive.
            $rootScope.$on("onRouteChangeEvent", function (event, result) {
                $rootScope.$on('$locationChangeStart', function () {
                    _this.goBack();
                });
            });
        }
        //If browser back buton is clicked then redirect it to IntroPage.
        SavedAndPausedPageController.prototype.goBack = function () {
            if (!this.$rootScope.browserBackIsClicked) {
                this.$rootScope.browserBackIsClicked = true;
                this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
            }
        };
        //Get quizname.
        SavedAndPausedPageController.prototype.getQuizName = function () {
            var _this = this;
            this.savedAndPausedPageService.getCurrentQuizName(this.hiddenCode).then(function (quizName) {
                _this.$scope.quizTitle = quizName.result;
            });
        };
        //Get total allotted time for quiz.
        SavedAndPausedPageController.prototype.getTotalAllottedtime = function () {
            var _this = this;
            //Get total allotted time for quiz.
            this.savedAndPausedPageService.getTotalAllottedTimeForQuiz(this.hiddenCode).then(function (totalAllottedTime) {
                //Get total time taken by user.
                _this.savedAndPausedPageService.getTotalTimeTakenByUser(_this.hiddenCode, _this.userId, _this.quizResultSummaryId).then(function (userTakenTime) {
                    if (totalAllottedTime.result != 0 && userTakenTime.result != 0) {
                        _this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                    }
                    else if (totalAllottedTime.result != 0 && userTakenTime.result == 0) {
                        _this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                        _this.$log.log("SavedAndPausedPageController - getTotalAllottedtime() - User time taken not found");
                    }
                    else if (totalAllottedTime.result == 0 && userTakenTime.result != 0) {
                        _this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                        _this.$log.log("SavedAndPausedPageController - getTotalAllottedtime() - Total allotted time not found");
                    }
                    else {
                        _this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                        _this.$log.log("SavedAndPausedPageController - getTotalAllottedtime() - Total allotted time and user time taken not found");
                    }
                });
            });
        };
        //Set the timerString.
        SavedAndPausedPageController.prototype.timerString = function (minutes, seconds) {
            var minuteString = "";
            var secondString = "";
            if (minutes > 1 || minutes < -1) {
                minuteString = "Minutes";
            }
            else {
                minuteString = "Minute";
            }
            if (seconds > 1 || seconds < -1) {
                secondString = "Seconds";
            }
            else {
                secondString = "Second";
            }
            var timerString = minutes + " " + minuteString + " " + seconds + " " + secondString;
            return timerString;
        };
        //Calculate time.
        SavedAndPausedPageController.prototype.calculateTime = function (totalAllottedTime, userTakenTime) {
            //calculate total allotted time.
            var allottedTimeSeconds = totalAllottedTime % 60;
            var allottedTimeMinutes = Math.floor(totalAllottedTime / 60);
            var allottedTimeString = this.timerString(allottedTimeMinutes, allottedTimeSeconds);
            this.$scope.timeAllowed = allottedTimeString;
            //calculate time taken by user.
            var timeTakenSeconds = userTakenTime % 60;
            var timeTakenMinutes = Math.floor(userTakenTime / 60);
            var timeTakenString = this.timerString(timeTakenMinutes, timeTakenSeconds);
            this.$scope.timeTaken = timeTakenString;
            //calculate remaining time for to complete the quiz.
            var remainingTime = totalAllottedTime - userTakenTime;
            var remainingTimeString;
            var remainingTimeSeconds;
            var remainingTimeMinutes;
            if (remainingTime > 0) {
                //If time remaining is greater than zero than take floor value.
                remainingTimeSeconds = remainingTime % 60;
                ;
                remainingTimeMinutes = Math.floor(remainingTime / 60);
                remainingTimeString = this.timerString(remainingTimeMinutes, remainingTimeSeconds);
                this.$scope.timeRemaining = remainingTimeString;
            }
            else {
                //If time remaining is greater than zero than take ceil value.
                remainingTimeSeconds = remainingTime % 60;
                ;
                remainingTimeMinutes = Math.ceil(remainingTime / 60);
                remainingTimeString = this.timerString(remainingTimeMinutes, remainingTimeSeconds);
                this.$scope.timeRemaining = remainingTimeString;
            }
            this.$scope.progressBarValue = false; //Stop progress bar.
            this.$scope.pageDetailsValue = true; //show quizmanagerpage details to UI.
        };
        //Redirect to selfscoringintropage if all the questions of the quiz has been answered.
        SavedAndPausedPageController.prototype.redirectResultPageOrSelfScoring = function (resultSummaryId) {
            var _this = this;
            this.introPageSevice.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then(function (selfScoringQuestion) {
                if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                    var selfScoringQuestionCount = selfScoringQuestion.result;
                    _this.$location.path("/quiz-selfscoringintro/" + _this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1);
                }
                else {
                    _this.$location.path("/quiz-result/" + _this.hiddenCode + "/" + resultSummaryId);
                }
            });
        };
        //MyQuizzes button click event.
        SavedAndPausedPageController.prototype.myQuizzes = function () {
            this.$rootScope.browserBackIsClicked = true;
            var path = "/quiz-quizmanager/" + this.hiddenCode;
            this.$location.path(path);
        };
        //Resume button click event.
        SavedAndPausedPageController.prototype.resumeQuiz = function () {
            var _this = this;
            this.$rootScope.browserBackIsClicked = true;
            //Check if quiz is saved and paused by user.
            this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then(function (quizResumed) {
                if (quizResumed.result != 0) {
                    //Get question number to resume quiz.
                    _this.introPageSevice.getQuizPageQuestionToResumeQuiz(_this.hiddenCode, _this.userId).then(function (resumeQuizQuestion) {
                        var resultSummaryId = quizResumed.result;
                        if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {
                            var questionNo = resumeQuizQuestion.result.QuestionNumber;
                            _this.$scope.path = "/quiz-question/" + _this.hiddenCode + "/" + questionNo;
                            _this.$location.path(_this.$scope.path);
                        }
                        else {
                            //Check if all the questions of the quiz has been nswered b the user and self score is remained.
                            _this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(_this.hiddenCode, _this.userId).then(function (selfScoring) {
                                if (!selfScoring.result) {
                                    //Get self scoring question count.
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
                                    _this.$scope.path = "/quiz-result/" + _this.hiddenCode + "/" + _this.quizResultSummaryId;
                                    _this.$location.path(_this.$scope.path);
                                }
                            });
                        }
                    });
                }
                else {
                    _this.$log.log("SavedAndPausedPageController - resumeQuiz() - QuizResulSummaryId not found.");
                }
            });
        };
        SavedAndPausedPageController.controllerId = "SavedAndPausedPageController";
        return SavedAndPausedPageController;
    })();
    app.controller(SavedAndPausedPageController.controllerId, ['$scope', '$rootScope', '$cookieStore', '$routeParams', 'savedAndPausedPageService', 'introPageSevice', '$location', '$log', function ($scope, $rootScope, $cookieStore, $routeParams, savedAndPausedPageService, introPageSevice, $location, $log) { return new SavedAndPausedPageController($scope, $rootScope, $cookieStore, $routeParams, savedAndPausedPageService, introPageSevice, $location, $log); }]);
})(App || (App = {}));
//# sourceMappingURL=savedAndPausedPageController.js.map