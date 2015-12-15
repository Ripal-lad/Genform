// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


    interface IselfScoringIntroPageControllerScope extends ng.IScope {
        title: string;
        seconds: number;
        Math: Math;
        minutes: number;
        progressBarValue: boolean;
        pageDetailsValue: boolean;
        selfScoringQuestionsCount: number;
        titleMessage: string;
        continueClick: () => void;
        quizTitle: string;
    }

    interface IselfScoringIntroPageController {
      
    }

    class SelfScoringIntroPageController implements IselfScoringIntroPageController {
        static controllerId: string = "SelfScoringIntroPageController";
        private hiddenCode;
        private userId=1;
        private quizResultSummaryId;
        private selfScoringQuestionCount;
        private isTimerExpired;
        private isContinueClick;
        private ips4MemberId;
        private ips4IpSessionFront;

        constructor(private $scope: IselfScoringIntroPageControllerScope,
            private $rootScope,
            private $cookieStore,
            private $routeParams,
            private selfScoringIntroPageService,
            private $location,
            private $log) {
            $scope.title = "selfScoringIntroPageController";

            this.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
            this.quizResultSummaryId = this.$routeParams.quizResultSummaryId;
            this.selfScoringQuestionCount = this.$routeParams.selfScoringQuestionCount;
            this.isTimerExpired = this.$routeParams.isTimerExpired;
            this.$scope.progressBarValue = true;    //Start progress bar.
            this.$scope.pageDetailsValue = false;  //Hide details.
            this.$scope.selfScoringQuestionsCount = 0;
            this.isContinueClick = false;

            this.$scope.continueClick = () => this.continueClick();


            //Get cookies of IPBoard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            
           if (this.hiddenCode != null && this.isTimerExpired != null && this.selfScoringQuestionCount != null && this.hiddenCode != "undefined" && this.selfScoringQuestionCount != "undefined") {
             
               this.getTotalTimeTakenByUser();
               this.getCurrentQuizName();
                this.$scope.selfScoringQuestionsCount = this.selfScoringQuestionCount;

                if (this.isTimerExpired == 1) {
                    
                    //To check whether the timer was expired for any of the question.
                    this.checkWhetherTheTimerGetExpired();
                  

                } else if (this.isTimerExpired == 0) {

                    this.$scope.titleMessage = "The Allotted Quiz Time has Elapsed";
                }
           } else {
               this.$log.log("SelfScoringIntroPageController : constructor - RouteParams are not defined.");
            }
           
           //Broadcast from browserBackButtonForOtherPages directive.
            $rootScope.$on("onRouteChangeEvent", (event, result) =>{
               
                $rootScope.$on('$locationChangeStart', ()=> {
                 
                    this.goBack();

                });
            });


        }
        
        //If browser back buton is clicked then redirect it to IntroPage.
        private goBack() {

            if (!this.$rootScope.browserBackIsClicked && !this.isContinueClick) {
                this.$rootScope.browserBackIsClicked = true;
                this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
            }
        }
   

        //Get current Quiz name.
        private getCurrentQuizName() {
            this.selfScoringIntroPageService.getCurrentQuizName(this.hiddenCode).then((quizName) =>{

                if (quizName.result != null && quizName.result != "" && quizName.result != "null") {
                    this.$scope.quizTitle = quizName.result;
                }
            });
        }

       //Get total time taken by user.
       private getTotalTimeTakenByUser () {
           this.selfScoringIntroPageService.getTotalTimeTakenByUser(this.hiddenCode, this.userId, this.quizResultSummaryId).then((timeTaken) =>{

                if (timeTaken.result != null && timeTaken.result != "") {
                    this.$scope.seconds = timeTaken.result % 60;
                    this.$scope.Math = Math;
                    this.$scope.minutes = Math.floor(timeTaken.result / 60);
                    this.$scope.progressBarValue = false;    //Stop progress bar.
                    this.$scope.pageDetailsValue = true;    //Show details.


                } else {
                    this.$log.log("SelfScoringIntroPageController : getTotalTimeTakenByUser - Total time taken by user is not available.");
                }
            });
       }

        //To check whether the timer was expired for any of the question.
       private checkWhetherTheTimerGetExpired () {

            this.selfScoringIntroPageService.getQuestionNoToSelfScoreAfterTimerExpired(this.hiddenCode, this.quizResultSummaryId).then((isTimerExpired) =>{

                if (isTimerExpired.result) {
                    this.$scope.titleMessage = "The Allotted Quiz Time has Elapsed";
                } else {
                    this.$scope.titleMessage = "You Have Completed the Quiz";
                }

            });
       }

       //Continue button click event.
       private continueClick() {
            this.$rootScope.backIsNotClicked = true;
           this.isContinueClick = true;
          
            //Get quizpage no for pagetype 7.
            this.selfScoringIntroPageService.getFirstSelfScoringQuestionNo(this.hiddenCode, this.userId).then((quizPage)=> {

                if (quizPage.result != null && quizPage.result != "") {
                    var questionNumber = quizPage.result.QuestionNumber;
                    this.$rootScope.backIsNotClicked = true;
                    this.isContinueClick = true;
                    this.$location.path("/quiz-selfscoringquestion/" + this.hiddenCode + "/" + questionNumber + "/" + this.isTimerExpired);
                } else {
                    this.$log.log("SelfScoringIntroPageController : continueClick() - Self scoring questions are not available.");
                    
                }
            });


        }
    }
    app.controller(SelfScoringIntroPageController.controllerId, ['$scope', '$rootScope','$cookieStore' ,'$routeParams', 'selfScoringIntroPageService', '$location','$log',
        ($scope, $rootScope, $cookieStore, $routeParams, selfScoringIntroPageService,  $location, $log) =>
            new SelfScoringIntroPageController($scope, $rootScope, $cookieStore, $routeParams, selfScoringIntroPageService,  $location, $log)
    ]);
