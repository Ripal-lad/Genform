// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var CountDownController = (function () {
    function CountDownController($scope, $rootScope, introPageSevice, $interval, $location, $routeParams, $timeout, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.introPageSevice = introPageSevice;
        this.$interval = $interval;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$timeout = $timeout;
        this.$log = $log;
        $scope.title = "CountDownController";
        this.hiddenCode = this.$routeParams.hiddenCode;
        this.$scope.counter = 5;
        this.userId = 1;
        this.$scope.progressBarValue = true; //Start progress bar.
        this.$scope.pageDetailsValue = false; //Hide details.
        if (this.hiddenCode != null && this.hiddenCode != undefined) {
            this.beginQuiz();
        }
        else {
            this.$log.log("CountDownController - constructor - Routeparams are not defined ");
        }
        $rootScope.$on('$locationChangeSuccess', function () {
            $interval.cancel(_this.myInterval);
        });
        //For to set height of Iframe in IpBoard
        $timeout(function () {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);
    }
    //Redirect to self scoring intro page                 .
    CountDownController.prototype.redirectResultPageOrSelfScoring = function (resultSummaryId) {
        var _this = this;
        this.introPageSevice.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then(function (selfScoringQuestion) {
            if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                var selfScoringQuestionCount = selfScoringQuestion.result;
                _this.$scope.path = "/quiz-selfscoringintro/" + _this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1;
                _this.$scope.progressBarValue = false; //Stop progress bar.
                _this.$scope.pageDetailsValue = true; //Show details.
                //Interval to show countdown timer.
                _this.myInterval = _this.$interval(function () {
                    _this.$scope.counter--;
                    if (_this.$scope.counter == 0) {
                        _this.$scope.isGo = true;
                        angular.element(".count-down").toggleClass("count-down-bg");
                    }
                    else if (_this.$scope.counter < 0) {
                        _this.$scope.counter = 0;
                        _this.$interval.cancel(_this.myInterval);
                        _this.$location.path(_this.$scope.path);
                    }
                    else {
                        _this.$scope.isGo = false;
                        angular.element(".count-down").toggleClass("count-down-bg");
                    }
                }, 1000);
            }
            else {
                _this.$rootScope.browserBackIsClicked = true;
                //If self scoring questions are not available then redirect to Result page.
                _this.$scope.path = "/quiz-result/" + _this.hiddenCode + "/" + resultSummaryId;
                //Interval to show countdown timer.
                _this.myInterval = _this.$interval(function () {
                    _this.$scope.counter--;
                    if (_this.$scope.counter == 0) {
                        _this.$scope.isGo = true;
                        angular.element(".count-down").toggleClass("count-down-bg");
                    }
                    else if (_this.$scope.counter < 0) {
                        _this.$scope.counter = 0;
                        _this.$interval.cancel(_this.myInterval);
                        _this.$location.path(_this.$scope.path);
                    }
                    else {
                        _this.$scope.isGo = false;
                        angular.element(".count-down").toggleClass("count-down-bg");
                    }
                }, 1000);
            }
        });
    };
    //Start Cpount down timer.
    CountDownController.prototype.beginQuiz = function () {
        var _this = this;
        var path = "";
        this.$rootScope.browserBackIsClicked = true;
        this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then(function (quizResumed) {
            var quizResultSummaryId = quizResumed.result;
            if (quizResumed.result == 0) {
                //If quiz is not resumed then start from the first question.
                _this.introPageSevice.getFirstQuestionNumberToLoadOnQuestionPage(_this.hiddenCode).then(function (firstQuestionPage) {
                    if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {
                        var questionNumber = firstQuestionPage.QuestionNumber;
                        _this.$scope.path = "/quiz-question/" + _this.hiddenCode + "/" + questionNumber;
                        _this.$scope.progressBarValue = false; //Stop progress bar.
                        _this.$scope.pageDetailsValue = true; //Show details.
                        //Interval to show countdown timer.
                        _this.myInterval = _this.$interval(function () {
                            _this.$scope.counter--;
                            if (_this.$scope.counter == 0) {
                                //mytimeout = $timeout($scope.onTimeout, 1000);
                                _this.$scope.isGo = true;
                                angular.element(".count-down").toggleClass("count-down-bg");
                            }
                            else if (_this.$scope.counter < 0) {
                                _this.$scope.counter = 0;
                                //     angular.element(".count-down").toggleClass("count-down-bg");
                                _this.$interval.cancel(_this.myInterval);
                                _this.$location.path(_this.$scope.path);
                            }
                            else {
                                _this.$scope.isGo = false;
                                //mytimeout = $timeout($scope.onTimeout, 1000);
                                angular.element(".count-down").toggleClass("count-down-bg");
                            }
                        }, 1000);
                    }
                    else {
                        _this.$log.log("CountDownController - beginQuiz() - First question number not found. ");
                    }
                });
            }
            else {
                //Get questiondetials to resume Quiz.
                _this.introPageSevice.getQuizPageQuestionToResumeQuiz(_this.hiddenCode, _this.userId).then(function (resumeQuizQuestion) {
                    if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {
                        _this.$scope.progressBarValue = false; //Stop progress bar.
                        _this.$scope.pageDetailsValue = true; //Show details.
                        var questionNumber = resumeQuizQuestion.result.QuestionNumber;
                        _this.$scope.path = "/quiz-question/" + _this.hiddenCode + "/" + questionNumber;
                        //Interval to show countdown timer.
                        _this.myInterval = _this.$interval(function () {
                            _this.$scope.counter--;
                            if (_this.$scope.counter == 0) {
                                _this.$scope.isGo = true;
                                angular.element(".count-down").toggleClass("count-down-bg");
                            }
                            else if (_this.$scope.counter < 0) {
                                _this.$scope.counter = 0;
                                _this.$interval.cancel(_this.myInterval);
                                _this.$location.path(_this.$scope.path);
                            }
                            else if (_this.$scope.counter > 0) {
                                _this.$scope.isGo = false;
                                angular.element(".count-down").toggleClass("count-down-bg");
                            }
                        }, 1000);
                    }
                    else {
                        //If all the questions of the Quiz are answered and not self scored yet.
                        _this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(_this.hiddenCode, _this.userId).then(function (selfScoring) {
                            if (!selfScoring.result) {
                                //If there questions remained to self score then redirect to Self Scoring IntroPage.
                                quizResultSummaryId = quizResumed.result;
                                _this.redirectResultPageOrSelfScoring(quizResultSummaryId);
                            }
                            else {
                                //If all the questions are self scored then redirect to ResultPage.
                                _this.$scope.path = "/quiz-result/" + _this.hiddenCode + "/" + quizResultSummaryId;
                                //Interval to show countdown timer.
                                _this.myInterval = _this.$interval(function () {
                                    _this.$scope.counter--;
                                    if (_this.$scope.counter == 0) {
                                        _this.$scope.isGo = true;
                                        angular.element(".count-down").toggleClass("count-down-bg");
                                    }
                                    else if (_this.$scope.counter < 0) {
                                        _this.$scope.counter = 0;
                                        _this.$interval.cancel(_this.myInterval);
                                        _this.$location.path(_this.$scope.path);
                                    }
                                    else if (_this.$scope.counter > 0) {
                                        _this.$scope.isGo = false;
                                        angular.element(".count-down").toggleClass("count-down-bg");
                                    }
                                }, 1000);
                            }
                        });
                    }
                });
            }
        });
    };
    CountDownController.controllerId = "CountDownController";
    return CountDownController;
})();
app.controller(CountDownController.controllerId, ['$scope', '$rootScope', 'introPageSevice', '$interval', '$location', '$routeParams', '$timeout', '$log', function ($scope, $rootScope, introPageSevice, $interval, $location, $routeParams, $timeout, $log) { return new CountDownController($scope, $rootScope, introPageSevice, $interval, $location, $routeParams, $timeout, $log); }]);
//# sourceMappingURL=countDownController.js.map