describe("Quiz-resultPageServiceSpec", () => {
    var httpBackend, _resultPageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((resultPageService, $httpBackend) => {
        httpBackend = $httpBackend;
        _resultPageService = resultPageService;
        hiddenCode = "yv2xdir3";
    }));

    //get Quizsettings
    it("should return QuizSettings.", ()=> {

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
        _resultPageService.getQuizSettingDetails(hiddenCode).then((data) =>{

            expect(data).not.toBeNull();
            expect(data.Id).not.toBeNull();
            expect(data.result.HiddenCodeForQuiz).toEqual(hiddenCode);
        });
        httpBackend.flush();
    });

    //Get questionrows to display result of individual question.
    it("should return list of result for individual questions.", ()=> {

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

        listOfResult.push(resultDetails);

        var questionsResult = new Object();
        questionsResult["ListOfResultsPageDetail"] = listOfResult;

        resultsPageDetailLists["result"] = questionsResult;

        httpBackend.expectGET(apiPaths.getResultsPageListOnPageLoad + "?hiddenCode=" + hiddenCode).respond(resultsPageDetailLists);
        _resultPageService.getResultsPageListOnPageLoad(hiddenCode).then((data) =>{

            expect(data).not.toBeNull();
            expect(data.result.ListOfResultsPageDetail.length).toEqual(4);
        });
        httpBackend.flush();

    });

    //Get values of state averages and relative rank.
    it("should return state averages and relative rank.", () =>{

        var resultPageScoreDetail = new Object();

        resultPageScoreDetail["RelativeRank"] = 100;
        resultPageScoreDetail["StateAverages"] = 0;
        resultPageScoreDetail["StateAveragesTimeTaken"] = 21;
        resultPageScoreDetail["RelativeRankTimeTaken"] = 0;
        resultPageScoreDetail["YourScore"] = 2;
        resultPageScoreDetail["YourScoreTimeTaken"] = 7;
        resultPageScoreDetail["MaxScore"] = 10;

        httpBackend.expectGET(apiPaths.getDetailsOnResultsPageLoad + "?hiddenCode=" + hiddenCode).respond(resultPageScoreDetail);

        _resultPageService.getDetailsOnResultsPageLoad(hiddenCode).then((data) =>{

            expect(data).not.toBeNull();

        });
        httpBackend.flush();
    });

   
})