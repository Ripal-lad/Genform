// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

    interface IanswerDrillPageControllerScope extends ng.IScope {
        title: string;
        quizName: string;
        totalQuizQuestion: number;
        progressBarValue: boolean;
        questionAndAnswerDetailsValue: boolean;
        shortAndMultipleChoiceAnswerQuestion: any;
        multipleChoiceAnswerQuestion: any;
        solutionImageValue: boolean;
        audioVideoValue: boolean;
        shortAnswerValue: boolean;
        jwPlayerArray: any;
        questionImageId: string;
        solutionImageId: string;
        multipleChoiceValue: boolean;
        questionImagePath: string;
        solutionImagePath: string;
        indentPx: number;
        solutionImageRequiredScaling: number;
        writeSolutionInSpecificLocationMessage: string;
        shortanswervalue: boolean;
        userScore: number;
        maxScore: number;
        userScoreToolTip:string;
        maxScoreToolTip: number;
        userAnswer: string;
        timerExpiredValue: boolean;
        scoreGivenValue: boolean;
        multipleChoiceToolTip: boolean;
        shortAnswerToolTip: boolean;
        notAttemptedQuestionImage: boolean;
        questionNo: number;
        resultPage:()=>void;
    }

    interface IanswerDrillPageController {
       
    }

    class AnswerDrillPageController implements IanswerDrillPageController {
        static controllerId: string = "AnswerDrillPageController";

        private hiddenCode;
        private questionNumber;
        private userId;
        private quizResultSummaryId;
        private totalUserScore;
        private totalQuestionScore;
        private isCkEditorReadonly;
        private ips4MemberId;
        private ips4IpSessionFront;

        //Constructor.
        constructor(private $scope: IanswerDrillPageControllerScope,
            private $sce,
            private $cookieStore,
            private $rootScope,
            private $routeParams,
            private selfScoringQuestionPageService,
            private answerDrillPageService,
            private $location,
            private $log) {
            $scope.title = "AnswerDrillPageController";

            this.$rootScope.isCkEditorReadonly = true;  //Ckeditor readonly.

            this.hiddenCode = $routeParams.hiddenCode;
            this.questionNumber = $routeParams.questionNumber;
            this.userId = 1;
            this.quizResultSummaryId = $routeParams.quizResultSummaryId;
            this.totalUserScore = 0;
            this.totalQuestionScore = 0;
            this.$scope.questionNo = $routeParams.questionNumber;
            this.$scope.questionAndAnswerDetailsValue = true; //Hide the QuestionDetils div.
            this.$scope.progressBarValue = false; //Start progress bar hence process has been completed.

            this.$scope.resultPage = () => this.resultPage();

            //Get cookies of IPBoard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
          
            if (this.hiddenCode != null && this.questionNumber != null && this.questionNumber != undefined && this.questionNumber != "undefined" && this.hiddenCode != undefined && this.hiddenCode != "undefined") {

                this.getCurrentQuizName();
                this.getTotalNumberOfQuestions();
                this.getQuestionAndAnswerDetailsAndBindItToUi();
            } else {
                this.$log.log("AnswerDrillPagecontroller - constructor - RouteParams are not defined.");
            }

            //Broad cast from the BrowserBackButtonDirectiveForQuestionPage when mouse pointer leaves the page.
            $rootScope.$on("onRouteChangeEvent", (event, result) => {

                $rootScope.$on('$locationChangeStart', () => {

                    this.goBack();

                });
            });

         }

            //If browser back buton is clicked then redirect it to IntroPage.
            private goBack() {

                if (!this.$rootScope.browserBackIsClicked) {
                    this.$rootScope.browserBackIsClicked = true;
                    this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
                }
            }
        
            //Get current quiz name.
            private getCurrentQuizName(){
                //Call service to get current quiz name.
                this.answerDrillPageService.getCurrentQuizName(this.hiddenCode).then((quizName) => {
                    if (quizName != null && quizName != "null") {
                        this.$scope.quizName = quizName.result;
                    } else {
                        this.$log.log("AnswerDrillPagecontroller - getCurrentQuizName - QuizName  is not available..");
                       
                    }
                });
            }
        
            //Bind total number of quiz questions.
            private getTotalNumberOfQuestions () {

            this.answerDrillPageService.getTotalNumberOfQuestions(this.hiddenCode).then((totalNoOfQuestions) =>{
                if (totalNoOfQuestions.result != 0) {
                    this.$scope.totalQuizQuestion = totalNoOfQuestions.result;

                } else {
                    this.$log.log("AnswerDrillPagecontroller - getTotalNumberOfQuestions - Total Number of questions are not available");
                 
                }
            });
            }

            //Get question and answer details and bind it to UI.        
            private getQuestionAndAnswerDetailsAndBindItToUi() {

            this.answerDrillPageService.getQuestionAndAnswerDetailsForAnswerDrillResultPage(this.hiddenCode, this.questionNumber, this.userId, this.quizResultSummaryId).then((questionANswerAndResultDetails) =>{

                if (questionANswerAndResultDetails != null && questionANswerAndResultDetails != undefined && questionANswerAndResultDetails.result != null && questionANswerAndResultDetails.result != "null") {

                    var questionAndAnswerDetails = questionANswerAndResultDetails.result;
                    var questionImageCounter = 0;
                    var solutionImageCounter = 1;

                    //Bind the question details to page.

                    if (questionAndAnswerDetails.length > 0) {

                        this.$scope.shortAndMultipleChoiceAnswerQuestion = [];
                        this.$scope.multipleChoiceAnswerQuestion = [];
                        this.$rootScope.imageScalingArray = [];
                        var count = questionAndAnswerDetails.length;

                        for (var i = 0; i < count; i++) {

                            this.$rootScope.jwPlayerArray = [];

                            //Call method to bind score details to UI.
                            this.bindUserScoretoUi(questionAndAnswerDetails[i]);

                            //Check whether solution contains any video or audio as solution and if it then bind JwPlayer to it.
                            if (questionAndAnswerDetails[i].URL != null && questionAndAnswerDetails[i].AudioVideoImagePath != null) {

                                this.$scope.solutionImageValue = false; //Hide solutionImage.
                                this.$scope.audioVideoValue = true; //Show JWPlayer.

                                var length = questionAndAnswerDetails[i].AudioVideoImagePath.length;

                                for (var j = 0; j < length; j++) {

                                    //Push data into Array to bind resource details to JWPlayer.
                                    this.$rootScope.jwPlayerArray.push({ index: "myElement_" + j + "_" + i, solutionResourceTitle: questionAndAnswerDetails[i].SolutionResourceTitle, path: questionAndAnswerDetails[i].AudioVideoImagePath[j] });
                                }
                            } else {
                                //Show solutionImage and hide JWplayer.
                                this.$scope.solutionImageValue = true;
                                this.$scope.audioVideoValue = false;
                            }

                            //Short Answer question.
                            if (questionAndAnswerDetails[i].QuestionType == 2) {
                                this.$scope.shortAnswerValue = true;

                                //push data into an array to display using ng-repeat.
                                this.$scope.shortAndMultipleChoiceAnswerQuestion.push({
                                    ckEditorId: i,
                                    indentPx: questionAndAnswerDetails[i].IndentPx,
                                    questionImageId: "img-" + questionImageCounter,
                                    solutionImageId: "img-" + solutionImageCounter,
                                    solutionImageRequiredScaling: questionAndAnswerDetails[i].SolutionImageRequiredScaling,
                                    questionType: questionAndAnswerDetails[i].QuestionType,
                                    questionImagePath: questionAndAnswerDetails[i].QuestionImagePath,
                                    solutionImagePath: questionAndAnswerDetails[i].SolutionImagePath,
                                    userAnswer: questionAndAnswerDetails[i].UserAnswer,
                                    audioVideoArray: this.$rootScope.jwPlayerArray,
                                    audioVideoValue: this.$scope.audioVideoValue,
                                    solutionImageValue: this.$scope.solutionImageValue,
                                    writeSolutionInSpecificLocationMessage: this.$sce.trustAsHtml(questionAndAnswerDetails[i].WriteSolutionInSpecificLocationMessage)
                                });
                            }
                            //Multiple choice questionAndAnswerDetails.
                            else if (questionAndAnswerDetails[i].QuestionType == 1) {

                                if (this.$rootScope.jwPlayerArray.length > 0) {
                                    this.$scope.jwPlayerArray = this.$rootScope.jwPlayerArray;
                                }

                                this.$scope.questionImageId = "img-" + i;
                                this.$scope.solutionImageId = "img-" + (i + 1);
                                this.$scope.multipleChoiceValue = true;
                                this.$scope.shortAnswerValue = false;
                                this.$scope.questionImagePath = questionAndAnswerDetails[i].QuestionImagePath;
                                this.$scope.solutionImagePath = questionAndAnswerDetails[i].SolutionImagePath;
                                var possibleAnswer = questionAndAnswerDetails[i].PossibleAnswers;
                                var userPreviousAnswer = questionAndAnswerDetails[i].UserAnswer;
                                 this.$scope.indentPx=questionAndAnswerDetails[i].IndentPx,
                                this.$scope.solutionImageRequiredScaling = questionAndAnswerDetails[0].SolutionImageRequiredScaling,
                                this.$scope.writeSolutionInSpecificLocationMessage = this.$sce.trustAsHtml(questionAndAnswerDetails[i].WriteSolutionInSpecificLocationMessage);
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
                                            } else {
                                                hasChecked = false;
                                            }
                                        }
                                        //push data into an array to display check boxes using ng-repeat.
                                        this.$scope.multipleChoiceAnswerQuestion.push({
                                            questionNumber: questionAndAnswerDetails[i].QuestionNumber,
                                            questionType: questionAndAnswerDetails[i].QuestionType,
                                            userAnswer: possibleAnswer[k],
                                            imagePath: questionAndAnswerDetails[i].QuestionImagePath,
                                            userSelectedAnswer: hasChecked
                                        });
                                    }
                                } else {

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
                                this.$scope.shortanswervalue = false; //Hide short question answer details.
                            }
                            questionImageCounter = solutionImageCounter;
                            questionImageCounter++;
                            solutionImageCounter = solutionImageCounter + 2;
                        }
                    }

                    this.$scope.questionAndAnswerDetailsValue = true; //Display the QuestionDetils div.
                    this.$scope.progressBarValue = false; //Hide progress bar hence process has been completed.

                } else {

                    this.$log.log("AnswerDrillPagecontroller - getQuestionAndAnswerDetailsAndBindItToUi - Questiona and Result details are null.");
                 
                }
            });
            }

            //Bind user score details to UI.
            private bindUserScoretoUi (questionAndAnswerDetails) {

            //Add score for multiple short answer questions .
            this.totalUserScore = this.totalUserScore + questionAndAnswerDetails.Score;
            this.totalQuestionScore = this.totalQuestionScore + questionAndAnswerDetails.NumberOfMarks;

            this.$scope.userScore = this.totalUserScore;
            this.$scope.maxScore = this.totalQuestionScore;

            if (questionAndAnswerDetails.Score == null) {
                this.$scope.userScore = 0;
                this.totalUserScore = this.totalQuestionScore;    //If user has not attempted question and if he select "View result" option from confirm box then bind max score to tooltip.
                questionAndAnswerDetails.Score = this.totalQuestionScore;
            }

            if (this.$scope.userScore <= 1) {
                this.$scope.userScoreToolTip = this.totalUserScore + " mark";
            } else {
                this.$scope.userScoreToolTip = this.totalUserScore + " marks";
            }

            this.$scope.maxScoreToolTip = this.$scope.maxScore;

            if (questionAndAnswerDetails.UserId != null && questionAndAnswerDetails.UserId != 0) {

                //If answered in time then bind score.
                if (questionAndAnswerDetails.AnsweredInTime) {

                    this.$scope.userAnswer = questionAndAnswerDetails.UserAnswer;
                    this.$scope.timerExpiredValue = false;
                    this.$scope.scoreGivenValue = true;

                } else if (!questionAndAnswerDetails.AnsweredInTime) {

                    this.$scope.userAnswer = questionAndAnswerDetails.UserAnswer;

                    //If answered the question after timer got expired.
                    if (questionAndAnswerDetails.QuestionType == 1) {

                        this.$scope.multipleChoiceToolTip = true;
                        this.$scope.shortAnswerToolTip = false;

                    } else if (questionAndAnswerDetails.QuestionType == 2) {

                        this.$scope.multipleChoiceToolTip = false;
                        this.$scope.shortAnswerToolTip = true;
                    }
                    this.$scope.timerExpiredValue = true;
                    this.$scope.scoreGivenValue = false;

                }
            } else {

                //If user has not attempted the question.
                if (questionAndAnswerDetails.QuestionType == 1) {

                    this.$scope.multipleChoiceToolTip = true;
                    this.$scope.shortAnswerToolTip = false;

                } else if (questionAndAnswerDetails.QuestionType == 2) {
                    this.$scope.shortAnswerToolTip = true;
                    this.$scope.multipleChoiceToolTip = false;
                }
                this.$scope.notAttemptedQuestionImage = true;
                this.$scope.timerExpiredValue = false;
                this.$scope.scoreGivenValue = false;
            }

            }

            //Redirect on Result page.
            private resultPage() {

                this.$location.path("/quiz-result/" +this.hiddenCode + "/" + this.quizResultSummaryId);
         }
        }

    app.controller(AnswerDrillPageController.controllerId, ['$scope', '$sce', '$cookieStore', '$rootScope', '$routeParams', 'selfScoringQuestionPageService', 'answerDrillPageService',  '$location','$log',
        ($scope, $sce, $cookieStore, $rootScope, $routeParams, selfScoringQuestionPageService, answerDrillPageService,  $location, $log) =>
            new AnswerDrillPageController($scope, $sce, $cookieStore, $rootScope, $routeParams, selfScoringQuestionPageService, answerDrillPageService,  $location, $log)
    ]);
