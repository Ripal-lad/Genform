/// <reference path="../../../scripts/typings/ckeditor/ckeditor.d.ts" />
var SelfScoringQuestionPageController = (function () {
    //Contructor.
    function SelfScoringQuestionPageController($scope, $sce, $cookieStore, prevRoutePromiseGetter, $rootScope, $routeParams, selfScoringQuestionPageService, resultPageService, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$sce = $sce;
        this.$cookieStore = $cookieStore;
        this.prevRoutePromiseGetter = prevRoutePromiseGetter;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.selfScoringQuestionPageService = selfScoringQuestionPageService;
        this.resultPageService = resultPageService;
        this.$location = $location;
        this.$log = $log;
        angular.element("body").addClass("body-hidden");
        angular.element(".body-container").addClass("body-scroll");
        this.$rootScope.isCkEditorReadonly = true; //Ckeditor readonly.
        this.hiddenCode = $routeParams.hiddenCode;
        this.questionNumber = parseInt($routeParams.questionNumber);
        this.isTimerExpired = $routeParams.isTimerExpired;
        this.$scope.questionsValue = false; //Initially hide the QuestionDetils div.
        this.$scope.progressBarValue = true; //Start progress bar till the process get completed.
        this.nextIsClick = false;
        this.previousIsClick = false;
        this.userId = 1;
        this.$rootScope.isCkEditorReadonly = true;
        this.$scope.previousButtonValue = true; //Initially show previous button.
        this.$scope.nextButton = function (quizQuestionsAndAnswerDetails) { return _this.nextButton(quizQuestionsAndAnswerDetails); };
        this.$scope.previousButton = function (quizQuestionsAndAnswerDetails) { return _this.previousButton(quizQuestionsAndAnswerDetails); };
        //Get cookies of IPBoard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        if (this.questionNumber != null && this.isTimerExpired != null && this.questionNumber != "undefined" && this.questionNumber != undefined && this.hiddenCode != null && this.hiddenCode != "undefined" && this.hiddenCode != undefined) {
            this.getCurrentQuizName();
            this.gettQuestionAndResultDetails();
            this.getPrevRoteDetails();
        }
        else {
            this.$log.log("SelfScoringQuestionPageController - construtor - RouteParams are not defined ");
        }
        //Broadcast from browserBackButtonForOtherPages directive.
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    SelfScoringQuestionPageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked && !this.nextIsClick && !this.previousIsClick) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Display current quiz name.
    SelfScoringQuestionPageController.prototype.getCurrentQuizName = function () {
        var _this = this;
        //Call service to get current quiz name.
        this.selfScoringQuestionPageService.getCurrentQuizName(this.hiddenCode).then(function (quizName) {
            if (quizName != null && quizName != "null") {
                _this.$scope.quizName = quizName.result;
            }
        });
    };
    //Get previous route details.
    SelfScoringQuestionPageController.prototype.getPrevRoteDetails = function () {
        var _this = this;
        this.prevRoutePromiseGetter().then(function (prevRoute) {
            _this.$scope.preRouteController = prevRoute;
        });
    };
    //get question details to bind it by passing page no.
    SelfScoringQuestionPageController.prototype.gettQuestionAndResultDetails = function () {
        var _this = this;
        this.selfScoringQuestionPageService.getQuestionForSelfScoringQuestionPage(this.hiddenCode, this.questionNumber, this.userId).then(function (quizQuestionForFirstPage) {
            if (quizQuestionForFirstPage.result != "null" && quizQuestionForFirstPage.result != undefined && quizQuestionForFirstPage != null) {
                _this.checkForPreviousButton();
                _this.bindQuestionDetails(quizQuestionForFirstPage.result);
            }
            else {
                _this.$log.log("SelfScoringQuestionPageController - construtor - Question details contains null values.");
            }
        });
    };
    //Bind the question details to page.
    SelfScoringQuestionPageController.prototype.bindQuestionDetails = function (questions) {
        this.$scope.shortAndMultipleChoiceAnswerQuestion = [];
        this.$scope.questionNo = this.questionNumber;
        var count = questions.length;
        var questionImageCounter = 0;
        var solutionImageCounter = 1;
        for (var i = 0; i < count; i++) {
            this.$scope.maxScore = [];
            this.$rootScope.jwPlayerArray = [];
            if (questions[i].QuestionType == 2) {
                var marksCount = 0;
                var userScore;
                var maximumScore = questions[i].NumberOfMarks;
                //Check whether the solution contains Audio/Video.
                if (questions[i].URL != null && questions[i].AudioVideoImagePath != null) {
                    this.$scope.solutionImageValue = false; //Hide solutionImage.
                    this.$scope.audioVideoValue = true; //Show JWPlayer.
                    var length = questions[i].AudioVideoImagePath.length;
                    for (var j = 0; j < length; j++) {
                        //Push data into Array to bind resource details to JWPlayer.
                        this.$rootScope.jwPlayerArray.push({ index: "myElement_" + j + "_" + i, solutionResourceTitle: questions[i].SolutionResourceTitle, path: questions[i].AudioVideoImagePath[j] });
                    }
                }
                else {
                    //Show solutionImage and hide JWplayer.
                    this.$scope.solutionImageValue = true;
                    this.$scope.audioVideoValue = false;
                }
                while (marksCount <= maximumScore) {
                    this.$scope.maxScore.push({ mark: marksCount });
                    marksCount++;
                    if (marksCount == maximumScore) {
                        if (questions[i].Score == "null") {
                            userScore = "";
                        }
                        else {
                            userScore = questions[i].Score;
                        }
                        //push data into an array to display using ng-repeat.
                        this.$scope.shortAndMultipleChoiceAnswerQuestion.push({
                            indentPx: questions[i].IndentPx,
                            answeredInTime: questions[i].AnsweredInTime,
                            solutionImageRequiredScaling: questions[i].SolutionImageRequiredScaling,
                            HiddenCodeForQuiz: this.hiddenCode,
                            questionImageId: "img-" + questionImageCounter,
                            solutionImageId: "img-" + solutionImageCounter,
                            questionId: questions[i].QuestionId,
                            QuestionNumber: this.questionNumber,
                            questionImagePath: questions[i].QuestionImagePath,
                            solutionImagePath: questions[i].SolutionImagePath,
                            maxScore: questions[i].NumberOfMarks,
                            correctAnswer: questions[i].CorrectAnswer,
                            userAnswer: questions[i].UserAnswer,
                            userId: this.userId,
                            maxArray: this.$scope.maxScore,
                            score: userScore,
                            writeSolutionInSpecificLocationMessage: this.$sce.trustAsHtml(questions[i].WriteSolutionInSpecificLocationMessage),
                            audioVideoArray: this.$rootScope.jwPlayerArray,
                            solutionImageValue: this.$scope.solutionImageValue,
                            audioVideoValue: this.$scope.audioVideoValue,
                            scoreId: "id-" + i
                        });
                    }
                }
            }
            questionImageCounter = solutionImageCounter;
            questionImageCounter++;
            solutionImageCounter = solutionImageCounter + 2;
        }
        this.$scope.questionsValue = true; //Display the QuestionDetils div.
        this.$scope.progressBarValue = false; //Hide progress bar hence process has been completed.
    };
    //Check whether to hide previous button or not.
    SelfScoringQuestionPageController.prototype.checkForPreviousButton = function () {
        var _this = this;
        if (this.$scope.preRouteController == "SelfScoringIntroPageController" || this.$scope.preRouteController == "SavedAndPausedPageController" || this.$scope.preRouteController == "SelfScoringIntroPageWithTimerExpiredMessageController") {
            this.selfScoringQuestionPageService.setValueOfFirstQuestionToHidePreviousButton(this.questionNumber, true, this.hiddenCode, this.userId).then(function (questionNo) {
                if (questionNo.result != 0) {
                    if (questionNo.result == _this.questionNumber) {
                        _this.$scope.previousButtonValue = false;
                    }
                }
            });
        }
        else {
            this.selfScoringQuestionPageService.setValueOfFirstQuestionToHidePreviousButton(this.questionNumber, false, this.hiddenCode, this.userId).then(function (questionNo) {
                if (questionNo.result != 0) {
                    if (questionNo.result == _this.questionNumber) {
                        _this.$scope.previousButtonValue = false;
                    }
                }
            });
        }
    };
    //Check  whether user ahs marked the present question or not.
    SelfScoringQuestionPageController.prototype.validateUserScore = function (quizQuestionsAndAnswerDetails) {
        angular.element('md-select').siblings('.errorClass').remove();
        angular.element('md-select').children('div.border-bottom').remove();
        this.$scope.scoreSelectionValidationArray = [];
        var hasMarkSelectionDone = false;
        if (quizQuestionsAndAnswerDetails.length > 0) {
            var count;
            count = quizQuestionsAndAnswerDetails.length;
            for (var j = 0; j < count; j++) {
                if (quizQuestionsAndAnswerDetails[j].score === null) {
                    hasMarkSelectionDone = true;
                    this.$scope.scoreSelectionValidationArray.push({ scoreId: quizQuestionsAndAnswerDetails[j].scoreId });
                    this.$scope.isError = true;
                }
            }
            if (hasMarkSelectionDone) {
                count = this.$scope.scoreSelectionValidationArray.length;
                for (var i = 0; i < count; i++) {
                    var id = this.$scope.scoreSelectionValidationArray[i].scoreId;
                    var offset = angular.element('#' + this.$scope.scoreSelectionValidationArray[0].scoreId + '').parent().offset().top;
                    var parentOffset = angular.element('.container.main-container').offset().top;
                    var childOffset = offset - parentOffset;
                    angular.element('.body-container').animate({ scrollTop: childOffset }, 200);
                    angular.element('#' + id).siblings('p').remove();
                    angular.element('#' + id).parent().append("<div class='errorClass'>Required.</div>");
                    angular.element("md-select#" + id).append("<div class='border-bottom'></div>");
                    angular.element("md-select#" + id).find(".md-select-label").removeClass("md-placeholder");
                }
                return true;
            }
            else {
                return false;
            }
        }
    };
    //Change event for mark selection.   
    SelfScoringQuestionPageController.prototype.markSelectionChangeEvent = function (quizQuestionsAndAnswerDetails) {
        if (this.nextIsClick) {
            this.validateUserScore(quizQuestionsAndAnswerDetails);
        }
    };
    //Next button click event
    SelfScoringQuestionPageController.prototype.nextButton = function (quizQuestionsAndAnswerDetails) {
        var _this = this;
        this.$rootScope.browserBackIsClicked = true;
        this.nextIsClick = true;
        if (quizQuestionsAndAnswerDetails.length > 0) {
            var hasMarkSelectionDone = false;
            hasMarkSelectionDone = this.validateUserScore(quizQuestionsAndAnswerDetails);
            //If user has not selected any score then display error message.
            if (!hasMarkSelectionDone) {
                //If Timer has been expired for current question then show "TimerExpiredPage."
                if (this.isTimerExpired == 0) {
                    //Save user score into database.
                    this.selfScoringQuestionPageService.getNextQuizPageOfSelfScoringQuestion(quizQuestionsAndAnswerDetails).then(function (nextQuizPage) {
                        if (nextQuizPage != 0 && nextQuizPage.result != 0) {
                            _this.nextIsClick = true;
                            var nextPageQuestionNo = nextQuizPage.result;
                            _this.$scope.path = "/quiz-selfscoringquestion/" + _this.hiddenCode + "/" + nextPageQuestionNo + "/" + _this.isTimerExpired;
                            //Load next question.
                            _this.$location.path(_this.$scope.path);
                        }
                        else {
                            //Get quizResultsummaryId.
                            _this.selfScoringQuestionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(_this.hiddenCode, _this.userId).then(function (summaryId) {
                                if (summaryId != null && summaryId != undefined && summaryId.result != 0 && summaryId.result != undefined) {
                                    _this.quizResultSummaryId = summaryId.result;
                                    _this.nextIsClick = true;
                                    //If timer is expired then  let the user to "Timer expired page."
                                    _this.$scope.path = "/quiz-timerexpired/" + _this.hiddenCode + "/" + _this.quizResultSummaryId;
                                    _this.$location.path(_this.$scope.path);
                                }
                            });
                        }
                    });
                }
                else if (this.isTimerExpired == 1) {
                    //Save user score and redirect it to next Question Page.                  
                    this.selfScoringQuestionPageService.getNextQuizPageOfSelfScoringQuestion(quizQuestionsAndAnswerDetails).then(function (nextQuestionNo) {
                        if (nextQuestionNo.result != 0 && nextQuestionNo.result != undefined && nextQuestionNo.result.QuestionNumber != 0) {
                            _this.$rootScope.browserBackIsClicked = true;
                            var nextPageQuestionNo = nextQuestionNo.result;
                            _this.nextIsClick = true;
                            //Load next question.
                            _this.$location.path("/quiz-selfscoringquestion/" + _this.hiddenCode + "/" + nextPageQuestionNo + "/" + _this.isTimerExpired);
                        }
                        else {
                            //Call method to check whether to display Result page or not and redirect accordingly to Result page or end message Page.
                            _this.redirectResultPageOrEndMessagePage();
                        }
                    });
                }
            }
        }
        else {
            this.$log.log("SelfScoringQuestionPageController - nextButton() - User answer details contains null values.");
        }
    };
    //Method to check whether to display Result page or not and redirect accordingly to Result page or End message Page.
    SelfScoringQuestionPageController.prototype.redirectResultPageOrEndMessagePage = function () {
        var _this = this;
        this.$rootScope.browserBackIsClicked = true;
        //To get quizResultsummaryId of the current user.
        this.selfScoringQuestionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then(function (summaryId) {
            if (summaryId != null && summaryId != undefined && summaryId.result != 0 && summaryId.result != undefined) {
                _this.quizResultSummaryId = summaryId.result;
                //Get Quiz settings details and check whether to show Result page or not.
                _this.resultPageService.getQuizSettingDetails(_this.hiddenCode).then(function (quizSettings) {
                    if (quizSettings != null && quizSettings != undefined) {
                        //selfScoringQuestionPageService.GetQuestionNoToSelfScoreAfterTimerExpired(hiddenCode, quizResultSummaryId).then(function (isTimerExpired) {
                        //    if (!isTimerExpired.result) {
                        //If user has answered all the questions of short answer question then don't show timer expired page.
                        if (quizSettings.ShowResultsPage) {
                            //If result page is to be shown then directly redirect to it.
                            _this.$scope.path = "/quiz-result/" + _this.hiddenCode + "/" + _this.quizResultSummaryId;
                            _this.$location.path(_this.$scope.path);
                        }
                        else {
                            //If Result page is not to be shown then update QuizResultSummary table and redirect to endmessage page.
                            _this.resultPageService.getDetailsOnResultsPageLoad(_this.hiddenCode, _this.userId, "SelfScoringQuestionPageController", _this.quizResultSummaryId).then(function () {
                                _this.$scope.path = "/quiz-endmessage/" + _this.hiddenCode;
                                _this.$location.path(_this.$scope.path);
                            });
                        }
                    }
                    else {
                        _this.$log.log("SelfScoringQuestionPageController - redirectResultPageOrEndMessagePage() - Quiz settings are not available.");
                    }
                });
            }
            else {
                _this.$log.log("SelfScoringQuestionPageController - redirectResultPageOrEndMessagePage() - SummaryId is not available");
            }
        });
    };
    //Previous button click event.
    SelfScoringQuestionPageController.prototype.previousButton = function (quizQuestionsAndAnswerDetails) {
        var _this = this;
        this.$rootScope.browserBackIsClicked = true;
        this.$scope.previousIsClick = true;
        if (quizQuestionsAndAnswerDetails.length > 0) {
            var currentPageNo = quizQuestionsAndAnswerDetails[0].QuestionNumber;
            this.selfScoringQuestionPageService.getPreviousQuizPageOfSelfScoringQuestion(this.hiddenCode, currentPageNo, this.userId).then(function (previousQuizPage) {
                if (previousQuizPage != 0 && previousQuizPage.result != 0) {
                    var previousQuestionNo = previousQuizPage.result;
                    _this.$rootScope.browserBackIsClicked = true;
                    _this.$location.path("/quiz-selfscoringquestion/" + _this.hiddenCode + "/" + previousQuestionNo + "/" + _this.isTimerExpired);
                }
                else {
                    _this.$log.log("SelfScoringQuestionPageController - previousButton() - Previous question number not found");
                }
            });
        }
        else {
            this.$log.log("SelfScoringQuestionPageController - previousButton() - User answer details contains null values");
        }
    };
    SelfScoringQuestionPageController.controllerId = "SelfScoringQuestionPageController";
    return SelfScoringQuestionPageController;
})();
app.controller(SelfScoringQuestionPageController.controllerId, ['$scope', '$sce', '$cookieStore', 'prevRoutePromiseGetter', '$rootScope', '$routeParams', 'selfScoringQuestionPageService', 'resultPageService', '$location', '$log', function ($scope, $sce, $cookieStore, prevRoutePromiseGetter, $rootScope, $routeParams, selfScoringQuestionPageService, resultPageService, $location, $log) { return new SelfScoringQuestionPageController($scope, $sce, $cookieStore, prevRoutePromiseGetter, $rootScope, $routeParams, selfScoringQuestionPageService, resultPageService, $location, $log); }]);
//# sourceMappingURL=selfScoringQuestionpageController.js.map