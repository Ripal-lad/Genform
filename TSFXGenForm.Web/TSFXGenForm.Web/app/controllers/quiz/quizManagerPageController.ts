// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


    interface IquizManagerPageControllerScope extends ng.IScope {
        title: string;
        hiddenCode: string;
        relativeRankAndScoreLable : boolean;
        footerValue : boolean;
        quizNameLink :boolean ;
        quizName : boolean;
        quizManagerHeader: string;
        progressBarValue: boolean;
        quizManageDetailValue:boolean;
        quizManagerDetials: any;
        path: string;
        resultClick: (quizDetails) => void;
        beginQuiz: (quizDetails) => void;
    }

    interface IquizManagerPageController {
      
    }

    class QuizManagerPageController implements IquizManagerPageController {
      
        static controllerId: string = "QuizManagerPageController";

        private userId = 1;
        private ips4MemberId;
        private ips4IpSessionFront;

        //Constructor.
        constructor(private $scope: IquizManagerPageControllerScope,
            private $timeout,
            private $cookieStore,
            private $routeParams,
            private $rootScope,
            private quizManagerPageService,
            private introPageSevice,
            private $location,
            private $log) {
            $scope.title = "QuizManagerPageController";

            this.$scope.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.

            this.$scope.relativeRankAndScoreLable = false;
            this.$scope.footerValue = false;
            this.$scope.quizNameLink = false;
            this.$scope.quizName = true;
            this.$scope.quizManagerHeader = "";
            this.$scope.progressBarValue = true;    //Start progress bar.
            this.$scope.quizManageDetailValue = false;  //Hide quizmanagerpage details.
            this.$scope.quizManagerDetials = new Array();

            this.$scope.resultClick = (quizDetails) => this.resultClick(quizDetails);
            this.$scope.beginQuiz = (quizDetails) => this.beginQuiz(quizDetails);

            //Get cookies of IPboard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            
            $scope.path="";
            if (this.$scope.hiddenCode != null && this.$scope.hiddenCode != undefined) {
                this.getQuizManagerPageDetails();
            } else {

                this.$log.log("Quizmanagercontroller - constructor - RouteParams are not defined");
            
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

            if (!this.$rootScope.browserBackIsClicked) {
                this.$rootScope.browserBackIsClicked = true;
                this.$location.path("/quiz-intro/" + this.$scope.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront );
            }
        }

        //Get details of QuizManagerPage.
        private getQuizManagerPageDetails () {

            //Get details of quizmanagerpage.
            this.quizManagerPageService.getQuizDetailListForQuizManagerPage(this.$scope.hiddenCode, this.userId).then((quizManagerResult) =>{

                if (quizManagerResult != null) {

                    //Call method to bind details to UI.
                    this.bindDetailsToUi(quizManagerResult);

                } else {

                    this.$log.log("Quizmanagercontroller - getQuizManagerPageDetails - QuizManager class return null value");
                    this.$location.path('/');
                 
                }


            });
        }
          
        //Bind data to quizmanager page.
        private bindDetailsToUi (quizManagerResult) {

            var count = quizManagerResult.length;

            for (var i = 0; i < count; i++) {

                var relativeRankAndScoreValue = true;
                this.$scope.relativeRankAndScoreLable = true;
                this.$scope.footerValue = false;
                this.$scope.quizNameLink = false;
                this.$scope.quizName = true;
                this.$scope.quizManagerHeader = "My Quiz Results";

                //check whether user has completed quiz if not then show "In Progress."

                if (quizManagerResult[i].DueDate != null && quizManagerResult[i].EndDate == null && quizManagerResult[i].StartDate != null) {
                    quizManagerResult[i].EndDate = "In Progress";
                    relativeRankAndScoreValue = false;
                }

                //Check whether user has started quiz or not.

                if (quizManagerResult[i].DueDate != null && quizManagerResult[i].EndDate == null && quizManagerResult[i].StartDate == null) {

                    this.$scope.relativeRankAndScoreLable = false;
                    relativeRankAndScoreValue = false;
                    this.$scope.quizManagerHeader = "Quizzes that Require Completion";
                    this.$scope.footerValue = true;
                    this.$scope.quizNameLink = true;
                    this.$scope.quizName = false;
                }

                //Push data into array to display.
                this.$scope.quizManagerDetials.push({
                    quizName: quizManagerResult[i].QuizTitle,
                    dueDate: quizManagerResult[i].DueDate,
                    endDate: quizManagerResult[i].EndDate,
                    score: quizManagerResult[i].Score,
                    relativeRank: quizManagerResult[i].RelativeRankValue,
                    relativeAndScoreValue: relativeRankAndScoreValue,
                    quizResultSummaryId: quizManagerResult[i].QuizResultSummaryId
                });
            }
        this.$scope.progressBarValue = false;    //Stop progress bar.
        this.$scope.quizManageDetailValue = true;  //show quizmanagerpage details to UI.
        }

        //Redirect to QuestionPage or SelfScoringIntroPage or Count down timer page.
        private redirectToQuestionpageWithoutDisplayingIntroPage (quizdetails, quizSettings) {

            //If count down timer page is to be shown then redirect it to Count Down Timer Page.
            if (quizSettings.ShowStartCountDownTimer) {

                this.$scope.path = "/quiz-countdowntimer/" + this.$scope.hiddenCode;

                this.$location.path(this.$scope.path);


            } else {
                //If Count down timer page is to not be shown.
                //Get questiondetials to resume Quiz.
                this.introPageSevice.getQuizPageQuestionToResumeQuiz(this.$scope.hiddenCode, this.userId).then((resumeQuizQuestion) =>{

                    if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {

                        var questionNumber = resumeQuizQuestion.result.QuestionNumber;
                        this.$scope.path = "/quiz-question/" + this.$scope.hiddenCode + "/" + questionNumber;

                        this.$location.path(this.$scope.path);

                    } else {
                        //If all the questions of the Quiz are answered and not self scored yet.
                        this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(this.$scope.hiddenCode, this.userId).then((selfScoring)=> {
                            if (!selfScoring.result) {

                                this.introPageSevice.getSelfScoringQuestionsCount(this.$scope.hiddenCode, quizdetails.quizResultSummaryId).then((selfScoringQuestion)=> {

                                    if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                                        var selfScoringQuestionCount = selfScoringQuestion.result;
                                        this.$scope.path = "/quiz-selfscoringintro/" + this.$scope.hiddenCode + "/" + selfScoringQuestionCount + "/" + quizdetails.quizResultSummaryId + "/" + 1;

                                        this.$location.path(this.$scope.path);

                                    } else {

                                        this.$log.log("Quizmanagercontroller - getQuizManagerPageDetails - selfScoringQuestion questions count not available");}
                                });

                            } else {

                                //Redirect to ResultPage.
                                this.$scope.path = "/quiz-result/" + this.$scope.hiddenCode + "/" + quizdetails.quizResultSummaryId;
                                this.$location.path(this.$scope.path);

                            }
                        });
                    }

                });
            }


        }

        //Redirect to result page or Intro page.
        private resultClick(quizdetails) {

            if (quizdetails != undefined && quizdetails != null) {

                //If Quiz is not completed by user.
                if (quizdetails.endDate == "In Progress" && quizdetails.endDate != null) {

                    //get Quiz setting s to check whether to display intro page or not.
                    this.introPageSevice.getDetailsForIntroPage(this.$scope.hiddenCode).then((quizSettings) =>{

                        if (quizSettings != null && quizSettings != undefined && quizSettings != "null") {

                            if (quizSettings.ShowIntroductionPage) {

                                //Redirect to intro page if Intro page is to be shown.
                                this.$scope.path = "/quiz-intro/" + this.$scope.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront ;
                                this.$location.path(this.$scope.path);
                            } else {

                                //Redirect to Question page without displaying intro page.
                                this.redirectToQuestionpageWithoutDisplayingIntroPage(quizdetails, quizSettings);

                            }
                        }
                    });
                    //If quiz is comepleted by user then redirect to Result page.
                } else if (quizdetails.endDate != null && quizdetails.endDate != "In Progress") {

                    var quizResultSummaryId = quizdetails.quizResultSummaryId;

                    if (quizdetails.quizResultSummaryId != 0) {
                        this.$scope.path = "/quiz-result/" + this.$scope.hiddenCode + "/" + quizResultSummaryId;
                        this.$location.path(this.$scope.path);
                    } else {

                        this.$log.log("Quizmanagercontroller - resultClick - SummaryId not found");
                   }
                }
            };
        }

       //Redirect to intro page if user has not given any of the Quiz.
        private beginQuiz (quizdetails) {

          if (quizdetails != undefined && quizdetails != null) {

              this.introPageSevice.getDetailsForIntroPage(this.$scope.hiddenCode).then((quizSettings)=> {

                    //Check whether to show intro Page or not.
                    if (quizSettings.ShowIntroductionPage) {

                        this.$scope.path = "/quiz-intro/" + this.$scope.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront;
                        this.$location.path(this.$scope.path);

                    } else {

                        //Check whether to show countDownTimer or not.
                        if (quizSettings.ShowStartCountDownTimer) {

                            this.$scope.path = "/quiz-countdowntimer/" + this.$scope.hiddenCode;
                            this.$location.path(this.$scope.path);

                        } else {

                            //If intro page is not to be shown then redirect directly to Question page.
                            //Get first question number to redirect directly to question page.
                            this.introPageSevice.getFirstQuestionNumberToLoadOnQuestionPage(this.$scope.hiddenCode).then((firstQuestionPage) =>{

                                if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {

                                    var questionNumber = firstQuestionPage.QuestionNumber;
                                    this.$scope.path = "/quiz-question/" + this.$scope.hiddenCode + "/" + questionNumber;
                                    this.$location.path(this.$scope.path);

                                } else {

                                    this.$log.log("Quizmanagercontroller - beginQuiz -First question number not found.");
                                 
                                }
                            });

                        }
                    }

                });

            }

        }
    }

    app.controller(QuizManagerPageController.controllerId, ['$scope', '$timeout','$cookieStore', '$routeParams', '$rootScope', 'quizManagerPageService', 'introPageSevice',  '$location','$log',
        ($scope, $timeout, $cookieStore, $routeParams, $rootScope, quizManagerPageService, introPageSevice,  $location,$log) =>
            new QuizManagerPageController($scope, $timeout, $cookieStore, $routeParams, $rootScope, quizManagerPageService, introPageSevice,  $location, $log)
    ]);
