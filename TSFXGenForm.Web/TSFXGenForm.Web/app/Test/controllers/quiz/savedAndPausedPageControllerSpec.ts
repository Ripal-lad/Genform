describe('Quiz-savedAndPausedPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        mockedIntroPageService,
        $qservice,
        savedAndPausedPageController,
        mdDialog,
        defered,
        deferedSavedAndPaused,
        deferedTotalTimeTaken,
        deferedQuestionNo;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $q: ng.IQService,
        $mdDialog,
        savedAndPausedPageService,
        introPageSevice
    ) => {

 
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = savedAndPausedPageService;
        mockedIntroPageService = introPageSevice;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $qservice.defer();
        deferedSavedAndPaused = $qservice.defer();
        deferedTotalTimeTaken = $qservice.defer();
        deferedQuestionNo = $qservice.defer();

        spyOn(mockedEventService, 'getTotalAllottedTimeForQuiz').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getTotalTimeTakenByUser').and.returnValue(deferedTotalTimeTaken.promise);
        spyOn(mockedEventService, 'getCurrentQuizName').and.returnValue(defered.promise);
        spyOn(mockedIntroPageService, "checkIfSelfScoringQuestionIsSaveAndPausedByUser").and.returnValue(deferedSavedAndPaused.promise);

        //Initialize fixture
        initializeTest();
    }));

    //setup controller.
    it('Should setup controller scope', ()=> {
        expect(scope).toBeDefined();
        expect(scope.myQuizzes).toBeDefined();
        expect(scope.resumeQuiz).toBeDefined();
    });

    //bind quizName.
    it("should bind Quiz Name.", ()=> {

        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";

        defered.resolve(response);
        savedAndPausedPageController.getQuizName();
        scope.$root.$apply();
        expect(response).not.toBeNull();
        expect(scope.quizTitle).toEqual('VCAA Chemistry Section A Quiz');

    });
    //calculate time and convert in minutes and seconds and timerString() have been called
    it("should calculate time and convert in minutes and seconds and timerString() have been called.", ()=> {

        var totalAllottedTime = 804;
        var userTakenTime = 450;

        spyOn(savedAndPausedPageController, 'timerString');
        savedAndPausedPageController.calculateTime(totalAllottedTime, userTakenTime);

        expect(savedAndPausedPageController.timerString).toHaveBeenCalled();
    });



    it("Should resume quiz on click of FinishClick and redirect to QuestionPage.", ()=> {

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        spyOn(mockedIntroPageService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(quizResultSummaryId);

        var questionNumber = new Object();
        questionNumber["QuestionNumber"] = 2;

        var questionNumberToResumeQuiz = new Object();
        questionNumberToResumeQuiz["result"] = questionNumber;

        spyOn(mockedIntroPageService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuestionNo.promise);
        deferedQuestionNo.resolve(questionNumberToResumeQuiz);

        var isQuizPausedAndSavedByUser = new Object();
        isQuizPausedAndSavedByUser["result"] = false;

        deferedSavedAndPaused.resolve(isQuizPausedAndSavedByUser);

        scope.resumeQuiz();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-question/yv2xdir3/2");
    });

    it("Should resume quiz on click of FinishClick and redirect to SelfScoringIntroPage if all questions have been answered.", ()=> {

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        spyOn(mockedIntroPageService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(quizResultSummaryId);

        var questionNumberToResumeQuiz = new Object();
        questionNumberToResumeQuiz["result"] = "null";

        spyOn(mockedIntroPageService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuestionNo.promise);
        deferedQuestionNo.resolve(questionNumberToResumeQuiz);

        var isQuizPausedAndSavedByUser = new Object();
        isQuizPausedAndSavedByUser["result"] = false;

        deferedSavedAndPaused.resolve(isQuizPausedAndSavedByUser);

        var selfScoringQuestionCount = new Object();
        selfScoringQuestionCount["result"] = 3;

        var deferedSelfScoringQuestionCount = $qservice.defer();

        spyOn(mockedIntroPageService, "getSelfScoringQuestionsCount").and.returnValue(deferedSelfScoringQuestionCount.promise);
        deferedSelfScoringQuestionCount.resolve(selfScoringQuestionCount);


        scope.resumeQuiz();
        scope.$root.$apply();
        expect(scope.path).toEqual("/quiz-selfscoringintro/yv2xdir3/3/2/1");
    });

    it("should resume quiz on click of FinishClick and redirect to ResultPage if all the questions have been answered and also have selfscored.", ()=> {

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        spyOn(mockedIntroPageService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(defered.promise);
        defered.resolve(quizResultSummaryId);

        var questionNumberToResumeQuiz = new Object();
        questionNumberToResumeQuiz["result"] = "null";

        spyOn(mockedIntroPageService, "getQuizPageQuestionToResumeQuiz").and.returnValue(deferedQuestionNo.promise);
        deferedQuestionNo.resolve(questionNumberToResumeQuiz);

        var isQuizPausedAndSavedByUser = new Object();
        isQuizPausedAndSavedByUser["result"] = true;

        deferedSavedAndPaused.resolve(isQuizPausedAndSavedByUser);

        scope.resumeQuiz();
        scope.$root.$apply();
        expect(scope.resumeQuiz).toBeDefined();
        expect(scope.path).toEqual("/quiz-result/yv2xdir3/1");
    });

    it("should calculate time and convert in minutes and seconds.", ()=> {

        var totalAllottedTime = 804;
        var userTakenTime = 450;

        savedAndPausedPageController.calculateTime(totalAllottedTime, userTakenTime);
        expect(scope.timeAllowed).toEqual("13 Minutes 24 Seconds");
        expect(scope.timeTaken).toEqual("7 Minutes 30 Seconds");
        expect(scope.timeRemaining).toEqual("5 Minutes 54 Seconds");

    });

    // return string if minutes and seconds are greater than 
    it("should return string if minutes and seconds are greater than 1.", ()=> {

        var minutes = 13;
        var seconds = 24;
        var result = savedAndPausedPageController.timerString(minutes, seconds);
        expect(result).toEqual("13 Minutes 24 Seconds");

    });

    // return string if minutes and seconds are equal to 1
    it("should return string if minutes and seconds are equal to 1.", ()=> {

        var minutes = 1;
        var seconds = 1;
        var result = savedAndPausedPageController.timerString(minutes, seconds);
        expect(result).toEqual("1 Minute 1 Second");
    });

    //return string if minute is 1 and seconds are greater than 1
    it("should return string if minute is 1 and seconds are greater than 1.", ()=> {

        var minutes = 1;
        var seconds = 24;
        var result = savedAndPausedPageController.timerString(minutes, seconds);
        expect(result).toEqual("1 Minute 24 Seconds");
    });

    //return string if minutes are greater than 1 and second is 1
    it("should return string if minutes are greater than 1 and second is 1.", ()=> {

        var minutes = 10;
        var seconds = 0;
        var result = savedAndPausedPageController.timerString(minutes, seconds);
        expect(result).toEqual("10 Minutes 0 Second");
    });

    //get total allotted time to complete the quiz and time taken by user
    it("should get total allotted time to complete the quiz and time taken by user.", ()=> {

        var minutes = 10;
        var seconds = 0;

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 804;

        var timeTakenByUser = new Object();
        timeTakenByUser["result"] = 450;

        spyOn(savedAndPausedPageController, "calculateTime");

        defered.resolve(totalAllottedTime);
        deferedTotalTimeTaken.resolve(timeTakenByUser);
        savedAndPausedPageController.getTotalAllottedtime(minutes, seconds);
        scope.$root.$apply();
        expect(savedAndPausedPageController.getTotalAllottedtime).toBeDefined();
        expect(savedAndPausedPageController.calculateTime).toHaveBeenCalled();
    });

    //prompt alert box if total allotted time is 0
    it("should prompt alert box if total allotted time is 0.", () =>{

        var minutes = 10;
        var seconds = 0;

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 0;

        var timeTakenByUser = new Object();
        timeTakenByUser["result"] = 450;

        spyOn(savedAndPausedPageController, "calculateTime");

        spyOn(mdDialog, "show").and.returnValue({
            dismiss: () => { }
        });

        mdDialog.alert("Alert box");

        defered.resolve(totalAllottedTime);
        deferedTotalTimeTaken.resolve(timeTakenByUser);
        savedAndPausedPageController.getTotalAllottedtime(minutes, seconds);
        scope.$root.$apply();
        expect(savedAndPausedPageController.getTotalAllottedtime).toBeDefined();
        expect(savedAndPausedPageController.calculateTime).toHaveBeenCalled();
    });

    // prompt alert box if user taken time is 0
    it("should prompt alert box if user taken time is 0.", () => {

        var minutes = 10;
        var seconds = 0;

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 450;

        var timeTakenByUser = new Object();
        timeTakenByUser["result"] = 0;

        spyOn(savedAndPausedPageController, "calculateTime");

        spyOn(mdDialog, "show").and.returnValue({
            dismiss: () =>{ }
        });

        mdDialog.alert("Alert box");

        defered.resolve(totalAllottedTime);
        deferedTotalTimeTaken.resolve(timeTakenByUser);
        savedAndPausedPageController.getTotalAllottedtime(minutes, seconds);
        scope.$root.$apply();
        expect(savedAndPausedPageController.getTotalAllottedtime).toBeDefined();
        expect(savedAndPausedPageController.calculateTime).toHaveBeenCalled();
    });

    // prompt alert box if user taken time and total allotted time are 0
    it("should prompt alert box if user taken time and total allotted time are 0.", () => {

        var minutes = 10;
        var seconds = 0;

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 0;

        var timeTakenByUser = new Object();
        timeTakenByUser["result"] = 0;

        spyOn(savedAndPausedPageController, "calculateTime");

        spyOn(mdDialog, "show").and.returnValue({
            dismiss: () => { }
        });

        mdDialog.alert("Alert box");

        defered.resolve(totalAllottedTime);
        deferedTotalTimeTaken.resolve(timeTakenByUser);
        savedAndPausedPageController.getTotalAllottedtime(minutes, seconds);
        scope.$root.$apply();
        expect(savedAndPausedPageController.getTotalAllottedtime).toBeDefined();
        expect(savedAndPausedPageController.calculateTime).toHaveBeenCalled();
    });

    function initializeTest() {
        savedAndPausedPageController = $controllerConstructor('SavedAndPausedPageController', {
            $scope: scope,
            savedAndPausedPageService: mockedEventService,
            introPageSevice: mockedIntroPageService,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: 'yv2xdir3', quizResultSummaryId: 1 }
        });
    }
}) 