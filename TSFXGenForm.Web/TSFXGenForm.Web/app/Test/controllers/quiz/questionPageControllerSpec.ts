﻿describe('Quiz-questionPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mdDialog,
        mockedEventService,
        $qservice,
        compile,
        rootScope,
        questionPageController,
        deferedSaveAnswer,
        deferedValidateUserAnswer,
        deferedPreviousRoute,
        deferedCheckIfQuizIsResumed,
        defered,
        deferedValue,
        interval,
        sce,
        timeout,
        deferedQuizPage, deferedLocation, deferedSelfScoringQuestionCount, deferedNextQuizQuestion, deferedReturnValue, deferedQuestions, deferedUserTimeTaken, location;

    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $sce,
        $q: ng.IQService,
        $mdDialog,
        questionPageService,
        $timeout,
        $interval,
        $location
    ) => {

        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = questionPageService;
        sce = $sce;
        $qservice = $q;
        defered = $q.defer();
        deferedQuizPage = $q.defer();
        deferedReturnValue = $q.defer();
        deferedQuestions = $q.defer();
        deferedUserTimeTaken = $q.defer();
        deferedLocation = $q.defer();
        deferedCheckIfQuizIsResumed = $q.defer();
        deferedValue = $q.defer();
        mdDialog = $mdDialog;
        location = $location;
        timeout = $timeout;
        interval = $interval;
        deferedSelfScoringQuestionCount = $q.defer();
        deferedNextQuizQuestion = $q.defer();
        deferedPreviousRoute = $q.defer();
        deferedSaveAnswer = $q.defer();
        deferedValidateUserAnswer = $q.defer();

        var previousRouteController = new Object();         //Pass controller to prevRoutePromiseGetter.
        previousRouteController["controller"] = "QuestionPageController";
        var previousRoute = new Object();
        previousRoute["$$route"] = previousRouteController;
        deferedPreviousRoute.resolve(previousRoute);

        //Mocked the services which are being called on page load.
        spyOn(location, 'path').and.returnValue(deferedLocation.promise);       //spy $location.
        spyOn(mockedEventService, 'getQuizSettingDetails').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getTotalNumberOfQuestions').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getQuestionAndPageDetailsForQuestionPage').and.returnValue(deferedQuestions.promise);
        spyOn(mockedEventService, "getDetailsOnResultsPageLoad").and.returnValue(defered.promise);
        spyOn(mockedEventService, "checkIfQuizQuestionPageIsSaveAndPausedByUser").and.returnValue(deferedCheckIfQuizIsResumed.promise);

        spyOn(mockedEventService, 'getTotalTimeTakenByUser').and.returnValue(deferedUserTimeTaken.promise);

        //Initialize fixture
        initializeTest();
    }));

   
    //setup controller.
    it('should setup controller scope', ()=> {
        expect(scope).toBeDefined();
        expect(scope.nextButton).toBeDefined();
        expect(scope.previousButton).toBeDefined();
        expect(scope.saveAndCompleteLaterClick).toBeDefined();
        expect(scope.saveAndCompleteLaterButtonClick).toBeDefined();
    });

    it('should call method to check previous route controller.', ()=> {

        questionPageController.getPrevRoteDetails();
        scope.$root.$apply();
        expect(questionPageController.getPrevRoteDetails).toBeDefined();
    });

    //Get Quizsettings
    it("should return QuizSettings.", ()=> {

        var quizSettings = new Object();
        quizSettings["Id"] = 7;
        quizSettings["HiddenCodeForQuiz"] = "yv2xdir3";
        quizSettings["Name"] = "VCAA Chemistry Section A Quiz ";
        quizSettings["DefaultWidthPx"] = 250;
        quizSettings["ExpiresDateTime"] = "19 - Sep - 2015";
        quizSettings["DueDateTime"] = "11 - Jul - 2014";
        quizSettings["AuthenticationType"] = 0;
        quizSettings["RequiredToCompleteGroupIds"] = "";
        quizSettings["ShowScoreBreakdown"] = true;
        quizSettings["ShowScoreAverages"] = true;
        quizSettings["ShowTimer"] = true;
        quizSettings["EnforceTimer"] = true;
        quizSettings["TimerUpdateFrequency"] = 1;
        quizSettings["ShowMaximumMarks"] = true;
        quizSettings["AttemptsAllowed"] = 2;
        quizSettings["ScoreSystem"] = 1;
        quizSettings["QuizBeingSavedAndPaused"] = false;
        quizSettings["QuizPausedQuestionId"] = 0;
        quizSettings["AvailableDateTime"] = "";
        quizSettings["AllowSaveAndComplete"] = true;
        quizSettings["ShowIntroductionPage"] = true;
        quizSettings["ShowResultsPage"] = true;
        quizSettings["PageMinHeightRatio"] = 0;
        quizSettings["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quizSettings["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong> and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.<br/><br/>||previousattempts||";
        quizSettings["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong></OpeningMessageEnd>";
        quizSettings["EndMessage"] = "Thank you for completing this Quiz";

        var quizSettingsDetails = new Object();
        quizSettingsDetails["result"] = quizSettings;

        spyOn(questionPageController, 'applyQuizSetings').and.returnValue(defered.promise);
        spyOn(questionPageController, 'getQuestionDetails').and.returnValue(defered.promise);
        defered.resolve(quizSettingsDetails);

        questionPageController.getQuizSettings();
        scope.$root.$apply();
        expect(questionPageController.getQuizSettings).toBeDefined();

    });

    //Save and complete later button click event.
    it('on clicking Save and complete later link confirm box should be prompt.', inject(()=> {

        spyOn(mdDialog, "confirm").and.returnValue({
            dismiss: ()=> { }
        });

        mdDialog.confirm("Save and Complete Later");
        scope.saveAndCompleteLaterClick();
        scope.$root.$apply();
        expect(scope.saveAndCompleteLaterClick).toBeDefined();
    }));


    it('on clicking Save and Complete Later button redirect to saved and paused page.', inject(()=> {

        var quizQuestionsAndAnswerList = [];
        var quizAnswersAndPage = new Object();

        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 2;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["shortAnswerQuestionNo"] = "a";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "ABCD";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["UserId"] = 1;
        quizQuestionsAndAnswerList.push(quizAnswersAndPage);

        spyOn(questionPageController, 'returnUserAnswerDetails').and.returnValue(defered.promise);
        deferedReturnValue.resolve(quizQuestionsAndAnswerList);

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = 2;

        deferedCheckIfQuizIsResumed.resolve(selfScoringQuestion);

        var userTimeTaken = 30;

        spyOn(questionPageController, 'getUserTimeTakenAndStopeTimer').and.returnValue(defered.promise);
        deferedReturnValue.resolve(userTimeTaken);

        var quetionId = [];
        quetionId.push(2, 4, 6, 18);

        var quizPageQuestions = new Object();
        quizPageQuestions["result"] = "null";

        spyOn(mockedEventService, 'getNextQuizPageOfQuiz').and.returnValue(defered.promise);
        deferedNextQuizQuestion.resolve(quizPageQuestions);

        scope.saveAndCompleteLaterButtonClick(quizQuestionsAndAnswerList);
       // scope.$root.$apply();
        expect(scope.saveAndCompleteLaterButtonClick).toBeDefined();
    }));

    it('push questions and answers into array that are supposed to send on the server side to save.', inject(()=> {

        var quizQuestionsAndAnswerList = [];

        var quizAnswersAndPage = new Object();
        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 2;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["shortAnswerQuestionNo"] = "a";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "<p>dsdk</p>";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["userId"] = 1;

        quizQuestionsAndAnswerList.push(quizAnswersAndPage);

        var userTimeTaken = 24;
        var saveAndcompleteLaterLink = false;
        var result = questionPageController.returnUserAnswerDetails(quizQuestionsAndAnswerList, saveAndcompleteLaterLink, userTimeTaken);

        expect(scope.saveAndCompleteLaterClick).toBeDefined();
        expect(result[0].UserId).toEqual(1);
        expect(result[0].UserAnswer).toEqual("<p>dsdk</p>");
        expect(result[0].QuestionId).toEqual('4');
        expect(result[0].QuestionType).toEqual(2);
        expect(result[0].AnsweredInTime).toEqual(true);

    }));

    it('display error message if user has not answered the present question for questiontype 2.', inject(()=> {

        var quizQuestionsAndAnswerList = [];

        var quizAnswersAndPage = new Object();
        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 2;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["UserId"] = 1;
        quizAnswersAndPage["ckEditorId"] = 1;

        quizQuestionsAndAnswerList.push(quizAnswersAndPage);

        var elem = '<textarea id="1" class="container main-container" ck-editor></textarea><br/>';
        $(document.body).append(elem);

        var result = questionPageController.validateUserAnswers(quizQuestionsAndAnswerList);
        
        expect(questionPageController.validateUserAnswers).toBeDefined();
        expect(result).toEqual(false);
        expect(scope.errormsgShort).toEqual(true);
        expect(angular.element('#' + 1).parent().find("p")[0]).not.toEqual(undefined);
    }));

    it('display error message if user has not answered the present question for questiontype 1.', inject(()=> {

        var quizQuestionsAndAnswerList = [];

        var quizAnswersAndPage = new Object();
        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 1;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["UserId"] = 1;

        quizQuestionsAndAnswerList.push(quizAnswersAndPage);

        var elem = '<div class="multiple-ans"></div><br/>';
        $(document.body).append(elem);

        var result = questionPageController.validateUserAnswers(quizQuestionsAndAnswerList);
    
        expect(questionPageController.validateUserAnswers).toBeDefined();
        expect(result).toEqual(false);
        expect(angular.element("div.multiple-ans").find("p")[0]).not.toEqual(undefined);

    }));

    //check url parameters from the route should not be null.
    it('if timer gets expired the confirm dialog box should be prompted for questiontype 1.', inject(() => {

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 100;

        var response = "1 Minute 40 Seconds";

        var quizSettings = new Object();
        quizSettings["Id"] = 7;
        quizSettings["HiddenCodeForQuiz"] = "yv2xdir3";
        quizSettings["Name"] = "VCAA Chemistry Section A Quiz ";
        quizSettings["DefaultWidthPx"] = 250;
        quizSettings["ExpiresDateTime"] = "19 - Sep - 2015";
        quizSettings["DueDateTime"] = "11 - Jul - 2014";
        quizSettings["AuthenticationType"] = 0;
        quizSettings["RequiredToCompleteGroupIds"] = "";
        quizSettings["ShowScoreBreakdown"] = true;
        quizSettings["ShowScoreAverages"] = true;
        quizSettings["ShowTimer"] = true;
        quizSettings["EnforceTimer"] = true;
        quizSettings["TimerUpdateFrequency"] = 1;
        quizSettings["ShowMaximumMarks"] = true;
        quizSettings["AttemptsAllowed"] = 2;
        quizSettings["ScoreSystem"] = 1;
        quizSettings["QuizBeingSavedAndPaused"] = false;
        quizSettings["QuizPausedQuestionId"] = 0;
        quizSettings["AvailableDateTime"] = "";
        quizSettings["AllowSaveAndComplete"] = true;
        quizSettings["ShowIntroductionPage"] = true;
        quizSettings["ShowResultsPage"] = true;
        quizSettings["PageMinHeightRatio"] = 0;
        quizSettings["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quizSettings["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong> and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.<br/><br/>||previousattempts||";
        quizSettings["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong></OpeningMessageEnd>";
        quizSettings["EndMessage"] = "Thank you for completing this Quiz";

        spyOn(questionPageController, 'timerString').and.returnValue(defered.promise);
        defered.resolve(response);

        spyOn(mockedEventService, 'getTotalAllottedTimeForQuiz').and.returnValue(defered.promise);
        defered.resolve(totalAllottedTime);

        var settings = new Object();
        settings["EnforceTimer"] = true;
        scope.quizSetting = settings;

        scope.questionType = 1;

        spyOn(mdDialog, "confirm").and.returnValue({
            dismiss :()=>{}
        }); 

        questionPageController.timerExpiredpage(quizSettings);
        scope.$root.$apply();

        mdDialog.show("The Allotted Quiz Time has Elapsed!!");
        expect(questionPageController.timerExpiredpage).toBeDefined();
        expect(questionPageController.timerString).toHaveBeenCalled();
        expect(scope.okButton).toEqual("View Results");

    }));

    // return string if minutes and seconds are greater than
    it("should return string if minutes and seconds are greater than 1.", ()=> {

        var minutes = 13;
        var seconds = 24;
        var result = questionPageController.timerString(minutes, seconds);
        expect(result).toEqual("13 Minutes 24 Seconds");

    });

    // return string if minutes and seconds are equal to 1
    it("should return string if minutes and seconds are equal to 1.", () => {

        var minutes = 1;
        var seconds = 1;
        var result = questionPageController.timerString(minutes, seconds);
        expect(result).toEqual("1 Minute 1 Second");
    });

    //return string if minute is 1 and seconds are greater than 1
    it("should return string if minute is 1 and seconds are greater than 1.", () => {

        var minutes = 1;
        var seconds = 24;
        var result = questionPageController.timerString(minutes, seconds);
        expect(result).toEqual("1 Minute 24 Seconds");
    });

    //return string if minutes are greater than 1 and second is 1
    it("should return string if minutes are greater than 1 and second is 1.", ()=> {

        var minutes = 10;
        var seconds = 0;
        var result = questionPageController.timerString(minutes, seconds);
        expect(result).toEqual("10 Minutes 0 Second");
    });


    //return string if minutes are greater than 1 and second is 1
    it("should get total allotted time for quiz if quiz is not resumed.", ()=> {

        var hasQuizResumed = false;
        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 804;

        spyOn(mockedEventService, 'getTotalAllottedTimeForQuiz').and.returnValue(defered.promise);
        defered.resolve(totalAllottedTime);

        spyOn(questionPageController, 'calculteSeconds');
        questionPageController.getTotalAllottedtimeToCompleteQuiz(hasQuizResumed);

        scope.$root.$apply();
        expect(questionPageController.getTotalAllottedtimeToCompleteQuiz).toBeDefined();
    });

    //return string if minutes are greater than 1 and second is 1
    it("should get total allotted time for quiz if quiz is resumed.", ()=> {

        var hasQuizResumed = true;

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 804;

        spyOn(mockedEventService, 'getTotalAllottedTimeForQuiz').and.returnValue(defered.promise);
        defered.resolve(totalAllottedTime);

        var summaryId = new Object();
        summaryId["result"] = 2;

       deferedCheckIfQuizIsResumed.resolve(summaryId);

        var usertimeTaken = new Object();
        usertimeTaken["result"] = 60;

        //spyOn(mockedEventService, 'getTotalTimeTakenByUser').and.returnValue(deferedUserTimeTaken.promise);
        deferedUserTimeTaken.resolve(usertimeTaken);

        spyOn(questionPageController, 'calculteSeconds');

        questionPageController.getTotalAllottedtimeToCompleteQuiz(hasQuizResumed);

        scope.$root.$apply();

        expect(scope.timeRemaining).toEqual(744);
        expect(scope.timeRemainingSeconds).toEqual(24);
        expect(scope.timeRemainingMinutes).toEqual(12);
        expect(scope.minutesString).toEqual("Minutes");
        expect(scope.secondsString).toEqual("Seconds");
        expect(questionPageController.calculteSeconds).toBeDefined();
        expect(questionPageController.getTotalAllottedtimeToCompleteQuiz).toBeDefined();
    });

    //return string if minutes are greater than 1 and second is 1
    it("should get total number of questions and bind it to UI.", ()=> {

        var totalNumberOfQuestions = new Object();
        var totalQuestion = 5;
        totalNumberOfQuestions["result"] = totalQuestion;
        defered.resolve(totalNumberOfQuestions);

        questionPageController.getTotalNumberOfQuestions();
        scope.$root.$apply();
        expect(questionPageController.getTotalNumberOfQuestions).toBeDefined();
        expect(scope.totalQuizQuestion).toEqual(5);
    });

    //return user time taken.
    it("should return user time taken.", ()=> {

        var response = new Object();
        response["millis"] = 4000;
        questionPageController.getUserTimeTakenAndStopeTimer();
        scope.$broadcast('timer-stop');
        scope.$broadcast('timer-stopped', response);

        expect(questionPageController.getUserTimeTakenAndStopeTimer).toBeDefined();
    });

    // bind questions details to UI
    it("should bind questions details to UI for single short answer questions.", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionIds"] = "4";
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionId"] = 944;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "";
        quizPageAndQuestionDetails["WriteSolutionInSpecificLocationMessage"] = "Write your answer.";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        spyOn(questionPageController, 'setTimervalue');

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        scope.quizSetting = settings;

        questionPageController.bindQuestionDetails(quizPageAndQuestionDetailsList);
        timeout.flush();
        expect(questionPageController.bindQuestionDetails).toBeDefined();
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(1);
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].shortAnswerMaxmarks).toEqual("3 Marks");
        expect(questionPageController.setTimervalue).toHaveBeenCalled();
    });

    // bind questions details to UI
    it("should bind questions details to UI for multiple short answer questions.", () =>{

        var quizPageAndQuestionDetailsList = [];
        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionIds"] = "4,5";
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "";

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        quizPageAndQuestionDetails["QuestionId"] = 5;
        quizPageAndQuestionDetails["QuestionIds"] = "4,5";
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/OU9CGFEQ2JI353P.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "";

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        spyOn(questionPageController, 'setTimervalue');

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        scope.quizSetting = settings;

        questionPageController.bindQuestionDetails(quizPageAndQuestionDetailsList);
        expect(questionPageController.bindQuestionDetails).toBeDefined();
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(2);
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].shortAnswerMaxmarks).toEqual("3 Marks");
    });

    // bind questions details to UI
    it("should bind questions details to UI for multiple choice questions.", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 6;
        quizPageAndQuestionDetails["QuestionIds"] = "6";
        quizPageAndQuestionDetails["QuestionNumber"] = 3;
        quizPageAndQuestionDetails["QuestionType"] = 1;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "A";
        quizPageAndQuestionDetails["PossibleAnswers"] = "ABCD";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 72;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        spyOn(questionPageController, 'setTimervalue');

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        scope.quizSetting = settings;

        questionPageController.bindQuestionDetails(quizPageAndQuestionDetailsList);
        timeout.flush();
        expect(questionPageController.bindQuestionDetails).toBeDefined();
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(4);
        expect(scope.multipleAnswerMaxMarks).toEqual("3 Marks");
        expect(questionPageController.setTimervalue).toHaveBeenCalled();

    });

    //apply Quizsettings
    it("should apply QuizSettings to scope.", ()=> {

        var quizSettings = new Object();
        quizSettings["Id"] = 7;
        quizSettings["HiddenCodeForQuiz"] = "yv2xdir3";
        quizSettings["Name"] = "VCAA Chemistry Section A Quiz ";
        quizSettings["DefaultWidthPx"] = 250;
        quizSettings["ExpiresDateTime"] = "19 - Sep - 2015";
        quizSettings["DueDateTime"] = "11 - Jul - 2014";
        quizSettings["AuthenticationType"] = 0;
        quizSettings["RequiredToCompleteGroupIds"] = "";
        quizSettings["ShowScoreBreakdown"] = true;
        quizSettings["ShowScoreAverages"] = true;
        quizSettings["ShowTimer"] = true;
        quizSettings["EnforceTimer"] = true;
        quizSettings["TimerUpdateFrequency"] = 1;
        quizSettings["ShowMaximumMarks"] = true;
        quizSettings["AttemptsAllowed"] = 2;
        quizSettings["ScoreSystem"] = 1;
        quizSettings["QuizBeingSavedAndPaused"] = false;
        quizSettings["QuizPausedQuestionId"] = 0;
        quizSettings["AvailableDateTime"] = "";
        quizSettings["AllowSaveAndComplete"] = true;
        quizSettings["ShowIntroductionPage"] = true;
        quizSettings["ShowResultsPage"] = true;
        quizSettings["PageMinHeightRatio"] = 0;
        quizSettings["OpeningMessageTitle"] = "Welcome to the TSFX Quiz Master";
        quizSettings["OpeningMessage"] = "The following quiz consists of <strong>4 questions</strong> and should be completed in <strong>13 minutes 24 seconds.</strong><br/><br/>You may complete this quiz multiple times, however, your relative rank will be determined using the score received in your first attempt.<br/><br/>||previousattempts||";
        quizSettings["OpeningMessageEnd"] = "The Quiz Master has been proudly developed by <strong>TSFX</strong></OpeningMessageEnd>";
        quizSettings["EndMessage"] = "Thank you for completing this Quiz";

        questionPageController.applyQuizSetings(quizSettings);
        expect(scope.quizName).toEqual("VCAA Chemistry Section A Quiz ");
        expect(scope.showTimerValue).toEqual(true);
        expect(scope.shortAnswerMaxMarksValue).toEqual(true);
        expect(scope.multipleAnswerMaxmarksValue).toEqual(false);
        expect(scope.saveAndCompleteLaterLinkValue).toEqual(true);
    });

    
    it("get question details and it should initialize data into QuizResultSummaryId,QuizCompilation,MappingQuizResultDetails.", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionIds"] = "4";
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionId"] = 944;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var quizResuleSummaryId = new Object();
        quizResuleSummaryId["result"] = 1;

        spyOn(mockedEventService, 'initializeQuizResultSummaryAndQuizCompilation').and.returnValue(defered.promise);
        defered.resolve(quizResuleSummaryId);

        deferedQuestions.resolve(quizPageAndQuestionDetailsList);

        spyOn(questionPageController, 'bindQuestionDetails');
        spyOn(questionPageController, 'calculteSeconds');
        spyOn(questionPageController, "checkForPreviousButton");
        questionPageController.getQuestionDetails();
        scope.$root.$apply();
        expect(questionPageController.getQuestionDetails).toBeDefined();
        expect(questionPageController.bindQuestionDetails).toHaveBeenCalled();
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();

    });

    it("get question details and it should not initialize data into QuizResultSummaryId,QuizCompilation,MappingQuizResultDetails.", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionIds"] = "4";
        quizPageAndQuestionDetails["QuestionNumber"] = 2;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionId"] = 944;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["NumberOfMarks"] = 3;
        quizPageAndQuestionDetails["TimeToAnswer"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        deferedQuestions.resolve(quizPageAndQuestionDetailsList);

        spyOn(questionPageController, 'bindQuestionDetails');
        spyOn(questionPageController, 'calculteSeconds');
        spyOn(questionPageController, "checkForPreviousButton");
        questionPageController.getQuestionDetails();
        scope.$root.$apply();
        expect(questionPageController.getQuestionDetails).toBeDefined();
        expect(questionPageController.bindQuestionDetails).toHaveBeenCalled();
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();

    });

    it("should set time remaining value.", ()=> {

        var settings = new Object();
        settings["TimerCountDown"] = 0;
        scope.quizSetting = settings;

        var timeAllotted = 40;
        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = timeAllotted;

        spyOn(mockedEventService, 'setAndGetRemainingtime').and.returnValue(defered.promise);
        defered.resolve(totalAllottedTime);

        questionPageController.calculteSeconds(2, 40, 0, false);
        scope.$root.$apply();

        expect(scope.timeRemaining).toEqual(40);
        expect(scope.timeRemainingSeconds).toEqual(40);
        expect(scope.timeRemainingMinutes).toEqual(0);
        expect(scope.recommendedMinutesString).toEqual("Minutes");
        expect(scope.recommendedSecondsString).toEqual("Seconds");
        expect(scope.minutesString).toEqual("Minutes");
        expect(scope.secondsString).toEqual("Seconds");
        expect(questionPageController.calculteSeconds).toBeDefined();
    });

  
    it("should set timer value and start interval for timer refresh on page changed.", ()=> {

        var xmlFileTotalAllottedTime = 300;
        scope.timeRemaining = 13;
        var settings = new Object();
        settings["TimerCountDown"] = 0;
        scope.quizSetting = settings;

        questionPageController.setTimervalue(xmlFileTotalAllottedTime);
        interval.flush(1000);
        expect(scope.recommendedTime).toEqual(xmlFileTotalAllottedTime);
        expect(scope.recommendedTimeSeconds).toEqual(0);
        expect(scope.recommendedTimeMinutes).toEqual(5);
        expect(scope.timeRemaining).toEqual(13);
    });

  
    it("should set timer value and start interval for timer refresh on second changed.", ()=> {

        var xmlFileTotalAllottedTime = 300;
        scope.timeRemaining = 13;
        var settings = new Object();
        settings["TimerCountDown"] = 2;
        scope.quizSetting = settings;

        questionPageController.setTimervalue(xmlFileTotalAllottedTime);
        interval.flush(1000);
        expect(scope.recommendedTime).toEqual(xmlFileTotalAllottedTime);
        expect(scope.recommendedTimeSeconds).toEqual(0);
        expect(scope.recommendedTimeMinutes).toEqual(5);
    });

   
    it("should set timer value and start interval for timer refresh on second changed.", ()=> {

        var xmlFileTotalAllottedTime = 300;
        scope.timeRemaining = 13;
        var settings = new Object();
        settings["TimerCountDown"] = 2;
        scope.quizSetting = settings;

        questionPageController.setTimervalue(xmlFileTotalAllottedTime);
        interval.flush(60000);
        expect(scope.recommendedTime).toEqual(xmlFileTotalAllottedTime);
        expect(scope.recommendedTimeSeconds).toEqual(0);
        expect(scope.recommendedTimeMinutes).toEqual(5);
        expect(scope.timeRemaining).toEqual(13);
    });

    //should redirect on self scoring-intro page
    it("should redirect on self scoring-intro page.", ()=> {

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = 2;

        var resultSummaryId = 2;

        spyOn(mockedEventService, 'getSelfScoringQuestionsCount').and.returnValue(defered.promise);
        defered.resolve(selfScoringQuestion);

        questionPageController.redirectResultPageorSelfscoring(resultSummaryId);

        scope.$root.$apply();
        expect(questionPageController.redirectResultPageorSelfscoring).toBeDefined();
        expect(scope.path).toEqual("/quiz-selfscoringintro/yv2xdir3/2/2/1");
    });

    //should redirect on Result page
    it("should redirect on Result page if self scoring questions are not available and Resultpage is to be shown.", ()=> {

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = "null";

        var settings = new Object();
        settings["ShowResultsPage"] = true;
        scope.quizSetting = settings;
      
        var resultSummaryId = 2;

        spyOn(mockedEventService, 'getSelfScoringQuestionsCount').and.returnValue(defered.promise);
        defered.resolve(selfScoringQuestion);

        questionPageController.redirectResultPageorSelfscoring(resultSummaryId);

        scope.$root.$apply();
        expect(questionPageController.redirectResultPageorSelfscoring).toBeDefined();
       
    });

    //should redirect on endMessage Page.
    it("should redirect on Result page if self scoring questions are not available and End-MessagePage is to be shown.", ()=> {

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = "null";

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        settings["ShowResultsPage"] = false;
        scope.quizSetting = settings;
      

        var resultSummaryId = 2;

        spyOn(mockedEventService, 'getSelfScoringQuestionsCount').and.returnValue(defered.promise);
        defered.resolve(selfScoringQuestion);

        questionPageController.redirectResultPageorSelfscoring(resultSummaryId);

        scope.$root.$apply();
        expect(questionPageController.redirectResultPageorSelfscoring).toBeDefined();
        expect(scope.path).toEqual("/quiz-endmessage/yv2xdir3");
    });

    //should load next question
    it("next button click and load next question page.", ()=> {

        var response = new Object();
        response["millis"] = 4000;

        var quizAnswersAndPage = new Object();

        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 2;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["shortAnswerQuestionNo"] = "a";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "ABCD";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["UserId"] = 1;

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizAnswersAndPage);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var nextQuizPage = new Object();
        nextQuizPage["result"] = quizPageQuestion;

        var userAnswersAndPageDetails = [];
        var userAnswersAndPage = new Object();

        userAnswersAndPage["HiddenCodeForQuiz"] = "yv2xdir3";
        userAnswersAndPage["QuestionNumber"] = 1;
        userAnswersAndPage["UserId"] = 1;
        userAnswersAndPage["QuestionId"] = "4";
        userAnswersAndPage["QuestionIds"] = "4";
        userAnswersAndPage["QuestionType"] = 2;
        userAnswersAndPage["UserAnswer"] = "ABCD";
        userAnswersAndPage["CorrectAnswer"] = "";
        userAnswersAndPage["AnsweredInTime"] = true;
        userAnswersAndPage["SaveAndcompleteLaterLink"] = "a";
        userAnswersAndPage["TimeTaken"] = 30;
        userAnswersAndPage["AnsweredInTime"] = true;

        userAnswersAndPageDetails.push(userAnswersAndPage);

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        settings["EnforceTimer"] = true;
        scope.quizSetting = settings;

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        spyOn(mockedEventService, 'getNextQuizPageOfQuiz').and.returnValue(defered.promise);
        defered.resolve(nextQuizPage);

        var totalAllottedTime = new Object();
        totalAllottedTime["result"] = 804;

        spyOn(mockedEventService, 'getTotalAllottedTimeForQuiz').and.returnValue(deferedValue.promise);
        deferedValue.resolve(totalAllottedTime);

        deferedCheckIfQuizIsResumed.resolve(quizResultSummaryId);

        var usertimeTaken = new Object();
        usertimeTaken["result"] = 60;

        deferedUserTimeTaken.resolve(usertimeTaken);

        spyOn(questionPageController, 'validateUserAnswers').and.callFake(()=> {
            return true;
        });

        spyOn(questionPageController, 'getUserTimeTakenAndStopeTimer').and.returnValue(defered.promise);
        defered.resolve(45);

        spyOn(questionPageController, 'redirectResultPageorSelfscoring');

        spyOn(questionPageController, 'returnUserAnswerDetails').and.callFake(()=> {
            return userAnswersAndPageDetails;
        });

        spyOn(questionPageController, 'calculteSeconds');

        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(questionPageController.validateUserAnswers).toHaveBeenCalled();
        expect(questionPageController.returnUserAnswerDetails).toHaveBeenCalled();;
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();
        expect(scope.path).toEqual("/quiz-question/yv2xdir3/2");
    });


    //should load next question
    it("next button click and redirect to self scoring intro page if timer is expired on short answer questions.", ()=> {

        var response = new Object();
        response["millis"] = 4000;

        var quizAnswersAndPage = new Object();

        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 2;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["shortAnswerQuestionNo"] = "a";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "ABCD";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["UserId"] = 1;

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizAnswersAndPage);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 2;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var nextQuizPage = new Object();
        nextQuizPage["result"] = quizPageQuestion;

        var userAnswersAndPageDetails = [];
        var userAnswersAndPage = new Object();

        userAnswersAndPage["HiddenCodeForQuiz"] = "yv2xdir3";
        userAnswersAndPage["QuestionNumber"] = 1;
        userAnswersAndPage["UserId"] = 1;
        userAnswersAndPage["QuestionId"] = "4";
        userAnswersAndPage["QuestionIds"] = "4";
        userAnswersAndPage["QuestionType"] = 2;
        userAnswersAndPage["UserAnswer"] = "ABCD";
        userAnswersAndPage["CorrectAnswer"] = "";
        userAnswersAndPage["AnsweredInTime"] = true;
        userAnswersAndPage["SaveAndcompleteLaterLink"] = "a";
        userAnswersAndPage["TimeTaken"] = 30;
        userAnswersAndPage["AnsweredInTime"] = false;

        userAnswersAndPageDetails.push(userAnswersAndPage);


        scope.isTimerExpiredPrompt = true;
        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        settings["EnforceTimer"] = true;
        scope.quizSetting = settings;

        spyOn(mockedEventService, 'getNextQuizPageOfQuiz').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(nextQuizPage);

        var resultSummaryId = new Object();
        resultSummaryId["result"] = 2;

        deferedCheckIfQuizIsResumed.resolve(resultSummaryId);

        spyOn(questionPageController, 'validateUserAnswers').and.callFake(()=> {
            return true;
        });

        spyOn(questionPageController, 'getUserTimeTakenAndStopeTimer').and.returnValue(defered.promise);
        defered.resolve(45);

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = 2;

        spyOn(mockedEventService, 'getSelfScoringQuestionsCount').and.returnValue(deferedSelfScoringQuestionCount.promise);
        deferedSelfScoringQuestionCount.resolve(selfScoringQuestion);

        spyOn(questionPageController, 'redirectResultPageorSelfscoring');

        spyOn(questionPageController, 'returnUserAnswerDetails').and.callFake(()=> {
            return userAnswersAndPageDetails;
        });

        spyOn(questionPageController, 'calculteSeconds');

        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(questionPageController.validateUserAnswers).toHaveBeenCalled();
        expect(questionPageController.returnUserAnswerDetails).toHaveBeenCalled();;
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();
        expect(scope.path).toEqual("/quiz-selfscoringintro/yv2xdir3/2/2/0");
    });

    //should redirect on Result page or self scoring-intro page
    it("next button click  and redirect on Result page or self scoring-intro page", ()=> {

        var response = new Object();
        response["millis"] = 4000;

        var quizAnswersAndPage = new Object();

        quizAnswersAndPage["hiddenCode"] = "yv2xdir3";
        quizAnswersAndPage["questionIds"] = "4";
        quizAnswersAndPage["questionType"] = 2;
        quizAnswersAndPage["questionNumber"] = 1;
        quizAnswersAndPage["imagePath"] = "http://localhost/forms/Data/AppWriteWebRead/Quiz/Images/CGNWE2VIWURBHB1.png";
        quizAnswersAndPage["shortAnswerQuestionNo"] = "a";
        quizAnswersAndPage["noOfAnswersRequired"] = "";
        quizAnswersAndPage["shortAnswerMaxmarks"] = 5;
        quizAnswersAndPage["CorrectAnswer"] = "";
        quizAnswersAndPage["userAnswer"] = "ABCD";
        quizAnswersAndPage["timeAllotted"] = 300;
        quizAnswersAndPage["UserId"] = 1;


        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizAnswersAndPage);

        var nextQuizPage = new Object();
        nextQuizPage["result"] = null;

        var userAnswersAndPageDetails = [];
        var userAnswersAndPage = new Object();

        userAnswersAndPage["HiddenCodeForQuiz"] = "yv2xdir3";
        userAnswersAndPage["QuestionNumber"] = 1;
        userAnswersAndPage["UserId"] = 1;
        userAnswersAndPage["QuestionId"] = "4";
        userAnswersAndPage["QuestionIds"] = "4";
        userAnswersAndPage["QuestionType"] = 2;
        userAnswersAndPage["UserAnswer"] = "ABCD";
        userAnswersAndPage["CorrectAnswer"] = "";
        userAnswersAndPage["AnsweredInTime"] = true;
        userAnswersAndPage["SaveAndcompleteLaterLink"] = "a";
        userAnswersAndPage["TimeTaken"] = 30;
        userAnswersAndPage["AnsweredInTime"] = true;

        userAnswersAndPageDetails.push(userAnswersAndPage);

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        scope.quizSetting = settings;

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = 2;

        spyOn(mockedEventService, 'getNextQuizPageOfQuiz').and.returnValue(defered.promise);
        defered.resolve(nextQuizPage);

        deferedCheckIfQuizIsResumed.resolve(selfScoringQuestion);

        spyOn(questionPageController, 'validateUserAnswers').and.returnValue(defered.promise);
        defered.resolve(true);

        spyOn(questionPageController, 'getUserTimeTakenAndStopeTimer').and.returnValue(defered.promise);
        defered.resolve(45);

        spyOn(questionPageController, 'redirectResultPageorSelfscoring');

        spyOn(questionPageController, 'returnUserAnswerDetails').and.callFake(()=> {
            return userAnswersAndPageDetails;
        });

        spyOn(questionPageController, 'calculteSeconds');

        scope.nextButton(quizPageAndQuestionDetailsList);
        scope.$root.$apply();
        expect(questionPageController.validateUserAnswers).toHaveBeenCalled();
        expect(questionPageController.returnUserAnswerDetails).toHaveBeenCalled();
        expect(questionPageController.redirectResultPageorSelfscoring).toHaveBeenCalled();
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();
    });

    //should redirect on previous question.
    it("should save user answer on click of previous button if user has attempted questions and redirect to previous question.", () =>{

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = 2;

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        scope.quizSetting = settings;

        var userAnswersAndPageDetails = [];
        var userAnswersAndPage = new Object();

        userAnswersAndPage["HiddenCodeForQuiz"] = "yv2xdir3";
        userAnswersAndPage["QuestionNumber"] = 2;
        userAnswersAndPage["UserId"] = 1;
        userAnswersAndPage["QuestionId"] = "4";
        userAnswersAndPage["QuestionIds"] = "4";
        userAnswersAndPage["QuestionType"] = 2;
        userAnswersAndPage["UserAnswer"] = "ABCD";
        userAnswersAndPage["CorrectAnswer"] = "";
        userAnswersAndPage["AnsweredInTime"] = true;
        userAnswersAndPage["SaveAndcompleteLaterLink"] = "a";
        userAnswersAndPage["TimeTaken"] = 30;

        userAnswersAndPageDetails.push(userAnswersAndPage);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 1;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var previousQuizpageDetails = new Object();
        previousQuizpageDetails["result"] = quizPageQuestion;

        spyOn(questionPageController, 'returnUserAnswerDetails').and.returnValue(defered.promise);
        defered.resolve(userAnswersAndPageDetails);

        spyOn(mockedEventService, 'getPreviousQuizPageOfQuiz').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(previousQuizpageDetails);

        var isAnswerSaved = new Object();
        isAnswerSaved["result"] = true;

        spyOn(mockedEventService, 'saveAnswersOfQuestions').and.returnValue(deferedSaveAnswer.promise);
        deferedSaveAnswer.resolve(isAnswerSaved);

        spyOn(questionPageController, 'calculteSeconds');

        deferedLocation.resolve("/quiz-question/yv2xdir3/1");

        scope.previousButton(userAnswersAndPageDetails);
        scope.$root.$apply();

        expect(scope.previousButton).toBeDefined();
        expect(questionPageController.returnUserAnswerDetails).toHaveBeenCalled();
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();
        expect(scope.path).toEqual("/quiz-question/yv2xdir3/1");
    });
    
   
    it("should prompt alert box if user answer is not saved in the database on click of previous button.", ()=> {

        var selfScoringQuestion = new Object();
        selfScoringQuestion["result"] = 2;

        var settings = new Object();
        settings["TimerUpdateFrequency"] = 0;
        scope.quizSetting = settings;

        var userAnswersAndPageDetails = [];
        var userAnswersAndPage = new Object();

        userAnswersAndPage["HiddenCodeForQuiz"] = "yv2xdir3";
        userAnswersAndPage["QuestionNumber"] = 2;
        userAnswersAndPage["UserId"] = 1;
        userAnswersAndPage["QuestionId"] = "4";
        userAnswersAndPage["QuestionIds"] = "4";
        userAnswersAndPage["QuestionType"] = 2;
        userAnswersAndPage["UserAnswer"] = "ABCD";
        userAnswersAndPage["CorrectAnswer"] = "";
        userAnswersAndPage["AnsweredInTime"] = true;
        userAnswersAndPage["SaveAndcompleteLaterLink"] = "a";
        userAnswersAndPage["TimeTaken"] = 30;

        userAnswersAndPageDetails.push(userAnswersAndPage);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 1;
        quizPageQuestion["QuestionIds"] = "5,6,7";

        var previousQuizpageDetails = new Object();
        previousQuizpageDetails["result"] = quizPageQuestion;

        spyOn(questionPageController, 'returnUserAnswerDetails').and.returnValue(defered.promise);
        defered.resolve(userAnswersAndPageDetails);

        spyOn(mockedEventService, 'getPreviousQuizPageOfQuiz').and.returnValue(deferedQuizPage.promise);
        deferedQuizPage.resolve(previousQuizpageDetails);

        var isAnswerSaved = new Object();
        isAnswerSaved["result"] = false;

        spyOn(mockedEventService, 'saveAnswersOfQuestions').and.returnValue(deferedSaveAnswer.promise);
        deferedSaveAnswer.resolve(isAnswerSaved);

        spyOn(questionPageController, 'calculteSeconds');

        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: ()=> { }
        });
        scope.previousButton(userAnswersAndPageDetails);
        scope.$root.$apply();

        expect(scope.previousButton).toBeDefined();
        expect(questionPageController.returnUserAnswerDetails).toHaveBeenCalled();
        expect(questionPageController.calculteSeconds).toHaveBeenCalled();

    });

   
    it("should hide previous button.", ()=> {

        var questionNo = new Object();
        questionNo["result"] = 1;
        scope.preRouteController = "IntroPageController";

        spyOn(mockedEventService, 'setValueOfFirstQuestionToHidePreviousButton').and.returnValue(defered.promise);
        defered.resolve(questionNo);

        questionPageController.checkForPreviousButton(1);
        scope.$root.$apply();
        expect(scope.previousButtonValue).toEqual(false);
    });

    
    it("should show previous button.", ()=> {

        var questionNo = new Object();
        questionNo["result"] = 1;
        scope.preRouteController = "IntroPageController";

        spyOn(mockedEventService, 'setValueOfFirstQuestionToHidePreviousButton').and.returnValue(defered.promise);
        defered.resolve(questionNo);

        questionPageController.checkForPreviousButton(2);
        scope.$root.$apply();
        expect(scope.previousButtonValue).toEqual(true);
    });


    function initializeTest() {
        questionPageController = $controllerConstructor('QuestionPageController', {
            $scope: scope,
            questionPageService: mockedEventService,
            $sce: sce,
            $mdDialog: mdDialog,
            $timeout: timeout,
            $location: location,
            prevRoutePromiseGetter: () => { return deferedPreviousRoute.promise; },
            $routeParams: { hiddenCode: "yv2xdir3", questionNumber: 1 }
        });
    }
   
}); 