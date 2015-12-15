describe("Quiz-endMessagePageServiceSpec", () => {
    var httpBackend, _endMessagePageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((endMessagePageService, $httpBackend) => {
        httpBackend = $httpBackend;
        _endMessagePageService = endMessagePageService;
        hiddenCode = "yv2xdir3";
    }));


    it("should return Quiz details to bind End EndMessage on UI.", ()=> {

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
        quiz["EndMessage"] = "Thank you for completing this Quiz.";

        var quizsettings = new Object();
        quizsettings["result"] = quiz;
        httpBackend.expectGET(apiPaths.getQuizSettingDetails + "?hiddenCode=" + hiddenCode).respond(quizsettings);

        _endMessagePageService.getQuizSettingDetails(hiddenCode).then((data) => {
            expect(data).not.toBeNull();
            expect(data.result.EndMessage).toEqual("Thank you for completing this Quiz.");

        });
        httpBackend.flush();

    });
}) 