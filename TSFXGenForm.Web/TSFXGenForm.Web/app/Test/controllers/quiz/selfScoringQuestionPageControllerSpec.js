describe('Quiz-selfScoringQuestionPageControllerSpec', function () {
    var scope, $controllerConstructor, mockedEventService, $qservice, defered, mockedResultPageService, deferedQuizSettings, deferedQuizPage, deferedQuizQuestion, mdDialog, sce, selfScoringQuestionPageController;
    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function ($controller, $rootScope, $sce, $q, $mdDialog, selfScoringQuestionPageService, resultPageService) {
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = selfScoringQuestionPageService;
        mockedResultPageService = resultPageService;
        $qservice = $q;
        defered = $q.defer();
        deferedQuizPage = $q.defer();
        deferedQuizQuestion = $q.defer();
        deferedQuizSettings = $q.defer();
        sce = $sce;
        mdDialog = $mdDialog;
        //spy services which will be called on page load.
        spyOn(mockedEventService, 'getCurrentQuizName').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getQuestionForSelfScoringQuestionPage').and.returnValue(deferedQuizQuestion.promise);
        //Initialize fixture
        initializeTest();
    }));
    //setup controller.
    it('Should setup controller scope', function () {
        expect(scope).toBeDefined();
        expect(scope.nextButton).toBeDefined();
        expect(scope.previousButton).toBeDefined();
    });
    //bind quizName.
    it("should bind Quiz Name.", function () {
        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";
        defered.resolve(response);
        selfScoringQuestionPageController.getCurrentQuizName();
        scope.$root.$apply();
        expect(response).not.toBeNull();
        expect(scope.quizName).toEqual('VCAA Chemistry Section A Quiz');
    });
    //get questions details
    it("should get questions details.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = true;
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var questionsAndResultDetails = new Object();
        questionsAndResultDetails["result"] = quizPageAndQuestionDetailsList;
        spyOn(selfScoringQuestionPageController, "checkForPreviousButton");
        spyOn(selfScoringQuestionPageController, "bindQuestionDetails");
        selfScoringQuestionPageController.gettQuestionAndResultDetails();
        deferedQuizQuestion.resolve(questionsAndResultDetails);
        scope.$root.$apply();
        expect(quizPageAndQuestionDetailsList).not.toBeNull();
        expect(selfScoringQuestionPageController.checkForPreviousButton).toHaveBeenCalled();
        expect(selfScoringQuestionPageController.bindQuestionDetails).toHaveBeenCalled();
    });
    //prompt alert box if question details contain null value.
    it("should prompt alert box if question details contain null value.", function () {
        var questionsAndResultDetails = new Object();
        questionsAndResultDetails["result"] = "null";
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        deferedQuizQuestion.resolve(questionsAndResultDetails);
        selfScoringQuestionPageController.gettQuestionAndResultDetails();
        scope.$root.$apply();
        mdDialog.confirm("Question details contains null values");
        expect(selfScoringQuestionPageController.gettQuestionAndResultDetails).toBeDefined();
    });
    //bind questions details to page.
    it("should bind Question details to page .", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["QuestionId"] = 29;
        quizPageAndQuestionDetails["QuestionIds"] = "29";
        quizPageAndQuestionDetails["QuestionNumber"] = 2;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>abcd</p>";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["QuestionImageName"] = "KI2OKKTLJWB1Q3O";
        quizPageAndQuestionDetails["SolutionImageName"] = "CM2AECMO5GE4SWY";
        quizPageAndQuestionDetails["WriteSolutionInSpecificLocationMessage"] = "";
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        selfScoringQuestionPageController.bindQuestionDetails(quizPageAndQuestionDetailsList);
        expect(scope.maxScore[0].mark).toEqual(0);
        expect(scope.maxScore[1].mark).toEqual(1);
        expect(scope.maxScore[2].mark).toEqual(2);
        expect(scope.maxScore[3].mark).toEqual(3);
        expect(scope.shortAndMultipleChoiceAnswerQuestion).not.toBeNull();
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(1);
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].score).toEqual(0);
    });
    //bind questions details to page if user has self scored their answer.
    it("should bind Question details to page if user has self scored their answers and clicked previous.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["QuestionId"] = 29;
        quizPageAndQuestionDetails["QuestionIds"] = "29";
        quizPageAndQuestionDetails["QuestionNumber"] = 2;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 5;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>abcd</p>";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 2;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["QuestionImageName"] = "KI2OKKTLJWB1Q3O";
        quizPageAndQuestionDetails["SolutionImageName"] = "CM2AECMO5GE4SWY";
        // quizPageAndQuestionDetails["WriteSolutionInSpecificLocationMessage"] = "Write your answer.";
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        selfScoringQuestionPageController.bindQuestionDetails(quizPageAndQuestionDetailsList);
        expect(scope.maxScore[0].mark).toEqual(0);
        expect(scope.maxScore[1].mark).toEqual(1);
        expect(scope.maxScore[2].mark).toEqual(2);
        expect(scope.maxScore[3].mark).toEqual(3);
        expect(scope.maxScore[4].mark).toEqual(4);
        expect(scope.maxScore[5].mark).toEqual(5);
        expect(scope.shortAndMultipleChoiceAnswerQuestion).not.toBeNull();
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(1);
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].score).toEqual(2);
    });
    //bind questions details to page.
    it("should validate user score if user has scored.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var result = selfScoringQuestionPageController.validateUserScore(quizPageAndQuestionDetailsList);
        expect(result).toEqual(false);
    });
    //bind questions details to page.
    it("should validate user score if user has not self scored yet.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = null;
        quizPageAndQuestionDetails["scoreId"] = "id-1";
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var elem = '<div id= "id-1" class="container main-container"></div><br/>';
        $(document.body).append(elem);
        var result = selfScoringQuestionPageController.validateUserScore(quizPageAndQuestionDetailsList);
        expect(result).toEqual(true);
        //expect(angular.element('#' + 1).parent().find("p")[0]).not.toBe(undefined);
    });
    //promp alert message if user has clicked next button without self scoring.
    it("should promp alert message if user has clicked next button without self scoring.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = null;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        spyOn(selfScoringQuestionPageController, 'validateUserScore').and.returnValue(defered.promise);
        defered.resolve(true);
        scope.nextButton(quizPageAndQuestionDetailsList);
        expect(selfScoringQuestionPageController.validateUserScore).toHaveBeenCalled();
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        mdDialog.confirm("Please Mark Your Answer to Question Using the Marking Scheme Below.");
    });
    //load next question if user has clicked next button.
    it("should load next question if user has clicked next button.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var quetionId = [];
        quetionId.push(2, 4, 6, 18);
        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 5;
        quizPageQuestion["QuestionIds"] = quetionId;
        var nextQuizpageDetails = new Object();
        nextQuizpageDetails["result"] = quizPageQuestion;
        var response = undefined;
        spyOn(selfScoringQuestionPageController, 'validateUserScore').and.returnValue(defered.promise);
        defered.resolve(response);
        spyOn(mockedEventService, 'getNextQuizPageOfSelfScoringQuestion').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(nextQuizpageDetails);
        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.validateUserScore).toHaveBeenCalled();
    });
    //load result page if all questions have been self scored and user has clicked next button
    it("should load result page if all questions have been self scored and user has clicked next button.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var nextQuizpageDetails = new Object();
        nextQuizpageDetails["result"] = "null";
        var response = undefined;
        spyOn(selfScoringQuestionPageController, 'validateUserScore').and.returnValue(defered.promise);
        defered.resolve(response);
        spyOn(mockedEventService, 'getNextQuizPageOfSelfScoringQuestion').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(nextQuizpageDetails);
        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.validateUserScore).toHaveBeenCalled();
    });
    //bind load self scoring intro page if user clicks previous button on first question.
    it("should load previous question clicked previous button.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var quetionId = [];
        quetionId.push(2, 3);
        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 3;
        quizPageQuestion["QuestionIds"] = quetionId;
        var preQuizpageDetails = new Object();
        preQuizpageDetails["result"] = quizPageQuestion;
        spyOn(mockedEventService, 'getPreviousQuizPageOfSelfScoringQuestion').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(preQuizpageDetails);
        scope.previousButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(scope.previousButton).toBeDefined();
    });
    //bind load self scoring intro page if user clicks previous button on first question.
    it("should load self scoring intro page if user has clicked previous button from the 1st question.", function () {
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var previousQuizPage = new Object();
        previousQuizPage["result"] = "null";
        spyOn(mockedEventService, 'getPreviousQuizPageOfSelfScoringQuestion').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(previousQuizPage);
        scope.previousButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(scope.previousButton).toBeDefined();
    });
    //check whether to show ResultPage or not and redirect to Result Page
    it("should check whether to show ResultPage or not and redirect to Result Page.", function () {
        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";
        var savedAndPaused = new Object();
        savedAndPaused["result"] = 2;
        spyOn(mockedEventService, 'checkIfQuizQuestionPageIsSaveAndPausedByUser').and.returnValue(defered.promise);
        defered.resolve(savedAndPaused);
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
        spyOn(mockedResultPageService, 'getQuizSettingDetails').and.returnValue(deferedQuizSettings.promise);
        deferedQuizSettings.resolve(quiz);
        selfScoringQuestionPageController.redirectResultPageOrEndMessagePage();
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.redirectResultPageOrEndMessagePage).toBeDefined();
        expect(scope.path).toEqual("/quiz-result/yv2xdir3/2");
    });
    //check whether to show ResultPage or not and redirect to EndMessagePage.
    it("should check whether to show ResultPage or not and redirect to EndMessagePage.", function () {
        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";
        var savedAndPaused = new Object();
        savedAndPaused["result"] = 2;
        spyOn(mockedEventService, 'checkIfQuizQuestionPageIsSaveAndPausedByUser').and.returnValue(defered.promise);
        defered.resolve(savedAndPaused);
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
        quiz["ShowResultsPage"] = false;
        quiz["PageMinHeightRatio"] = 0.3787879;
        quiz["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quiz["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>";
        quiz["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong>";
        var quizSettings = new Object();
        quizSettings["result"] = quiz;
        spyOn(mockedResultPageService, 'getQuizSettingDetails').and.returnValue(deferedQuizSettings.promise);
        deferedQuizSettings.resolve(quizSettings);
        spyOn(mockedResultPageService, 'getDetailsOnResultsPageLoad').and.returnValue(deferedQuizSettings.promise);
        var isTimerExpired = new Object();
        isTimerExpired["result"] = false;
        selfScoringQuestionPageController.redirectResultPageOrEndMessagePage();
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.redirectResultPageOrEndMessagePage).toBeDefined();
        expect(scope.path).toEqual("/quiz-endmessage/yv2xdir3");
    });
    it("should check whether the timer was expired for short answer questions and redirect it to next question.", function () {
        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";
        var savedAndPaused = new Object();
        savedAndPaused["result"] = 2;
        spyOn(mockedEventService, 'checkIfQuizQuestionPageIsSaveAndPausedByUser').and.returnValue(defered.promise);
        defered.resolve(savedAndPaused);
        spyOn(selfScoringQuestionPageController, 'validateUserScore').and.callFake(function () {
            return false;
        });
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var nextQuizpageDetails = new Object();
        nextQuizpageDetails["result"] = 5;
        spyOn(mockedEventService, 'getNextQuizPageOfSelfScoringQuestion').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(nextQuizpageDetails);
        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.redirectResultPageOrEndMessagePage).toBeDefined();
        expect(scope.path).toEqual("/quiz-selfscoringquestion/yv2xdir3/5/0");
    });
    //check whether to show ResultPage or not and redirect to EndMessagePage.
    it("should check whether the timer was expired for short answer questions and redirect it to TimerExpired Page if all the timer expired questions have been self scored.", function () {
        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";
        var savedAndPaused = new Object();
        savedAndPaused["result"] = 2;
        spyOn(mockedEventService, 'checkIfQuizQuestionPageIsSaveAndPausedByUser').and.returnValue(defered.promise);
        defered.resolve(savedAndPaused);
        spyOn(selfScoringQuestionPageController, 'validateUserScore').and.callFake(function () {
            return false;
        });
        var quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["maxArray"] = "{ mark= 0, mark= 1, mark= 2, mark= 3}";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;
        var quizPageAndQuestionDetailsList = [];
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var nextQuizpageDetails = new Object();
        nextQuizpageDetails["result"] = 0;
        spyOn(mockedEventService, 'getNextQuizPageOfSelfScoringQuestion').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(nextQuizpageDetails);
        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.redirectResultPageOrEndMessagePage).toBeDefined();
        expect(scope.path).toEqual("/quiz-timerexpired/yv2xdir3/2");
    });
    //check for the previous button.
    it("should hide previous button.", function () {
        var questionNo = new Object();
        questionNo["result"] = 2;
        scope.preRouteController = "SelfScoringIntroPageController";
        spyOn(mockedEventService, 'setValueOfFirstQuestionToHidePreviousButton').and.returnValue(defered.promise);
        defered.resolve(questionNo);
        selfScoringQuestionPageController.checkForPreviousButton();
        scope.$root.$apply();
        expect(scope.previousButtonValue).toEqual(false);
    });
    //check for the previous button.
    it("should show previous button.", function () {
        var questionNo = new Object();
        questionNo["result"] = 1;
        scope.preRouteController = "IntroPageController";
        spyOn(mockedEventService, 'setValueOfFirstQuestionToHidePreviousButton').and.returnValue(defered.promise);
        defered.resolve(questionNo);
        selfScoringQuestionPageController.checkForPreviousButton();
        scope.$root.$apply();
        expect(scope.previousButtonValue).toEqual(true);
    });
    //check for the previous button.
    it("Previous route controller should be defined.", function () {
        var questionNo = new Object();
        questionNo["result"] = 1;
        scope.preRouteController = "IntroPageController";
        selfScoringQuestionPageController.getPrevRoteDetails();
        defered.resolve("IntroPageController");
        scope.$root.$apply();
        expect(selfScoringQuestionPageController.getPrevRoteDetails).toBeDefined();
    });
    function initializeTest() {
        selfScoringQuestionPageController = $controllerConstructor('SelfScoringQuestionPageController', {
            $scope: scope,
            selfScoringQuestionPageService: mockedEventService,
            resultPageService: mockedResultPageService,
            $sce: sce,
            $mdDialog: mdDialog,
            prevRoutePromiseGetter: function () {
                return defered.promise;
            },
            $routeParams: { hiddenCode: 'yv2xdir3', questionNumber: 2, isTimerExpired: 0 }
        });
    }
});
//# sourceMappingURL=selfScoringQuestionPageControllerSpec.js.map