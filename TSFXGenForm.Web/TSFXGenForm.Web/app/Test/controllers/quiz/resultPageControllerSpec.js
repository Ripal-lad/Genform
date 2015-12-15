describe('Quiz-resultPageControllerSpec', function () {
    var scope, $controllerConstructor, $qservice, defered, mockedResultPageService, deferedQuizSettings, deferedResultList, deferedQuizQuestion, mdDialog, resultPageController;
    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function ($controller, $rootScope, $q, $mdDialog, resultPageService) {
        scope = $rootScope.$new(true).$parent;
        $controllerConstructor = $controller;
        mockedResultPageService = resultPageService;
        $qservice = $q;
        defered = $q.defer();
        deferedResultList = $q.defer();
        deferedQuizQuestion = $q.defer();
        deferedQuizSettings = $q.defer();
        mdDialog = $mdDialog;
        //spy services which will be called on page load.
        spyOn(mockedResultPageService, "getDetailsOnResultsPageLoad").and.returnValue(defered.promise);
        spyOn(mockedResultPageService, 'getResultsPageListOnPageLoad').and.returnValue(deferedResultList.promise);
        spyOn(mockedResultPageService, "getQuizSettingDetails").and.returnValue(defered.promise);
        //Initialize fixture
        initializeTest();
    }));
    //setup controller.
    it('Should setup controller scope', function () {
        expect(scope).toBeDefined();
        expect(scope.myQuizzes).toBeDefined();
        expect(scope.beginQuiz).toBeDefined();
    });
    it("should return QuizSettings.", function () {
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
        defered.resolve(quizSettings);
        resultPageController.getQuizSettings();
        scope.$root.$apply();
        expect(resultPageController.getQuizSettings).toBeDefined();
        expect(scope.showScoreBreakDownValue).toEqual(true);
        expect(scope.showScoreAveragesValue).toEqual(true);
        expect(scope.attempt).toEqual("First");
    });
    //get quesrtionrows to display result of individual question.
    it("should return list of result for individual questions and bind it to UI.", function () {
        var resultsPageDetailLists = new Object();
        var listOfResult = [];
        var resultDetails = new Object();
        resultDetails["QuestionNumber"] = "Question 1";
        resultDetails["UserScoreOutOfMaxScore"] = "0/3";
        resultDetails["QuestionAnsweredCorrectly"] = "0 Average Score";
        resultDetails["QuestionType"] = 2;
        resultDetails["QuestionId"] = 4;
        resultDetails["IsQuizResultExists"] = true;
        resultDetails["IsQuestionAnsInTime"] = true;
        listOfResult.push(resultDetails);
        resultDetails = new Object();
        resultDetails["QuestionNumber"] = "Question 2";
        resultDetails["UserScoreOutOfMaxScore"] = 1;
        resultDetails["QuestionAnsweredCorrectly"] = "1";
        resultDetails["QuestionType"] = 1;
        resultDetails["QuestionId"] = 16;
        resultDetails["IsQuizResultExists"] = true;
        resultDetails["IsQuestionAnsInTime"] = false;
        listOfResult.push(resultDetails);
        resultDetails = new Object();
        resultDetails["QuestionNumber"] = "Question 3";
        resultDetails["UserScoreOutOfMaxScore"] = 1;
        resultDetails["QuestionAnsweredCorrectly"] = "1";
        resultDetails["QuestionType"] = 2;
        resultDetails["QuestionId"] = 17;
        resultDetails["IsQuizResultExists"] = false;
        resultDetails["IsQuestionAnsInTime"] = false;
        listOfResult.push(resultDetails);
        var questionsResult = new Object();
        questionsResult["ListOfResultsPageDetail"] = listOfResult;
        resultsPageDetailLists["result"] = questionsResult;
        var resultPageDetails = new Object();
        resultPageDetails["ListOfResultsPageDetail"] = resultsPageDetailLists;
        deferedResultList.resolve(resultsPageDetailLists);
        resultPageController.getResultDetailsListForQuestionRaws();
        scope.$root.$apply();
        expect(resultPageController.getResultDetailsListForQuestionRaws).toBeDefined();
        expect(scope.questionResultDetails.length).toEqual(3);
        expect(scope.questionResultDetails[1].multipleChoiceTimerExpiredValue).toEqual(true);
        expect(scope.questionResultDetails[1].multipleChoiceImageValue).toEqual(false);
        expect(scope.questionResultDetails[1].shortAnswerQuestionTimerExpiredValue).toEqual(false);
        expect(scope.questionResultDetails[2].wrongAnswerValue).toEqual(true);
        expect(scope.questionResultDetails[1].shortAnswerQuestionTimerExpiredValue).toEqual(false);
    });
    //get values of state averages and relative rank.
    it("should return state averages and relative rank and bind it to UI.", function () {
        var resultPageScoreDetail = new Object();
        resultPageScoreDetail["RelativeRank"] = 100;
        resultPageScoreDetail["StateAverages"] = 0;
        resultPageScoreDetail["StateAveragesTimeTaken"] = 21;
        resultPageScoreDetail["RelativeRankTimeTaken"] = 0;
        resultPageScoreDetail["YourScore"] = 2;
        resultPageScoreDetail["YourScoreTimeTaken"] = 75;
        resultPageScoreDetail["MaxScore"] = 10;
        var resultPageScore = new Object();
        resultPageScore["result"] = resultPageScoreDetail;
        defered.resolve(resultPageScore);
        spyOn(resultPageController, "getResultDetailsListForQuestionRaws");
        resultPageController.getDetailsOfResultHeader("QuestionPageController", 2);
        scope.$root.$apply();
        expect(scope.relativeRank).toEqual(100);
        expect(scope.relativeRankTimeTaken).toEqual(0);
        expect(scope.yourScorePercentage).toEqual(20);
        expect(scope.yourScoreString).toEqual("2 out of 10 ");
        expect(scope.yourScoreTimeInSeconds).toEqual(15);
        expect(scope.yourScoreTimeInMinutes).toEqual(1);
        expect(scope.stateAveragePercentage).toEqual(0);
        expect(scope.stateAverageString).toEqual("0 out of 10 (");
        expect(scope.stateAverageTimeInSeconds).toEqual(21);
        expect(scope.stateAverageTimeInMinutes).toEqual(0);
    });
    //Redirect to QuizManagerPage.
    it('should redirect to QuizManagerPage.', function () {
        scope.myQuizzes();
        expect(scope.myQuizzes).toBeDefined();
    });
    //Redirect to IntroPage if IntroPage is to be shown
    it('should redirect to IntroPage if IntroPage is to be shown when user clicks on try again.', function () {
        var settings = new Object();
        settings["ShowIntroductionPage"] = true;
        settings["showStartCountDownTimer"] = true;
        scope.quizSettings = settings;
        scope.beginQuiz();
        expect(scope.beginQuiz).toBeDefined();
        expect(scope.path).toEqual("/quiz-intro/yv2xdir3/undefined/undefined");
    });
    function initializeTest() {
        resultPageController = $controllerConstructor('ResultPageController', {
            $scope: scope,
            resultPageService: mockedResultPageService,
            $mdDialog: mdDialog,
            prevRoutePromiseGetter: function () {
                return defered.promise;
            },
            $routeParams: { hiddenCode: 'yv2xdir3' }
        });
    }
});
//# sourceMappingURL=resultPageControllerSpec.js.map