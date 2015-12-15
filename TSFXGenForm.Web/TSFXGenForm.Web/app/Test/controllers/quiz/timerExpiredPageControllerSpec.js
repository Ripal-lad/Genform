describe('Quiz-timerExpiredPageControllerSpec', function () {
    var scope, $controllerConstructor, mockedEventService, $qservice, interval, timerExpiredPageController, mockedResultPageServce, mdDialog, defered, deferedQuestionNo, deferedSavedAndPaused, deferedSelfScoringQuestionCount;
    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function ($controller, $rootScope, $q, $interval, $mdDialog, introPageSevice, resultPageService) {
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = introPageSevice;
        mockedResultPageServce = resultPageService;
        interval = $interval;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $q.defer();
        deferedQuestionNo = $q.defer();
        deferedSavedAndPaused = $q.defer();
        deferedSelfScoringQuestionCount = $qservice.defer();
        spyOn(mockedResultPageServce, "getQuizSettingDetails").and.returnValue(defered.promise);
        spyOn(mockedEventService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(deferedSavedAndPaused.promise);
        spyOn(mockedEventService, "getSelfScoringQuestionsCount").and.returnValue(deferedSelfScoringQuestionCount.promise);
        //Initialize fixture
        initializeTest();
    }));
    it("should define scope", function () {
        expect(scope).toBeDefined();
        expect(scope.viewResult).toBeDefined();
        expect(scope.finishQuiz).toBeDefined();
    });
    it("should get quizSettingsdetails and bind quiz name", function () {
        var quizSettings = new Object();
        quizSettings["Id"] = 7;
        quizSettings["HiddenCodeForQuiz"] = "yv2xdir3";
        quizSettings["Name"] = "VCAA Chemistry Section A Quiz ";
        quizSettings["DefaultWidthPx"] = 250;
        quizSettings["ExpiresDateTime"] = "19 - Sep - 2015";
        quizSettings["DueDateTime"] = "11 - Jul - 2014";
        quizSettings["AuthenticationType"] = 0;
        quizSettings["RequiredToCompleteGroupIds"] = "";
        quizSettings["ShowScoreBreakdown"] = true;
        quizSettings["ShowScoreAverages"] = true;
        quizSettings["ShowTimer"] = true;
        quizSettings["EnforceTimer"] = true;
        quizSettings["TimerUpdateFrequency"] = 1;
        quizSettings["ShowMaximumMarks"] = true;
        quizSettings["AttemptsAllowed"] = 2;
        quizSettings["ScoreSystem"] = 1;
        quizSettings["QuizBeingSavedAndPaused"] = false;
        quizSettings["QuizPausedQuestionId"] = 0;
        quizSettings["AvailableDateTime"] = "";
        quizSettings["AllowSaveAndComplete"] = true;
        quizSettings["ShowIntroductionPage"] = true;
        quizSettings["ShowResultsPage"] = true;
        quizSettings["PageMinHeightRatio"] = 0;
        quizSettings["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quizSettings["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong> and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.<br/><br/>||previousattempts||";
        quizSettings["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong></OpeningMessageEnd>";
        quizSettings["EndMessage"] = "Thank you for completing this Quiz";
        var quizSetting = new Object();
        quizSetting["result"] = quizSettings;
        defered.resolve(quizSetting);
        timerExpiredPageController.getQuizSettingDetails();
        scope.$root.$apply();
        expect(scope.quizTitle).toEqual("VCAA Chemistry Section A Quiz ");
        expect(scope.pageDetails).toEqual(true);
        expect(scope.progressBarValue).toEqual(false);
    });
    it("should get quizSettingsdetails and prompt alert box if quiz setings details are null.", function () {
        var quizSettings = new Object();
        quizSettings["result"] = "null";
        defered.resolve(quizSettings);
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        timerExpiredPageController.getQuizSettingDetails();
        scope.$root.$apply();
        mdDialog.alert("Alert box !!");
        expect(timerExpiredPageController.getQuizSettingDetails).toBeDefined();
    });
    it("should resume quiz on click of FinishClick and redirect to QuestionPage.", function () {
        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;
        spyOn(mockedEventService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(quizResultSummaryId);
        var questionNumber = new Object();
        questionNumber["QuestionNumber"] = 2;
        var questionNumberToResumeQuiz = new Object();
        questionNumberToResumeQuiz["result"] = questionNumber;
        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuestionNo.promise);
        deferedQuestionNo.resolve(questionNumberToResumeQuiz);
        scope.finishQuiz();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-question/yv2xdir3/2");
    });
    it("Should resume quiz on click of FinishClick and redirect to SelfScoringIntroPage if all questions have been answered.", function () {
        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;
        spyOn(mockedEventService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(quizResultSummaryId);
        var questionNumberToResumeQuiz = new Object();
        questionNumberToResumeQuiz["result"] = "null";
        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuestionNo.promise);
        deferedQuestionNo.resolve(questionNumberToResumeQuiz);
        var isQuizPausedAndSavedByUser = new Object();
        isQuizPausedAndSavedByUser["result"] = false;
        deferedSavedAndPaused.resolve(isQuizPausedAndSavedByUser);
        var selfScoringQuestionCount = new Object();
        selfScoringQuestionCount["result"] = 3;
        deferedSelfScoringQuestionCount.resolve(selfScoringQuestionCount);
        scope.finishQuiz();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-selfscoringintro/yv2xdir3/3/2/1");
    });
    it("should resume quiz on click of FinishClick and redirect to ResultPage if all the questions have been answered and also have selfscored.", function () {
        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;
        spyOn(mockedEventService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(quizResultSummaryId);
        var questionNumberToResumeQuiz = new Object();
        questionNumberToResumeQuiz["result"] = "null";
        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuestionNo.promise);
        deferedQuestionNo.resolve(questionNumberToResumeQuiz);
        var isQuizPausedAndSavedByUser = new Object();
        isQuizPausedAndSavedByUser["result"] = true;
        deferedSavedAndPaused.resolve(isQuizPausedAndSavedByUser);
        scope.finishQuiz();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-result/yv2xdir3/2");
    });
    it("should redirect to Result Page on click of View Result if resultPage is to be shown.", function () {
        var quizSettings = new Object();
        quizSettings["ShowResultsPage"] = true;
        scope.quizSettings = quizSettings;
        scope.viewResult();
        expect(scope.path).toEqual("/quiz-result/yv2xdir3/2");
    });
    it("should redirect to Result Page on click of View Result if result page is not be shown.", function () {
        var quizSettings = new Object();
        quizSettings["ShowResultsPage"] = false;
        scope.quizSettings = quizSettings;
        spyOn(mockedResultPageServce, "getDetailsOnResultsPageLoad").and.returnValue(defered.promise);
        defered.resolve();
        scope.viewResult();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-endmessage/yv2xdir3");
    });
    it("should redirect to Result Page on click of Finish Quiz if result page is not be shown.", function () {
        var quizSettings = new Object();
        quizSettings["ShowResultsPage"] = false;
        scope.quizSettings = quizSettings;
        spyOn(mockedResultPageServce, "getDetailsOnResultsPageLoad").and.returnValue(defered.promise);
        defered.resolve();
        scope.viewResult();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-endmessage/yv2xdir3");
    });
    function initializeTest() {
        timerExpiredPageController = $controllerConstructor('TimerExpiredPageController', {
            $scope: scope,
            $interval: interval,
            introPageSevice: mockedEventService,
            resultPageService: mockedResultPageServce,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: "yv2xdir3", quizResultSummaryId: 2 }
        });
    }
});
//# sourceMappingURL=timerExpiredPageControllerSpec.js.map