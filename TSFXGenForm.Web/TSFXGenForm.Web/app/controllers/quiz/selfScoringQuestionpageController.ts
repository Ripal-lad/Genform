/// <reference path="../../../scripts/typings/ckeditor/ckeditor.d.ts" />
 

interface IselfScoringQuestionPageControllerScope extends ng.IScope {
    quizName: string;
    preRouteController: string;
    shortAndMultipleChoiceAnswerQuestion: any;
    questionNo: number;
    maxScore: any;
    audioVideoValue: boolean;
    solutionImageValue: boolean;
    questionsValue: boolean;
    progressBarValue: boolean;
    previousButtonValue: boolean;
    scoreSelectionValidationArray: any;
    isError: boolean;
    path: string;
    previousIsClick: boolean;
    nextButton: (quizQuestionsAndAnswerDetails) => void;
    previousButton: (quizQuestionsAndAnswerDetails) => void;
    isCkEditorReadonly:boolean;
}
interface IselfScoringQuestionPageController {

}

class SelfScoringQuestionPageController implements IselfScoringQuestionPageController {
    static controllerId: string = "SelfScoringQuestionPageController";

    private hiddenCode;
    private quizResultSummaryId;
    private userId;
    private questionNumber;
    private isTimerExpired;
    private nextIsClick;
    private previousIsClick;
    private isCkEditorReadonly;
    private ips4MemberId;
    private ips4IpSessionFront;

    //Contructor.
    constructor(private $scope: IselfScoringQuestionPageControllerScope,
        private $sce,
        private $cookieStore,
        private prevRoutePromiseGetter,
        private $rootScope,
        private $routeParams,
        private selfScoringQuestionPageService,
        private resultPageService,
        private $location,
        private $log) {

        angular.element("body").addClass("body-hidden");
        angular.element(".body-container").addClass("body-scroll");

        this.$rootScope.isCkEditorReadonly = true;  //Ckeditor readonly.
        this.hiddenCode = $routeParams.hiddenCode;
        this.questionNumber = parseInt($routeParams.questionNumber);
        this.isTimerExpired = $routeParams.isTimerExpired;

        this.$scope.questionsValue = false;          //Initially hide the QuestionDetils div.
        this.$scope.progressBarValue = true;         //Start progress bar till the process get completed.
        this.nextIsClick = false;
        this.previousIsClick = false;
        this.userId = 1;

        this.$rootScope.isCkEditorReadonly = true;
        this.$scope.previousButtonValue = true;          //Initially show previous button.

        this.$scope.nextButton = (quizQuestionsAndAnswerDetails) => this.nextButton(quizQuestionsAndAnswerDetails);
        this.$scope.previousButton = (quizQuestionsAndAnswerDetails) => this.previousButton(quizQuestionsAndAnswerDetails);

        //Get cookies of IPBoard.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        
        if (this.questionNumber != null && this.isTimerExpired != null && this.questionNumber != "undefined" && this.questionNumber != undefined && this.hiddenCode != null && this.hiddenCode != "undefined" && this.hiddenCode != undefined) {
            this.getCurrentQuizName();
            this.gettQuestionAndResultDetails();
            this.getPrevRoteDetails();
        } else {
            this.$log.log("SelfScoringQuestionPageController - construtor - RouteParams are not defined ");
        }

        //Broadcast from browserBackButtonForOtherPages directive.
        $rootScope.$on("onRouteChangeEvent", (event, result) => {

            $rootScope.$on('$locationChangeStart', () => {

                this.goBack();

            });
        });

    }

        //If browser back buton is clicked then redirect it to IntroPage.
        private goBack() {

            if (!this.$rootScope.browserBackIsClicked && !this.nextIsClick && !this.previousIsClick) {
                this.$rootScope.browserBackIsClicked = true;
                this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
            }
        }
        //Display current quiz name.
        private getCurrentQuizName () {
        //Call service to get current quiz name.
        this.selfScoringQuestionPageService.getCurrentQuizName(this.hiddenCode).then((quizName) =>{
            if (quizName != null && quizName != "null") {
                this.$scope.quizName = quizName.result;
            }
        });
        }

        //Get previous route details.
        private getPrevRoteDetails () {
        this.prevRoutePromiseGetter().then((prevRoute) =>{
            this.$scope.preRouteController = prevRoute;
        });
        }
    
        //get question details to bind it by passing page no.
        private gettQuestionAndResultDetails () {

        this.selfScoringQuestionPageService.getQuestionForSelfScoringQuestionPage(this.hiddenCode, this.questionNumber, this.userId).then((quizQuestionForFirstPage)=> {

            if (quizQuestionForFirstPage.result != "null" && quizQuestionForFirstPage.result != undefined && quizQuestionForFirstPage != null) {

                this.checkForPreviousButton();
                this.bindQuestionDetails(quizQuestionForFirstPage.result);

            } else {
                this.$log.log("SelfScoringQuestionPageController - construtor - Question details contains null values.");
            }
        });
        }

        //Bind the question details to page.
        private bindQuestionDetails (questions) {

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

                    this.$scope.solutionImageValue = false;      //Hide solutionImage.
                    this.$scope.audioVideoValue = true;          //Show JWPlayer.

                    var length = questions[i].AudioVideoImagePath.length;

                    for (var j = 0; j < length; j++) {

                        //Push data into Array to bind resource details to JWPlayer.
                        this.$rootScope.jwPlayerArray.push({ index: "myElement_" + j + "_" + i, solutionResourceTitle: questions[i].SolutionResourceTitle, path: questions[i].AudioVideoImagePath[j] });
                    }

                } else {

                    //Show solutionImage and hide JWplayer.
                    this.$scope.solutionImageValue = true;
                    this.$scope.audioVideoValue = false;
                }

                //Check whether user has scored or not and if scored then bind the score.
                while (marksCount <= maximumScore) {
                   this.$scope.maxScore.push({ mark: marksCount });
                    marksCount++;
                    if (marksCount == maximumScore) {
                        if (questions[i].Score == "null") {      //If user has scored the question then his score will be binded to dropdown list.
                            userScore = "";
                        } else {
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
        this.$scope.questionsValue = true;          //Display the QuestionDetils div.
        this.$scope.progressBarValue = false;       //Hide progress bar hence process has been completed.
        }

        //Check whether to hide previous button or not.
        private checkForPreviousButton() {
          
        if (this.$scope.preRouteController == "SelfScoringIntroPageController" || this.$scope.preRouteController == "SavedAndPausedPageController" || this.$scope.preRouteController == "SelfScoringIntroPageWithTimerExpiredMessageController") {
        
            this.selfScoringQuestionPageService.setValueOfFirstQuestionToHidePreviousButton(this.questionNumber, true, this.hiddenCode, this.userId).then((questionNo)=> {
                if (questionNo.result != 0) {
                    if (questionNo.result == this.questionNumber) {
                        this.$scope.previousButtonValue = false;
                    }
                }
            });
        } else {
           
            this.selfScoringQuestionPageService.setValueOfFirstQuestionToHidePreviousButton(this.questionNumber, false, this.hiddenCode, this.userId).then((questionNo)=> {
               
                if (questionNo.result != 0) {
                    if (questionNo.result == this.questionNumber) {
                        this.$scope.previousButtonValue = false;
                    }
                }
            });
        }
        }
    
        //Check  whether user ahs marked the present question or not.
        private validateUserScore (quizQuestionsAndAnswerDetails) {

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
            } else {
                return false;
            }
        }
        }
    
        //Change event for mark selection.   
        private  markSelectionChangeEvent (quizQuestionsAndAnswerDetails) {

        if (this.nextIsClick) {
            this.validateUserScore(quizQuestionsAndAnswerDetails);

        }
        }

        //Next button click event
        private nextButton(quizQuestionsAndAnswerDetails) {
        
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
                    this.selfScoringQuestionPageService.getNextQuizPageOfSelfScoringQuestion(quizQuestionsAndAnswerDetails).then((nextQuizPage) =>{

                        if (nextQuizPage != 0 && nextQuizPage.result != 0) {
                            this.nextIsClick = true;
                            var nextPageQuestionNo = nextQuizPage.result;

                            this.$scope.path = "/quiz-selfscoringquestion/" + this.hiddenCode + "/" + nextPageQuestionNo + "/" + this.isTimerExpired;
                            //Load next question.
                            this.$location.path(this.$scope.path);

                        } else {

                            //Get quizResultsummaryId.
                            this.selfScoringQuestionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId)=> {

                                if (summaryId != null && summaryId != undefined && summaryId.result != 0 && summaryId.result != undefined) {

                                    this.quizResultSummaryId = summaryId.result;
                                    this.nextIsClick = true;
                                    //If timer is expired then  let the user to "Timer expired page."
                                    this.$scope.path = "/quiz-timerexpired/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                                    this.$location.path(this.$scope.path);
                                }
                            });
                        }

                    });

                } else if (this.isTimerExpired == 1) {
                    //Save user score and redirect it to next Question Page.                  
                    this.selfScoringQuestionPageService.getNextQuizPageOfSelfScoringQuestion(quizQuestionsAndAnswerDetails).then((nextQuestionNo) =>{

                        if (nextQuestionNo.result != 0 && nextQuestionNo.result != undefined && nextQuestionNo.result.QuestionNumber != 0) {

                            this.$rootScope.browserBackIsClicked = true;
                            var nextPageQuestionNo = nextQuestionNo.result;
                            this.nextIsClick = true;
                            //Load next question.
                            this.$location.path("/quiz-selfscoringquestion/" + this.hiddenCode + "/" + nextPageQuestionNo + "/" + this.isTimerExpired);

                        } else {

                            //Call method to check whether to display Result page or not and redirect accordingly to Result page or end message Page.
                            this.redirectResultPageOrEndMessagePage();
                        }
                    });
                }
            }
        } else {

            this.$log.log("SelfScoringQuestionPageController - nextButton() - User answer details contains null values.");
        }
        }

        //Method to check whether to display Result page or not and redirect accordingly to Result page or End message Page.
        private redirectResultPageOrEndMessagePage  () {

        this.$rootScope.browserBackIsClicked = true;
        //To get quizResultsummaryId of the current user.
        this.selfScoringQuestionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId) => {

            if (summaryId != null && summaryId != undefined && summaryId.result != 0 && summaryId.result != undefined) {

                this.quizResultSummaryId = summaryId.result;

                //Get Quiz settings details and check whether to show Result page or not.
                this.resultPageService.getQuizSettingDetails(this.hiddenCode).then((quizSettings) =>{

                    if (quizSettings != null && quizSettings != undefined) {

                        //selfScoringQuestionPageService.GetQuestionNoToSelfScoreAfterTimerExpired(hiddenCode, quizResultSummaryId).then(function (isTimerExpired) {

                        //    if (!isTimerExpired.result) {

                        //If user has answered all the questions of short answer question then don't show timer expired page.
                        if (quizSettings.ShowResultsPage) {

                            //If result page is to be shown then directly redirect to it.
                            this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                            this.$location.path(this.$scope.path);

                        } else {

                            //If Result page is not to be shown then update QuizResultSummary table and redirect to endmessage page.
                            this.resultPageService.getDetailsOnResultsPageLoad(this.hiddenCode, this.userId, "SelfScoringQuestionPageController", this.quizResultSummaryId).then(()=> {

                                this.$scope.path = "/quiz-endmessage/" + this.hiddenCode;
                                this.$location.path(this.$scope.path);
                            });
                        }

                        //} else {
                        //    //If timer got expired on any of the question of short answer type then redirect it to timr expired page.

                        //    $scope.path = "/quiz-timerexpired/" + hiddenCode + "/" + quizResultSummaryId;
                        //    $location.path($scope.path);

                        //}

                        // });


                    } else {
                        this.$log.log("SelfScoringQuestionPageController - redirectResultPageOrEndMessagePage() - Quiz settings are not available.");
                      
                    }

                });
            } else {
                this.$log.log("SelfScoringQuestionPageController - redirectResultPageOrEndMessagePage() - SummaryId is not available");
            }
        });

    }

        //Previous button click event.
        private previousButton (quizQuestionsAndAnswerDetails){
        this.$rootScope.browserBackIsClicked = true;
        this.$scope.previousIsClick = true;
        if (quizQuestionsAndAnswerDetails.length > 0) {

            var currentPageNo = quizQuestionsAndAnswerDetails[0].QuestionNumber;
            this.selfScoringQuestionPageService.getPreviousQuizPageOfSelfScoringQuestion(this.hiddenCode, currentPageNo, this.userId).then((previousQuizPage) =>{

                if (previousQuizPage != 0 && previousQuizPage.result != 0) {

                    var previousQuestionNo = previousQuizPage.result;
                    this.$rootScope.browserBackIsClicked = true;
                    this.$location.path("/quiz-selfscoringquestion/" + this.hiddenCode + "/" + previousQuestionNo + "/" + this.isTimerExpired);
                } else {
                    this.$log.log("SelfScoringQuestionPageController - previousButton() - Previous question number not found");
                    
                }
            });
        } else {
            this.$log.log("SelfScoringQuestionPageController - previousButton() - User answer details contains null values");
        }
    }
}
app.controller(SelfScoringQuestionPageController.controllerId, ['$scope', '$sce', '$cookieStore', 'prevRoutePromiseGetter', '$rootScope', '$routeParams', 'selfScoringQuestionPageService', 'resultPageService',  '$location','$log',
    ($scope, $sce, $cookieStore, prevRoutePromiseGetter, $rootScope, $routeParams, selfScoringQuestionPageService, resultPageService,  $location, $log) =>
        new SelfScoringQuestionPageController($scope, $sce, $cookieStore, prevRoutePromiseGetter, $rootScope, $routeParams, selfScoringQuestionPageService, resultPageService,  $location, $log)
]);