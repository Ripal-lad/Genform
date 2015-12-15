// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

interface IcountDownControllerScope extends ng.IScope {
    title: string;
    counter: number;
    path: string;
    progressBarValue: boolean;
    pageDetailsValue: boolean;
    isGo: boolean;

}

interface IcountDownController {

}

class CountDownController implements IcountDownController {
    static controllerId: string = "CountDownController";

    private hiddenCode;
    private myInterval;
    private userId;
    private ips4MemberId;
    private ips4IpSessionFront;
    constructor(private $scope: IcountDownControllerScope,
        private $rootScope,
        private introPageSevice,
        private $interval,
        private $location,
        private $routeParams,
        private $timeout,
        private $log) {
        $scope.title = "CountDownController";

        this.hiddenCode = this.$routeParams.hiddenCode;
        this.$scope.counter = 5;
        this.userId = 1;
        this.$scope.progressBarValue = true;    //Start progress bar.
        this.$scope.pageDetailsValue = false;    //Hide details.


        if (this.hiddenCode != null && this.hiddenCode != undefined) {


            this.beginQuiz();


        } else {
            this.$log.log("CountDownController - constructor - Routeparams are not defined ");
        }
        $rootScope.$on('$locationChangeSuccess', () => {

            $interval.cancel(this.myInterval);

        });
        //For to set height of Iframe in IpBoard
        $timeout(() => {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);
    }


    //Redirect to self scoring intro page                 .
    private redirectResultPageOrSelfScoring(resultSummaryId) {

        this.introPageSevice.getSelfScoringQuestionsCount(this.hiddenCode, resultSummaryId).then((selfScoringQuestion) => {

            if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {

                var selfScoringQuestionCount = selfScoringQuestion.result;
                this.$scope.path = "/quiz-selfscoringintro/" + this.hiddenCode + "/" + selfScoringQuestionCount + "/" + resultSummaryId + "/" + 1;
                this.$scope.progressBarValue = false;    //Stop progress bar.
                this.$scope.pageDetailsValue = true;  //Show details.

                //Interval to show countdown timer.
                this.myInterval = this.$interval(() => {

                    this.$scope.counter--;

                    if (this.$scope.counter == 0) {

                        this.$scope.isGo = true;
                        angular.element(".count-down").toggleClass("count-down-bg");

                    } else if (this.$scope.counter < 0) {

                        this.$scope.counter = 0;
                        this.$interval.cancel(this.myInterval);
                        this.$location.path(this.$scope.path);

                    } else {

                        this.$scope.isGo = false;
                        angular.element(".count-down").toggleClass("count-down-bg");
                    }
                }, 1000);

            } else {

                this.$rootScope.browserBackIsClicked = true;

                //If self scoring questions are not available then redirect to Result page.
                this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + resultSummaryId;

                //Interval to show countdown timer.
                this.myInterval = this.$interval(() => {

                    this.$scope.counter--;

                    if (this.$scope.counter == 0) {

                        this.$scope.isGo = true;
                        angular.element(".count-down").toggleClass("count-down-bg");

                    } else if (this.$scope.counter < 0) {

                        this.$scope.counter = 0;
                        this.$interval.cancel(this.myInterval);
                        this.$location.path(this.$scope.path);

                    } else {

                        this.$scope.isGo = false;
                        angular.element(".count-down").toggleClass("count-down-bg");
                    }
                }, 1000);

            }
        });
    }

    //Start Cpount down timer.
    private beginQuiz() {
        var path = "";
        this.$rootScope.browserBackIsClicked = true;
        this.introPageSevice.checkIfQuizQuestionPageIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((quizResumed) => {
            var quizResultSummaryId = quizResumed.result;
            if (quizResumed.result == 0) {

                //If quiz is not resumed then start from the first question.
                this.introPageSevice.getFirstQuestionNumberToLoadOnQuestionPage(this.hiddenCode).then((firstQuestionPage) => {

                    if (firstQuestionPage != null && firstQuestionPage.QuestionNumber != undefined) {

                        var questionNumber = firstQuestionPage.QuestionNumber;
                        this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + questionNumber;
                        this.$scope.progressBarValue = false;    //Stop progress bar.
                        this.$scope.pageDetailsValue = true;  //Show details.
                        //Interval to show countdown timer.
                        this.myInterval = this.$interval(() => {

                            this.$scope.counter--;

                            if (this.$scope.counter == 0) {

                                //mytimeout = $timeout($scope.onTimeout, 1000);
                                this.$scope.isGo = true;
                                angular.element(".count-down").toggleClass("count-down-bg");

                            } else if (this.$scope.counter < 0) {
                                this.$scope.counter = 0;
                                //     angular.element(".count-down").toggleClass("count-down-bg");
                                this.$interval.cancel(this.myInterval);
                                this.$location.path(this.$scope.path);
                            } else {

                                this.$scope.isGo = false;
                                //mytimeout = $timeout($scope.onTimeout, 1000);
                                angular.element(".count-down").toggleClass("count-down-bg");
                            }
                        }, 1000);

                    } else {
                        this.$log.log("CountDownController - beginQuiz() - First question number not found. ");
                    }
                });
            } else {
                //Get questiondetials to resume Quiz.
                this.introPageSevice.getQuizPageQuestionToResumeQuiz(this.hiddenCode, this.userId).then((resumeQuizQuestion) => {

                    if (resumeQuizQuestion != null && resumeQuizQuestion.result != "null" && resumeQuizQuestion.result != undefined) {

                        this.$scope.progressBarValue = false;    //Stop progress bar.
                        this.$scope.pageDetailsValue = true;  //Show details.

                        var questionNumber = resumeQuizQuestion.result.QuestionNumber;
                        this.$scope.path = "/quiz-question/" + this.hiddenCode + "/" + questionNumber;

                        //Interval to show countdown timer.
                        this.myInterval = this.$interval(() => {

                            this.$scope.counter--;
                            if (this.$scope.counter == 0) {

                                this.$scope.isGo = true;
                                angular.element(".count-down").toggleClass("count-down-bg");

                            } else if (this.$scope.counter < 0) {

                                this.$scope.counter = 0;
                                this.$interval.cancel(this.myInterval);
                                this.$location.path(this.$scope.path);

                            } else if (this.$scope.counter > 0) {

                                this.$scope.isGo = false;
                                angular.element(".count-down").toggleClass("count-down-bg");
                            }
                        }, 1000);

                    } else {
                        //If all the questions of the Quiz are answered and not self scored yet.
                        this.introPageSevice.checkIfSelfScoringQuestionIsSaveAndPausedByUser(this.hiddenCode, this.userId).then((selfScoring) => {

                            if (!selfScoring.result) {

                                //If there questions remained to self score then redirect to Self Scoring IntroPage.

                                quizResultSummaryId = quizResumed.result;
                                this.redirectResultPageOrSelfScoring(quizResultSummaryId);

                            } else {

                                //If all the questions are self scored then redirect to ResultPage.

                                this.$scope.path = "/quiz-result/" + this.hiddenCode + "/" + quizResultSummaryId;

                                //Interval to show countdown timer.
                                this.myInterval = this.$interval(() => {

                                    this.$scope.counter--;
                                    if (this.$scope.counter == 0) {

                                        this.$scope.isGo = true;
                                        angular.element(".count-down").toggleClass("count-down-bg");

                                    } else if (this.$scope.counter < 0) {

                                        this.$scope.counter = 0;
                                        this.$interval.cancel(this.myInterval);
                                        this.$location.path(this.$scope.path);

                                    } else if (this.$scope.counter > 0) {

                                        this.$scope.isGo = false;
                                        angular.element(".count-down").toggleClass("count-down-bg");
                                    }
                                }, 1000);
                            }
                        });
                    }
                });
            }
        });
    }
}

app.controller(CountDownController.controllerId, ['$scope', '$rootScope', 'introPageSevice',  '$interval', '$location', '$routeParams','$timeout','$log',
    ($scope, $rootScope, introPageSevice, $interval, $location, $routeParams, $timeout,$log) =>
        new CountDownController($scope, $rootScope, introPageSevice,  $interval, $location, $routeParams,$timeout,$log)
]);