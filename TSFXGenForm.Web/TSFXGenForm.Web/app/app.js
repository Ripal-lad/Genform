/// <reference path='../Scripts/typings/angularjs/angular.d.ts'/>
/// <reference path='../Scripts/typings/angularjs/angular-resource.d.ts'/>
// Create the module and define its dependencies.
var app = angular.module('app', [
    'ngResource',
    'ngAnimate',
    'ngRoute',
    'ngMaterial',
    "ngSanitize",
    "timer",
    "ngCookies"
]);
// Execute bootstrapping code and any dependencies.
app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: 'templates/Home/home.html',
            controller: 'HomeController'
        });
        $routeProvider.when("/:hiddenCode", {
            templateUrl: 'templates/Home/home.html',
            controller: 'HomeController'
        });
        //Routes for the Resources.
        //$routeProvider.when("/Resource-Link/:code/:command", {
        $routeProvider.when("/resource-link/:hiddenCode/:ips4_member_id/:ips4_IPSessionFront", {
            templateUrl: 'templates/Resources/linkPreview.html',
            controller: 'ResourceLinkController'
        });
        //$routeProvider.when("/Resource-Notes/:code/:command/:fileName", {
        $routeProvider.when("/resource-notes/:hiddenCode/:fileName/:currentFileNo/:ips4_member_id/:ips4_IPSessionFront", {
            templateUrl: 'templates/Resources/notesPreview.html',
            controller: 'ResourceNotesController',
        });
        //Routes for the Quiz.
        $routeProvider.when("/quiz-intro/:hiddenCode/:ips4_member_id/:ips4_IPSessionFront", {
            templateUrl: 'templates/Quiz/introPage.html',
            controller: 'IntroPageController',
        });
        $routeProvider.when("/quiz-countdowntimer/:hiddenCode", {
            templateUrl: 'templates/Quiz/countDown.html',
            controller: 'CountDownController',
        });
        $routeProvider.when("/quiz-question/:hiddenCode/:questionNumber", {
            templateUrl: 'templates/Quiz/questionPage.html',
            controller: 'QuestionPageController',
            resolve: {
                prevRoutePromiseGetter: function ($q, $rootScope) {
                    var deferred = $q.defer();
                    var dereg = $rootScope.$on('$routeChangeSuccess', function (evt, next, prev) {
                        dereg();
                        if (prev != undefined) {
                            deferred.resolve((prev || ''));
                        }
                        else {
                            deferred.resolve((next || ''));
                        }
                    });
                    return function () {
                        return deferred.promise;
                    };
                }
            }
        });
        $routeProvider.when("/quiz-result/:hiddenCode/:quizResultSummaryId", {
            templateUrl: 'templates/Quiz/resultPage.html',
            controller: 'ResultPageController',
            resolve: {
                prevRoutePromiseGetter: function ($q, $rootScope) {
                    var deferred = $q.defer();
                    var dereg = $rootScope.$on('$routeChangeSuccess', function (evt, next, prev) {
                        dereg();
                        if (prev != undefined) {
                            deferred.resolve((prev.$$route.controller || ''));
                        }
                        else {
                            deferred.resolve((next.$$route.controller || ''));
                        }
                    });
                    return function () {
                        return deferred.promise;
                    };
                }
            }
        });
        $routeProvider.when("/quiz-answerdrill/:hiddenCode/:questionNumber/:quizResultSummaryId", {
            templateUrl: 'templates/Quiz/answerDrillPage.html',
            controller: 'AnswerDrillPageController',
        });
        $routeProvider.when("/quiz-quizmanager/:hiddenCode", {
            templateUrl: 'templates/Quiz/quizManagerPage.html',
            controller: 'QuizManagerPageController',
        });
        $routeProvider.when("/quiz-selfscoringintro/:hiddenCode/:selfScoringQuestionCount/:quizResultSummaryId/:isTimerExpired", {
            templateUrl: 'templates/Quiz/selfScoringIntroPage.html',
            controller: 'SelfScoringIntroPageController',
        });
        $routeProvider.when("/quiz-savedandpaused/:hiddenCode/:quizResultSummaryId", {
            templateUrl: 'templates/Quiz/savedAndPausedPage.html',
            controller: 'SavedAndPausedPageController',
        });
        $routeProvider.when("/quiz-selfscoringquestion/:hiddenCode/:questionNumber/:isTimerExpired", {
            templateUrl: 'templates/Quiz/selfScoringQuestionPage.html',
            controller: 'SelfScoringQuestionPageController',
            resolve: {
                prevRoutePromiseGetter: function ($q, $rootScope) {
                    var deferred = $q.defer();
                    var dereg = $rootScope.$on('$routeChangeSuccess', function (evt, next, prev) {
                        dereg();
                        if (prev != undefined) {
                            deferred.resolve((prev.$$route.controller || ''));
                        }
                        else {
                            deferred.resolve((next.$$route.controller || ''));
                        }
                    });
                    return function () {
                        return deferred.promise;
                    };
                }
            }
        });
        $routeProvider.when("/quiz-endmessage/:hiddenCode", {
            templateUrl: 'templates/Quiz/endMessagePage.html',
            controller: 'EndMessagePageController',
        });
        $routeProvider.when("/quiz-availablequizmessage/:hiddenCode", {
            templateUrl: 'templates/Quiz/availableQuizMessagePage.html',
            controller: 'AvailableQuizMessageController',
        });
        $routeProvider.when("/quiz-timerexpired/:hiddenCode/:quizResultSummaryId", {
            templateUrl: 'templates/Quiz/timerExpiredPage.html',
            controller: 'TimerExpiredPageController',
        });
    }
]);
var apiPaths = {
    //Api path for Home page.
    callBasedOnMediaHandlerID: "api/callbaseonmediahandlerid",
    ipBoardGroupPermission: "api/ipboardgrouppermission",
    ipBoardApplyViewResourcePermission: "api/ipboardapplyviewresourcepermission",
    //Api paths for the Resources.
    // checkResourceUrl: "api/Resource/CheckResourceUrl",
    createResourceLinkPreview: "api/resource/link",
    getResourceDetailsForHiddenCodePassed: "api/resource/selectedresourcedetail",
    createResourcesNotesPreview: "api/resource/notes",
    downloadFile: "api/downloadfile",
    //Api paths for the Quiz.
    getCurrentQuizName: "api/quizname",
    //pageType 1
    //CheckQuizUrlAndGetFormId: "api/Quiz/CheckQuizUrlAndGetFormId",
    getDetailsOfQuizOnIntroLoadPage: "api/quiz/intropagedetailsonpageload",
    getDetailsForIntroPage: "api/Quiz/intropagedetails",
    checkQuizIsAvailableOrNot: "api/quiz/quizavailable",
    //pageType 2
    initializeQuizResultSummaryAndQuizCompilation: "api/quiz/initializequizresultsummaryandquizcompilation",
    getQuizSettingDetails: "api/quizsettings",
    initializeQuizDefineOnPageLoad: "api/initializequizdefine",
    //CheckSaveAndCompleteLaterPageExistsOfQuiz: "api/Quiz/CheckSaveAndCompleteLaterPageExistsOfQuiz",
    getFirstQuestionNumberToLoadOnQuestionPage: "api/quiz/firstquestionnumber",
    //GetQuestionForFirstPageOfQuizStart: "api/Quiz/GetQuestionForFirstPageOfQuizStart",
    getNextQuizPageOfQuiz: "api/quiz/nextquizpage",
    // GetNextQuizQuestionDetailsOfQuiz: "api/Quiz/GetNextQuizQuestionDetailsOfQuiz",
    getPreviousQuizPageOfQuiz: "api/quiz/previousquizpage",
    //GetPreviousQuizQuestionDetailsOfQuiz: "api/Quiz/GetPreviousQuizQuestionDetailsOfQuiz",
    // GetPreviousQuizPageResult:"api/Quiz/GetPreviousQuizPageResult",
    getTotalAllottedTimeForQuiz: "api/quiz/totalallottedtime",
    getTotalNumberOfQuestions: "api/quiz/totalquestioncount",
    getSelfScoringQuestionsCount: "api/selfscoringquestionscount",
    setAndGetRemainingtime: "api/quiz/remainingtime",
    storeTimerExpiredvalue: "api/storetimerexpiredvalue",
    setValueOfFirstQuestionToHidePreviousButton: "api/quiz/storefirstquestionnumber",
    saveAnswersOfQuestions: "api/quiz/saveanswer",
    getQuestionAndPageDetailsForQuestionPage: "api/quiz/questionandpagedetails",
    //PageType 3
    getDetailsOnResultsPageLoad: "api/resultdetails",
    getResultsPageListOnPageLoad: "api/resultlist",
    //PageType 4
    //GetQuestionDetailsForAnswerDrillPage: "api/Quiz/GetQuestionDetailsForAnswerDrillPage",
    //GetSolutionDetailsForAnswerDrillPage: "api/Quiz/GetSolutionDetailsForAnswerDrillPage",
    //GetCurrentQuestionNumber: "api/Quiz/GetCurrentQuestionNumber",
    getQuestionAndAnswerDetailsForAnswerDrillResultPage: "api/answerdrilldetails",
    //PageType 5
    getQuizDetailListForQuizManagerPage: "api/quizmanagerdetails",
    //PageType 6
    getTotalTimeTakenByUser: "api/totaltimetakenbyuser",
    getFirstSelfScoringQuestionNo: "api/firstselfscoringquestionno",
    //check for resume quiz.
    checkIfQuizQuestionPageIsSaveAndPausedByUser: "api/checkifquizquestionpageissaveandpausedbyuser",
    checkIfSelfScoringQuestionIsSaveAndPausedByUser: "api/checkifselfscoringquestionissaveandpausedbyuser",
    getQuizPageQuestionToResumeQuiz: "api/quizpagetoresumequiz",
    //PageType 7
    getQuestionForSelfScoringQuestionPage: "api/questionforselfscoringquestionpage",
    getNextQuizPageOfSelfScoringQuestion: "api/nextquizpageofselfscoringquestion",
    getPreviousQuizPageOfSelfScoringQuestion: "api/previousquizpageofselfscoringquestion",
    getQuestionNoToSelfScoreAfterTimerExpired: "api/questionnotoselfscoreaftertimerexpired",
};
//# sourceMappingURL=app.js.map