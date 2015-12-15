// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var AnswerDrillPageController = (function () {
    //Constructor.
    function AnswerDrillPageController($scope, $sce, $cookieStore, $rootScope, $routeParams, selfScoringQuestionPageService, answerDrillPageService, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$sce = $sce;
        this.$cookieStore = $cookieStore;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.selfScoringQuestionPageService = selfScoringQuestionPageService;
        this.answerDrillPageService = answerDrillPageService;
        this.$location = $location;
        this.$log = $log;
        $scope.title = "AnswerDrillPageController";
        this.$rootScope.isCkEditorReadonly = true; //Ckeditor readonly.
        this.hiddenCode = $routeParams.hiddenCode;
        this.questionNumber = $routeParams.questionNumber;
        this.userId = 1;
        this.quizResultSummaryId = $routeParams.quizResultSummaryId;
        this.totalUserScore = 0;
        this.totalQuestionScore = 0;
        this.$scope.questionNo = $routeParams.questionNumber;
        this.$scope.questionAndAnswerDetailsValue = true; //Hide the QuestionDetils div.
        this.$scope.progressBarValue = false; //Start progress bar hence process has been completed.
        this.$scope.resultPage = function () { return _this.resultPage(); };
        //Get cookies of IPBoard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        if (this.hiddenCode != null && this.questionNumber != null && this.questionNumber != undefined && this.questionNumber != "undefined" && this.hiddenCode != undefined && this.hiddenCode != "undefined") {
            this.getCurrentQuizName();
            this.getTotalNumberOfQuestions();
            this.getQuestionAndAnswerDetailsAndBindItToUi();
        }
        else {
            this.$log.log("AnswerDrillPagecontroller - constructor - RouteParams are not defined.");
        }
        //Broad cast from the BrowserBackButtonDirectiveForQuestionPage when mouse pointer leaves the page.
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    AnswerDrillPageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Get current quiz name.
    AnswerDrillPageController.prototype.getCurrentQuizName = function () {
        var _this = this;
        //Call service to get current quiz name.
        this.answerDrillPageService.getCurrentQuizName(this.hiddenCode).then(function (quizName) {
            if (quizName != null && quizName != "null") {
                _this.$scope.quizName = quizName.result;
            }
            else {
                _this.$log.log("AnswerDrillPagecontroller - getCurrentQuizName - QuizName  is not available..");
            }
        });
    };
    //Bind total number of quiz questions.
    AnswerDrillPageController.prototype.getTotalNumberOfQuestions = function () {
        var _this = this;
        this.answerDrillPageService.getTotalNumberOfQuestions(this.hiddenCode).then(function (totalNoOfQuestions) {
            if (totalNoOfQuestions.result != 0) {
                _this.$scope.totalQuizQuestion = totalNoOfQuestions.result;
            }
            else {
                _this.$log.log("AnswerDrillPagecontroller - getTotalNumberOfQuestions - Total Number of questions are not available");
            }
        });
    };
    //Get question and answer details and bind it to UI.        
    AnswerDrillPageController.prototype.getQuestionAndAnswerDetailsAndBindItToUi = function () {
        var _this = this;
        this.answerDrillPageService.getQuestionAndAnswerDetailsForAnswerDrillResultPage(this.hiddenCode, this.questionNumber, this.userId, this.quizResultSummaryId).then(function (questionANswerAndResultDetails) {
            if (questionANswerAndResultDetails != null && questionANswerAndResultDetails != undefined && questionANswerAndResultDetails.result != null && questionANswerAndResultDetails.result != "null") {
                var questionAndAnswerDetails = questionANswerAndResultDetails.result;
                var questionImageCounter = 0;
                var solutionImageCounter = 1;
                //Bind the question details to page.
                if (questionAndAnswerDetails.length > 0) {
                    _this.$scope.shortAndMultipleChoiceAnswerQuestion = [];
                    _this.$scope.multipleChoiceAnswerQuestion = [];
                    _this.$rootScope.imageScalingArray = [];
                    var count = questionAndAnswerDetails.length;
                    for (var i = 0; i < count; i++) {
                        _this.$rootScope.jwPlayerArray = [];
                        //Call method to bind score details to UI.
                        _this.bindUserScoretoUi(questionAndAnswerDetails[i]);
                        //Check whether solution contains any video or audio as solution and if it then bind JwPlayer to it.
                        if (questionAndAnswerDetails[i].URL != null && questionAndAnswerDetails[i].AudioVideoImagePath != null) {
                            _this.$scope.solutionImageValue = false; //Hide solutionImage.
                            _this.$scope.audioVideoValue = true; //Show JWPlayer.
                            var length = questionAndAnswerDetails[i].AudioVideoImagePath.length;
                            for (var j = 0; j < length; j++) {
                                //Push data into Array to bind resource details to JWPlayer.
                                _this.$rootScope.jwPlayerArray.push({ index: "myElement_" + j + "_" + i, solutionResourceTitle: questionAndAnswerDetails[i].SolutionResourceTitle, path: questionAndAnswerDetails[i].AudioVideoImagePath[j] });
                            }
                        }
                        else {
                            //Show solutionImage and hide JWplayer.
                            _this.$scope.solutionImageValue = true;
                            _this.$scope.audioVideoValue = false;
                        }
                        //Short Answer question.
                        if (questionAndAnswerDetails[i].QuestionType == 2) {
                            _this.$scope.shortAnswerValue = true;
                            //push data into an array to display using ng-repeat.
                            _this.$scope.shortAndMultipleChoiceAnswerQuestion.push({
                                ckEditorId: i,
                                indentPx: questionAndAnswerDetails[i].IndentPx,
                                questionImageId: "img-" + questionImageCounter,
                                solutionImageId: "img-" + solutionImageCounter,
                                solutionImageRequiredScaling: questionAndAnswerDetails[i].SolutionImageRequiredScaling,
                                questionType: questionAndAnswerDetails[i].QuestionType,
                                questionImagePath: questionAndAnswerDetails[i].QuestionImagePath,
                                solutionImagePath: questionAndAnswerDetails[i].SolutionImagePath,
                                userAnswer: questionAndAnswerDetails[i].UserAnswer,
                                audioVideoArray: _this.$rootScope.jwPlayerArray,
                                audioVideoValue: _this.$scope.audioVideoValue,
                                solutionImageValue: _this.$scope.solutionImageValue,
                                writeSolutionInSpecificLocationMessage: _this.$sce.trustAsHtml(questionAndAnswerDetails[i].WriteSolutionInSpecificLocationMessage)
                            });
                        }
                        else if (questionAndAnswerDetails[i].QuestionType == 1) {
                            if (_this.$rootScope.jwPlayerArray.length > 0) {
                                _this.$scope.jwPlayerArray = _this.$rootScope.jwPlayerArray;
                            }
                            _this.$scope.questionImageId = "img-" + i;
                            _this.$scope.solutionImageId = "img-" + (i + 1);
                            _this.$scope.multipleChoiceValue = true;
                            _this.$scope.shortAnswerValue = false;
                            _this.$scope.questionImagePath = questionAndAnswerDetails[i].QuestionImagePath;
                            _this.$scope.solutionImagePath = questionAndAnswerDetails[i].SolutionImagePath;
                            var possibleAnswer = questionAndAnswerDetails[i].PossibleAnswers;
                            var userPreviousAnswer = questionAndAnswerDetails[i].UserAnswer;
                            _this.$scope.indentPx = questionAndAnswerDetails[i].IndentPx, _this.$scope.solutionImageRequiredScaling = questionAndAnswerDetails[0].SolutionImageRequiredScaling, _this.$scope.writeSolutionInSpecificLocationMessage = _this.$sce.trustAsHtml(questionAndAnswerDetails[i].WriteSolutionInSpecificLocationMessage);
                            var hasChecked = false;
                            var possibleAnswerLength = questionAndAnswerDetails[i].PossibleAnswers.length;
                            //If user has answered the question and if he clicks previous then to bind the selected check box value.
                            if (userPreviousAnswer != undefined && userPreviousAnswer != null) {
                                var userPreviousAnswerLength = userPreviousAnswer.length;
                                for (var k = 0; k < possibleAnswerLength; k++) {
                                    for (var j = 0; j < userPreviousAnswerLength; j++) {
                                        if (possibleAnswer[k] == userPreviousAnswer[j]) {
                                            hasChecked = true;
                                            break;
                                        }
                                        else {
                                            hasChecked = false;
                                        }
                                    }
                                    //push data into an array to display check boxes using ng-repeat.
                                    _this.$scope.multipleChoiceAnswerQuestion.push({
                                        questionNumber: questionAndAnswerDetails[i].QuestionNumber,
                                        questionType: questionAndAnswerDetails[i].QuestionType,
                                        userAnswer: possibleAnswer[k],
                                        imagePath: questionAndAnswerDetails[i].QuestionImagePath,
                                        userSelectedAnswer: hasChecked
                                    });
                                }
                            }
                            else {
                                //If user has not attemted answer then bind this array to UI for multiple choice.
                                angular.forEach(possibleAnswer, function (value) {
                                    //push data into an array to display using ng-repeat.
                                    this.$scope.multipleChoiceAnswerQuestion.push({
                                        questionNumber: questionAndAnswerDetails[i].QuestionNumber,
                                        questionType: questionAndAnswerDetails[i].QuestionType,
                                        userAnswer: value,
                                        imagePath: questionAndAnswerDetails[i].QuestionImagePath,
                                        userSelectedAnswer: hasChecked
                                    });
                                });
                            }
                            _this.$scope.shortanswervalue = false; //Hide short question answer details.
                        }
                        questionImageCounter = solutionImageCounter;
                        questionImageCounter++;
                        solutionImageCounter = solutionImageCounter + 2;
                    }
                }
                _this.$scope.questionAndAnswerDetailsValue = true; //Display the QuestionDetils div.
                _this.$scope.progressBarValue = false; //Hide progress bar hence process has been completed.
            }
            else {
                _this.$log.log("AnswerDrillPagecontroller - getQuestionAndAnswerDetailsAndBindItToUi - Questiona and Result details are null.");
            }
        });
    };
    //Bind user score details to UI.
    AnswerDrillPageController.prototype.bindUserScoretoUi = function (questionAndAnswerDetails) {
        //Add score for multiple short answer questions .
        this.totalUserScore = this.totalUserScore + questionAndAnswerDetails.Score;
        this.totalQuestionScore = this.totalQuestionScore + questionAndAnswerDetails.NumberOfMarks;
        this.$scope.userScore = this.totalUserScore;
        this.$scope.maxScore = this.totalQuestionScore;
        if (questionAndAnswerDetails.Score == null) {
            this.$scope.userScore = 0;
            this.totalUserScore = this.totalQuestionScore; //If user has not attempted question and if he select "View result" option from confirm box then bind max score to tooltip.
            questionAndAnswerDetails.Score = this.totalQuestionScore;
        }
        if (this.$scope.userScore <= 1) {
            this.$scope.userScoreToolTip = this.totalUserScore + " mark";
        }
        else {
            this.$scope.userScoreToolTip = this.totalUserScore + " marks";
        }
        this.$scope.maxScoreToolTip = this.$scope.maxScore;
        if (questionAndAnswerDetails.UserId != null && questionAndAnswerDetails.UserId != 0) {
            //If answered in time then bind score.
            if (questionAndAnswerDetails.AnsweredInTime) {
                this.$scope.userAnswer = questionAndAnswerDetails.UserAnswer;
                this.$scope.timerExpiredValue = false;
                this.$scope.scoreGivenValue = true;
            }
            else if (!questionAndAnswerDetails.AnsweredInTime) {
                this.$scope.userAnswer = questionAndAnswerDetails.UserAnswer;
                //If answered the question after timer got expired.
                if (questionAndAnswerDetails.QuestionType == 1) {
                    this.$scope.multipleChoiceToolTip = true;
                    this.$scope.shortAnswerToolTip = false;
                }
                else if (questionAndAnswerDetails.QuestionType == 2) {
                    this.$scope.multipleChoiceToolTip = false;
                    this.$scope.shortAnswerToolTip = true;
                }
                this.$scope.timerExpiredValue = true;
                this.$scope.scoreGivenValue = false;
            }
        }
        else {
            //If user has not attempted the question.
            if (questionAndAnswerDetails.QuestionType == 1) {
                this.$scope.multipleChoiceToolTip = true;
                this.$scope.shortAnswerToolTip = false;
            }
            else if (questionAndAnswerDetails.QuestionType == 2) {
                this.$scope.shortAnswerToolTip = true;
                this.$scope.multipleChoiceToolTip = false;
            }
            this.$scope.notAttemptedQuestionImage = true;
            this.$scope.timerExpiredValue = false;
            this.$scope.scoreGivenValue = false;
        }
    };
    //Redirect on Result page.
    AnswerDrillPageController.prototype.resultPage = function () {
        this.$location.path("/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId);
    };
    AnswerDrillPageController.controllerId = "AnswerDrillPageController";
    return AnswerDrillPageController;
})();
app.controller(AnswerDrillPageController.controllerId, ['$scope', '$sce', '$cookieStore', '$rootScope', '$routeParams', 'selfScoringQuestionPageService', 'answerDrillPageService', '$location', '$log', function ($scope, $sce, $cookieStore, $rootScope, $routeParams, selfScoringQuestionPageService, answerDrillPageService, $location, $log) { return new AnswerDrillPageController($scope, $sce, $cookieStore, $rootScope, $routeParams, selfScoringQuestionPageService, answerDrillPageService, $location, $log); }]);
//# sourceMappingURL=answerDrillPageController.js.map