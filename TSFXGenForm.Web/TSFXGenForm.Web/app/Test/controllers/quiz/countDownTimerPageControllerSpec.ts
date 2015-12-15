describe('Quiz-countDownTimerPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        $qservice,
        interval,
        countDownController,
        mdDialog,
        defered,
        deferedResumeQuiz,
        deferedSelfScoring,
        deferedQuizPage;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $q: ng.IQService,
        $interval,
        $mdDialog,
        introPageSevice
    ) => {
        
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = introPageSevice;
        interval = $interval;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $q.defer();
        deferedQuizPage = $q.defer();
        deferedResumeQuiz = $q.defer();
        deferedSelfScoring = $q.defer();

        spyOn(mockedEventService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(deferedResumeQuiz.promise);
        spyOn(mockedEventService, "getFirstQuestionNumberToLoadOnQuestionPage").and.returnValue(defered.promise);
        spyOn(mockedEventService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuizPage.promise);
        spyOn(mockedEventService, "getSelfScoringQuestionsCount").and.returnValue(defered.promise);

        //Initialize fixture
        initializeTest();
    }));


    it("should setup controller scope.", ()=> {
        expect(scope).toBeDefined();

    });


    it('should get self scoring Question count and redirect to SelfScoringIntroPage.', inject(()=> {

        var quizResumed = new Object();
        quizResumed["result"] = 2;

        defered.resolve(quizResumed);

        var quizResultSummaryId = 3;

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;
        deferedQuizPage.resolve(quizPageDetails);

        countDownController.redirectResultPageOrSelfScoring(quizResultSummaryId);
        scope.$root.$apply();

        expect(countDownController.redirectResultPageOrSelfScoring).toBeDefined();
    }));

    it('should get self scoring Question count and redirect to ResultPage.', inject(()=> {

        var quizResumed = new Object();
        quizResumed["result"] = 0;

        defered.resolve(quizResumed);

        var quizResultSummaryId = 3;

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;
        deferedQuizPage.resolve(quizPageDetails);

        countDownController.redirectResultPageOrSelfScoring(quizResultSummaryId);
        scope.$root.$apply();
        interval.flush(1000);
        expect(countDownController.redirectResultPageOrSelfScoring).toBeDefined();
        expect(scope.path).toEqual("/quiz-result/yv2xdir3/" + quizResultSummaryId);
    }));

    it('should check whether to resume Quiz or start Quiz or load Self Scoring Intro page and Should start Quiz from first question.', inject(()=> {

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        defered.resolve(quizPageQuestion);

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 0;

        deferedResumeQuiz.resolve(quizResultSummaryId);

        countDownController.beginQuiz();
        scope.$root.$apply();
        interval.flush(1000);
        expect(countDownController.beginQuiz).toBeDefined();

        expect(scope.path).toEqual("/quiz-question/yv2xdir3/2");
        expect(scope.counter).toEqual(4);

    }));

    it('should check whether to resume Quiz or start Quiz or load Self Scoring Intro page and Should prompt alert box if first QuestionNumber is undefined.', inject(()=> {


        defered.resolve(null);

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 0;

        deferedResumeQuiz.resolve(quizResultSummaryId);
        spyOn(mdDialog, "alert").and.returnValue(
        {
            dismiss: () => {} 
        });
        countDownController.beginQuiz();
        scope.$root.$apply();

        expect(countDownController.beginQuiz).toBeDefined();

    }));

    it('should check whether to resume Quiz or start Quiz or load Self Scoring Intro page and Should resume Quiz.', inject(()=> {

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var quizPageDetails = new Object();
        quizPageDetails["result"] = quizPageQuestion;

        deferedQuizPage.resolve(quizPageDetails);

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 1;

        deferedResumeQuiz.resolve(quizResultSummaryId);

        countDownController.beginQuiz();
        scope.$root.$apply();
        interval.flush(1000);
        expect(countDownController.beginQuiz).toBeDefined();
        expect(scope.path).toEqual("/quiz-question/yv2xdir3/2");
        expect(scope.counter).toEqual(4);
    }));

    it('should check whether to resume Quiz or start Quiz or load Self Scoring Intro page and Should load SelfScoringIntroPage.', inject(()=> {

        var quizPageDetails = new Object();
        quizPageDetails["result"] = "null";

        deferedQuizPage.resolve(quizPageDetails);

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 1;

        deferedResumeQuiz.resolve(quizResultSummaryId);

        var selfScoringResult = new Object();
        selfScoringResult["result"] = false;

        spyOn(mockedEventService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(deferedSelfScoring.promise);
        deferedSelfScoring.resolve(selfScoringResult);

        spyOn(countDownController, "redirectResultPageOrSelfScoring");
        countDownController.beginQuiz();
        scope.$root.$apply();

        expect(countDownController.beginQuiz).toBeDefined();
        expect(countDownController.redirectResultPageOrSelfScoring).toHaveBeenCalled();
    }));

    it('should check whether to resume Quiz or start Quiz or load Self Scoring Intro page and prompt alert Box.', inject(()=> {

        var quizPageDetails = new Object();
        quizPageDetails["result"] = "null";

        deferedQuizPage.resolve(quizPageDetails);

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 1;

        deferedResumeQuiz.resolve(quizResultSummaryId);

        var selfScoringResult = new Object();
        selfScoringResult["result"] = true;

        spyOn(mockedEventService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(deferedSelfScoring.promise);
        deferedSelfScoring.resolve(selfScoringResult);

        spyOn(countDownController, "redirectResultPageOrSelfScoring");


        spyOn(mdDialog, "alert").and.returnValue({dismiss: () =>{ }});

        countDownController.beginQuiz();
        scope.$root.$apply();
        expect(countDownController.beginQuiz).toBeDefined();
    }));

    function initializeTest() {
        countDownController = $controllerConstructor('CountDownController', {
            $scope: scope,
            $interval: interval,
            introPageSevice: mockedEventService,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: "yv2xdir3" }
        });
    }
}) 