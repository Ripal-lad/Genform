describe('Home-homeService', function() {

    var _homeService, httpBackend;
    beforeEach(module('app'));

    beforeEach(inject(function (homeService, $httpBackend) {

        httpBackend = $httpBackend;
        _homeService = homeService;
    }));

    //Return selected resource for the matched hiddencode.
    it("should return selected resource for the matched hiddencode.", function() {

        var hiddenCode = "wmbhwquq";

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 2;
        selectedResource["ResourceTitle"] = "Bride's special dance will probably make you cry";
        selectedResource["FileSizes"] = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry|";
        selectedResource["FilePages"] = "";
        selectedResource["FileNames"] = "";
        selectedResource["HiddenCode"] = "";
        selectedResource["ResourceURL"] = "";
        selectedResource["ResourceDescription"] = "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog ";
        selectedResource["ResourceShortDescription"] = "";
        selectedResource["ResourceLinkImagePath"] = "";
        selectedResource["LinkId"] = 1;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        httpBackend.expectGET(apiPaths.CallBasedOnMediaHandlerID + "?hiddencode=" + hiddenCode).respond(xmlFileSelectedResources);
        _homeService.CallBasedOnMediaHandlerID(hiddenCode).then(function(data) {
            expect(data).not.toBeNull();
            expect(data.result.MediaHandlerId).not.toBeNull();
        });
        httpBackend.flush();

    });

    
    it("should return Quiz details.", function () {

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

        httpBackend.expectGET(apiPaths.GetDetailsForIntroPage + "?hiddenCode=" + hiddenCode).respond(quiz);
        _homeService.GetDetailsForIntroPage(hiddenCode).then(function (data) {

            expect(data).not.toBeNull();
            expect(data.OpeningMessageTitle).toBe("Welcome to the TSFX Quiz Master");
            expect(data.OpeningMessage).toBe("The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>");
            expect(data.OpeningMessageEnd).toBe("The Quiz Master has been proudly developed by <strong>TSFX</strong>");

        });
        httpBackend.flush();

    });

    //check whether data has been loaded from the xml file or not.
    it("should load data from the XML file and return true.", function () {

        var response = new Object();
        response["result"] = "true";

        var hiddenCode = "yv2xdir3";

        httpBackend.expectGET(apiPaths.GetDetailsOfQuizOnIntroLoadPage + "?hiddenCode=" + hiddenCode).respond(response);
        _homeService.GetDetailsOfQuizOnIntroLoadPage(hiddenCode).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.result).toBe('true');
        });
        httpBackend.flush();

    });

})