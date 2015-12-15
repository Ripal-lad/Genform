// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
module App {
    "use strict";

    interface IsavedAndPausedPageControllerScope extends ng.IScope {
        title: string;
        quizTitle: string;
        hiddenCode: string;
        timeAllowed: string;
        timeTaken: string;
        timeRemaining: string;
        progressBarValue: boolean;
        pageDetailsValue: boolean;
        beginQuizName: string;
        path: string;
        myQuizzes: () => void;
        resumeQuiz: () => void;
    }

    interface IsavedAndPausedPageController {
      
    }

    class SavedAndPausedPageController implements IsavedAndPausedPageController {
        static controllerId: string = "SavedAndPausedPageController";

        private hiddenCode;
        private quizResultSummaryId;
        private userId;
        private ips4MemberId;
        private ips4IpSessionFront;
        constructor(private $scope: IsavedAndPausedPageControllerScope,
            private $rootScope,
            private $cookieStore,
            private $routeParams,
            private savedAndPausedPageService,
            private introPageSevice,
            private $location,
            private $log) {
            $scope.title = "SavedAndPausedPageController";

            this.hiddenCode = $routeParams.hiddenCode;
            this.quizResultSummaryId = $routeParams.quizResultSummaryId;
            this.userId = 1;
            
            this.$scope.progressBarValue = false;    //Start progress bar.
            this.$scope.pageDetailsValue = true;  //Hide quizmanagerpage details to UI.

            this.$scope.beginQuizName = "Resume Quiz";

            this.$scope.myQuizzes = () => this.myQuizzes();
            this.$scope.resumeQuiz = () => this.resumeQuiz();

            //Get cookies of IPBoard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            
            if (this.hiddenCode != null && this.quizResultSummaryId != null && this.quizResultSummaryId != 0 && this.quizResultSummaryId != "undefined" && this.hiddenCode != "undefined") {

                this.getQuizName();
                this.getTotalAllottedtime();

            } else {

                this.$log.log("SavedAndPausedPageController - Constructor - RouteParams are not defined");
            }

            //Broadcast from browserBackButtonForOtherPages directive.
            $rootScope.$on("onRouteChangeEvent", (event, result) =>{

                $rootScope.$on('$locationChangeStart',() =>{

                    this.goBack();

                });
            });
        }

        //If browser back buton is clicked then redirect it to IntroPage.
        private  goBack() {

            if (!this.$rootScope.browserBackIsClicked) {
                this.$rootScope.browserBackIsClicked = true;
                this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
            }
        }


        //Get quizname.
        private getQuizName () {
            this.savedAndPausedPageService.getCurrentQuizName(this.hiddenCode).then((quizName)=> {
                this.$scope.quizTitle = quizName.result;
            });
        }

         //Get total allotted time for quiz.
        private getTotalAllottedtime () {

            //Get total allotted time for quiz.
            this.savedAndPausedPageService.getTotalAllottedTimeForQuiz(this.hiddenCode).then((totalAllottedTime) =>{

                //Get total time taken by user.
                this.savedAndPausedPageService.getTotalTimeTakenByUser(this.hiddenCode, this.userId, this.quizResultSummaryId).then((userTakenTime) =>{

                    if (totalAllottedTime.result != 0 && userTakenTime.result != 0) {

                        this.calculateTime(totalAllottedTime.result, userTakenTime.result);

                    } else if (totalAllottedTime.result != 0 && userTakenTime.result == 0) {

                        this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                        this.$log.log("SavedAndPausedPageController - getTotalAllottedtime() - User time taken not found");
                     
                    } else if (totalAllottedTime.result == 0 && userTakenTime.result != 0) {

                        this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                        this.$log.log("SavedAndPausedPageController - getTotalAllottedtime() - Total allotted time not found");
                    } else {

                        this.calculateTime(totalAllottedTime.result, userTakenTime.result);
                        this.$log.log("SavedAndPausedPageController - getTotalAllottedtime() - Total allotted time and user time taken not found");
                    }
                });
            });
        }
        
        //Set the timerString.
        private timerString (minutes, seconds) {
            var minuteString = "";
            var secondString = "";

            if (minutes > 1 || minutes < -1) {
                minuteString = "Minutes";
            } else {
                minuteString = "Minute";
            }

            if (seconds > 1 || seconds < -1) {
                secondString = "Seconds";
            } else {
                secondString = "Second";

            }

            var timerString = minutes + " " + minuteString + " " + seconds + " " + secondString;
            return timerString;
        }
        
        //Calculate time.
        private calculateTime (totalAllottedTime, userTakenTime) {

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

                remainingTimeSeconds = remainingTime % 60;;
                remainingTimeMinutes = Math.floor(remainingTime / 60);

                remainingTimeString = this.timerString(remainingTimeMinutes, remainingTimeSeconds);
                this.$scope.timeRemaining = remainingTimeString;

            } else {

                //If time remaining is greater than zero than take ceil value.

                remainingTimeSeconds = remainingTime % 60;;
                remainingTimeMinutes = Math.ceil(remainingTime / 60);

                remainingTimeString = this.timerString(remainingTimeMinutes, remainingTimeSeconds);
                this.$scope.timeRemaining = remainingTimeString;
            }
            this.$scope.progressBarValue = false;    //Stop progress bar.
            this.$scope.pageDetailsValue = true;  //show quizmanagerpage details to UI.
        }

        //Redirect to selfscoringintropage if all the questions of the quiz has been answered.
        private redirectResultPageOrSelfScoring (resultSummaryId) {

            this.introPageSevice.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then((selfScoringQuestion) =>{

                if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                    var selfScoringQuestionCount = selfScoringQuestion.result;
                    this.$location.path("/quiz-selfscoringintro/" + this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1);

                } else {
                    this.$location.path("/quiz-result/" + this.hiddenCode + "/" + resultSummaryId);
                }
            });
        }

        //MyQuizzes button click event.
        private myQuizzes () {
            this.$rootScope.browserBackIsClicked = true;
            var path = "/quiz-quizmanager/" + this.hiddenCode;
            this.$location.path(path);

        }

        //Resume button click event.
        private resumeQuiz () {
            this.$rootScope.browserBackIsClicked = true;

            //Check if quiz is saved and paused by user.
            this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((quizResumed)=> {

                if (quizResumed.result != 0) {

                    //Get question number to resume quiz.
                    this.introPageSevice.getQuizPageQuestionToResumeQuiz(this.hiddenCode, this.userId).then((resumeQuizQuestion) =>{
                        var resultSummaryId = quizResumed.result;

                        if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {

                            var questionNo = resumeQuizQuestion.result.QuestionNumber;

                            this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + questionNo;
                            this.$location.path(this.$scope.path);
                        } else {

                            //Check if all the questions of the quiz has been nswered b the user and self score is remained.
                            this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((selfScoring)=> {
                                if (!selfScoring.result) {

                                   //Get self scoring question count.
                                    this.introPageSevice.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then((selfScoringQuestion)=> {

                                        if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                                            var selfScoringQuestionCount = selfScoringQuestion.result;

                                            this.$scope.path = "/quiz-selfscoringintro/" + this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1;
                                            this.$location.path(this.$scope.path);

                                        } else {
                                            this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId
                                            this.$location.path(this.$scope.path);
                                        }
                                    });

                                } else {

                                    this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                                    this.$location.path(this.$scope.path);
                                   
                                }
                            });
                        }
                    });
                } else {
                    this.$log.log("SavedAndPausedPageController - resumeQuiz() - QuizResulSummaryId not found.");
                }
            });
        }
    }

    app.controller(SavedAndPausedPageController.controllerId, ['$scope', '$rootScope', '$cookieStore', '$routeParams', 'savedAndPausedPageService', 'introPageSevice', '$location','$log',
        ($scope, $rootScope, $cookieStore, $routeParams, savedAndPausedPageService, introPageSevice,  $location, $log) =>
            new SavedAndPausedPageController($scope, $rootScope, $cookieStore, $routeParams, savedAndPausedPageService, introPageSevice,  $location, $log)
    ]);
  
}