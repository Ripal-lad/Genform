// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />

interface IIntroPageControllerScope extends ng.IScope {
    title: string;
    quizTitle: string;
    hiddenCode: string;
    pageOpeningMessage: string;
    pageOpeninMessagetitle: string;
    pageEndMessage: string;
    buttonShow: boolean;
    progressBarValue: boolean;
    introPageContentvalue: boolean;
    availableQuizMessageValue: boolean;
    path: string;
    countDownTimerValue: boolean;
    myQuizzes: () => void;
    beginQuiz: () => void;
    quizName: string;
    message:string;
}

interface IIntroPageController {

}

class IntroPageController implements IIntroPageController {
    static controllerId = "IntroPageController";

    private quizResultSummaryId;
    private userId = 1;
    private questionNumber;
    private ips4MemberId;
    private ips4IpSessionFront;

    //Contsructor.
    constructor(private $scope: IIntroPageControllerScope,
        private $timeout,
        private $sce,
        private $cookieStore,
        private $rootScope,
        private $routeParams,
        private introPageSevice:IintroPageSevice,
        private $mdDialog,
        private $location,
        private $log) {

        $scope.title = "introPageController";

        this.$scope.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.$scope.pageOpeningMessage = "";
        this.$scope.pageOpeninMessagetitle = "";
        this.$scope.pageEndMessage = "";
        this.$scope.buttonShow = false;
        this.$scope.progressBarValue = true;
        this.$scope.introPageContentvalue = false;
        this.$scope.availableQuizMessageValue = false;
        this.$scope.countDownTimerValue = false;
        this.$scope.path = "";
        this.$rootScope.quizName = "";
        angular.element(".add-disable").removeClass("disable-btn"); //Remove class from disable event

        this.ips4MemberId = this.$routeParams.ips4_member_id;
        this.ips4IpSessionFront = this.$routeParams.ips4_IPSessionFront;

        this.$scope.myQuizzes = () => this.myQuizzes();
        this.$scope.beginQuiz = () => this.beginQuiz();

        $cookieStore.put('ips4_member_id', this.ips4MemberId);
        $cookieStore.put('ips4_IPSessionFront', this.ips4IpSessionFront);
        //this.$cookies.put('ips4_IPSessionFront', this.ips4IpSessionFront);

        if (this.$scope.hiddenCode == null || this.$scope.hiddenCode == undefined || this.$scope.hiddenCode == "undefined") {
            
            this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Route params are not defined.");

        } else {
                //If user has permission to view quiz.
                //Call methods
                this.getCurrentQuizName();
                this.checkQuizIsAvailableorNotAndInitializeQuiz();
                this.checkQuizBeingResumed();
        }
        //For to set height of Iframe in IpBoard
        $timeout(() => {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);
    }

    

    //Get current quiz name
    private getCurrentQuizName() {

        this.introPageSevice.getCurrentQuizName(this.$scope.hiddenCode).then((quizName) => {

            if (quizName != null) {

                this.$scope.quizTitle = quizName.result;
                this.$rootScope.quizName = quizName.result;

            } else {
                this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi -Xml file does not contain quiz name..");
                this.$location.path('/');
            }
        });
    }

    //Methods  which will be call on load.
    private checkQuizIsAvailableorNotAndInitializeQuiz() {

        //check whether Quiz is available or not.
        this.introPageSevice.checkQuizIsAvailableOrNot(this.$scope.hiddenCode).then((isAvailable) => {

            //If quiz is available than add details to Quiz define table and bind details to uI.
            if (isAvailable.result.IsQuizValidated) {

                this.$scope.availableQuizMessageValue = false;

                this.introPageSevice.initializeQuizDefineOnPageLoad(this.$scope.hiddenCode).then((initiateQuizDefine) => {

                    if (initiateQuizDefine.result) {

                        //Call method to bind details to UI.
                        this.getQuizIntroPageDetailsAndBindToUi();

                    } else {
                        this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Error in initiate database");
                    }
                });


            } else {
                //If quiz is unavailable.

                //Disable buttons.
                angular.element(".add-disable").addClass("disable-btn");
                this.$scope.message = isAvailable.result.Message;
                this.$scope.availableQuizMessageValue = true;
                this.getQuizIntroPageDetailsAndBindToUi();
            }
        });
    }

    //Get details of introPage and bind it to UI.
    private getQuizIntroPageDetailsAndBindToUi() {

        //Get details to display on the UI.
        this.introPageSevice.getDetailsForIntroPage(this.$scope.hiddenCode).then((introPageDetails) => {

            if (introPageDetails != null && introPageDetails != undefined) {
                var introPageData = introPageDetails;

                this.$rootScope.showStartCountDownTimer = introPageDetails.ShowStartCountDownTimer;
                if (introPageData.PreviousAttemptMessage != null && introPageData.OpeningMessageTitle && introPageData.OpeningMessageEnd != null) {

                    //var pageOpeningMsg = introPageData.OpeningMessage;
                    var pageOpeningMsg = introPageData.PreviousAttemptMessage;
                    var pageOpeninMSgtitle = introPageData.OpeningMessageTitle;
                    var pageEndMsg = introPageData.OpeningMessageEnd;

                    //Make  unsafe code safe.
                    this.$scope.pageOpeningMessage = this.$sce.trustAsHtml(pageOpeningMsg);
                    this.$scope.pageOpeninMessagetitle = this.$sce.trustAsHtml(pageOpeninMSgtitle);
                    this.$scope.pageEndMessage = this.$sce.trustAsHtml(pageEndMsg);
                    this.$scope.buttonShow = true;
                    this.$scope.progressBarValue = false;    //Stop progress bar.
                    this.$scope.introPageContentvalue = true;  //show quizmanagerpage details to UI.

                } else {
                    this.$location.path('/');
                    this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Intro Page details are null");
                }
            } else {
                this.$log.log("Intropagecontroller - getQuizIntroPageDetailsAndBindToUi - Intro Page contains null values");
                this.$location.path('/');
            }

        });
    }

    //Method to check whether the Quiz is resumed or not.
    private checkQuizBeingResumed() {

        this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.$scope.hiddenCode, this.userId).then((quizResumed) => {

            if (quizResumed.result != 0) {

                this.quizResultSummaryId = quizResumed.result;
                this.$rootScope.beginQuizName = "Resume Quiz";

            } else {
                this.$rootScope.beginQuizName = "Begin Quiz";
            }

        });
    }

    //Redirect to self scoring intro page.
    private redirectResultPageOrSelfScoring(resultSummaryId) {

        this.introPageSevice.getSelfScoringQuestionsCount(this.$scope.hiddenCode, resultSummaryId).then((selfScoringQuestion) => {

            if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                var selfScoringQuestionCount = selfScoringQuestion.result;
                this.$location.path("/quiz-selfscoringintro/" + this.$scope.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1);

            } else {

                this.$scope.path = "/quiz-result/" + this.$scope.hiddenCode + "/" + resultSummaryId;
                this.$location.path(this.$scope.path);
            }
        });
    }

    //My quizzes button click event.
    private myQuizzes() {
        var path = "/quiz-quizmanager/" + this.$scope.hiddenCode;
        this.$location.path(path);
    }

    //Begin button click event
    private beginQuiz() {

        if (this.ips4MemberId != null || this.ips4MemberId != undefined || this.ips4IpSessionFront != null || this.ips4IpSessionFront != undefined) {

            var promise = this.introPageSevice.ipBoardGroupPermission(this.ips4MemberId, this.ips4IpSessionFront);

            promise.then((isUserAllowedToViewQuiz) => {

                if (isUserAllowedToViewQuiz.result) {

                    //Check whether to show countDownTimer or not.
                    if (!this.$rootScope.showStartCountDownTimer) {

                        if (this.$rootScope.beginQuizName != "Resume Quiz") {

                            //If quiz is not resumed then start from the first question.
                            this.introPageSevice.getFirstQuestionNumberToLoadOnQuestionPage(this.$scope.hiddenCode).then((firstQuestionPage) => {
                                this.$scope.countDownTimerValue = true;
                                this.$scope.introPageContentvalue = false;
                                if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {

                                    this.questionNumber = firstQuestionPage.QuestionNumber;
                                    var path = "/quiz-question/" + this.$scope.hiddenCode + "/" + this.questionNumber;
                                    this.$location.path(path);

                                } else {

                                    this.$log.log("Intropagecontroller - beginQuiz -first question number not found.");
                                }
                            });
                        } else {
                            //Get questiondetials to resume Quiz.
                            this.introPageSevice.getQuizPageQuestionToResumeQuiz(this.$scope.hiddenCode, this.userId).then((resumeQuizQuestion) => {

                                if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {

                                    this.questionNumber = resumeQuizQuestion.result.QuestionNumber;
                                    this.$scope.path = "/quiz-question/" + this.$scope.hiddenCode + "/" + this.questionNumber;
                                    this.$location.path(this.$scope.path);

                                } else {
                                    //If all the questions of the Quiz are answered and not self scored yet.
                                    this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(this.$scope.hiddenCode, this.userId).then((selfScoring) => {
                                        if (!selfScoring.result) {

                                            this.redirectResultPageOrSelfScoring(this.quizResultSummaryId);

                                        } else {

                                            this.$scope.path = "/quiz-result/" + this.$scope.hiddenCode + "/" + this.quizResultSummaryId;
                                            this.$location.path(this.$scope.path);

                                        }
                                    });
                                }
                            });
                        }
                    } else {

                        // If count down timer is to be shown then redirect to CountDownTimerPage.
                        var path = "/quiz-countdowntimer/" + this.$scope.hiddenCode;
                        this.$location.path(path);
                    }

                } else {
                    this.$mdDialog.show(this.$mdDialog.alert({
                        title: 'Alert box !!',
                        content: "You must log in to access this quiz.",
                        ok: 'Ok',
                        escapetoclose: false,
                        clickoutsidetoclose: false
                    }));
                }

            });
            promise.catch(() => {

                this.$log.log("Intropagecontroller - beginQuiz -Exception in ipBoardGroupPermission");
               
            });

        } else {

            this.$log.log("Intropagecontroller - beginQuiz -Cookie values are not defined");
            
        }
    }


}

app.controller(IntroPageController.controllerId, ['$scope', '$timeout', '$sce', '$cookieStore','$rootScope', '$routeParams', 'introPageSevice', '$mdDialog', '$location','$log',
    ($scope, $timeout, $sce, $cookieStore, $rootScope, $routeParams, introPageSevice, $mdDialog, $location, $log) =>
        new IntroPageController($scope, $timeout, $sce, $cookieStore, $rootScope, $routeParams, introPageSevice, $mdDialog, $location, $log)
]);