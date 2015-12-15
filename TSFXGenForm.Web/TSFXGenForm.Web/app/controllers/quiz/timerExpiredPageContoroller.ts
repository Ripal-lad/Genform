// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

    interface ItimerExpiredPageContorollerScope extends ng.IScope {
        title: string;
        path: string;
        quizSettings: any;
        finishQuiz: () => void;
        viewResult: () => void;
        pageDetails: boolean;
        progressBarValue: boolean;
        quizTitle: string;
        beginQuizName:string;
    }

    interface ItimerExpiredPageContoroller {
       
    }

    class TimerExpiredPageController implements ItimerExpiredPageContoroller {
        static controllerId: string = "TimerExpiredPageController";

        private hiddenCode;
        private quizResultSummaryId;
        private userId;
        private ips4MemberId;
        private ips4IpSessionFront;
        private finishQuizIsClicked;
        private  viewResultIsClicked;

        //Constructor.
        constructor(private $scope: ItimerExpiredPageContorollerScope,
            private $routeParams,
            private $rootScope,
            private $cookieStore,
            private $location,
            private introPageSevice,
            private resultPageService,
            private $log) {
            $scope.title = "TimerExpiredPageController";

            this.hiddenCode = $routeParams.hiddenCode;
            this.quizResultSummaryId = $routeParams.quizResultSummaryId;
            this.userId = 1;

            this.finishQuizIsClicked = false;
            this.viewResultIsClicked = false;
            this.$scope.finishQuiz = () => this.finishQuiz();
            this.$scope.viewResult = () => this.viewResult();
            this.$scope.beginQuizName = "Resume Quiz";

            //Get cookies of IPBoard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            

            if (this.hiddenCode != null && this.quizResultSummaryId != null && this.quizResultSummaryId != 0 && this.hiddenCode != "undefined") {
                this.getQuizSettingDetails();
            } else {
                this.$log.log("TimerExpiredPageController - constructor - RouteParams are not defined");
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

         if (!this.$rootScope.browserBackIsClicked && !this.viewResultIsClicked && !this.finishQuizIsClicked) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
        }
         //Method to get Quizsettings
         private getQuizSettingDetails() {

             this.resultPageService.getQuizSettingDetails(this.hiddenCode).then((quizSettings)=> {
                if (quizSettings != null && quizSettings != undefined && quizSettings.result != "null") {

                    this.$scope.quizSettings = quizSettings.result;

                    this.$scope.pageDetails = true;          //Show page details.
                    this.$scope.progressBarValue = false;         //Hide prgressbar.
                    this.$scope.quizTitle = quizSettings.result.Name;

                } else {
                    this.$log.log("TimerExpiredPageController - getQuizSettingDetails() - Quiz settings are not available");
                }
            });

         }

         //View Result button click event to redirect it to Result page.
        private viewResult() {

              this.$rootScope.browserBackIsClicked = true;
              this.viewResultIsClicked = true;
            if (this.$scope.quizSettings.ShowResultsPage) {
                
                //If result page is to be shown.
                this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                this.$location.path(this.$scope.path);

            } else {
                //If Result page is not to be shown then update QuizResultSummary table and redirect to endmessage page.
                this.resultPageService.getDetailsOnResultsPageLoad(this.hiddenCode, this.userId, "TimerExpiredPageController", this.quizResultSummaryId).then(() =>{

                    this.$scope.path = "/quiz-endmessage/" + this.hiddenCode;
                    this.$location.path(this.$scope.path);
                });
            }

        }
        
         //Finish buton click event.
        private finishQuiz() {
            this.finishQuizIsClicked = true;
             this.$rootScope.browserBackIsClicked = true;

               //Check if quizquestions are remained  to attempt.
               this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((quizResumed)=> {

                if (quizResumed.result != 0) {

                    //If there are questions which are not attempted by user then get question number.
                    this.introPageSevice.getQuizPageQuestionToResumeQuiz(this.hiddenCode, this.userId).then((resumeQuizQuestion) =>{
                        var resultSummaryId = quizResumed.result;

                        if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {

                            var questionNo = resumeQuizQuestion.result.QuestionNumber;
                            this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + questionNo;
                            this.$location.path(this.$scope.path);

                        } else {
                            
                            //Check if questions are remained to self score.
                            this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((selfScoring)=> {
                                if (!selfScoring.result) {

                                    //$scope.redirectResultPageOrSelfScoring(quizResultSummaryId);
                                    this.introPageSevice.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then((selfScoringQuestion)=> {

                                        if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                                            var selfScoringQuestionCount = selfScoringQuestion.result;

                                            this.$scope.path = "/quiz-selfscoringintro/" + this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1;
                                            this.$location.path(this.$scope.path);

                                        } else {
                                            this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                                            this.$location.path(this.$scope.path);
                                        }
                                    });

                                } else {

                                    //If all the questions are attempted and self scored then let them to ResultPage.
                                    this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + this.quizResultSummaryId;
                                    this.$location.path(this.$scope.path);
                                 
                                }
                            });
                        }
                    });
                } else {

                    this.$log.log("TimerExpiredPageController - finishQuiz() - QuizResulSummaryId not found");
                }
            });
        }
    }


    app.controller(TimerExpiredPageController.controllerId, ["$scope", "$routeParams",'$rootScope' ,'$cookieStore' ,'$location', 'introPageSevice', 'resultPageService','$log',
        ($scope, $routeParams, $rootScope,  $cookieStore, $location, introPageSevice, resultPageService, $log) =>
            new TimerExpiredPageController($scope, $routeParams, $rootScope,  $cookieStore, $location, introPageSevice, resultPageService, $log)
    ]);
  