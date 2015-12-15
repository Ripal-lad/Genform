/// <reference path='../Scripts/typings/angularjs/angular.d.ts'/>
/// <reference path='../Scripts/typings/angularjs/angular-resource.d.ts'/>

/*============ Application ============*/
/*============ Auther: Dharmesh Pipariya ============*/

interface Iapp extends ng.IModule { }

// Create the module and define its dependencies.
var app: Iapp = angular.module('app', [
// Angular modules 
    'ngResource',       // $resource for REST queries
    'ngAnimate',        // animations
    'ngRoute',              // routing
    'ngMaterial',        // Material
    "ngSanitize",
   "timer",
    "ngCookies"
    // Custom modules 

    // 3rd Party Modules
]);

// Execute bootstrapping code and any dependencies.

app.config([
    '$routeProvider', ($routeProvider) => {

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

        $routeProvider.when("/quiz-intro/:hiddenCode/:ips4_member_id/:ips4_IPSessionFront", {               //PageType 1
            templateUrl: 'templates/Quiz/introPage.html',
            controller: 'IntroPageController',
        });

        $routeProvider.when("/quiz-countdowntimer/:hiddenCode", {            //count Down timer page.
            templateUrl: 'templates/Quiz/countDown.html',
            controller: 'CountDownController',
        });
        $routeProvider.when("/quiz-question/:hiddenCode/:questionNumber", {            //PageType 2
            templateUrl: 'templates/Quiz/questionPage.html',
            controller: 'QuestionPageController',

            resolve: {
                prevRoutePromiseGetter: ($q, $rootScope) => {
                    var deferred = $q.defer();
                    var dereg = $rootScope.$on('$routeChangeSuccess',
                        (evt, next, prev) => {
                            dereg();
                            if (prev != undefined) {
                                deferred.resolve((prev|| ''));
                            } else {

                                deferred.resolve((next || ''));
                            }
                        }
                        );
                    return () => {
                        return deferred.promise;
                    };
                }
            }
        });
        $routeProvider.when("/quiz-result/:hiddenCode/:quizResultSummaryId", {               //PageType 3
            templateUrl: 'templates/Quiz/resultPage.html',
            controller: 'ResultPageController',

            resolve: {
                prevRoutePromiseGetter : ($q, $rootScope)=> {
                    var deferred = $q.defer();
                    var dereg = $rootScope.$on('$routeChangeSuccess',
                         (evt, next, prev)=> {
                            dereg();
                            if (prev != undefined) {
                                deferred.resolve((prev.$$route.controller || ''));
                            } else {

                                deferred.resolve((next.$$route.controller || ''));
                            }
                        }
                        );
                    return () =>{
                        return deferred.promise;
                    };
                }
            }
        });
        $routeProvider.when("/quiz-answerdrill/:hiddenCode/:questionNumber/:quizResultSummaryId", {               //PageType 4
            templateUrl: 'templates/Quiz/answerDrillPage.html',
              controller: 'AnswerDrillPageController',
        });
        $routeProvider.when("/quiz-quizmanager/:hiddenCode", {               //PageType 5
            templateUrl: 'templates/Quiz/quizManagerPage.html',
            controller: 'QuizManagerPageController',
        });
        $routeProvider.when("/quiz-selfscoringintro/:hiddenCode/:selfScoringQuestionCount/:quizResultSummaryId/:isTimerExpired", {               //PageType 6
            templateUrl: 'templates/Quiz/selfScoringIntroPage.html',
            controller: 'SelfScoringIntroPageController',
        });
       
        $routeProvider.when("/quiz-savedandpaused/:hiddenCode/:quizResultSummaryId", {               //PageType 9
            templateUrl: 'templates/Quiz/savedAndPausedPage.html',
            controller: 'SavedAndPausedPageController',
        });
        $routeProvider.when("/quiz-selfscoringquestion/:hiddenCode/:questionNumber/:isTimerExpired", {               //PageType 7
            templateUrl: 'templates/Quiz/selfScoringQuestionPage.html',
            controller: 'SelfScoringQuestionPageController',

            resolve: {
                prevRoutePromiseGetter: ($q, $rootScope) => {
                    var deferred = $q.defer();
                    var dereg = $rootScope.$on('$routeChangeSuccess',
                        (evt, next, prev) => {
                            dereg();
                            if (prev != undefined) {
                                deferred.resolve((prev.$$route.controller || ''));
                            } else {

                                deferred.resolve((next.$$route.controller || ''));
                            }
                        }
                        );
                    return () => {
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
        
       
}]);
  
var apiPaths = {

    //Api path for Home page.
    callBasedOnMediaHandlerID: "api/callbaseonmediahandlerid",
    ipBoardGroupPermission: "api/ipboardgrouppermission",
    ipBoardApplyViewResourcePermission:"api/ipboardapplyviewresourcepermission",
    
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
    getDetailsOfQuizOnIntroLoadPage:"api/quiz/intropagedetailsonpageload",
    getDetailsForIntroPage: "api/Quiz/intropagedetails",
    checkQuizIsAvailableOrNot:"api/quiz/quizavailable",
   

    //pageType 2

    initializeQuizResultSummaryAndQuizCompilation:"api/quiz/initializequizresultsummaryandquizcompilation",             //To insert entries into QuizResultSummary. 
    getQuizSettingDetails: "api/quizsettings",
    initializeQuizDefineOnPageLoad: "api/initializequizdefine",
    //CheckSaveAndCompleteLaterPageExistsOfQuiz: "api/Quiz/CheckSaveAndCompleteLaterPageExistsOfQuiz",
    getFirstQuestionNumberToLoadOnQuestionPage:"api/quiz/firstquestionnumber",
    //GetQuestionForFirstPageOfQuizStart: "api/Quiz/GetQuestionForFirstPageOfQuizStart",
    getNextQuizPageOfQuiz: "api/quiz/nextquizpage",
   // GetNextQuizQuestionDetailsOfQuiz: "api/Quiz/GetNextQuizQuestionDetailsOfQuiz",
    getPreviousQuizPageOfQuiz: "api/quiz/previousquizpage",
    //GetPreviousQuizQuestionDetailsOfQuiz: "api/Quiz/GetPreviousQuizQuestionDetailsOfQuiz",
   // GetPreviousQuizPageResult:"api/Quiz/GetPreviousQuizPageResult",
    getTotalAllottedTimeForQuiz: "api/quiz/totalallottedtime",
    getTotalNumberOfQuestions: "api/quiz/totalquestioncount",
    getSelfScoringQuestionsCount: "api/selfscoringquestionscount",     //to check for existence of short answer question.
    setAndGetRemainingtime:"api/quiz/remainingtime",
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
    getQuestionAndAnswerDetailsForAnswerDrillResultPage:"api/answerdrilldetails",

    //PageType 5
    getQuizDetailListForQuizManagerPage:"api/quizmanagerdetails",

    //PageType 6

    getTotalTimeTakenByUser: "api/totaltimetakenbyuser",
    getFirstSelfScoringQuestionNo:"api/firstselfscoringquestionno",
  
    //check for resume quiz.
    checkIfQuizQuestionPageIsSaveAndPausedByUser: "api/checkifquizquestionpageissaveandpausedbyuser",
    checkIfSelfScoringQuestionIsSaveAndPausedByUser: "api/checkifselfscoringquestionissaveandpausedbyuser",
    getQuizPageQuestionToResumeQuiz: "api/quizpagetoresumequiz", 

    //PageType 7

    getQuestionForSelfScoringQuestionPage: "api/questionforselfscoringquestionpage",
    getNextQuizPageOfSelfScoringQuestion: "api/nextquizpageofselfscoringquestion",
    getPreviousQuizPageOfSelfScoringQuestion: "api/previousquizpageofselfscoringquestion",
    getQuestionNoToSelfScoreAfterTimerExpired:"api/questionnotoselfscoreaftertimerexpired",
    

   
    
}