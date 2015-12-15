describe('HomeController', function () {

    var scope, $qservice, defered, controller, deferedQuizName,deferedAvailableDate, deferedValue,mockedEventservice, timeout, deferedAvailableQuiz, deferedDetailsofIntroPage, introPageMockedService;
    beforeEach(module('app'));
    beforeEach(inject(function ($controller, $rootScope, $q, homeService, quizIntroPageService, $timeout) {
        scope = $rootScope.$new(true);
        $qservice = $q;
        defered = $q.defer();
        timeout = $timeout;
        deferedDetailsofIntroPage = $q.defer();
        deferedValue = $q.defer();
        deferedAvailableQuiz = $q.defer();
        deferedQuizName = $q.defer();
        deferedAvailableDate = $q.defer();
        mockedEventservice = homeService;
        introPageMockedService = quizIntroPageService;

        spyOn(mockedEventservice, "GetDetailsOfQuizOnIntroLoadPage").and.returnValue(defered.promise);
        spyOn(mockedEventservice, "CheckQuizIsAvailableOrNot").and.returnValue(deferedAvailableDate.promise);
        spyOn(introPageMockedService, "GetCurrentQuizName").and.returnValue(deferedQuizName.promise);
        spyOn(introPageMockedService, "CheckQuizIsAvailableOrNot").and.returnValue(deferedAvailableQuiz.promise);
        spyOn(introPageMockedService, "GetQuizPageQuestionToResumeQuiz").and.returnValue(deferedValue.promise);
        spyOn(introPageMockedService, "InitializeQuizDefineOnPageLoad").and.returnValue(defered.promise);
        spyOn(introPageMockedService, "GetDetailsForIntroPage").and.returnValue(deferedDetailsofIntroPage.promise);
        spyOn(introPageMockedService, "CheckIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        spyOn(introPageMockedService, "GetFirstQuestionNumberToLoadOnQuestionPage").and.returnValue(defered.promise);
        controller = $controller('HomeController', { $scope: scope, homeService: mockedEventservice, quizIntroPageService:introPageMockedService});
     //   controller = $controller('IntroPageController', { $scope: scope, homeService: mockedEventservice, quizIntroPageService:introPageMockedService });
    }));

    ////check Url list on the home page should not be null.
    //it("url list should not be null", function () {
    //    expect(scope.url).not.toBeNull();
    //});
       
    ////setup controller scope.
    //it("Should setup controller scope", function () {
    //    expect(scope.getUrl).toBeDefined();
    //});

    ////check searchstring in the url should not be null.
    //it("searchString in URL should not be null", function () {
    //    var url = "http://community.tsfx.com.au/genformedge/default.aspx?_command=linkpreview&code=wmbhwquq";
    //    scope.getUrl(url);
    //    expect(scope.searchString).not.toBeNull();
    //    expect(scope.searchString).toBe("?_command=linkpreview&code=wmbhwquq");
    //  });
    
    ////check parameters in the url should not be null.
    //it("url parameters should not be null", function () {
    //    var url = "http://community.tsfx.com.au/genformedge/default.aspx?_command=linkpreview&code=wmbhwquq";
    //    scope.getUrl(url);
    //    expect(scope.urlParam).not.toBeNull();
    //    expect(scope.urlParam.code).toBe("wmbhwquq");
    //    expect(scope.urlParam.command).toBe("linkpreview");
    //});

    ////check route path for the Resource-Link.
    //it("route path for resourceLink should not be null", function () {
    //    var url = "http://community.tsfx.com.au/genformedge/default.aspx?_command=linkpreview&code=wmbhwquq";
    //    scope.getUrl(url);
    //    expect(scope.routeUrl).not.toBeNull();
    //    expect(scope.routeUrl).toBe("#/Resource-Link/wmbhwquq/linkpreview");
       
    //});

    ////check route path for the Resource-Notes.
    //it("route path for resourceNotes should not be null", function () {
    //    var url = "http://community.tsfx.com.au/genformedge/default.aspx?_command=pdfpreview&code=wbtqbuac";
    //    scope.getUrl(url);
    //    expect(scope.routeUrl).not.toBeNull();
    //    expect(scope.routeUrl).toBe("#/Resource-Notes/wbtqbuac/pdfpreview");

    //});

    //For new implementation.

    //check searchstring in the url should not be null.
    it("searchString in URL should not be null", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=wmbhwquq";
        scope.getUrl(url);
        expect(scope.searchString).not.toBeNull();
        expect(scope.searchString).toBe("?reskey=wmbhwquq");
    });

    //should call geturl method and return notes preview.
    it("should call getUrl method and let the user to notes preview page.", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=ssvnsouh";
     
        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 1;
        selectedResource["Title"] = "Bride's special dance will probably make you cry";
        selectedResource["FileSizes"] = "537315|342601|";
        selectedResource["FilePages"] = "13|10";
        selectedResource["FileNames"] = "vic-sample-notes-biology.pdf|MyEng.pdf|";
        selectedResource["HiddenCode"] = null;
        selectedResource["URL"] = null;
        selectedResource["Description"] = "Long Description";
        selectedResource["ShortDescription"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        spyOn(mockedEventservice, 'CallBasedOnMediaHandlerID').and.returnValue(defered.promise);
        defered.resolve(xmlFileSelectedResources);

        scope.getUrl(url);
        scope.$root.$apply();

        expect(scope.getUrl).toBeDefined();
        expect(scope.path).toEqual("/Resource-Notes/ssvnsouh/vic-sample-notes-biology.pdf");
    });

    //should call geturl method and return link preview.
    it("should call getUrl method and let the user to link preview page.", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=wmbhwquq";

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 2;
        selectedResource["Title"] = "Bride's special dance will probably make you cry";
        selectedResource["FileSizes"] = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry|";
        selectedResource["FilePages"] = null;
        selectedResource["FileNames"] = null;
        selectedResource["HiddenCode"] = "wmbhwquq";
        selectedResource["URL"] = null;
        selectedResource["Description"] = "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog ";
        selectedResource["ShortDescription"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        spyOn(mockedEventservice, 'CallBasedOnMediaHandlerID').and.returnValue(defered.promise);
        defered.resolve(xmlFileSelectedResources);

        scope.getUrl(url);
        scope.$root.$apply();

        expect(scope.getUrl).toBeDefined();
        expect(scope.path).toEqual("/Resource-Link/wmbhwquq");
    });

    //should call geturl method and return Quiz.
    it("should call getUrl method and let the user to Quiz.", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=yv2xdir3";

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 3;
        selectedResource["Title"] = null;
        selectedResource["FileSizes"] = null;
        selectedResource["FilePages"] = null;
        selectedResource["FileNames"] = null;
        selectedResource["HiddenCode"] = null;
        selectedResource["URL"] = null;
        selectedResource["Description"] = null;
        selectedResource["ShortDescription"] =null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        spyOn(mockedEventservice, 'CallBasedOnMediaHandlerID').and.returnValue(defered.promise);
        defered.resolve(xmlFileSelectedResources);

        spyOn(scope, 'checkWhetherToShowIntroPageAndRedirect');

        scope.getUrl(url);
        scope.$root.$apply();

        expect(scope.checkWhetherToShowIntroPageAndRedirect).toHaveBeenCalled();
    });

    //should call geturl method.
    it("should call getUrl method and let the user to video link form the XMl file.", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=wmbhwquq";

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 4;
        selectedResource["Title"] = "Bride's special dance will probably make you cry";
        selectedResource["FileSizes"] = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry|";
        selectedResource["FilePages"] = null;
        selectedResource["FileNames"] = null;
        selectedResource["HiddenCode"] = null;
        selectedResource["URL"] = null;
        selectedResource["Description"] = "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog ";
        selectedResource["ShortDescription"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["LinkId"] = 1;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        spyOn(mockedEventservice, 'CallBasedOnMediaHandlerID').and.returnValue(defered.promise);
        defered.resolve(xmlFileSelectedResources);

        scope.getUrl(url);
        scope.$root.$apply();

        expect(scope.getUrl).toBeDefined();
        expect(scope.message).toEqual("Video link from the Reource.xml");
    });

    //should call geturl method.
    it("should call getUrl method and let the user to video link of the youtube.", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=wmbhwquq";

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 5;
        selectedResource["Title"] = "Bride's special dance will probably make you cry";
        selectedResource["FileSizes"] = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry|";
        selectedResource["FilePages"] = null;
        selectedResource["FileNames"] = null;
        selectedResource["HiddenCode"] = null;
        selectedResource["URL"] = null;
        selectedResource["Description"] = "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog ";
        selectedResource["ShortDescription"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        spyOn(mockedEventservice, 'CallBasedOnMediaHandlerID').and.returnValue(defered.promise);
        defered.resolve(xmlFileSelectedResources);

        scope.getUrl(url);
        scope.$root.$apply();

        expect(scope.getUrl).toBeDefined();
        expect(scope.message).toEqual("Video link for youtube link.");
    });

    //should call geturl method and return Quiz.
    it("should call getUrl method and let the user to Quiz.", function () {
        var url = "http://community.tsfx.com.au/genformedge/default.aspx?reskey=yv2xdir3";

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 3;
        selectedResource["Title"] = null;
        selectedResource["FileSizes"] = null;
        selectedResource["FilePages"] = null;
        selectedResource["FileNames"] = null;
        selectedResource["HiddenCode"] = null;
        selectedResource["URL"] = null;
        selectedResource["Description"] = null;
        selectedResource["ShortDescription"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["CreateDateTime"] = "2013-03-27T21:52:39";
        selectedResource["FormattedCreateDateTime"] = "2013-03-27 21:52:39";

        var xmlFileSelectedResources = new Object();
        xmlFileSelectedResources["result"] = selectedResource;

        spyOn(mockedEventservice, 'CallBasedOnMediaHandlerID').and.returnValue(defered.promise);
        defered.resolve(xmlFileSelectedResources);

        spyOn(scope, 'checkWhetherToShowIntroPageAndRedirect');

        scope.getUrl(url);
        scope.$root.$apply();

        expect(scope.checkWhetherToShowIntroPageAndRedirect).toHaveBeenCalled();
    });
    
    //should call geturl method and return Quiz.
    it("should check whether to shown IntroPage or not and redirect to IntroPage.", function () {
       
        var detailsOnLoad = new Object();
        detailsOnLoad["result"] = true;

        defered.resolve(detailsOnLoad);

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

        var quizDetails = new Object();
        quizDetails["result"] = quiz;
        
        spyOn(mockedEventservice, 'GetDetailsForIntroPage').and.returnValue(deferedDetailsofIntroPage.promise);
        deferedDetailsofIntroPage.resolve(quizDetails);

        var hiddenCode = "yv2xdir3";

        scope.checkWhetherToShowIntroPageAndRedirect(hiddenCode);
        scope.$root.$apply();

        expect(scope.checkWhetherToShowIntroPageAndRedirect).toBeDefined();
        expect(scope.path).toEqual("/quiz-intro/" + hiddenCode);
    });

    //should call geturl method and return Quiz.
    it("should check whether to shown IntroPage or not and redirect to QuestionPage.", function () {

        var detailsOnLoad = new Object();
        detailsOnLoad["result"] = true;

        defered.resolve(detailsOnLoad);

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
        quiz["AllowSaveAndComplete"] = true;
        quiz["ShowResultsPage"] = true;
        quiz["PageMinHeightRatio"] = 0.3787879;
        quiz["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quiz["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>";
        quiz["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong>";

        var quizDetails = new Object();
        quizDetails["result"] = quiz;

        var availableQuiz = new Object();
        availableQuiz["result"] = true;

        deferedAvailableDate.resolve(availableQuiz);

        spyOn(mockedEventservice, 'GetDetailsForIntroPage').and.returnValue(deferedDetailsofIntroPage.promise);
        deferedDetailsofIntroPage.resolve(quizDetails);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;
        deferedValue.resolve(quizPageDetails);
    
        var hiddenCode = "yv2xdir3";
        scope.checkWhetherToShowIntroPageAndRedirect(hiddenCode);
        scope.$root.$apply();
        timeout.flush();
        expect(scope.checkWhetherToShowIntroPageAndRedirect).toBeDefined();
    });
    
    //should call geturl method and return Quiz.
    it("should check whether to shown IntroPage or not and redirect to availableQuiz meesage page if quiz is not available.", function () {

        var detailsOnLoad = new Object();
        detailsOnLoad["result"] = true;

        defered.resolve(detailsOnLoad);

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
        quiz["AllowSaveAndComplete"] = true;
        quiz["ShowResultsPage"] = true;
        quiz["PageMinHeightRatio"] = 0.3787879;
        quiz["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quiz["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt. ||previousattempts||<br/><br/>";
        quiz["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong>";

        var quizDetails = new Object();
        quizDetails["result"] = quiz;

        var availableQuiz = new Object();
        availableQuiz["result"] = false;

        deferedAvailableDate.resolve(availableQuiz);

        spyOn(mockedEventservice, 'GetDetailsForIntroPage').and.returnValue(deferedDetailsofIntroPage.promise);
        deferedDetailsofIntroPage.resolve(quizDetails);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;
        deferedValue.resolve(quizPageDetails);

        var hiddenCode = "yv2xdir3";
        scope.checkWhetherToShowIntroPageAndRedirect(hiddenCode);
        scope.$root.$apply();
       
        expect(scope.checkWhetherToShowIntroPageAndRedirect).toBeDefined();
        expect(scope.path).toEqual("/quiz-availablequizmessage/yv2xdir3");
    });
});