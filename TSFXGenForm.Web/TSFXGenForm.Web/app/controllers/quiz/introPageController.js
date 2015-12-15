// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
var IntroPageController = (function () {
    //Contsructor.
    function IntroPageController($scope, $timeout, $sce, $cookieStore, $rootScope, $routeParams, introPageSevice, $mdDialog, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$sce = $sce;
        this.$cookieStore = $cookieStore;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.introPageSevice = introPageSevice;
        this.$mdDialog = $mdDialog;
        this.$location = $location;
        this.$log = $log;
        this.userId = 1;
        $scope.title = "introPageController";
        this.$scope.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.$scope.pageOpeningMessage = "";
        this.$scope.pageOpeninMessagetitle = "";
        this.$scope.pageEndMessage = "";
        this.$scope.buttonShow = false;
        this.$scope.progressBarValue = true;
        this.$scope.introPageContentvalue = false;
        this.$scope.availableQuizMessageValue = false;
        this.$scope.countDownTimerValue = false;
        this.$scope.path = "";
        this.$rootScope.quizName = "";
        angular.element(".add-disable").removeClass("disable-btn"); //Remove class from disable event
        this.ips4MemberId = this.$routeParams.ips4_member_id;
        this.ips4IpSessionFront = this.$routeParams.ips4_IPSessionFront;
        this.$scope.myQuizzes = function () { return _this.myQuizzes(); };
        this.$scope.beginQuiz = function () { return _this.beginQuiz(); };
        $cookieStore.put('ips4_member_id', this.ips4MemberId);
        $cookieStore.put('ips4_IPSessionFront', this.ips4IpSessionFront);
        //this.$cookies.put('ips4_IPSessionFront', this.ips4IpSessionFront);
        if (this.$scope.hiddenCode == null || this.$scope.hiddenCode == undefined || this.$scope.hiddenCode == "undefined") {
            this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Route params are not defined.");
        }
        else {
            //If user has permission to view quiz.
            //Call methods
            this.getCurrentQuizName();
            this.checkQuizIsAvailableorNotAndInitializeQuiz();
            this.checkQuizBeingResumed();
        }
        //For to set height of Iframe in IpBoard
        $timeout(function () {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);
    }
    //Get current quiz name
    IntroPageController.prototype.getCurrentQuizName = function () {
        var _this = this;
        this.introPageSevice.getCurrentQuizName(this.$scope.hiddenCode).then(function (quizName) {
            if (quizName != null) {
                _this.$scope.quizTitle = quizName.result;
                _this.$rootScope.quizName = quizName.result;
            }
            else {
                _this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi -Xml file does not contain quiz name..");
                _this.$location.path('/');
            }
        });
    };
    //Methods  which will be call on load.
    IntroPageController.prototype.checkQuizIsAvailableorNotAndInitializeQuiz = function () {
        var _this = this;
        //check whether Quiz is available or not.
        this.introPageSevice.checkQuizIsAvailableOrNot(this.$scope.hiddenCode).then(function (isAvailable) {
            //If quiz is available than add details to Quiz define table and bind details to uI.
            if (isAvailable.result.IsQuizValidated) {
                _this.$scope.availableQuizMessageValue = false;
                _this.introPageSevice.initializeQuizDefineOnPageLoad(_this.$scope.hiddenCode).then(function (initiateQuizDefine) {
                    if (initiateQuizDefine.result) {
                        //Call method to bind details to UI.
                        _this.getQuizIntroPageDetailsAndBindToUi();
                    }
                    else {
                        _this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Error in initiate database");
                    }
                });
            }
            else {
                //If quiz is unavailable.
                //Disable buttons.
                angular.element(".add-disable").addClass("disable-btn");
                _this.$scope.message = isAvailable.result.Message;
                _this.$scope.availableQuizMessageValue = true;
                _this.getQuizIntroPageDetailsAndBindToUi();
            }
        });
    };
    //Get details of introPage and bind it to UI.
    IntroPageController.prototype.getQuizIntroPageDetailsAndBindToUi = function () {
        var _this = this;
        //Get details to display on the UI.
        this.introPageSevice.getDetailsForIntroPage(this.$scope.hiddenCode).then(function (introPageDetails) {
            if (introPageDetails != null && introPageDetails != undefined) {
                var introPageData = introPageDetails;
                _this.$rootScope.showStartCountDownTimer = introPageDetails.ShowStartCountDownTimer;
                if (introPageData.PreviousAttemptMessage != null && introPageData.OpeningMessageTitle && introPageData.OpeningMessageEnd != null) {
                    //var pageOpeningMsg = introPageData.OpeningMessage;
                    var pageOpeningMsg = introPageData.PreviousAttemptMessage;
                    var pageOpeninMSgtitle = introPageData.OpeningMessageTitle;
                    var pageEndMsg = introPageData.OpeningMessageEnd;
                    //Make  unsafe code safe.
                    _this.$scope.pageOpeningMessage = _this.$sce.trustAsHtml(pageOpeningMsg);
                    _this.$scope.pageOpeninMessagetitle = _this.$sce.trustAsHtml(pageOpeninMSgtitle);
                    _this.$scope.pageEndMessage = _this.$sce.trustAsHtml(pageEndMsg);
                    _this.$scope.buttonShow = true;
                    _this.$scope.progressBarValue = false; //Stop progress bar.
                    _this.$scope.introPageContentvalue = true; //show quizmanagerpage details to UI.
                }
                else {
                    _this.$location.path('/');
                    _this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Intro Page details are null");
                }
            }
            else {
                _this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Intro Page contains null values");
                _this.$location.path('/');
            }
        });
    };
    //Method to check whether the Quiz is resumed or not.
    IntroPageController.prototype.checkQuizBeingResumed = function () {
        var _this = this;
        this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.$scope.hiddenCode, this.userId).then(function (quizResumed) {
            if (quizResumed.result != 0) {
                _this.quizResultSummaryId = quizResumed.result;
                _this.$rootScope.beginQuizName = "Resume Quiz";
            }
            else {
                _this.$rootScope.beginQuizName = "Begin Quiz";
            }
        });
    };
    //Redirect to self scoring intro page.
    IntroPageController.prototype.redirectResultPageOrSelfScoring = function (resultSummaryId) {
        var _this = this;
        this.introPageSevice.getSelfScoringQuestionsCount(this.$scope.hiddenCode, resultSummaryId).then(function (selfScoringQuestion) {
            if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                var selfScoringQuestionCount = selfScoringQuestion.result;
                _this.$location.path("/quiz-selfscoringintro/" + _this.$scope.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1);
            }
            else {
                _this.$scope.path = "/quiz-result/" + _this.$scope.hiddenCode + "/" + resultSummaryId;
                _this.$location.path(_this.$scope.path);
            }
        });
    };
    //My quizzes button click event.
    IntroPageController.prototype.myQuizzes = function () {
        var path = "/quiz-quizmanager/" + this.$scope.hiddenCode;
        this.$location.path(path);
    };
    //Begin button click event
    IntroPageController.prototype.beginQuiz = function () {
        var _this = this;
        if (this.ips4MemberId != null || this.ips4MemberId != undefined || this.ips4IpSessionFront != null || this.ips4IpSessionFront != undefined) {
            var promise = this.introPageSevice.ipBoardGroupPermission(this.ips4MemberId, this.ips4IpSessionFront);
            promise.then(function (isUserAllowedToViewQuiz) {
                if (isUserAllowedToViewQuiz.result) {
                    //Check whether to show countDownTimer or not.
                    if (!_this.$rootScope.showStartCountDownTimer) {
                        if (_this.$rootScope.beginQuizName != "Resume Quiz") {
                            //If quiz is not resumed then start from the first question.
                            _this.introPageSevice.getFirstQuestionNumberToLoadOnQuestionPage(_this.$scope.hiddenCode).then(function (firstQuestionPage) {
                                _this.$scope.countDownTimerValue = true;
                                _this.$scope.introPageContentvalue = false;
                                if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {
                                    _this.questionNumber = firstQuestionPage.QuestionNumber;
                                    var path = "/quiz-question/" + _this.$scope.hiddenCode + "/" + _this.questionNumber;
                                    _this.$location.path(path);
                                }
                                else {
                                    _this.$log.log("Intropagecontroller - beginQuiz -first question number not found.");
                                }
                            });
                        }
                        else {
                            //Get questiondetials to resume Quiz.
                            _this.introPageSevice.getQuizPageQuestionToResumeQuiz(_this.$scope.hiddenCode, _this.userId).then(function (resumeQuizQuestion) {
                                if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {
                                    _this.questionNumber = resumeQuizQuestion.result.QuestionNumber;
                                    _this.$scope.path = "/quiz-question/" + _this.$scope.hiddenCode + "/" + _this.questionNumber;
                                    _this.$location.path(_this.$scope.path);
                                }
                                else {
                                    //If all the questions of the Quiz are answered and not self scored yet.
                                    _this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(_this.$scope.hiddenCode, _this.userId).then(function (selfScoring) {
                                        if (!selfScoring.result) {
                                            _this.redirectResultPageOrSelfScoring(_this.quizResultSummaryId);
                                        }
                                        else {
                                            _this.$scope.path = "/quiz-result/" + _this.$scope.hiddenCode + "/" + _this.quizResultSummaryId;
                                            _this.$location.path(_this.$scope.path);
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        // If count down timer is to be shown then redirect to CountDownTimerPage.
                        var path = "/quiz-countdowntimer/" + _this.$scope.hiddenCode;
                        _this.$location.path(path);
                    }
                }
                else {
                    _this.$mdDialog.show(_this.$mdDialog.alert({
                        title: 'Alert box !!',
                        content: "You must log in to access this quiz.",
                        ok: 'Ok',
                        escapetoclose: false,
                        clickoutsidetoclose: false
                    }));
                }
            });
            promise.catch(function () {
                _this.$log.log("Intropagecontroller - beginQuiz -Exception in ipBoardGroupPermission");
            });
        }
        else {
            this.$log.log("Intropagecontroller - beginQuiz -Cookie values are not defined");
        }
    };
    IntroPageController.controllerId = "IntroPageController";
    return IntroPageController;
})();
app.controller(IntroPageController.controllerId, ['$scope', '$timeout', '$sce', '$cookieStore', '$rootScope', '$routeParams', 'introPageSevice', '$mdDialog', '$location', '$log', function ($scope, $timeout, $sce, $cookieStore, $rootScope, $routeParams, introPageSevice, $mdDialog, $location, $log) { return new IntroPageController($scope, $timeout, $sce, $cookieStore, $rootScope, $routeParams, introPageSevice, $mdDialog, $location, $log); }]);
//# sourceMappingURL=introPageController.js.map