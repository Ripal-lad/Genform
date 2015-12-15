describe('Quiz-selfScoringIntroPageControllerSpec', function () {
    var scope, $controllerConstructor, mockedEventService, $qservice, selfScoringIntroPageController, sce, mdDialog, defered, deferedQuestionDetails, deferedValue, deferedDetailsofIntroPage;
    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function ($controller, $rootScope, $sce, $q, $mdDialog, selfScoringIntroPageService) {
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
    it('should setup controller scope', function () {
        expect(scope).toBeDefined();
        expect(scope.continueClick).toBeDefined();
    });
    //Bind quizName.
    it('should bind QuizName .', inject(function () {
        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";
        defered.resolve(response);
        selfScoringIntroPageController.getCurrentQuizName();
        scope.$root.$apply();
        expect(response).not.toBeNull();
        expect(scope.quizTitle).toEqual("VCAA Chemistry Section A Quiz");
    }));
    it('should bind total time taken by user .', inject(function () {
        var totalTimeTaken = new Object();
        totalTimeTaken["result"] = 90;
        defered.resolve(totalTimeTaken);
        selfScoringIntroPageController.getTotalTimeTakenByUser();
        scope.$root.$apply();
        expect(totalTimeTaken).not.toBeNull();
        expect(scope.seconds).toEqual(30);
        expect(scope.minutes).toEqual(1);
    }));
    it('should redirect to SelfScoringQuestuionPage .', inject(function () {
        var selfScoringQuestionNo = new Object();
        selfScoringQuestionNo["result"] = 2;
        spyOn(mockedEventService, "getFirstSelfScoringQuestionNo").and.returnValue(defered.promise);
        defered.resolve(selfScoringQuestionNo);
        scope.continueClick();
        scope.$root.$apply();
        expect(selfScoringQuestionNo).not.toBeNull();
        expect(scope.continueClick).toBeDefined();
    }));
    it('should prompt alert box if self scoring questions are not available.', inject(function () {
        var selfScoringQuestionNo = new Object();
        selfScoringQuestionNo["result"] = "null";
        spyOn(mockedEventService, "getFirstSelfScoringQuestionNo").and.returnValue(defered.promise);
        defered.resolve(selfScoringQuestionNo);
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        scope.continueClick();
        scope.$root.$apply();
        mdDialog.confirm("Alert box ");
        expect(selfScoringQuestionNo).not.toBeNull();
        expect(scope.continueClick).toBeDefined();
    }));
    it('should bind title  "The Allotted Quiz Time has Elapsed" if timer is expired.', inject(function () {
        var isTimerExpired = new Object();
        isTimerExpired["result"] = true;
        deferedValue.resolve(isTimerExpired);
        selfScoringIntroPageController.checkWhetherTheTimerGetExpired();
        scope.$root.$apply();
        expect(scope.titleMessage).toEqual("The Allotted Quiz Time has Elapsed");
    }));
    it('should bind title "You Have Completed the Quiz" if timer is expired.', inject(function () {
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
});
//# sourceMappingURL=selfScoringIntroPageControllerSpec.js.map