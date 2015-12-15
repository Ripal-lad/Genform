describe('Quiz-selfScoringIntroPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        $qservice,
        selfScoringIntroPageController,
        sce,
        mdDialog,
        defered,
        deferedQuestionDetails,
        deferedValue,
        deferedDetailsofIntroPage;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $sce,
        $q: ng.IQService,
        $mdDialog,
        selfScoringIntroPageService
    ) => {

        sce = $sce;
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = selfScoringIntroPageService;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $q.defer();
        deferedDetailsofIntroPage = $q.defer();
        deferedQuestionDetails = $q.defer();
        deferedValue = $q.defer();

        spyOn(mockedEventService, 'getCurrentQuizName').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getTotalTimeTakenByUser').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getQuestionNoToSelfScoreAfterTimerExpired').and.returnValue(deferedValue.promise);

        //Initialize fixture
        initializeTest();
    }));


    //setup controller.
    it('should setup controller scope', ()=> {
        expect(scope).toBeDefined();
        expect(scope.continueClick).toBeDefined();
    });

    //Bind quizName.
    it('should bind QuizName .', inject(()=> {

        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";

        defered.resolve(response);

        selfScoringIntroPageController.getCurrentQuizName();
        scope.$root.$apply();

        expect(response).not.toBeNull();
        expect(scope.quizTitle).toEqual("VCAA Chemistry Section A Quiz");

    }));

    it('should bind total time taken by user .', inject(()=> {

        var totalTimeTaken = new Object();
        totalTimeTaken["result"] = 90;

        defered.resolve(totalTimeTaken);

        selfScoringIntroPageController.getTotalTimeTakenByUser();
        scope.$root.$apply();

        expect(totalTimeTaken).not.toBeNull();
        expect(scope.seconds).toEqual(30);
        expect(scope.minutes).toEqual(1);

    }));

    it('should redirect to SelfScoringQuestuionPage .', inject(()=> {

        var selfScoringQuestionNo = new Object();
        selfScoringQuestionNo["result"] = 2;

        spyOn(mockedEventService, "getFirstSelfScoringQuestionNo").and.returnValue(defered.promise);

        defered.resolve(selfScoringQuestionNo);

        scope.continueClick();
        scope.$root.$apply();

        expect(selfScoringQuestionNo).not.toBeNull();
        expect(scope.continueClick).toBeDefined();
    }));

    it('should prompt alert box if self scoring questions are not available.', inject(()=> {

        var selfScoringQuestionNo = new Object();
        selfScoringQuestionNo["result"] = "null";

        spyOn(mockedEventService, "getFirstSelfScoringQuestionNo").and.returnValue(defered.promise);

        defered.resolve(selfScoringQuestionNo);
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: ()=> { }
        });
        scope.continueClick();
        scope.$root.$apply();
        mdDialog.confirm("Alert box ");
        expect(selfScoringQuestionNo).not.toBeNull();
        expect(scope.continueClick).toBeDefined();
    }));

    it('should bind title  "The Allotted Quiz Time has Elapsed" if timer is expired.', inject(() => {

        var isTimerExpired = new Object();
        isTimerExpired["result"] = true;

       
        deferedValue.resolve(isTimerExpired);
       
        selfScoringIntroPageController.checkWhetherTheTimerGetExpired();
        scope.$root.$apply();
      
        expect(scope.titleMessage).toEqual("The Allotted Quiz Time has Elapsed");
    }));
    it('should bind title "You Have Completed the Quiz" if timer is expired.', inject(() => {

        var isTimerExpired = new Object();
        isTimerExpired["result"] = false;


        deferedValue.resolve(isTimerExpired);

        selfScoringIntroPageController.checkWhetherTheTimerGetExpired();
        scope.$root.$apply();

        expect(scope.titleMessage).toEqual("You Have Completed the Quiz");
    }));
  

    function initializeTest() {
        selfScoringIntroPageController = $controllerConstructor('SelfScoringIntroPageController', {
            $scope: scope,
            selfScoringIntroPageService: mockedEventService,
            $sce: sce,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: "yv2xdir3", quizResultSummaryId: 1, selfScoringQuestionCount: 2, isTimerExpired: 1 }
        });
    }
})
 