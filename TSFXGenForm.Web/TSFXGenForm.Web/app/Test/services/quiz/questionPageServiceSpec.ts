describe("Quiz-questionPageServiceSpec", () => {
    var httpBackend, _questionPageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((questionPageService, $httpBackend) => {
        httpBackend = $httpBackend;
        _questionPageService = questionPageService;
        hiddenCode = "yv2xdir3";
    }));


    //get total number of quiz questions.
    it("should return total number of quiz questions.", ()=> {

        var totalQuizQuestion = new Object();
        totalQuizQuestion["result"] = 4;

        httpBackend.expectGET(apiPaths.getTotalNumberOfQuestions + "?hiddenCode=" + hiddenCode).respond(totalQuizQuestion);
        _questionPageService.getTotalNumberOfQuestions(hiddenCode).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(4);
        });
        httpBackend.flush();

    });

    //get total number of quiz questions.
    it("should initialize data into quizresultsummary andn quizcompilation table.", ()=> {

        var quizresultsummaryid = new Object();
        quizresultsummaryid["result"] = 1;

        httpBackend.expectGET(apiPaths.initializeQuizResultSummaryAndQuizCompilation + "?hiddenCode=" + hiddenCode).respond(quizresultsummaryid);
        _questionPageService.initializeQuizResultSummaryAndQuizCompilation(hiddenCode).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(1);
        });
        httpBackend.flush();

    });

    //get total allotted time for quiz.
    it("should return Total allotted time for Quiz.", ()=> {

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 900;

        httpBackend.expectGET(apiPaths.getTotalAllottedTimeForQuiz + "?hiddenCode=" + hiddenCode).respond(totalAllottedTime);
        _questionPageService.getTotalAllottedTimeForQuiz(hiddenCode).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.result).not.toEqual(0);
            expect(data.result).toEqual(900);

        });
        httpBackend.flush();
    });

    //get Quizsettings
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

        var quizSetting = new Object();
        quizSetting["result"] = quizSettings;

        httpBackend.expectGET(apiPaths.getQuizSettingDetails + "?hiddenCode=" + hiddenCode).respond(quizSetting);
        _questionPageService.getQuizSettingDetails(hiddenCode).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.HiddenCodeForQuiz).not.toBeNull();
            expect(data.result.HiddenCodeForQuiz).toEqual(hiddenCode);

        });

        httpBackend.flush();
    });


    //get values of state averages and relative rank.
    it("should return state averages and relative rank.", ()=> {

        var resultPageScoreDetail = new Object();

        resultPageScoreDetail["RelativeRank"] = 100;
        resultPageScoreDetail["StateAverages"] = 0;
        resultPageScoreDetail["StateAveragesTimeTaken"] = 21;
        resultPageScoreDetail["RelativeRankTimeTaken"] = 0;
        resultPageScoreDetail["YourScore"] = 2;
        resultPageScoreDetail["YourScoreTimeTaken"] = 7;
        resultPageScoreDetail["MaxScore"] = 10;

        httpBackend.expectGET(apiPaths.getDetailsOnResultsPageLoad + "?hiddenCode=" + hiddenCode).respond(resultPageScoreDetail);

        _questionPageService.getDetailsOnResultsPageLoad(hiddenCode).then((data)=> {

            expect(data).not.toBeNull();

        });
        httpBackend.flush();
    });

   
    //get total number of short answer quiz questions.
    it("should check whether user has paused the quiz or not and return quizresultsummaryid.", ()=> {

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        var userId = 1;

        httpBackend.expectGET(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser + "?hiddenCode=" + hiddenCode + "&userId=" + userId).respond(quizResultSummaryId);
        _questionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(hiddenCode, userId).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();

    });

    //Get QuizQuestion and page details.
    it("should return Quiz Page ,Quiz Question and Quiz Result details on page load.", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionIds"] = "4";
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
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 1;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var quizPageAndQuestionAndResultDetails = new Object();
        quizPageAndQuestionAndResultDetails["result"] = quizPageAndQuestionDetailsList;

        var questionNumber = 2;
        var userId = 1;
        httpBackend.expectGET(apiPaths.getQuestionAndPageDetailsForQuestionPage + "?hiddenCode=" + hiddenCode + "&questionNumber=" + questionNumber + "&userId=" + userId).respond(quizPageAndQuestionAndResultDetails);
        _questionPageService.getQuestionAndPageDetailsForQuestionPage(hiddenCode, questionNumber, userId).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.result.length).toEqual(1);
        });
        httpBackend.flush();
    });

    //get QuizPageQuestion when next button is clicked.
    it("should return next QuizPageQuestion when next clicked.", ()=> {

        var userAnswersAndPageDetails = [];
        var userAnswersAndPage = new Object();

        userAnswersAndPage["HiddenCodeForQuiz"] = "yv2xdir3";
        userAnswersAndPage["QuestionNumber"] = 1;
        userAnswersAndPage["UserId"] = 1;
        userAnswersAndPage["QuestionId"] = "4";
        userAnswersAndPage["QuestionIds"] = "4";
        userAnswersAndPage["QuestionType"] = 2;
        userAnswersAndPage["UserAnswer"] = "ABCD";
        userAnswersAndPage["CorrectAnswer"] = "";
        userAnswersAndPage["AnsweredInTime"] = true;
        userAnswersAndPage["SaveAndcompleteLaterLink"] = "a";
        userAnswersAndPage["TimeTaken"] = 30;

        userAnswersAndPageDetails.push(userAnswersAndPage);
        var quetionId = [];
        quetionId.push(2, 4, 6, 18);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var nextQuizpageDetails = new Object();
        nextQuizpageDetails["result"] = quizPageQuestion;

        httpBackend.expectPOST(apiPaths.getNextQuizPageOfQuiz).respond(nextQuizpageDetails);
        _questionPageService.getNextQuizPageOfQuiz(userAnswersAndPageDetails).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.QuestionNumber).not.toBeNull();
            expect(data.QuestionIds).not.toBeNull();

        });

        httpBackend.flush();
    });

    //get QuizPageQuestion when user click previous button.
    it("should return QuizPageQuestion for Previous page.", ()=> {

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var previousQuizpageDetails = new Object();
        previousQuizpageDetails["result"] = quizPageQuestion;

        httpBackend.expectGET(apiPaths.getPreviousQuizPageOfQuiz + "?hiddenCode=" + hiddenCode).respond(previousQuizpageDetails);
        _questionPageService.getPreviousQuizPageOfQuiz(hiddenCode).then((data) =>{

            expect(data).not.toBeNull();
            expect(data.result.QuestionIds.length).not.toEqual(0);
        });

        httpBackend.flush();
    });

    //get total time taken by user to complete quiz.
    it("should return total time taken by user to complete quiz.", ()=> {

        var response = new Object();
        response["result"] = 300;

        var userId = 1;
        var quizResultSummaryId = 2;

        httpBackend.expectGET(apiPaths.getTotalTimeTakenByUser + "?hiddenCode=" + hiddenCode + "&quizResultSummaryId=" + quizResultSummaryId + "&userId=" + userId).respond(response);
        _questionPageService.getTotalTimeTakenByUser(hiddenCode, userId, quizResultSummaryId).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(300);
        });
        httpBackend.flush();
    });
    //get total number of short answer quiz questions and check for the existence of PageType 6..
    it("should return total count of self scoring questions.", () =>{

        var response = new Object();
        response["result"] = 2;
        var resultSummaryId = 1;

        httpBackend.expectGET(apiPaths.getSelfScoringQuestionsCount + "?hiddenCode=" + hiddenCode + "&quizResultSummaryId=" + resultSummaryId).respond(response);
        _questionPageService.getSelfScoringQuestionsCount(hiddenCode, resultSummaryId).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();

    });

    //set timer value in the static variable.
    it("should set timer value.", ()=> {

        var response = new Object();
        response["result"] = 500;

        var timeRemaining = 500;

        httpBackend.expectGET(apiPaths.setAndGetRemainingtime + "?setValue=" + true + "&timeRemaining=" + timeRemaining).respond(response);
        _questionPageService.setAndGetRemainingtime(timeRemaining, true).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(500);
        });
        httpBackend.flush();

    });

    //get timer value in the static variable.
    it("should get timer value.", ()=> {

        var response = new Object();
        response["result"] = 500;

        var timeRemaining = 0;

        httpBackend.expectGET(apiPaths.setAndGetRemainingtime + "?setValue=" + false + "&timeRemaining=" + timeRemaining).respond(response);
        _questionPageService.setAndGetRemainingtime(timeRemaining, false).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(500);
        });
        httpBackend.flush();

    });

   
    //set timer value in the static variable.
    it("should set question no to check whether the hide previous button or not.", () =>{

        var response = new Object();
        response["result"] = 1;

        var questionNo = 1;

        httpBackend.expectGET(apiPaths.setValueOfFirstQuestionToHidePreviousButton + "?questionNo=" + questionNo + "&setValue=" + true).respond(response);
        _questionPageService.setValueOfFirstQuestionToHidePreviousButton(questionNo, true).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(1);
        });
        httpBackend.flush();

    });

    //Get timer value in the static variable.
    it("should get question no to check whether the hide previous button or not.", ()=> {

        var response = new Object();
        response["result"] = 1;

        var questionNo = 1;

        httpBackend.expectGET(apiPaths.setValueOfFirstQuestionToHidePreviousButton + "?questionNo=" + questionNo + "&setValue=" + false).respond(response);
        _questionPageService.setValueOfFirstQuestionToHidePreviousButton(questionNo, false).then((data) =>{
            expect(response).not.toBeNull();
            expect(data.result).toEqual(1);
        });
        httpBackend.flush();

    });

})