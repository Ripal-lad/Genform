describe("Quiz-introPageServiceSpec", () => {
    var httpBackend, _introPageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((introPageSevice, $httpBackend) => {
        httpBackend = $httpBackend;
        _introPageService = introPageSevice;
        hiddenCode = "wmbhwquq";
    }));

    
        it("should initiate data into QuizDefine.", ()=> {

            var response = new Object();
            response["result"] = "true";

            var hiddenCode = "yv2xdir3";

            httpBackend.expectGET(apiPaths.initializeQuizDefineOnPageLoad + "?hiddenCode=" + hiddenCode).respond(response);
            _introPageService.initializeQuizDefineOnPageLoad(hiddenCode).then((data) => {
                expect(data).not.toBeNull();
                expect(data.result).toEqual('true');
            });
            httpBackend.flush();

        });
    //get name of the Quiz.
    it("should return Quiz Name.", ()=> {

        var response = new Object();
        response["QuizName"] = "VCAA Chemistry Section A Quiz";

        var hiddenCode = "yv2xdir3";

        httpBackend.expectGET(apiPaths.getCurrentQuizName + "?hiddenCode=" + hiddenCode).respond(response);
        _introPageService.getCurrentQuizName(hiddenCode).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.QuizName).toEqual('VCAA Chemistry Section A Quiz');
        });
        httpBackend.flush();

    });

    //get name of the Quiz.
    it("should check available date for the Quiz.",()=> {

        var isAvailable = new Object();
        isAvailable["result"] = true;

        var hiddenCode = "yv2xdir3";

        httpBackend.expectGET(apiPaths.checkQuizIsAvailableOrNot + "?hiddenCode=" + hiddenCode).respond(isAvailable);
        _introPageService.checkQuizIsAvailableOrNot(hiddenCode).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(true);
        });
        httpBackend.flush();

    });

    //Get data to display on Pgetype 1 i.e Intro page.
    it("should return Quiz details.", ()=> {

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

        var hiddenCode = "yv2xdir3";

        httpBackend.expectGET(apiPaths.getDetailsForIntroPage + "?hiddenCode=" + hiddenCode).respond(quiz);
        _introPageService.getDetailsForIntroPage(hiddenCode).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.OpeningMessageTitle).toEqual("Welcome to the TSFX Quiz Master");
            expect(data.OpeningMessage).toEqual("The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>");
            expect(data.OpeningMessageEnd).toEqual("The Quiz Master has been proudly developed by <strong>TSFX</strong>");

        });
        httpBackend.flush();

    });

    //check whether user has paused the quiz or not
    it("should check whether user has paused the quiz or not.", ()=> {

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        var hiddenCode = "yv2xdir3";
        var userId = 1;
        httpBackend.expectGET(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser + "?hiddenCode=" + hiddenCode + "&userId=" + userId).respond(quizResultSummaryId);
        _introPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser(hiddenCode, userId).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();

    });

    // check if Quiz has been answered but self scoring is remained
    it("should check if Quiz has been answered but self scoring is remained.", ()=> {

        var response = new Object();
        response["result"] = true;

        var userId = 1;
        httpBackend.expectGET(apiPaths.checkIfSelfScoringQuestionIsSaveAndPausedByUser + "?hiddenCode=" + hiddenCode + "&userId=" + userId).respond(response);
        _introPageService.checkIfSelfScoringQuestionIsSaveAndPausedByUser(hiddenCode, userId).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(true);
        });
        httpBackend.flush();

    });

    //get get question no of the first question to be displayed.
    it("should get question no of the first question to be displayed.", () =>{

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        httpBackend.expectGET(apiPaths.getFirstQuestionNumberToLoadOnQuestionPage + "?hiddenCode=" + hiddenCode).respond(quizPageQuestion);
        _introPageService.getFirstQuestionNumberToLoadOnQuestionPage(hiddenCode).then((data)=> {
            expect(data).not.toBeNull();
        });
        httpBackend.flush();

    });

    //get total number of short answer quiz questions and check for the existence of PageType 6..
    it("should return total count of self scoring questions.", ()=> {

        var selfScoringQuestionCount = new Object();
        selfScoringQuestionCount["result"] = 2;

        var resultSummaryId = 1;
        httpBackend.expectGET(apiPaths.getSelfScoringQuestionsCount + "?hiddenCode=" + hiddenCode + "&quizResultSummaryId=" + resultSummaryId).respond(selfScoringQuestionCount);
        _introPageService.getSelfScoringQuestionsCount(hiddenCode, resultSummaryId).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();

    });

    //get total number of short answer quiz questions and check for the existence of PageType 6..
    it("should return Question details to resume quiz.", () =>{

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;

        httpBackend.expectGET(apiPaths.getQuizPageQuestionToResumeQuiz + "?hiddenCode=" + hiddenCode).respond(quizPageDetails);
        _introPageService.getQuizPageQuestionToResumeQuiz(hiddenCode).then((data)=> {
            expect(data).not.toBeNull();
        });
        httpBackend.flush();

    });

}) 