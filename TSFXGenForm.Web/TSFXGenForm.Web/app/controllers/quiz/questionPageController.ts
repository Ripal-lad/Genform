// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


//interface IquestionPageControllerRootScope extends ng.IRootScopeService {
//    time:number;
//}

interface IquestionPageControllerScope extends ng.IScope {
    title: string;
    preRouteController: string;
    previousButtonValue: boolean;
    nextButtonValue: boolean;
    backGroudTimer: number;
    questionsValue: boolean;
    progressBarValue: boolean;
    errormsgShort: boolean;
    isTimerExpiredPrompt: boolean;
    userTimeTaken: number;
    quizAnswersAndPageDetails: any;
    timeRemaining: number;
    recommendedMinutesString: string;
    recommendedSecondsString: string;
    minutesString: string;
    secondsString: string;
    timeRemainingSeconds: number;
    timeRemainingMinutes: number;
    quizSetting: any;
    quizName: string;
    showTimerValue: boolean;
    saveAndCompleteLaterLinkValue: boolean;
    shortAnswerMaxMarksValue: boolean;
    multipleAnswerMaxmarksValue: boolean;
    totalQuizQuestion: number;
    shortAnswerValidationArray: any;
    userCheckedOptions: any;
    recommendedTime: number;
    recommendedTimeSeconds: number;
    recommendedTimeMinutes: number;
    shortanswervalue: boolean;
    shortAndMultipleChoiceAnswerQuestion: any;
    questionNo: number;
    questionType: number;
    multipleAnswerMaxMarks: string;
    questionImageId: string;
    multipleChoiceValue: boolean;
    shortAnswerValue: boolean;
    questionImagePath: string;
    solutionImageRequiredScaling: number;
    writeSolutionInSpecificLocationMessage: string;
    path: string;
    saveAndCompleteLaterButtonValue: boolean;
    okButton: string;

    checkBoxChange: (valueselectedcheckbox) => void;
    nextButton: (quizAnswer) => void;
    previousButton: (quizAnswer) => void;
    saveAndCompleteLaterClick: () => void;
    saveAndCompleteLaterButtonClick: (quizAnswer) => void;

}

interface IquestionPageController {

}

class QuestionPageController implements IquestionPageController {
    static controllerId: string = "QuestionPageController";
    private time;
    private questionNumber;
    private hiddenCode;
    private timerExpired;
    private quizResultSummaryId;
    private remainingTimeTimer;
    private recommendedTimeTimer;
    private pageChangedRefreshInterval;
    private isAnsweringDone;        //will be true on next button click event,svae and complete later button click event and when timer gets expired if user does not wants to complete the quiz to indicate that the user has completed the question.
    private isPeriodicCall;
    private saveUserAnswerInterval;
    private isTabNotActive;
    private userId;
    private timerUpdateFrequency;
    private isCkEditorReadonly;
    private ips4MemberId;
    private ips4IpSessionFront;
    private validationArray;

    constructor(private $scope: IquestionPageControllerScope,
        private $sce,
        private $cookieStore,
        private $controller,
        private prevRoutePromiseGetter,
        private $route,
        private $routeParams,
        private questionPageService: IquestionPageService,
        private introPageSevice: IintroPageSevice,
        private $mdDialog,
        private $location,
        private $interval,
        private $timeout,
        private $rootScope,
        private $log) {

        $scope.title = "QuestionPageController";
        this.$rootScope.isCkEditorReadonly = false;     //Enable ckeditor.
        this.$rootScope.time = 50;
        this.timerExpired = false;
        this.$rootScope.nextIsClicked = false;
        this.userId = 1;
        this.$scope.previousButtonValue = true;
        this.$scope.nextButtonValue = true;

        this.$scope.backGroudTimer = 0;      //set background timer value to 0 on load of question.
        this.timerExpired = false;
        this.$scope.questionsValue = false;          //Initially hide the QuestionDetils div.
        this.$scope.progressBarValue = true;         //Display progress bar till the process get completed.         
        this.$scope.errormsgShort = false;
        this.isAnsweringDone = false;            //will be true on next button click event,svae and complete later button click event and when timer gets expired if user does not wants to complete the quiz to indicate that the user has completed the question.
        this.isPeriodicCall = false;
        this.isTabNotActive = false;
        this.$scope.isTimerExpiredPrompt = false;     //This flag is to check whether to show timer expired page for short answer question if timer gets expired.
        this.$scope.userTimeTaken = 0;               //User time taken counter for individual questions.
        this.$scope.quizAnswersAndPageDetails = new Array();
        this.$scope.shortAndMultipleChoiceAnswerQuestion = new Array();

        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");

        //Get Route params
        this.questionNumber = $routeParams.questionNumber;
        this.hiddenCode = $routeParams.hiddenCode;

        this.$scope.nextButton = (quizAnswer) => this.nextButton(quizAnswer);
        this.$scope.previousButton = (quizAnswer) => this.previousButton(quizAnswer);
        this.$scope.saveAndCompleteLaterClick = () => this.saveAndCompleteLaterClick();
        this.$scope.saveAndCompleteLaterButtonClick = (quizAnswer) => this.saveAndCompleteLaterButtonClick(quizAnswer);
        this.$scope.checkBoxChange = (valueselectedcheckbox) => this.checkBoxChange(valueselectedcheckbox);

        if (this.hiddenCode != undefined || this.hiddenCode != null || this.questionNumber != "undefined" || this.questionNumber != null || this.hiddenCode != undefined) {
            this.getQuizSettings();
            this.getTotalNumberOfQuestions();
            this.getPrevRoteDetails();
           this.getTotalAllottedtimeToCompleteQuiz(true);
        } else {

            this.$log.log("Questionpagecontroller - constructor - RouteParams are not define");
        }


        $rootScope.$on('$locationChangeSuccess', function () {

            //stop interval on change of route.
            $interval.cancel(this.remainingTimeTimer);
            $interval.cancel(this.recommendedTimeTimer);
            $interval.cancel(this.pageChangedRefreshInterval);
            $interval.cancel(this.saveUserAnswerInterval);

        });


        window.addEventListener("blur", () => {
            console.log("blur");
            this.isTabNotActive = true;

        });

        window.addEventListener("focus", () => {
            console.log("focus");
            this.isTabNotActive = false;
        });
        //Broad cast from the BrowserBackButtonDirectiveForQuestionPage when mouse pointer leaves the page.
        $rootScope.$on("onHashChangeEvent", (event, result) => {

            $rootScope.$on('$locationChangeStart', () => {

                $scope.quizAnswersAndPageDetails = [];

                //If browser back button is clicked then confirm box will be displayed.
                this.goBack();

                //stop interval on change of route.
                $interval.cancel(this.remainingTimeTimer);
                $interval.cancel(this.saveUserAnswerInterval);
                $interval.cancel(this.recommendedTimeTimer);
                $interval.cancel(this.pageChangedRefreshInterval);

            });

        });

        //For to set height of Iframe in IpBoard
        $timeout(() => {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);

    }



    //If browser back button is clicked then confirm box will be displayed.
    private goBack() {

        this.$rootScope.currentQuestionNo = this.$routeParams.questionNumber;

        if (!this.$rootScope.backIsNotClicked) {

            this.$interval.cancel(this.remainingTimeTimer);
            this.$interval.cancel(this.recommendedTimeTimer);
            this.$interval.cancel(this.pageChangedRefreshInterval);
            this.$interval.cancel(this.saveUserAnswerInterval);

            if (confirm("Warning: Leaving the Quiz and not completing the current question will result in time penalties, please use the ‘Save and Completed Later’ feature to avoid these penalties. \n\n Are you sure you want to leave the Quiz now?")) {

                //If user wants to leave the Quiz then he will be let to the IntroPage.
                this.$rootScope.backIsNotClicked = true;
                this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);

            } else {

                //If user wants to continue the Quiz
                this.$rootScope.backIsNotClicked = true;
                this.$location.path("/quiz-question/" + this.hiddenCode + "/" + this.$rootScope.currentQuestionNo);

            }
        }
    }

    //Get previous route details
    private getPrevRoteDetails() {

        //Check if previous page is intropagecontroller or saved and paused page controller than get total allotted time for quiz.
        this.prevRoutePromiseGetter().then((prevRoute) => {

            this.$scope.preRouteController = prevRoute.$$route.controller;
            if (this.$scope.preRouteController == "IntroPageController" || this.$scope.preRouteController == "SavedAndPausedPageController" || this.$scope.preRouteController == "HomeController" || this.$scope.preRouteController == "ResultPageController" || this.$scope.preRouteController == "CountDownController" || this.$scope.preRouteController == "TimerExpiredPageController" || this.$scope.preRouteController == undefined) {

                var hasQuizBeenResumed = prevRoute.locals.$scope.beginQuizName;

                if (hasQuizBeenResumed == "Resume Quiz") {
                  //  this.getTotalAllottedtimeToCompleteQuiz(true);
                } else {
                   // this.getTotalAllottedtimeToCompleteQuiz(false);
                }
            }

            if (this.$scope.preRouteController == "TimerExpiredPageController") {

                this.timerExpired = true;
            }
        });
    }

    //Save user answer on an interval of 1 miinute.
    private saveUserAnswerDetailsOnMinuteInterval() {

        //Save user answer on an interval of 1 minute.
        this.saveUserAnswerInterval = this.$interval(() => {

            this.isAnsweringDone = false;
            this.isPeriodicCall = true;

            //If question number match with the question number passed from the URL then only save user answer into database.  //To solved the issue of the cache data into the object.
            if (this.$scope.shortAndMultipleChoiceAnswerQuestion[0].questionNumber == this.questionNumber) {

                //Call method to get the array of the user answers to send it server side.
                var quizQuestionsAndUserAnswers = this.returnUserAnswerDetails(this.$scope.shortAndMultipleChoiceAnswerQuestion, false, this.$scope.userTimeTaken, this.isAnsweringDone, this.isPeriodicCall);

                //Call method to save user answer on an interval.
                this.questionPageService.saveAnswersOfQuestions(quizQuestionsAndUserAnswers).then(() => {

                });
            }
        }, 60000);
    }


    //Get total alltted time for quiz.
    private getTotalAllottedtimeToCompleteQuiz(hasQuizResumed) {

        var userTimeTakenforResumeQuiz;

        this.$scope.recommendedMinutesString = "Minutes";
        this.$scope.recommendedSecondsString = "Seconds";
        this.$scope.minutesString = "Minutes";
        this.$scope.secondsString = "Seconds";

        ////Check  if quiz is resumed
        //if (hasQuizResumed) {

        //To get quizResultsummaryId and whether quiz is resumed or not.
        this.questionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId) => {
          
            if (summaryId.result != 0) {

                this.quizResultSummaryId = summaryId.result;

                //Get user time taken if quiz is resumed.
                this.questionPageService.getTotalTimeTakenByUser(this.hiddenCode, this.userId, this.quizResultSummaryId).then((userTimeTaken) => {

                    userTimeTakenforResumeQuiz = userTimeTaken.result;
                 
                    this.questionPageService.getTotalAllottedTimeForQuiz(this.hiddenCode).then((totalAllottedTime) => {

                        if (totalAllottedTime.result != 0 && userTimeTakenforResumeQuiz != 0) {

                            //Subtract user time from total alloted time.
                            this.$scope.timeRemaining = totalAllottedTime.result - userTimeTakenforResumeQuiz;
                            this.$scope.timeRemainingSeconds = this.$scope.timeRemaining % 60;
                            this.$scope.timeRemainingMinutes = Math.floor(this.$scope.timeRemaining / 60);


                            this.calculteSeconds(this.$scope.timeRemainingMinutes, this.$scope.timeRemainingSeconds, this.$scope.timeRemaining, true);

                        } else {

                            this.$scope.timeRemaining = totalAllottedTime.result;
                            this.$scope.timeRemainingSeconds = totalAllottedTime.result % 60;
                            this.$scope.timeRemainingMinutes = Math.floor(totalAllottedTime.result / 60);


                            this.calculteSeconds(this.$scope.timeRemainingMinutes, this.$scope.timeRemainingSeconds, this.$scope.timeRemaining, true);

                        }
                    });
                });
            } else {

                //if quiz starts form the 1st question.
                this.questionPageService.getTotalAllottedTimeForQuiz(this.hiddenCode).then((totalAllottedTime) => {
                
                    if (totalAllottedTime != 0) {

                        this.$scope.timeRemaining = totalAllottedTime.result;
                        this.$scope.timeRemainingSeconds = totalAllottedTime.result % 60;
                        this.$scope.timeRemainingMinutes = Math.floor(totalAllottedTime.result / 60);

                        this.calculteSeconds(this.$scope.timeRemainingMinutes, this.$scope.timeRemainingSeconds, this.$scope.timeRemaining, true);

                        return totalAllottedTime.result;
                    } else {

                        this.$log.log("Questionpagecontroller - getTotalAllottedtimeToCompleteQuiz() - Total allotted time is not available");

                    }

                });
            }
        });
    }

    //Get quiz settings.
    private getQuizSettings() {
        this.questionPageService.getQuizSettingDetails(this.hiddenCode).then((quizSettings) => {
            if (quizSettings != null) {
                this.$scope.quizSetting = quizSettings;
                this.applyQuizSetings(quizSettings);
                this.getQuestionDetails();

            } else {
                this.$scope.quizSetting = quizSettings;
                this.applyQuizSetings(quizSettings);
                this.getQuestionDetails();

                this.$log.log("Questionpagecontroller - getQuizSettings() - Quiz Settings are not available");
               
            }
        });
    }

    //Apply Quizsettings.
    private applyQuizSetings(quizSettings) {

        if (quizSettings != null) {

            this.$scope.quizSetting = quizSettings;
            this.$scope.quizName = quizSettings.Name;
            this.timerUpdateFrequency = quizSettings.TimerUpdateFrequency;
            if (quizSettings != "null") {

                //Condition to display timer
                var showTimer = quizSettings.ShowTimer;

                if (showTimer) {
                    this.$scope.showTimerValue = true;
                } else {
                    this.$scope.showTimerValue = false;
                }

                //Check whether to display save and complete later link.
                if (quizSettings.AllowSaveAndComplete) {

                    this.$scope.saveAndCompleteLaterLinkValue = true;
                } else {
                    this.$scope.saveAndCompleteLaterLinkValue = false;
                }

                //Logic to dispaly maximum marks based on ShowMaximumMarks value.
                if (quizSettings.ShowMaximumMarks == 0) {

                    this.$scope.shortAnswerMaxMarksValue = false;
                    this.$scope.multipleAnswerMaxmarksValue = false;
                } else if (quizSettings.ShowMaximumMarks == 1) {

                    this.$scope.shortAnswerMaxMarksValue = true;
                    this.$scope.multipleAnswerMaxmarksValue = false;
                } else if (quizSettings.ShowMaximumMarks == 2) {

                    this.$scope.shortAnswerMaxMarksValue = true;
                    this.$scope.multipleAnswerMaxmarksValue = true;
                }
            }
        }
    }

    //Get total number of quizQuestions.
    private getTotalNumberOfQuestions() {
        this.questionPageService.getTotalNumberOfQuestions(this.hiddenCode).then((data) => {

            if (data != null && data != 0 && data.result != null && data.result != "") {
                this.$scope.totalQuizQuestion = data.result; //display total number of Quiz Questions.
            } else {

                this.$log.log("Questionpagecontroller - getTotalNumberOfQuestions() - Total number of questions are not available");
              
            }
        });
    }

    //Validate user answers.
    private validateUserAnswers(quizAnswer) {

        //Remove validation messages.
        angular.element('textarea').siblings('p.error').remove();
        angular.element('div.multiple-ans').children('p.error').remove();
        var answerRequired = 0;
        this.$scope.shortAnswerValidationArray = [];
        var userSelectedOptions = "";
        var hasShortAnswerQuestionBeenAnswered = false;
        var hasMultipleQuestionBeenAnswer = false;
        var hasNoOfAnswersRequired = false;

        var count = quizAnswer.length;

        if (quizAnswer.length > 0) {
            var i;
            for (i = 0; i < count; i++) {

                if (quizAnswer[i].questionType == 2) {
                    this.$scope.quizAnswersAndPageDetails = [];
                    if (quizAnswer[i].userAnswer != null && quizAnswer[i].userAnswer != "") {
                        var shortAnswer = quizAnswer[i].userAnswer;
                    } else {
                        this.$scope.shortAnswerValidationArray.push({ ckEditorId: quizAnswer[i].ckEditorId, indentPx: quizAnswer[i].indentPx });

                        hasShortAnswerQuestionBeenAnswered = true;
                    }
                } else if (quizAnswer[i].questionType == 1) {

                    this.$scope.quizAnswersAndPageDetails = [];
                    hasMultipleQuestionBeenAnswer = false;
                    if (quizAnswer[i].userSelectedAnswer == true) {
                        ;
                        this.$scope.userCheckedOptions = [];
                        this.$scope.userCheckedOptions.push({ selectedOptions: quizAnswer[i].userAnswer });
                        userSelectedOptions = userSelectedOptions + this.$scope.userCheckedOptions[0].selectedOptions;
                        answerRequired++;
                    }

                    if (userSelectedOptions == "") {
                        hasMultipleQuestionBeenAnswer = true;
                    }
                }
            }
            this.$rootScope.validationArray = this.$scope.shortAnswerValidationArray;
            //Check whether user has selected multiple choice questions as per the noOfAnswers required.
            if (quizAnswer[0].questionType == 1) {

                if (!hasMultipleQuestionBeenAnswer) {

                    if (answerRequired != quizAnswer[0].noOfAnswersRequired) {
                        hasNoOfAnswersRequired = true;
                    }
                }
            }


            //If user has not answered for the present question.
            if (hasShortAnswerQuestionBeenAnswered) {

                if (this.$scope.shortAnswerValidationArray.length > 0) {
                    for (i = 0; i < this.$scope.shortAnswerValidationArray.length; i++) {
                        var id = this.$scope.shortAnswerValidationArray[i].ckEditorId;
                        var indentPx = this.$scope.shortAnswerValidationArray[i].indentPx;
                        var offset = angular.element('#' + this.$scope.shortAnswerValidationArray[0].ckEditorId + '').parent().offset().top;
                        var parentOffset = angular.element('.container.main-container').offset().top;
                        var childOffset = offset - parentOffset;
                        angular.element('html,body').animate({ scrollTop: childOffset }, 200);
                        this.$scope.errormsgShort = true;
                        angular.element('#' + id).siblings('p').remove();
                        angular.element('#' + id).parent().append("<p class='error' indentPx=" + indentPx + " >Please type in your answer in the area provided.</p>");
                        angular.element('#' + id).parent().find('p').css("margin-left", + indentPx + 'px');

                    }
                }
                return false;
            }
            //if user has not selected any checkbox.
            else if (hasMultipleQuestionBeenAnswer) {
                var answer;
                if (quizAnswer[0].noOfAnswersRequired > 1) {
                    answer = " answers.";
                } else {
                    answer = " answer.";
                }
                angular.element("div.multiple-ans").append("<p class='error pad-15'>Please select " + quizAnswer[0].noOfAnswersRequired + answer + "</p>");

                return false;
            }
            //if user has not select the checkboxes as per the number required.
            else if (hasNoOfAnswersRequired) {

                if (quizAnswer[0].noOfAnswersRequired > 1) {
                    answer = " answers.";
                } else {
                    answer = " answer.";
                }
                angular.element("div.multiple-ans").append("<p class='error pad-15'>Please select " + quizAnswer[0].noOfAnswersRequired + answer + "</p>");

                return false;
            } else {
                return true;
            }
        }

    }

    //Remove error once user selects a checkbox
    private checkBoxChange(valueselectedcheckbox) {
        this.validateUserAnswers(valueselectedcheckbox);
    }

    //push data into array which will be saved.
    private returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, userTimeTaken, isAnswerCompleted, isPeriodicSaveAnswerCall) {

        var answerRequired = 0;
        var userSelectedOptions = "";
        var count = quizAnswer.length;
        var answeredInTime = false;
        this.$scope.quizAnswersAndPageDetails = [];

        if (this.timerExpired == true) {
            //User has not answered in time.
            answeredInTime = false;

        } else {
            answeredInTime = true;
        }

        if (quizAnswer.length > 0) {
            for (var i = 0; i < count; i++) {
                if (quizAnswer[i].questionType == 2) {

                    //push questions and page details into an array that are to be saved. 
                    this.$scope.quizAnswersAndPageDetails.push({
                        IsTabNotActive: this.isTabNotActive,
                        HiddenCodeForQuiz: quizAnswer[i].hiddenCode,
                        NumberOfMarks: quizAnswer[i].numberOfMarks,
                        QuestionNumber: quizAnswer[i].questionNumber,
                        UserId: quizAnswer[i].userId,
                        QuestionId: quizAnswer[i].questionIds[i],
                        QuestionIds: quizAnswer[i].questionIds,
                        QuestionType: quizAnswer[i].questionType,
                        UserAnswer: quizAnswer[i].userAnswer,
                        CorrectAnswer: quizAnswer[i].correctAnswer,
                        AnsweredInTime: answeredInTime,
                        SaveAndcompleteLaterLink: saveAndCompleteLaterLink,
                        TimeTaken: userTimeTaken,
                        IsAnsweringDone: isAnswerCompleted,
                        isPeriodicCall: isPeriodicSaveAnswerCall
                    });

                } else if (quizAnswer[i].questionType == 1) {

                    this.$scope.quizAnswersAndPageDetails = [];
                    if (quizAnswer[i].userSelectedAnswer == true) {

                        this.$scope.userCheckedOptions = [];
                        this.$scope.userCheckedOptions.push({ selectedOptions: quizAnswer[i].userAnswer });
                        userSelectedOptions = userSelectedOptions + this.$scope.userCheckedOptions[0].selectedOptions;
                        answerRequired++;
                    }
                    //push questions and page details into an array that are to be saved.
                    this.$scope.quizAnswersAndPageDetails.push({
                        IsTabNotActive: this.isTabNotActive,
                        HiddenCodeForQuiz: quizAnswer[i].hiddenCode,
                        NumberOfMarks: quizAnswer[i].numberOfMarks,
                        QuestionNumber: quizAnswer[i].questionNumber,
                        UserId: quizAnswer[i].userId,
                        QuestionId: quizAnswer[i].questionIds[0],
                        QuestionIds: quizAnswer[i].questionIds,
                        QuestionType: quizAnswer[i].questionType,
                        UserAnswer: userSelectedOptions,
                        CorrectAnswer: quizAnswer[i].correctAnswer,
                        AnsweredInTime: answeredInTime,
                        SaveAndcompleteLaterLink: saveAndCompleteLaterLink,
                        TimeTaken: userTimeTaken,
                        IsAnsweringDone: isAnswerCompleted,
                        isPeriodicCall: isPeriodicSaveAnswerCall
                    });
                }
            }
            return this.$scope.quizAnswersAndPageDetails;
        }
    }

    //Set timer value.
    private setTimervalue(xmlFileTotalAllottedTime) {

        this.$scope.recommendedTime = xmlFileTotalAllottedTime;
        this.$scope.recommendedTimeSeconds = this.$scope.recommendedTime % 60;

        if (this.$scope.recommendedTime > 0) {

            this.$scope.recommendedTimeMinutes = Math.floor(this.$scope.recommendedTime / 60);
        } else {

            this.$scope.recommendedTimeMinutes = Math.ceil(this.$scope.recommendedTime / 60);
        }

        //Logic to refresh timer based on the value of timercountdown.

        if (this.$scope.quizSetting.TimerUpdateFrequency == 0) { //Value of timercountdown is set globally during quizsettings.    

            //Only update the displayed timer when a new question is presented.

            //  var pageChangeRefreshCounter = $scope.recommendedTime;
            var pageChangeRefreshCounter = this.$scope.timeRemaining;
            this.pageChangedRefreshInterval = this.$interval(() => {

                pageChangeRefreshCounter--;
                this.$scope.timeRemaining--; //To get time remainig value when timer refresh on page load.
                if (pageChangeRefreshCounter == 0) {

                    this.timerExpiredpage(this.$scope.quizSetting); //Propmt Confirm dialog box when recommended time get over.
                }


                if (this.$scope.timeRemaining < 0) {

                    this.timerExpired = true;
                }
                //For RecommendedTime
                if (this.$scope.recommendedTimeMinutes > 1) {
                    this.$scope.recommendedMinutesString = "Minutes";
                } else {
                    this.$scope.recommendedMinutesString = "Minute";
                }

                if (this.$scope.recommendedTimeSeconds > 1) {
                    this.$scope.recommendedSecondsString = "Seconds";
                } else {
                    this.$scope.recommendedSecondsString = "Second";
                }


                //For Time Remaining.
                if (this.$scope.timeRemainingMinutes > 1 || this.$scope.timeRemainingMinutes < -1) {
                    this.$scope.minutesString = "Minutes";
                } else {
                    this.$scope.minutesString = "Minute";
                }

                if (this.$scope.timeRemainingSeconds > 1 || this.$scope.timeRemainingSeconds < -1) {
                    this.$scope.secondsString = "Seconds";
                } else {
                    this.$scope.secondsString = "Second";
                }
            }, 1000);


        } else if (this.$scope.quizSetting.TimerUpdateFrequency == 1) {

            //Update the displayed timer on the minute
            var count = 0;
            var recommendedCounter = 0;

            //Recommended  timer i.e time for individual questions.
            var reccommenedTimeCounter = 0;

            this.recommendedTimeTimer = this.$interval(() => {

                //if ($scope.recommendedTimeMinutes == 0 && $scope.recommendedTimeSeconds >= 0) {

                //        //If Minute is 0 and seconds is greater than 0 than when seconds reaches to 0 then prompt comfirm box.
                //        if (reccommenedTimeCounter == $scope.recommendedTimeSeconds) {

                //            //Call method to propmt timer expired.
                //            $scope.timerExpiredpage($scope.quizSetting);
                //        }
                //        reccommenedTimeCounter++;
                //    }

                recommendedCounter++;

                //When counter reaches to 60 decrement minute.
                if (recommendedCounter == 60) {
                    this.$scope.recommendedTimeMinutes--;

                    if (this.$scope.recommendedTimeMinutes < 0 && this.$scope.recommendedTimeSeconds > 0) {
                        this.$scope.recommendedTimeSeconds = 0 - this.$scope.recommendedTimeSeconds;
                    }
                    recommendedCounter = 0;
                }

                if (this.$scope.recommendedTimeMinutes > 1 || this.$scope.recommendedTimeMinutes < 1) {
                    this.$scope.recommendedMinutesString = "Minutes";
                } else {
                    this.$scope.recommendedMinutesString = "Minute";
                }

                if (this.$scope.recommendedTimeSeconds > 1 || this.$scope.recommendedTimeSeconds < 1) {
                    this.$scope.recommendedSecondsString = "Seconds";
                } else {
                    this.$scope.recommendedSecondsString = "Second";
                }
            }, 1000);

            //Remaining time i.e. timer to complete whole quiz.

            var timerCounter = 0;
            var timeRemainingCounterForTimerExpired = 0;
            this.remainingTimeTimer = this.$interval(() => {

                if (this.$scope.timeRemaining != undefined) {

                    timerCounter++;
                    this.$scope.timeRemaining--;     //To get time remainig value when timer refresh on minute.

                    if (this.$scope.recommendedTimeMinutes == 0 && this.$scope.recommendedTimeSeconds >= 0) {

                        //If Minute is 0 and seconds is greater than 0 than when seconds reaches to 0 then prompt confirm box for Timer expired.
                        if (timeRemainingCounterForTimerExpired == this.$scope.recommendedTimeSeconds) {

                            //Call method to propmt timer expired.
                            this.timerExpiredpage(this.$scope.quizSetting);
                        }
                        timeRemainingCounterForTimerExpired++;
                    }

                    //When counter reaches to 60 decrement minute.
                    if (timerCounter == 60) {
                        this.$scope.timeRemainingMinutes--;

                        if (this.$scope.timeRemainingMinutes < 0 && this.$scope.timeRemainingSeconds > 0) {
                            this.$scope.timeRemainingSeconds = 0 - this.$scope.timeRemainingSeconds;
                        }
                        timerCounter = 0;
                    }

                    if (this.$scope.timeRemaining < 0) {

                        this.timerExpired = true;
                    }

                    if (this.$scope.timeRemainingMinutes > 1 || this.$scope.timeRemainingMinutes < -1) {
                        this.$scope.minutesString = "Minutes";
                    } else {
                        this.$scope.minutesString = "Minute";
                    }

                    if (this.$scope.timeRemainingSeconds > 1 || this.$scope.timeRemainingSeconds < -1) {
                        this.$scope.secondsString = "Seconds";
                    } else {
                        this.$scope.secondsString = "Second";
                    }

                }
            }, 1000);


        } else if (this.$scope.quizSetting.TimerUpdateFrequency == 2) {

            //Update time displayed timer on the second.

            //Remaining time i.e. timer to complete whole quiz.
            this.remainingTimeTimer = this.$interval(() => {

                this.$scope.userTimeTaken++;         //user time taken counter per question.
                this.$scope.timeRemainingSeconds--;
                this.$scope.timeRemaining--;         //To take total time taken in seconds and store it in a variable on server side to pass its value to next/previous question.

                //Check if Minutes and seconds are 0 then show timer expired page.
                if (this.$scope.timeRemainingSeconds == 0 && this.$scope.timeRemainingMinutes == 0) {

                    this.timerExpiredpage(this.$scope.quizSetting);
                    this.timerExpired = true;
                }

                if (this.$scope.timeRemainingSeconds < 0) {

                    this.timerExpired = true;
                }
                if (this.$scope.timeRemainingSeconds <= 0 && this.$scope.timeRemainingMinutes > 0) {

                    //If time remaining is positive.
                    this.$scope.timeRemainingMinutes--;
                    this.$scope.timeRemainingSeconds = 59;

                } else if (this.$scope.timeRemainingMinutes <= 0 && this.$scope.timeRemainingSeconds == -60) {

                    //If time remainig is negative value.
                    this.$scope.timeRemainingMinutes--;
                    this.$scope.timeRemainingSeconds = 0;
                }

                if (this.$scope.timeRemainingMinutes > 1 || this.$scope.timeRemainingMinutes < -1) {
                    this.$scope.minutesString = "Minutes";
                } else {
                    this.$scope.minutesString = "Minute";
                }

                if (this.$scope.timeRemainingSeconds > 1 || this.$scope.timeRemainingSeconds < -1) {
                    this.$scope.secondsString = "Seconds";
                } else {
                    this.$scope.secondsString = "Second";
                }
            }, 1000);

            //Recommended  timer i.e time for individual questions.
            this.recommendedTimeTimer = this.$interval(() => {

                this.$scope.recommendedTimeSeconds--;

                //Check if Minutes and seconds are 0 then show timer expired page.
                if (this.$scope.recommendedTimeSeconds == 0 && this.$scope.recommendedTimeMinutes == 0) {

                    //Call method to show Timer Expired Page.
                    //  $scope.timerExpiredpage($scope.quizSetting);

                } else if (this.$scope.recommendedTimeSeconds <= 0 && this.$scope.recommendedTimeMinutes > 0) {

                    //If Recommended time is positive.
                    this.$scope.recommendedTimeMinutes--;
                    this.$scope.recommendedTimeSeconds = 59;

                } else if (this.$scope.recommendedTimeMinutes <= 0 && this.$scope.recommendedTimeSeconds == -60) {

                    //If Recommended time is negative.
                    this.$scope.recommendedTimeMinutes--;
                    this.$scope.recommendedTimeSeconds = 0;
                }

                if (this.$scope.recommendedTimeMinutes > 1 || this.$scope.recommendedTimeMinutes < 1) {
                    this.$scope.recommendedMinutesString = "Minutes";
                } else {
                    this.$scope.recommendedMinutesString = "Minute";
                }

                if (this.$scope.recommendedTimeSeconds > 1 || this.$scope.recommendedTimeSeconds < 1) {
                    this.$scope.recommendedSecondsString = "Seconds";
                } else {
                    this.$scope.recommendedSecondsString = "Second";
                }
            }, 1000);
        }

        //start background timer.
        this.$scope.$broadcast('timer-start');

    }

    //Get time taken by user to complete the present question.
    private getUserTimeTakenAndStopeTimer() {

        var userTimeTaken;
        this.$interval.cancel(this.remainingTimeTimer);
        this.$interval.cancel(this.recommendedTimeTimer);
        this.$interval.cancel(this.pageChangedRefreshInterval);
        this.$interval.cancel(this.saveUserAnswerInterval);

        this.$scope.$on('timer-stopped', (event, data) => {
            userTimeTaken = Math.round(data.millis / 1000);
            return userTimeTaken;
        });

        this.$scope.$broadcast('timer-stop');

        return userTimeTaken;
    }

    //Bind the question details to page.
    private bindQuestionDetails(questions) {

        var xmlFileTotalAllottedTime = 0;
        var timeTakenByUserToCompletePreviousQuestion = 0;
        var timeAllottedTouserForQuestion;
        this.$scope.shortAndMultipleChoiceAnswerQuestion = [];
        if (questions.length > 0) {

            //this.$scope.shortAndMultipleChoiceAnswerQuestion = [];
            this.$scope.questionNo = questions[0].QuestionNumber;
            this.$scope.questionType = questions[0].QuestionType;    // To check condition on whether to show timer expired confrim box or not.
            var count = questions.length;

            for (var i = 0; i < count; i++) {
                this.$scope.questionType = questions[i].QuestionType; //Used to pass value if timer expired.

                xmlFileTotalAllottedTime = xmlFileTotalAllottedTime + questions[i].TimeToAnswer;

                timeTakenByUserToCompletePreviousQuestion = timeTakenByUserToCompletePreviousQuestion + questions[i].TimeTaken;
                if (questions[i].QuestionNumber == 1) {
                    this.$scope.previousButtonValue = false;
                }

                //Bind value to show maximum marks field.
                if (questions[i].NumberOfMarks > 1) {
                    this.$scope.multipleAnswerMaxMarks = questions[i].NumberOfMarks + " Marks";
                } else {
                    this.$scope.multipleAnswerMaxMarks = questions[i].NumberOfMarks + " Mark";
                }

                //Short Answer question.
                if (questions[i].QuestionType == 2) {

                    //push data into an array to display using ng-repeat.
                    this.$scope.shortAndMultipleChoiceAnswerQuestion.push({
                        ckEditorId: i,
                        questionImageId: "img-" + i,
                        indentPx: questions[i].IndentPx,
                        hiddenCode: this.hiddenCode,
                        solutionImageRequiredScaling: questions[i].SolutionImageRequiredScaling,
                        questionType: questions[i].QuestionType,
                        questionIds: questions[i].QuestionIds,
                        questionNumber: questions[i].QuestionNumber,
                        imagePath: questions[i].QuestionImagePath,
                        noOfAnswersRequired: questions[i].NoOfAnswersRequired,
                        shortAnswerMaxmarks: this.$scope.multipleAnswerMaxMarks,
                        correctAnswer: questions[i].CorrectAnswer,
                        userAnswer: questions[i].UserAnswer,
                        timeAllotted: xmlFileTotalAllottedTime,
                        userId: this.userId,
                        numberOfMarks: questions[i].NumberOfMarks,
                        isAnsweringDone: questions[i].IsAnsweringDone,
                        writeSolutionInSpecificLocationMessage: this.$sce.trustAsHtml(questions[i].WriteSolutionInSpecificLocationMessage)
                    });
                }
                //Multiple choice questions.
                else if (questions[i].QuestionType == 1) {

                    this.$scope.questionImageId = "img-" + i;
                    this.$scope.multipleChoiceValue = true;
                    this.$scope.shortAnswerValue = false;
                    this.$scope.questionImagePath = questions[0].QuestionImagePath;
                    this.$scope.solutionImageRequiredScaling = questions[0].SolutionImageRequiredScaling;
                    this.$scope.writeSolutionInSpecificLocationMessage = this.$sce.trustAsHtml(questions[i].WriteSolutionInSpecificLocationMessage);

                    var possibleAnswer = questions[i].PossibleAnswers;
                    var userPreviousAnswer = questions[i].UserAnswer;
                    var hasChecked = false;

                    var possibleAnswerLength = questions[i].PossibleAnswers.length;

                    //If user has already answer the question and if he clicks previous then to bind the selected check box value.
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
                            //push data into an array to display using ng-repeat.
                            this.$scope.shortAndMultipleChoiceAnswerQuestion.push({
                                hiddenCode: this.hiddenCode,
                                indentPx: questions[i].IndentPx,
                                questionNumber: questions[i].QuestionNumber,
                                questionType: questions[i].QuestionType,
                                questionIds: questions[i].QuestionIds,
                                userAnswer: possibleAnswer[k],
                                imagePath: questions[i].QuestionImagePath,
                                shortAnswerMaxmarks: questions[i].NumberOfMarks,
                                noOfAnswersRequired: questions[i].NoOfAnswersRequired,
                                correctAnswer: questions[i].CorrectAnswer,
                                timeAllotted: xmlFileTotalAllottedTime,
                                userId: this.userId,
                                isAnsweringDone: questions[i].IsAnsweringDone,
                                numberOfMarks: questions[i].NumberOfMarks,
                                userSelectedAnswer: hasChecked
                            });
                        }
                    } //Bind multiple choice question on click of next.
                    else {
                        angular.forEach(possibleAnswer, (value) => {

                            //Push data into an array to display using ng-repeat.
                            this.$scope.shortAndMultipleChoiceAnswerQuestion.push({
                                questionImageId: "img-" + i,
                                indentPx: questions[i].IndentPx,
                                hiddenCode: this.hiddenCode,
                                questionNumber: questions[i].QuestionNumber,
                                questionType: questions[i].QuestionType,
                                questionIds: questions[i].QuestionIds,
                                userAnswer: value,
                                imagePath: questions[i].QuestionImagePath,
                                shortAnswerMaxmarks: questions[i].NumberOfMarks,
                                noOfAnswersRequired: questions[i].NoOfAnswersRequired,
                                correctAnswer: questions[i].CorrectAnswer,
                                timeAllotted: xmlFileTotalAllottedTime,
                                userId: this.userId,
                                isAnsweringDone: questions[i].IsAnsweringDone,
                                numberOfMarks: questions[i].NumberOfMarks,
                                userSelectedAnswer: hasChecked
                            });
                        });
                    }
                    this.$scope.shortanswervalue = false;
                }
            }


            timeAllottedTouserForQuestion = Math.round(xmlFileTotalAllottedTime - timeTakenByUserToCompletePreviousQuestion);
            this.$scope.userTimeTaken = timeTakenByUserToCompletePreviousQuestion;

        }

        this.$scope.questionsValue = true; //Display the QuestionDetils div.
        this.$scope.progressBarValue = false; //Hide progress bar hence process has been completed.

        //Call method to start timer.
        this.$timeout(() => {
            this.setTimervalue(timeAllottedTouserForQuestion);
        }, 100);

        //Call method to save user answer on an interval of 1 minute.
        this.saveUserAnswerDetailsOnMinuteInterval();
    }

    //Get question details to bind it by passing page no.
    private getQuestionDetails() {

        this.questionPageService.getQuestionAndPageDetailsForQuestionPage(this.hiddenCode, this.questionNumber, this.userId).then((quizQuestionDetails) => {

            if (quizQuestionDetails != null && quizQuestionDetails.length > 0) {

                if (quizQuestionDetails[0].QuestionNumber == 1) {

                    //Insert data into quizresultsummary and quizcompilation on load of 1st question only.
                    this.questionPageService.initializeQuizResultSummaryAndQuizCompilation(this.hiddenCode, this.userId).then(() => {

                    });
                }
                var firstQuestionNum = quizQuestionDetails[0].QuestionNumber;

                //Method to check whether to hide previous button or not.
                this.checkForPreviousButton(firstQuestionNum);

                //Method to bind question details to UI.
                this.bindQuestionDetails(quizQuestionDetails);

                //Get time remaning value.
                this.calculteSeconds(0, 0, 0, false);

            } else {

                this.$log.log("Questionpagecontroller - getQuestionDetails() - Question details are not available.");
            }
        });
    }

    //Calculate seconds and store time remaining value on server side to maintain its value when browser refresh.
    private calculteSeconds(minutes, seconds, totalTimeRemainigseconds, setValue) {

        var totalSeconds;
        totalSeconds = totalTimeRemainigseconds;
        console.log("calculteSeconds - totalSeconds = " + totalSeconds + " setValue =  " + setValue);
        //Set value on click of next button and get value on load of question.
        this.questionPageService.setAndGetRemainingtime(totalSeconds, setValue, this.hiddenCode, this.userId).then((totalAllottedTime) => {

            this.$scope.timeRemaining = totalAllottedTime.result;
            this.$scope.timeRemainingSeconds = totalAllottedTime.result % 60;

            console.log("calculteSeconds - totalAllottedTime  = " + totalAllottedTime.result + " Minute - " + this.$scope.timeRemaining + " seconds = " + this.$scope.timeRemainingSeconds);

            //If time is negative than take ceil value of it.
            if (totalAllottedTime.result < 0) {
                this.$scope.timeRemainingMinutes = Math.ceil(totalAllottedTime.result / 60);
            } else {
                //If time is positive than take floor value of it.
                this.$scope.timeRemainingMinutes = Math.floor(totalAllottedTime.result / 60);
            }

            this.$scope.recommendedMinutesString = "Minutes";
            this.$scope.recommendedSecondsString = "Seconds";
            this.$scope.minutesString = "Minutes";
            this.$scope.secondsString = "Seconds";
        });
        // return seconds;

    }

    //Check whether to hide previous button or not.
    private checkForPreviousButton(firstQuestionNum) {

        if (this.$scope.preRouteController == "IntroPageController" || this.$scope.preRouteController == "TimerExpiredPageController" || this.$scope.preRouteController == "CountDownController" || this.$scope.preRouteController == "HomeController" || this.$scope.preRouteController == "SavedAndPausedPageController" || this.$scope.preRouteController == "HomeController" || this.$scope.preRouteController == "QuizManagerPageController") {

            this.questionPageService.setValueOfFirstQuestionToHidePreviousButton(firstQuestionNum, true, this.hiddenCode, this.userId).then((questionNumber) => {
                if (questionNumber.result != 0) {
                    if (questionNumber.result == firstQuestionNum) {
                        this.$scope.previousButtonValue = false;
                    }
                }
            });
        } else {
            this.questionPageService.setValueOfFirstQuestionToHidePreviousButton(firstQuestionNum, false, this.hiddenCode, this.userId).then((questionNumber) => {

                if (questionNumber.result != 0) {
                    if (questionNumber.result == firstQuestionNum) {
                        this.$scope.previousButtonValue = false;
                    }
                }
            });
        }
    }

    //Next button click event.
    private nextButton(quizAnswer) {
        this.$rootScope.nextIsClicked = true;

        //For to handle browser back button.
        this.$rootScope.backIsNotClicked = true;

        if (quizAnswer.length > 0) {

            var saveAndCompleteLaterLink = false;

            //Check whether the user has answered the present questions or not.
            var hasUserAnwered = this.validateUserAnswers(quizAnswer);

            if (hasUserAnwered) {

                //Stop backgroud timer and get user time taken.
                //  var userTimeTaken = $scope.getUserTimeTakenAndStopeTimer(totalAllottedTime);
                var minutes = this.$scope.timeRemainingMinutes;
                var seconds = this.$scope.timeRemainingSeconds;


                //if (userTimeTaken < 0) {
                //    userTimeTaken = (-1) * userTimeTaken;
                //}
                this.isAnsweringDone = true;     //This is set to true to indicate that the user has completed the question.
                this.isPeriodicCall = false;


                //Call method to get the array of the user answers to send it server side.
                //var quizQuestionsAndUserAnswers = $scope.returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, userTimeTaken, isAnsweringDone, isPeriodicCall);

                var quizQuestionsAndUserAnswers = this.returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, this.$scope.userTimeTaken, this.isAnsweringDone, this.isPeriodicCall);

                if (quizQuestionsAndUserAnswers != null && quizQuestionsAndUserAnswers != "") {

                    //Call method to set time remaining on server side.
                    this.calculteSeconds(minutes, seconds, this.$scope.timeRemaining, true);

                    //If user has not answered in time and questiontype is 2 then redirect them to SelfScoringIntroPage with timer expired message.
                    if (!quizQuestionsAndUserAnswers[0].AnsweredInTime && this.$scope.quizSetting.EnforceTimer && quizQuestionsAndUserAnswers[0].QuestionType === 2 && this.$scope.isTimerExpiredPrompt) {

                        //Save user answer
                        this.questionPageService.getNextQuizPageOfQuiz(quizQuestionsAndUserAnswers).then((nextQuizPage) => {
                            this.$rootScope.backIsNotClicked = true;

                            //After saving user answer let them to self scoring intro page with the message Time allotted has expired.

                            //To get quizResultsummaryId.
                            this.questionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId) => {

                                if (summaryId.result != 0 && summaryId != undefined) {

                                    var resultsummaryId = summaryId.result;
                                    //Get total number of self scoring question count
                                    this.questionPageService.getSelfScoringQuestionsCount(this.hiddenCode, resultsummaryId).then((selfScoringQuestion) => {

                                        if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {

                                            var selfScoringQuestionCount = selfScoringQuestion.result;

                                            this.$scope.path = "/quiz-selfscoringintro/" + this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultsummaryId + "/" + 0; //0 is to indicate that the timer has been expired for the current question.
                                            this.$location.path(this.$scope.path);
                                        }
                                    });
                                } else {

                                    this.$log.log("Questionpagecontroller - nextButton() - SummaryId not found..");
                                }
                            });
                        });

                    } else {

                        this.questionPageService.getNextQuizPageOfQuiz(quizQuestionsAndUserAnswers).then((nextQuizPage) => {
                            this.$rootScope.backIsNotClicked = true;
                            //timerExpired = false;
                            if (nextQuizPage == null || nextQuizPage.result == null) {

                                //To get quizResultsummaryId.
                                this.questionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId) => {
                                    if (summaryId != null && summaryId.result != 0) {
                                        this.redirectResultPageorSelfscoring(summaryId.result);

                                    } else {
                                        this.$log.log("Questionpagecontroller - nextButton() - SummaryId is not available.");
                                    }


                                });
                            } else {

                                var nextQuestionNo = nextQuizPage.result.QuestionNumber;
                                this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + nextQuestionNo;

                                this.$location.path(this.$scope.path);
                            }
                        });
                    }

                } else {
                    this.$log.log("Questionpagecontroller - nextButton() -quizQuestionsAndUserAnswers contains null values");
                
                }
            }
        }
    }

    //Previous buton click event
    private previousButton(quizAnswer) {

        this.$rootScope.backIsNotClicked = true;
        this.$interval.cancel(this.remainingTimeTimer);
        this.$interval.cancel(this.recommendedTimeTimer);
        this.$interval.cancel(this.pageChangedRefreshInterval);
        this.$interval.cancel(this.saveUserAnswerInterval);

        if (quizAnswer.length > 0) {

            var currentQuestionNo = quizAnswer[0].questionNumber;

            var saveAndCompleteLaterLink = false;

            //Check whether the user has answered the present questions or not.
            var userTimeTaken;
            var minutes;
            var seconds;
            var quizQuestionsAndUserAnswers;

            //Check whethre isAnsweringDone is true or false.
            if (quizAnswer[0].isAnsweringDone) {

                //Check user anmswer field is not null.
                var hasUserAnwered = this.validateUserAnswers(quizAnswer);

                //If user has answered the questions.
                if (hasUserAnwered) {

                    //Stop backgroud timer and get user time taken.
                    //   userTimeTaken = $scope.getUserTimeTakenAndStopeTimer(totalAllottedTime);
                    minutes = this.$scope.timeRemainingMinutes;
                    seconds = this.$scope.timeRemainingSeconds;

                    if (userTimeTaken < 0) {
                        userTimeTaken = (-1) * userTimeTaken;
                    }

                    this.isAnsweringDone = false;
                    this.isPeriodicCall = false;
                    //Call method to get the array of the user answers to send it server side.
                    //quizQuestionsAndUserAnswers = $scope.returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, userTimeTaken, isAnsweringDone, isPeriodicCall);

                    quizQuestionsAndUserAnswers = this.returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, this.$scope.userTimeTaken, this.isAnsweringDone, this.isPeriodicCall);

                    if (quizQuestionsAndUserAnswers != null && quizQuestionsAndUserAnswers != "") {

                        //Call method to set time remaining on server side.
                        this.calculteSeconds(minutes, seconds, this.$scope.timeRemaining, true);

                        //timerExpired = false;
                        //call method to save user answer.
                        this.questionPageService.saveAnswersOfQuestions(quizQuestionsAndUserAnswers).then((isAnswerSaved) => {

                            if (isAnswerSaved.result) {

                                this.questionPageService.getPreviousQuizPageOfQuiz(this.hiddenCode, currentQuestionNo).then((previousQuizPage) => {

                                    if (previousQuizPage.result != null) {
                                        var previousQuestionNo = previousQuizPage.result.QuestionNumber;
                                        this.$rootScope.backIsNotClicked = true;

                                        this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + previousQuestionNo;
                                        this.$location.path(this.$scope.path);
                                    } else {
                                        this.$log.log("Questionpagecontroller - previousButton() - Previous question details are not available");
                                       
                                    }
                                });

                            } else {

                                this.$log.log("Questionpagecontroller - previousButton() - Answer is not saved in database");
                             
                            }

                        });
                    }
                }
            } else {
                //If isAnsweringDone is false then don't validate user answers.

                //Stop backgroud timer and get user time taken.
                userTimeTaken = this.getUserTimeTakenAndStopeTimer();
                minutes = this.$scope.timeRemainingMinutes;
                seconds = this.$scope.timeRemainingSeconds; //Call method to set time remaining on server side.
                this.calculteSeconds(minutes, seconds, this.$scope.timeRemaining, true);

                if (userTimeTaken < 0) {
                    userTimeTaken = (-1) * userTimeTaken;
                }
                this.isAnsweringDone = false;
                this.isPeriodicCall = false;

                //Call method to get the array of the user answers to send it server side.
                //quizQuestionsAndUserAnswers = $scope.returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, userTimeTaken, isAnsweringDone, isPeriodicCall);

                quizQuestionsAndUserAnswers = this.returnUserAnswerDetails(quizAnswer, saveAndCompleteLaterLink, this.$scope.userTimeTaken, this.isAnsweringDone, this.isPeriodicCall);
                if (quizQuestionsAndUserAnswers != null && quizQuestionsAndUserAnswers != "") {

                    //timerExpired = false;
                    //call method to save user answer.
                    this.questionPageService.saveAnswersOfQuestions(quizQuestionsAndUserAnswers).then((isAnswerSaved) => {

                        if (isAnswerSaved.result) {

                            this.questionPageService.getPreviousQuizPageOfQuiz(this.hiddenCode, currentQuestionNo).then((previousQuizPage) => {

                                if (previousQuizPage.result != null) {
                                    var previousQuestionNo = previousQuizPage.result.QuestionNumber;
                                    this.$rootScope.backIsNotClicked = true;

                                    this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + previousQuestionNo;
                                    this.$location.path(this.$scope.path);
                                } else {
                                    this.$log.log("Questionpagecontroller - previousButton() - Previous question details are not available.");
                                  
                                }
                            });

                        } else {

                            this.$log.log("Questionpagecontroller - previousButton() - Answer is not saved");
                        
                        }

                    });
                }

            }
        }
    }

    //Redirect either on selfscoring intro page if it exist or on result page.
    private redirectResultPageorSelfscoring(resultSummaryId) {

        this.$interval.cancel(this.remainingTimeTimer);
        this.$interval.cancel(this.recommendedTimeTimer);
        this.$interval.cancel(this.pageChangedRefreshInterval);
        this.$interval.cancel(this.saveUserAnswerInterval);

        this.questionPageService.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then((selfScoringQuestion) => {

            if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {

                var selfScoringQuestionCount = selfScoringQuestion.result;
                this.$scope.path = "/quiz-selfscoringintro/" + this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1;    //1 is to indicate timer has not been expired and continue with the normal flow.
                this.$location.path(this.$scope.path);

            } else {
                //check whether to display Result page or not.
                if (this.$scope.quizSetting.ShowResultsPage) {

                    //If result page is to be dispalyed.
                    this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + resultSummaryId;
                    this.$location.path(this.$scope.path);
                } else {

                    //If result page is not to be displayed.

                    //Call method to update data into QuizResultSummary and redirect to end message page if Result page is not to be shown.
                    this.questionPageService.getDetailsOnResultsPageLoad(this.hiddenCode, this.userId, "QuestionPageController", resultSummaryId).then(() => {

                        this.$scope.path = "/quiz-endmessage/" + this.hiddenCode;
                        this.$location.path(this.$scope.path);
                    });

                }
            }
        });
    }

    //When  user clicks on save and complete later link this confirm box will be displayed.
    private saveAndCompleteLaterClick() {

        var confirm = this.$mdDialog.confirm({
            title: 'Save and Complete Later',
            content: "This feature enables you to complete the quiz at a later time, but in order to invoke this feature, you must finish answering the current question.Additionally, when you resume the Quiz, you will not be able to navigate to previously answered questions.To save the quiz and complete it later, select the 'Save & Complete Later' button and finish answering the current question.",
            ok: 'Save & Complete Later',
            cancel: 'Continue as Normal',
            escapeToClose: false,
            clickOutsideToClose: false
        });


        this.$mdDialog.show(confirm).then(() => {

            //If user wants to complete the quiz later then next and previous buttons will be hide and will display 
            //Save and pause buton.

            this.$scope.saveAndCompleteLaterButtonValue = true;
            this.$scope.nextButtonValue = false;
            this.$scope.previousButtonValue = false;
            this.$scope.saveAndCompleteLaterLinkValue = false;

        }, () => {
            //If user wants to continue with the current quiz then he will be stayed on that page only.

        });
    }

    //When user clicks on save and pause butoon then he will be let to the pagetype 9.
    private saveAndCompleteLaterButtonClick(quizAnswer) {
        this.$rootScope.backIsNotClicked = true;
        var quizQuestionsAndUserAnswers;
        var saveAndcompleteLaterLink = true;

        var hasUserAnwered = this.validateUserAnswers(quizAnswer);

        if (hasUserAnwered) {

            this.$interval.cancel(this.remainingTimeTimer);
            this.$interval.cancel(this.recommendedTimeTimer);
            this.$interval.cancel(this.pageChangedRefreshInterval);
            this.$interval.cancel(this.saveUserAnswerInterval);
            this.isAnsweringDone = true;
            this.isPeriodicCall = false;


            //quizQuestionsAndUserAnswers = $scope.returnUserAnswerDetails(quizAnswer, saveAndcompleteLaterLink, userTimeTaken, isAnsweringDone, isPeriodicCall);
            quizQuestionsAndUserAnswers = this.returnUserAnswerDetails(quizAnswer, saveAndcompleteLaterLink, this.$scope.userTimeTaken, this.isAnsweringDone, this.isPeriodicCall);
            if (quizQuestionsAndUserAnswers != null && quizQuestionsAndUserAnswers != "") {

                this.questionPageService.getNextQuizPageOfQuiz(quizQuestionsAndUserAnswers).then((nextQuizPage) => {

                    if (nextQuizPage.result == null) {
                        this.questionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId) => {
                            this.quizResultSummaryId = summaryId.result;
                            this.$rootScope.backIsNotClicked = true;
                            this.$location.path("/quiz-savedandpaused/" + this.hiddenCode + "/" + this.quizResultSummaryId);
                        });

                    } else {

                        this.$log.log("Questionpagecontroller - saveAndCompleteLaterButtonClick() - Answer is not saved in database");
              
                    }
                });

            }
        }
    }

    //If enforce timer is true ad timeallotted get expired than this function will be called.
    private timerExpiredpage(quizSetting) {

        this.timerExpired = true;
        var timerString;
        this.$scope.isTimerExpiredPrompt = true;


        //Prompt confirm dialog box only if QuestionType is 1.
        if (this.$scope.questionType === 1) {

            this.questionPageService.getTotalAllottedTimeForQuiz(this.hiddenCode).then((totalime) => {
                var totalAllottedTime = totalime.result;

                if (totalAllottedTime != 0) {

                    var seconds = totalAllottedTime % 60;
                    var minutes = Math.floor(totalAllottedTime / 60);
                    timerString = this.timerString(minutes, seconds);

                    //If Result page is to be shown than show button with "View Results".
                    if (quizSetting.ShowResultsPage) {
                        this.$scope.okButton = "View Results";

                    } else {
                        //If Result page is not to be shown than show button with "My Quizzes".
                        this.$scope.okButton = "My Quizzes";
                    }

                    //If EnforceTimer is true than show confirm box.
                    if (quizSetting.EnforceTimer) {

                        var confirm = this.$mdDialog.confirm({
                            title: 'The Allotted Quiz Time has Elapsed',
                            content: "The allotted time for this quiz is " + timerString + " which has elapsed.\n\n You may still complete the quiz. You will be displayed a score for all completed questions, however you official score will be based on the questions you answered within the allotted time.",
                            ok: this.$scope.okButton,
                            cancel: 'Finish Quiz',
                            escapeToClose: false,
                            clickOutsideToClose: false
                        });


                        this.$mdDialog.show(confirm).then(() => {

                            //If user wants to go to result page.

                            this.$interval.cancel(this.remainingTimeTimer);
                            this.$interval.cancel(this.recommendedTimeTimer);
                            this.$interval.cancel(this.pageChangedRefreshInterval);
                            this.$interval.cancel(this.saveUserAnswerInterval);
                            //Get user time taken.
                            //    var userTimeTaken = $scope.getUserTimeTakenAndStopeTimer(totalAllottedTime);


                            // if (userTimeTaken != 0) {

                            this.isAnsweringDone = true;
                            this.isPeriodicCall = false;
                            this.timerExpired = true;
                            //var quizQuestionsAndUserAnswers = $scope.returnUserAnswerDetails($scope.shortAndMultipleChoiceAnswerQuestion, false, userTimeTaken, isAnsweringDone, isPeriodicCall);
                            var quizQuestionsAndUserAnswers = this.returnUserAnswerDetails(this.$scope.shortAndMultipleChoiceAnswerQuestion, false, this.$scope.userTimeTaken, this.isAnsweringDone, this.isPeriodicCall);

                            //Set timer expired flag to true on server side.
                            //  questionPageService.StoreTimerExpiredvalue(isTimerExpired).then(function() {

                            if (quizQuestionsAndUserAnswers != null && quizQuestionsAndUserAnswers != "") {

                                //Save user time taken and redirect to QuizResult page.
                                this.questionPageService.getNextQuizPageOfQuiz(quizQuestionsAndUserAnswers).then(() => {

                                    this.$rootScope.backIsNotClicked = true;
                                    if (this.$scope.okButton == "View Results" && quizSetting.ShowResultsPage) {

                                        //To get quizResuleSummaryId.
                                        this.questionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((summaryId) => {

                                            if (summaryId.result != 0 && summaryId.result != undefined && summaryId != undefined) {

                                                this.quizResultSummaryId = summaryId.result;
                                                this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                                                this.$location.path(this.$scope.path);
                                            } else {

                                                this.$log.log("Questionpagecontroller - timerExpiredpage() - SummaryId not found.");
                                              
                                            }
                                        });

                                    } else if (this.$scope.okButton == "My Quizzes" && !quizSetting.ShowResultsPage) {

                                        this.$scope.path = "/quiz-quizmanager/" + this.hiddenCode;
                                        this.$location.path(this.$scope.path);

                                    }
                                });
                            } else {

                                this.$log.log("Questionpagecontroller - timerExpiredpage() - Questions And UserAnswers details are null.");
                            
                            }
                           

                        }, () => {
                            this.timerExpired = true;
                            //If user wants to complete the current quiz then he will be stayed on the same page only.

                        });
                    }
                } else {
                    this.$log.log("Questionpagecontroller - timerExpiredpage() - Total allotted time for Quiz is not available");
                }
            });
        }
    }

    //Set the timerString.
    private timerString(minutes, seconds) {
        var minuteString = "";
        var secondString = "";

        if (minutes > 1) {
            minuteString = "Minutes";
        } else {
            minuteString = "Minute";
        }

        if (seconds > 1) {
            secondString = "Seconds";
        } else {
            secondString = "Second";
        }

        var timerString = minutes + " " + minuteString + " " + seconds + " " + secondString;
        return timerString;
    }

}
app.controller(QuestionPageController.controllerId, ['$scope', '$sce', '$cookieStore', '$controller', 'prevRoutePromiseGetter', '$route', '$routeParams', 'questionPageService', 'introPageSevice', '$mdDialog', '$location', '$interval', '$timeout', '$rootScope', '$log',
    ($scope, $sce, $cookieStore, $controller, prevRoutePromiseGetter, $route, $routeParams, questionPageService, introPageSevice, $mdDialog, $location, $interval, $timeout, $rootScope, $log) =>
        new QuestionPageController($scope, $sce, $cookieStore, $controller, prevRoutePromiseGetter, $route, $routeParams, questionPageService, introPageSevice, $mdDialog, $location, $interval, $timeout, $rootScope, $log)
]);
