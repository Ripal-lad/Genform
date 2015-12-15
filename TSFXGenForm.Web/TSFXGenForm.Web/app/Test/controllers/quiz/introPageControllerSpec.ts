
describe('Quiz-introPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        $qservice,
        introPageController,
        sce,
        mdDialog,
        defered,
        deferedQuizName,
        deferedAvailableQuiz,
        deferedDetailsofIntroPage,
        deferedcheckUrl,
        deferedDetailsOnLoad,
        deferedQuizPage;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $sce,
        $q: ng.IQService,
        $mdDialog,
        introPageSevice) => {

        sce = $sce;
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = introPageSevice;
        $qservice = $q;
        defered = $q.defer();
        deferedQuizName = $q.defer();
        deferedAvailableQuiz = $q.defer();
        deferedDetailsofIntroPage = $q.defer();
        deferedcheckUrl = $q.defer();
        deferedDetailsOnLoad = $q.defer();
        deferedQuizPage = $q.defer();
        mdDialog = $mdDialog;
        spyOn(mockedEventService, "getCurrentQuizName").and.returnValue(deferedQuizName.promise);
        spyOn(mockedEventService, "checkQuizIsAvailableOrNot").and.returnValue(deferedAvailableQuiz.promise);
        spyOn(mockedEventService, "initializeQuizDefineOnPageLoad").and.returnValue(defered.promise);
        spyOn(mockedEventService, "getDetailsForIntroPage").and.returnValue(deferedDetailsofIntroPage.promise);
        spyOn(mockedEventService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        spyOn(mockedEventService, "getFirstQuestionNumberToLoadOnQuestionPage").and.returnValue(defered.promise);
        //Initialize fixture
        initializeTest();
    }));

    //setup controller.
    it('Should setup controller scope', () =>{
        expect(scope).toBeDefined();
        expect(scope.beginQuiz).toBeDefined();
        expect(scope.myQuizzes).toBeDefined();
    });

     it('Should get Quiz name and bind to UI.', inject(() => {

        var quizName = new Object();
        quizName["result"] = "Biol Quick";

        deferedQuizName.resolve(quizName);
         introPageController.getCurrentQuizName();
        scope.$root.$apply();
        
        expect(scope.quizTitle).toEqual("Biol Quick");
      
     }));


    //call method "callMethodonLoad" if Quiz is not available
    it('should call method "checkQuizIsAvailableorNotAndInitializeQuiz" if Quiz is not available.', inject(()=> {

        var checkUrl = new Object();
        checkUrl["result"] = true;

        var detailsOnLoad = new Object();
        detailsOnLoad["result"] = true;

        var availableQuiz = new Object();
        availableQuiz["result"] = false;

        deferedcheckUrl.resolve(checkUrl);
        deferedDetailsOnLoad.resolve(detailsOnLoad);
        deferedAvailableQuiz.resolve(availableQuiz);
      

        introPageController.checkQuizIsAvailableorNotAndInitializeQuiz();
        scope.$root.$apply();
        expect(scope.availableQuizMessageValue).toEqual(true);
       

    }));

    // call method "callMethodonLoad" and prompt alert box for the initiate data into QuizDefine.
    it('should call method "checkQuizIsAvailableorNotAndInitializeQuiz" and prompt alert box for the initiate data into QuizDefine.', inject(function () {

        var checkUrl = new Object();
        checkUrl["result"] = true;

        var detailsOnLoad = new Object();
        detailsOnLoad["result"] = true;

        var initializeQuizDefine = new Object();
        initializeQuizDefine["result"] = false;

        var availableQuiz = new Object();
        availableQuiz["result"] = true;

        deferedcheckUrl.resolve(checkUrl);
        deferedDetailsOnLoad.resolve(detailsOnLoad);
        deferedAvailableQuiz.resolve(availableQuiz);
        defered.resolve(initializeQuizDefine);


        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: ()=> { }
        });
        mdDialog.confirm("Alert Box");

        introPageController.checkQuizIsAvailableorNotAndInitializeQuiz();

        scope.$root.$apply();
        expect(introPageController.checkQuizIsAvailableorNotAndInitializeQuiz).toBeDefined();

    }));
    
    //bind message details to page.
    it('Should bind message details to page.', inject(() =>{

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
        quiz["PreviousAttemptMessage"] = "The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.You have previously attempted/completed this quiz on 11 occasions, the most recent attempt being on 5 June 2015.<br/><br/>";
        var quizDetails = new Object();
        quizDetails["result"] = quiz;

        deferedDetailsofIntroPage.resolve(quiz);

       introPageController.getQuizIntroPageDetailsAndBindToUi();
        scope.$root.$apply();

        expect(sce.getTrustedHtml(scope.pageOpeninMessagetitle)).toEqual("Welcome to the TSFX Quiz Master");
        expect(sce.getTrustedHtml(scope.pageOpeningMessage)).toEqual("The following quiz consists of <strong>4 questions</strong>and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.You have previously attempted/completed this quiz on 11 occasions, the most recent attempt being on 5 June 2015.<br/><br/>");
        expect(sce.getTrustedHtml(scope.pageEndMessage)).toEqual("The Quiz Master has been proudly developed by <strong>TSFX</strong>");
    }));

    //check whether Quiz has been resumed or not and bind "Resume Quiz to button
    it('Should check whether Quiz has been resumed or not and bind "Resume Quiz" to button.', inject(()=> {

        var quizResumed = new Object();
        quizResumed["result"] = true;

        defered.resolve(quizResumed);

        introPageController.checkQuizBeingResumed();
        scope.$root.$apply();
        
        expect(introPageController.checkQuizBeingResumed).toBeDefined();
    }));
    

    it('Should check whether Quiz has been resumed or not and bind "Begin Quiz" to button.', inject(()=> {

        var quizResumed = new Object();
        quizResumed["result"] = false;

        defered.resolve(quizResumed);

        introPageController.checkQuizBeingResumed();
        scope.$root.$apply();

        expect(introPageController.checkQuizBeingResumed).toBeDefined();
    }));


    it('Should get self scoring Question count and redirect to SelfScoringIntroPage.', inject(()=> {

        var quizResumed = new Object();
        quizResumed["result"] = 2;

        spyOn(mockedEventService, "getSelfScoringQuestionsCount").and.returnValue(defered.promise);
        defered.resolve(quizResumed);

        introPageController.redirectResultPageOrSelfScoring();
        scope.$root.$apply();

        expect(introPageController.redirectResultPageOrSelfScoring).toBeDefined();
    }));

    //Clicking on Resume Quiz button it should Resume quiz
    it('Clicking on Begin Quiz button it should Resume quiz.', inject(()=> {

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;

        scope.beginQuizName = "Begin Quiz";
        defered.resolve(quizPageDetails);

        scope.beginQuiz();
        scope.$root.$apply();

        expect(scope.beginQuiz).toBeDefined();
    }));

    //Clicking on Resume Quiz button check if Question are not answered then resume quiz.
    it('Clicking on Resume Quiz button check if Question are not answered then resume quiz.', inject(() =>{

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;

        scope.beginQuizName = "Resume Quiz";
        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(defered.promise);
        defered.resolve(quizPageDetails);

        scope.beginQuiz();
        scope.$root.$apply();

        expect(scope.beginQuiz).toBeDefined();
    }));

    //Clicking on Resume Quiz button check if Question are answered then resume from the self scoring intro page
    it('Clicking on Resume Quiz button check if Question are answered then resume from the self scoring intro page.', inject(() =>{

        var quizPageDetails = new Object();
        quizPageDetails["result"] = "null";

        scope.beginQuizName = "Resume Quiz";

        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(quizPageDetails);

        var selfScoring = new Object();
        selfScoring["result"] = false;

        spyOn(mockedEventService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(selfScoring);

        scope.beginQuiz();
        scope.$root.$apply();

        expect(scope.beginQuiz).toBeDefined();
    }));

    //Clicking on Resume Quiz button check if Question are answered if there is an error to get check for the self scoring intro page then prompt dialog box
    it('Clicking on Resume Quiz button check if Question are answered if there is an error to get check for the self scoring intro page then prompt dialog box.', inject(()=> {

        var quizPageDetails = new Object();
        quizPageDetails["result"] = "null";

        scope.beginQuizName = "Resume Quiz";

        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(quizPageDetails);

        var selfScoring = new Object();
        selfScoring["result"] = true;

        spyOn(mockedEventService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(selfScoring);

        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: () =>{ }
        });

        scope.beginQuiz();
        scope.$root.$apply();

        mdDialog.alert("Alert box !!");
        expect(scope.beginQuiz).toBeDefined();
    }));

    //Should call myQuizzes
    it('Should call myQuizzes.', inject(() =>{

        scope.myQuizzes();
        expect(scope.myQuizzes).toBeDefined();
    }));

    
    function initializeTest() {
        introPageController = $controllerConstructor('IntroPageController', {
            $scope: scope,
            introPageSevice: mockedEventService,
            $sce: sce,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: 'wmbhwquq' }
        });

    }
}) 