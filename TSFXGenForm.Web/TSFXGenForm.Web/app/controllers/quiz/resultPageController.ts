
/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />

    interface IresultPageControllerScope extends ng.IScope {
        title: string;
        quizSettings: any;
        quizName: string;
        showScoreBreakDownValue: boolean;
        showScoreAveragesValue: boolean;
        attempt: string;
        wrongAnswerValue: boolean;
        correctAnswerValue: boolean;
        questionResultDetails: any;
        userScore: string;
        maxScore: number;
        resultPageDetailsValue: boolean;
        progressBarValue: boolean;
        relativeRank: number;
        relativeRankTimeTaken: number;
        yourScorePercentage: number;
        yourScoreString: string;
        yourScoreTimeInSeconds: number;
        Math: Math;
        yourScoreTimeInMinutes: number;
        stateAveragePercentage: number;
        stateAverageString: string;
        stateAverageTimeInSeconds: number;
        stateAverageTimeInMinutes: number;
        showTryAgainButton:boolean;
        path: string;
        myQuizzes: () => void;
        beginQuiz: () => void;
        answerDrillPage: (question) => void;
    }

    interface IresultPageController {
      
    }

    class ResultPageController implements IresultPageController {
        static controllerId: string = "ResultPageController";

        private hiddenCode;
        private quizResultSummaryId;
        private userId;
        private ips4MemberId;
        private ips4IpSessionFront;
        private prevRoutePageController;

        //Constructor.
        constructor(private $scope: IresultPageControllerScope,
            private $rootScope,
            private $cookieStore, 
            private prevRoutePromiseGetter,
            private $sce,
            private $routeParams,
            private resultPageService:IresultPageService,
            private $location,
            private $log) {
            $scope.title = "ResultPageController";

            this.hiddenCode = $routeParams.hiddenCode;
            this.quizResultSummaryId = $routeParams.quizResultSummaryId;
            this.$scope.questionResultDetails = new Array();

            this.$scope.answerDrillPage = (question) => this.answerDrillPage(question);
            this.$scope.myQuizzes = () => this.myQuizzes();
            this.$scope.beginQuiz = () => this.beginQuiz();

            this.userId = 1;

            //Get cookies of IPBoard.
            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            
            if (this.hiddenCode != null && this.hiddenCode != undefined && this.quizResultSummaryId != null && this.quizResultSummaryId != undefined) {
              
                //Get the previous route.
                prevRoutePromiseGetter().then((prevRoute) =>{

                   this.prevRoutePageController = prevRoute;
                    this.getQuizSettings();
                        
                });
            } else {

                this.$log.log("ResultPageController - construtor - RouteParams are not defined");
            }

            $rootScope.$on("onRouteChangeEvent", (event, result)=> {
             
                $rootScope.$on('$locationChangeStart', ()=> {
                 
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

        //Get quiz settings.
        private getQuizSettings () {

            //Get quizSettings details details.
            this.resultPageService.getQuizSettingDetails(this.hiddenCode).then((quizSettingdetails)=> {

                if (quizSettingdetails != null && quizSettingdetails != undefined) {
                    this.getDetailsOfResultHeader(this.prevRoutePageController, quizSettingdetails.AttemptsAllowed);

                    var quizSettings = quizSettingdetails;
                    this.$scope.quizSettings = quizSettings;
                    this.$scope.quizName = quizSettings.Name;

                   
                    //Check to display question rows.
                    if (quizSettings.ShowScoreBreakdown) {

                        this.$scope.showScoreBreakDownValue = true;
                    } else {

                        this.$scope.showScoreBreakDownValue = false;
                    }

                    //Check to display Relative rank and state averages.
                    if (quizSettings.ShowScoreAverages) {

                        this.$scope.showScoreAveragesValue = true;
                    } else {
                        this.$scope.showScoreAveragesValue = false;
                    }

                    if (quizSettings.ScoreSystem == 1) {
                        this.$scope.attempt = "First";

                    } else if (quizSettings.ScoreSystem == 2) {
                        this.$scope.attempt = "Best";

                    } else if (quizSettings.ScoreSystem == 3) {
                        this.$scope.attempt = "Current";
                    }
                } else {
                    this.$log.log("ResultPageController - getQuizSettings() - Quiz setings are not available");
                }
            });
        }

        //Get list of questions to dispaly in a raw.
        private getResultDetailsListForQuestionRaws() {

            //Get details of result page for questionraw.
            this.resultPageService.getResultsPageListOnPageLoad(this.hiddenCode, this.quizResultSummaryId).then((quizResult) =>{

                var shortAnswerQuestionTimerExpired;
                var multipleChoiceTimerExpiredValue;
                var shortAnswerMarks;
                var multipleChoiceImage;
                if (quizResult.result != undefined && quizResult.result != null && quizResult.result != "" && quizResult.result.ListOfResultsPageDetail.length > 0) {

                    var count = quizResult.result.ListOfResultsPageDetail.length;

                    for (var i = 0; i < count; i++) {

                        //If user has given all the answers in time.
                        if (quizResult.result.ListOfResultsPageDetail[i].IsQuestionAnsInTime) {

                            shortAnswerQuestionTimerExpired = false;
                            multipleChoiceTimerExpiredValue = false;
                            shortAnswerMarks = true;
                            multipleChoiceImage = false;
                            if (quizResult.result.ListOfResultsPageDetail[i].QuestionType == 1) {

                                shortAnswerMarks = false;
                                multipleChoiceImage = true;
                                if (quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore == 0) {
                                    this.$scope.wrongAnswerValue = true;
                                    this.$scope.correctAnswerValue = false;
                                } else if (quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore >= 1) {
                                    this.$scope.wrongAnswerValue = false;
                                    this.$scope.correctAnswerValue = true;
                                }
                            }
                            this.$scope.questionResultDetails.push({ questionNumber: quizResult.result.ListOfResultsPageDetail[i].QuestionNumber, questionId: quizResult.result.ListOfResultsPageDetail[i].QuestionId, userScoreOutOfMaxScore: quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore, questionAnsweredCorrectly: quizResult.result.ListOfResultsPageDetail[i].QuestionAnsweredCorrectly, questionType: quizResult.result.ListOfResultsPageDetail[i].QuestionType, shortAnswerQuestionTimerExpiredValue: shortAnswerQuestionTimerExpired, multipleChoiceTimerExpiredValue: multipleChoiceTimerExpiredValue, shortAnswerMarksValue: shortAnswerMarks, multipleChoiceImageValue: multipleChoiceImage, correctAnswerValue: this.$scope.correctAnswerValue, wrongAnswerValue: this.$scope.wrongAnswerValue });
                        } else {

                            //  if (quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore == null || quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore == 0) {
                            if (quizResult.result.ListOfResultsPageDetail[i].IsQuizResultExists) {

                                //If user has not answered in time.
                                if (quizResult.result.ListOfResultsPageDetail[i].QuestionType == 1) {

                                    shortAnswerQuestionTimerExpired = false;
                                    multipleChoiceTimerExpiredValue = true;
                                    shortAnswerMarks = false;
                                    multipleChoiceImage = false;

                                } else if (quizResult.result.ListOfResultsPageDetail[i].QuestionType == 2) {

                                    var splittedScore = quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore.split("/");

                                    //If user has selected View Result options from the confirm box if once timer gets expired.
                                    if (splittedScore[0] == "") {
                                        splittedScore[0] = splittedScore[1];
                                    }

                                    if (splittedScore[0] <= 1) {
                                        this.$scope.userScore = splittedScore[0] + " mark";      //Bind score to tooltip.
                                    } else {
                                        this.$scope.userScore = splittedScore[0] + " marks";
                                    }

                                    this.$scope.maxScore = splittedScore[1];            //Bind score to tooltip.

                                    shortAnswerQuestionTimerExpired = true;
                                    multipleChoiceTimerExpiredValue = false;
                                    shortAnswerMarks = false;
                                    multipleChoiceImage = false;

                                }

                            } else {

                                //If user has not answered the questions.
                                this.$scope.wrongAnswerValue = true;
                                shortAnswerQuestionTimerExpired = false;
                                multipleChoiceTimerExpiredValue = false;
                                shortAnswerMarks = false;
                                multipleChoiceImage = true;
                            }

                            this.$scope.questionResultDetails.push({ questionNumber: quizResult.result.ListOfResultsPageDetail[i].QuestionNumber, questionId: quizResult.result.ListOfResultsPageDetail[i].QuestionId, userScoreOutOfMaxScore: quizResult.result.ListOfResultsPageDetail[i].UserScoreOutOfMaxScore, questionAnsweredCorrectly: quizResult.result.ListOfResultsPageDetail[i].QuestionAnsweredCorrectly, questionType: quizResult.result.ListOfResultsPageDetail[i].QuestionType,shortAnswerQuestionTimerExpiredValue: shortAnswerQuestionTimerExpired, multipleChoiceTimerExpiredValue: multipleChoiceTimerExpiredValue, shortAnswerMarksValue: shortAnswerMarks, multipleChoiceImageValue: multipleChoiceImage, wrongAnswerValue: this.$scope.wrongAnswerValue, maxScore: this.$scope.maxScore, userScore: this.$scope.userScore });
                        }
                    }
                    this.$scope.resultPageDetailsValue = true;
                    this.$scope.progressBarValue = false;
                }
                else {
                    this.$log.log("ResultPageController - GetResultsPageListOnPageLoad() - returned null value");
                }
            });
        }

        //Get details to display state averages and relative score at header.
        private getDetailsOfResultHeader(prevRoutePageController, attemptsAllowed) {
       
            //Load quiz result page.
            this.resultPageService.getDetailsOnResultsPageLoad(this.hiddenCode, this.userId, prevRoutePageController, this.quizResultSummaryId).then((relativeAndStateAverages) =>{

                if (relativeAndStateAverages.result != null && relativeAndStateAverages.result != undefined && relativeAndStateAverages.result != "") {

                    //Call function to get details of the questions raws.
                    this.getResultDetailsListForQuestionRaws();

                    this.$scope.relativeRank = relativeAndStateAverages.result.RelativeRank;
                    this.$scope.relativeRankTimeTaken = relativeAndStateAverages.result.RelativeRankTimeTaken;

                    //Calculations for your score.
                    //Score
                    var yourScore = relativeAndStateAverages.result.YourScore;
                    var maxScore = relativeAndStateAverages.result.MaxScore;
                    this.$scope.yourScorePercentage = Math.round((yourScore * 100) / maxScore);

                    this.$scope.yourScoreString = yourScore + " out of " + maxScore + " ";

                    //Time
                    var yourScoreTime = relativeAndStateAverages.result.YourScoreTimeTaken;

                    this.$scope.yourScoreTimeInSeconds = yourScoreTime % 60;
                    this.$scope.Math = Math;
                    this.$scope.yourScoreTimeInMinutes = Math.floor(yourScoreTime / 60);

                    //Calculations for stateaverages.
                    //Score
                    var stateAverage = relativeAndStateAverages.result.StateAverages;
                    this.$scope.stateAveragePercentage = Math.round((stateAverage * 100) / maxScore);

                    this.$scope.stateAverageString = stateAverage + " out of " + maxScore + " (";

                    //Time
                    var stateAverageTime = relativeAndStateAverages.result.StateAveragesTimeTaken;

                    this.$scope.stateAverageTimeInSeconds = stateAverageTime % 60;
                    this.$scope.Math = Math;
                    this.$scope.stateAverageTimeInMinutes = Math.floor(stateAverageTime / 60);
                
                    //Whether user is allowed to attempt the quiz again.
                    if (attemptsAllowed > relativeAndStateAverages.result.AttemptNumber || attemptsAllowed==0) {

                        this.$scope.showTryAgainButton = true;
                    } else {

                        this.$scope.showTryAgainButton = false;
                    }

                } else {
                    this.$log.log("ResultPageController - GetDetailsOnResultsPageLoad() - returned null value");
                }
            });
        }

        //Answer link click event.
        private answerDrillPage(question) {

            var questionNumber = question.questionNumber;
            var path = "#/quiz-answerdrill/" + this.hiddenCode + "/" + questionNumber + "/" + this.quizResultSummaryId;
            return path;
        }

        //MyQuizzes button click event.
        private myQuizzes() {

            var path = "/quiz-quizmanager/" + this.hiddenCode;
            this.$location.path(path);

        }

        //Begin quiz when user clicks on Try again.
        private beginQuiz() {

            //Redirect to intro page.
            this.$scope.path = "/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront;
            this.$location.path(this.$scope.path);


            ////Check whether to display Intro page or not.
            //if ($scope.quizSettings.ShowIntroductionPage) {

            //    //Redirect to intro page.
            //    $scope.path = "/quiz-intro/" + hiddenCode;
            //    $location.path($scope.path);

            //} else {

            //    if ($scope.quizSettings.ShowStartCountDownTimer) {

            //        $scope.path = "/quiz-countdowntimer/" + hiddenCode;
            //        $location.path($scope.path);

            //    } else {

            //        //If intro page is not to be shown then redirect directly to Question page.
            //        //Get first question number to redirect directly to question page.
            //        resultPageService.GetFirstQuestionNumberToLoadOnQuestionPage(hiddenCode).then(function (firstQuestionPage) {

            //            if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {

            //                var questionNumber = firstQuestionPage.QuestionNumber;
            //                $scope.path = "/quiz-question/" + hiddenCode + "/" + questionNumber;
            //                $location.path($scope.path);

            //            } else {
            //            this.$log.log("ResultPageController - beginQuiz() - First question number not found");
            //            }
            //        });

            //    }


            //}

        }

    }
    
    app.controller(ResultPageController.controllerId, ['$scope','$rootScope','$cookieStore', 'prevRoutePromiseGetter', '$sce', '$routeParams', 'resultPageService',  '$location','$log',
        ($scope,$rootScope, $cookieStore, prevRoutePromiseGetter, $sce, $routeParams, resultPageService, $location,$log) =>
            new ResultPageController($scope,$rootScope, $cookieStore, prevRoutePromiseGetter, $sce, $routeParams, resultPageService,  $location,$log)
    ]);

    