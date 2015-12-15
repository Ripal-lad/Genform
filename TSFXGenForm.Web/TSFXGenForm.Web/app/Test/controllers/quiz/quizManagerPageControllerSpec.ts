﻿describe('Quiz-quizManagerPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        introPageMockedService,
        $qservice,
        quizManagerPageController,
        sce,
        mdDialog,
        defered,
        deferedSelfScoringQuestionCount,
        deferedValue,
        deferedDetailsofIntroPage;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $sce,
        $q: ng.IQService,
        $mdDialog,
        introPageSevice,
        quizManagerPageService) => {

        sce = $sce;
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = quizManagerPageService;
        introPageMockedService = introPageSevice;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $q.defer();
        deferedDetailsofIntroPage = $q.defer();
        deferedSelfScoringQuestionCount = $q.defer();
        deferedValue = $q.defer();
        spyOn(mockedEventService, 'getQuizDetailListForQuizManagerPage').and.returnValue(defered.promise);
        spyOn(introPageMockedService, "getDetailsForIntroPage").and.returnValue(defered.promise);
        spyOn(introPageMockedService, "getFirstQuestionNumberToLoadOnQuestionPage").and.returnValue(defered.promise);

        //Initialize fixture
        initializeTest();


    }));

    //setup controller.
    it('Should setup controller scope', ()=> {
        expect(scope).toBeDefined();
        expect(scope.resultClick).toBeDefined();
        expect(scope.beginQuiz).toBeDefined();
    });


    //call method on load.
    it('should call method on load.', ()=> {

        var quizManager = [];
        var quizManagerDetail = new Object();
        var response = new Object();
        response["QuizTitle"] = "VCAA Chemistry Section A Quiz";
        response["DueDate"] = "11 Jul 2014  12:00 AM";
        response["EndDate"] = null;
        response["Score"] = "0%";
        response["RelativeRankValue"] = "0%";
        response["FormId"] = 245;
        response["StartDate"] = "2015-03-25T10:59:24";

        quizManager.push(response);
        quizManagerDetail["result"] = quizManager;

        defered.resolve(quizManagerDetail);
        spyOn(quizManagerPageController, "bindDetailsToUi");

        quizManagerPageController.getQuizManagerPageDetails();
        scope.$root.$apply();
        expect(quizManagerPageController.bindDetailsToUi).toHaveBeenCalled();

    });

    //call method on load.
    it('should display alert box if QuizManagerpage contains null values.', ()=> {

        var quizManagerDetail = new Object();

        quizManagerDetail["result"] = "null";

        quizManagerPageController.getQuizManagerPageDetails();
        scope.$root.$apply();
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: ()=> { }
        });

        mdDialog.confirm("Alert box");

        expect(quizManagerPageController.getQuizManagerPageDetails).toBeDefined();
    });


    //bind total number of Questions if user has not complete the quiz.  
    it('Should bind total number of quizzes detail to UI if user has not completed the quiz.', inject(()=> {

        var quizManager = [];

        var response = new Object();
        response["QuizTitle"] = "VCAA Chemistry Section A Quiz";
        response["DueDate"] = "11 Jul 2014  12:00 AM";
        response["EndDate"] = null;
        response["Score"] = "0%";
        response["RelativeRankValue"] = "0%";
        response["FormId"] = 245;
        response["StartDate"] = "2015-03-25T10:59:24";

        quizManager.push(response);
        quizManagerPageController.bindDetailsToUi(quizManager);
        expect(scope.quizManagerHeader).toEqual("My Quiz Results");
        expect(scope.quizManagerDetials).toBeDefined();
        expect(scope.quizManagerDetials[0].quizName).toEqual("VCAA Chemistry Section A Quiz");
        expect(scope.quizManagerDetials[0].dueDate).toEqual("11 Jul 2014  12:00 AM");
        expect(scope.quizManagerDetials[0].endDate).toEqual("In Progress");
        expect(scope.quizManagerDetials[0].score).toEqual("0%");
        expect(scope.quizManagerDetials[0].relativeRank).toEqual("0%");
        expect(scope.quizManagerDetials[0].relativeAndScoreValue).toEqual(false);

    }));

    //bind total number of Questions if user has not started qny quiz..
    it('Should bind total number of quizzes detail to UI if user has started any quiz.', inject(()=> {

        var quizManager = [];
        var quizManagerDetailList = new Object();

        var response = new Object();
        response["QuizTitle"] = "VCAA Chemistry Section A Quiz";
        response["DueDate"] = "11 Jul 2014  12:00 AM";
        response["EndDate"] = null;
        response["Score"] = "0%";
        response["RelativeRankValue"] = "0%";
        response["FormId"] = 245;
        response["StartDate"] = null;

        quizManager.push(response);

        quizManagerPageController.bindDetailsToUi(quizManager);

        defered.resolve(quizManagerDetailList);

        expect(quizManagerDetailList).not.toBeNull();
        expect(scope.quizManagerHeader).toEqual("Quizzes that Require Completion");
        expect(scope.quizManagerDetials[0].quizName).toEqual("VCAA Chemistry Section A Quiz");
        expect(scope.quizManagerDetials[0].dueDate).toEqual("11 Jul 2014  12:00 AM");
        expect(scope.quizManagerDetials[0].score).toEqual("0%");
        expect(scope.quizManagerDetials[0].relativeRank).toEqual("0%");
        expect(scope.quizManagerDetials[0].relativeAndScoreValue).toEqual(false);

    }));

    it('Should redirect to IntroPage if IntroPage is to be shown when user clicks on try again.',  ()=> {

        var quizDetails = new Object();
        quizDetails["quizName"] = "VCAA Chemistry Section A Quiz";
        quizDetails["dueDate"] = "11 Jul 2014  12:00 AM";
        quizDetails["endDate"] = "25 Mar 2015  11:00 AM";
        quizDetails["score"] = "10%";
        quizDetails["relativeRank"] = "100%";
        quizDetails["relativeAndScoreValue"] = "100%";

        var quiz = new Object();
        quiz["Id"] = 7;
        quiz["HiddenCodeForQuiz"] = "yv2xdir3";
        quiz["Name"] = "Biol Quick";
        quiz["DefaultWidthPx"] = 0;
        quiz["ExpiresDateTime"] = "2015-09-19T00:00:00";
        quiz["FormattedExpiresDateTime"] = "2015-09-19 00:00:00";
        quiz["DueDateTime"] = "2014-07-11T00:00:00";
        quiz["FormattedDueDateTime"] = "2014-07-11 00:00:000";
        quiz["AuthenticationType"] = 0;
        quiz["RequiredToCompleteGroupIds"] = "";
        quiz["ShowScoreBreakdown"] = true;
        quiz["ShowScoreAverages"] = true;
        quiz["ShowTimer"] = true;
        quiz["EnforceTimer"] = true;
        quiz["AttemptsAllowed"] = 1;
        quiz["ScoreSystem"] = 1;
        quiz["QuizBeingSavedAndPaused"] = false;
        quiz["QuizPausedQuestionId"] = 1;
        quiz["ShowMaximumMarks"] = true;
        quiz["TimerUpdateFrequency"] = 1;
        quiz["MaxScore"] = true;
        quiz["AvailableDateTime"] = 1;
        quiz["FormattedAvailableDateTime"] = 1;
        quiz["ShowIntroductionPage"] = true;
        quiz["showStartCountDownTimer"] = true;
        quiz["AllowSaveAndComplete"] = true;
        quiz["ShowResultsPage"] = true;
        quiz["PageMinHeightRatio"] = 0.3787879;
        quiz["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quiz["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>";
        quiz["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong>";

        var quizSetting = new Object();
        quizSetting["result"] = quiz;

        defered.resolve(quiz);

        scope.beginQuiz(quiz);
        scope.$root.$apply();
        expect(scope.beginQuiz).toBeDefined();
        expect(scope.path).toEqual("/quiz-intro/yv2xdir3/undefined/undefined");

    });

    it('Should redirect to CountDownTimerPage if IntroPage is not to be shown and CountDownTimerPage is to be shown when user clicks on try again.', ()=> {

        var quizDetails = new Object();
        quizDetails["quizName"] = "VCAA Chemistry Section A Quiz";
        quizDetails["dueDate"] = "11 Jul 2014  12:00 AM";
        quizDetails["endDate"] = "25 Mar 2015  11:00 AM";
        quizDetails["score"] = "10%";
        quizDetails["relativeRank"] = "100%";
        quizDetails["relativeAndScoreValue"] = "100%";

        var quiz = new Object();
        quiz["Id"] = 7;
        quiz["HiddenCodeForQuiz"] = "yv2xdir3";
        quiz["Name"] = "Biol Quick";
        quiz["DefaultWidthPx"] = 0;
        quiz["ExpiresDateTime"] = "2015-09-19T00:00:00";
        quiz["FormattedExpiresDateTime"] = "2015-09-19 00:00:00";
        quiz["DueDateTime"] = "2014-07-11T00:00:00";
        quiz["FormattedDueDateTime"] = "2014-07-11 00:00:000";
        quiz["AuthenticationType"] = 0;
        quiz["RequiredToCompleteGroupIds"] = "";
        quiz["ShowScoreBreakdown"] = true;
        quiz["ShowScoreAverages"] = true;
        quiz["ShowTimer"] = true;
        quiz["EnforceTimer"] = true;
        quiz["AttemptsAllowed"] = 1;
        quiz["ScoreSystem"] = 1;
        quiz["QuizBeingSavedAndPaused"] = false;
        quiz["QuizPausedQuestionId"] = 1;
        quiz["ShowMaximumMarks"] = true;
        quiz["TimerUpdateFrequency"] = 1;
        quiz["MaxScore"] = true;
        quiz["AvailableDateTime"] = 1;
        quiz["FormattedAvailableDateTime"] = 1;
        quiz["ShowIntroductionPage"] = false;
        quiz["ShowStartCountDownTimer"] = true;
        quiz["AllowSaveAndComplete"] = true;
        quiz["ShowResultsPage"] = true;
        quiz["PageMinHeightRatio"] = 0.3787879;
        quiz["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quiz["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>";
        quiz["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong>";

      
        defered.resolve(quiz);

        scope.beginQuiz(quiz);
        scope.$root.$apply();

        expect(scope.beginQuiz).toBeDefined();
        expect(scope.path).toEqual("/quiz-countdowntimer/yv2xdir3");

    });

    it('Should return result page url when user clicks on EndDate.', ()=> {

        var response = new Object();
        response["quizName"] = "VCAA Chemistry Section A Quiz";
        response["dueDate"] = "11 Jul 2014  12:00 AM";
        response["endDate"] = "25 Mar 2015  11:00 AM";
        response["score"] = "10%";
        response["relativeRank"] = "100%";
        response["relativeAndScoreValue"] = "100%";
        response["formId"] = 245;
        response["quizResultSummaryId"] = 1;

        expect(scope.resultClick).toBeDefined();
        scope.resultClick(response);
        expect(scope.path).toEqual("/quiz-result/yv2xdir3/1");
    });

    it('Should redirect to Intro page if user clicks on "In Progress link."', ()=> {

        var quiz = new Object();
        quiz["Id"] = 7;
        quiz["HiddenCodeForQuiz"] = "yv2xdir3";
        quiz["Name"] = "Biol Quick";
        quiz["DefaultWidthPx"] = 0;
        quiz["ExpiresDateTime"] = "2015-09-19T00:00:00";
        quiz["FormattedExpiresDateTime"] = "2015-09-19 00:00:00";
        quiz["DueDateTime"] = "2014-07-11T00:00:00";
        quiz["FormattedDueDateTime"] = "2014-07-11 00:00:000";
        quiz["AuthenticationType"] = 0;
        quiz["RequiredToCompleteGroupIds"] = "";
        quiz["ShowScoreBreakdown"] = true;
        quiz["ShowScoreAverages"] = true;
        quiz["ShowTimer"] = true;
        quiz["EnforceTimer"] = true;
        quiz["AttemptsAllowed"] = 1;
        quiz["ScoreSystem"] = 1;
        quiz["QuizBeingSavedAndPaused"] = false;
        quiz["QuizPausedQuestionId"] = 1;
        quiz["ShowMaximumMarks"] = true;
        quiz["TimerUpdateFrequency"] = 1;
        quiz["MaxScore"] = true;
        quiz["AvailableDateTime"] = 1;
        quiz["FormattedAvailableDateTime"] = 1;
        quiz["ShowIntroductionPage"] = true;
        quiz["AllowSaveAndComplete"] = true;
        quiz["ShowResultsPage"] = true;
        quiz["PageMinHeightRatio"] = 0.3787879;
        quiz["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quiz["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>";
        quiz["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong>";

        deferedDetailsofIntroPage.resolve(quiz);

        var quizManagerDetails = new Object();
        quizManagerDetails["quizName"] = "VCAA Chemistry Section A Quiz";
        quizManagerDetails["dueDate"] = "11 Jul 2014  12:00 AM";
        quizManagerDetails["endDate"] = "In Progress";
        quizManagerDetails["score"] = "10%";
        quizManagerDetails["relativeRank"] = "100%";
        quizManagerDetails["relativeAndScoreValue"] = "100%";

        scope.resultClick(quizManagerDetails);
        scope.$root.$apply();

        expect(scope.resultClick).toBeDefined();
        //expect(scope.path).toEqual("#/quiz-intro/yv2xdir3");
    });

    it('Should redirect to Questionpage if ShowStartCountDownTimer is false without dispalying intro page if user clicks on "In Progress link."', ()=> {

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;

        spyOn(introPageMockedService, "getQuizPageQuestionToResumeQuiz").and.returnValue(defered.promise);
        defered.resolve(quizPageDetails);

        var quizSettings = new Object();
        quizSettings["ShowStartCountDownTimer"] = false;

        var quizManagerDetails = new Object();
        quizManagerDetails["quizName"] = "VCAA Chemistry Section A Quiz";
        quizManagerDetails["dueDate"] = "11 Jul 2014  12:00 AM";
        quizManagerDetails["endDate"] = "In Progress";
        quizManagerDetails["score"] = "10%";
        quizManagerDetails["relativeRank"] = "100%";
        quizManagerDetails["relativeAndScoreValue"] = "100%";

        quizManagerPageController.redirectToQuestionpageWithoutDisplayingIntroPage(quizManagerDetails, quizSettings);
        scope.$root.$apply();

        expect(scope.resultClick).toBeDefined();
        expect(scope.path).toEqual("/quiz-question/yv2xdir3/2");
    });

    it('Should redirect to CountDownTimerPage if ShowStartCountDownTimer is true."', ()=> {

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;

        spyOn(introPageMockedService, "getQuizPageQuestionToResumeQuiz").and.returnValue(defered.promise);
        defered.resolve(quizPageDetails);

        var quizSettings = new Object();
        quizSettings["ShowStartCountDownTimer"] = true;

        var quizManagerDetails = new Object();
        quizManagerDetails["quizName"] = "VCAA Chemistry Section A Quiz";
        quizManagerDetails["dueDate"] = "11 Jul 2014  12:00 AM";
        quizManagerDetails["endDate"] = "In Progress";
        quizManagerDetails["score"] = "10%";
        quizManagerDetails["relativeRank"] = "100%";
        quizManagerDetails["relativeAndScoreValue"] = "100%";

        quizManagerPageController.redirectToQuestionpageWithoutDisplayingIntroPage(quizManagerDetails, quizSettings);
        scope.$root.$apply();

        expect(scope.resultClick).toBeDefined();
        expect(scope.path).toEqual("/quiz-countdowntimer/yv2xdir3");
    });

    it('should redirect to SelfScroingIntroPage if user has attempted all the question of the Quiz and self scoring is to be remained."', ()=> {

        var quizPageDetails = new Object();
        quizPageDetails["result"] = "null";

        spyOn(introPageMockedService, "getQuizPageQuestionToResumeQuiz").and.returnValue(defered.promise);
        defered.resolve(quizPageDetails);

        var checkSelfScoringQuestionpage = new Object();
        checkSelfScoringQuestionpage["result"] = false;

        spyOn(introPageMockedService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(deferedValue.promise);
        deferedValue.resolve(checkSelfScoringQuestionpage);

        var selfScoringQuestionCount = new Object();
        selfScoringQuestionCount["result"] = 2;

        spyOn(introPageMockedService, "getSelfScoringQuestionsCount").and.returnValue(deferedSelfScoringQuestionCount.promise);
        deferedSelfScoringQuestionCount.resolve(selfScoringQuestionCount);

        var quizSettings = new Object();
        quizSettings["ShowStartCountDownTimer"] = false;

        var quizManagerDetails = new Object();
        quizManagerDetails["quizName"] = "VCAA Chemistry Section A Quiz";
        quizManagerDetails["dueDate"] = "11 Jul 2014  12:00 AM";
        quizManagerDetails["endDate"] = "In Progress";
        quizManagerDetails["score"] = "10%";
        quizManagerDetails["relativeRank"] = "100%";
        quizManagerDetails["relativeAndScoreValue"] = "100%";
        quizManagerDetails["quizResultSummaryId"] = 2;

        quizManagerPageController.redirectToQuestionpageWithoutDisplayingIntroPage(quizManagerDetails, quizSettings);
        scope.$root.$apply();

        expect(scope.resultClick).toBeDefined();
        expect(scope.path).toEqual("/quiz-selfscoringintro/yv2xdir3/2/2/1");
    });

    function initializeTest() {
        quizManagerPageController = $controllerConstructor('QuizManagerPageController', {
            $scope: scope,
            quizManagerPageService: mockedEventService,
            introPageSevice: introPageMockedService,
            $sce: sce,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: 'yv2xdir3' }
        });
    }

})