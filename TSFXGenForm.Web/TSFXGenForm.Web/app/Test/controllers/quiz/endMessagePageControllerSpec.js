describe('Quiz-endMessagePageControllerSpec', function () {
    var scope, $controllerConstructor, mockedEventService, $qservice, endMessagePageController, mdDialog, defered;
    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function ($controller, $rootScope, $q, $mdDialog, endMessagePageService) {
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = endMessagePageService;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $qservice.defer();
        spyOn(mockedEventService, "getQuizSettingDetails").and.returnValue(defered.promise);
        //Initialize fixture
        initializeTest();
    }));
    //setup controller.
    it('should setup controller scope', function () {
        expect(scope).toBeDefined();
    });
    //Should get Quiz details and bind it to UI
    it('should get Quiz details and bind it to UI.', function () {
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
        defered.resolve(quiz);
        endMessagePageController.getQuizDetailsAndBindMessageToUi();
        scope.$root.$apply();
        expect(scope.endMessage).toEqual("Thank you for completing this Quiz.");
        expect(scope.quizTitle).toEqual("Biol Quick");
    });
    //Should get Quiz details and bind it to UI
    it('should promp alert box if quiz details are not available.', function () {
        var quizDetails = new Object();
        quizDetails["result"] = "null";
        defered.resolve(quizDetails);
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        endMessagePageController.getQuizDetailsAndBindMessageToUi();
        scope.$root.$apply();
        mdDialog.alert("Alert box !!");
        expect(endMessagePageController.getQuizDetailsAndBindMessageToUi).toBeDefined();
    });
    function initializeTest() {
        endMessagePageController = $controllerConstructor('EndMessagePageController', {
            $scope: scope,
            endMessagePageService: mockedEventService,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: 'yv2xdir3' }
        });
    }
});
//# sourceMappingURL=endMessagePageControllerSpec.js.map