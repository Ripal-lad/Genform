describe('Quiz-answerDrillPageControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        $qservice,
        answerDrillPageController,
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
        answerDrillPageService
       ) => {

        sce = $sce;
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = answerDrillPageService;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $q.defer();
        deferedDetailsofIntroPage = $q.defer();
        deferedQuestionDetails = $q.defer();
        deferedValue = $q.defer();
        
        spyOn(mockedEventService, 'getQuestionAndAnswerDetailsForAnswerDrillResultPage').and.returnValue(deferedQuestionDetails.promise);
        spyOn(mockedEventService, 'getTotalNumberOfQuestions').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'getCurrentQuizName').and.returnValue(defered.promise);

        //Initialize fixture
        initializeTest();
    }));

    //setup controller.
    it('Should setup controller scope', ()=> {
        expect(scope).toBeDefined();
        expect(scope.resultPage).toBeDefined();
    });


    //bind total number of Questions.
    it('Should bind total number of questions detail to UI.', inject(()=>    {

        var totalQuizQuestion = new Object();
        totalQuizQuestion["result"] = 4;

        answerDrillPageController.getTotalNumberOfQuestions();

        defered.resolve(totalQuizQuestion);
        scope.$root.$apply();

        expect(scope.totalQuizQuestion).toEqual(4);

    }));

    //Bind quizName.
    it('Should bind QuizName .', inject(() =>{

        var response = new Object();
        response["result"] = "VCAA Chemistry Section A Quiz";

        defered.resolve(response);

        answerDrillPageController.getCurrentQuizName();
        scope.$root.$apply();

        expect(response).not.toBeNull();
        expect(scope.quizName).toEqual("VCAA Chemistry Section A Quiz");

    }));

    //bind quetsions and answers and score.
    it('Should bind questions detail to UI for short answer questions.', inject(() =>{

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["NumberOfMarks"] = 7;
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/5FCD6LGGVL3N08K.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/G776982WCA4G2IN.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = true;
        quizPageAndQuestionDetails["Score"] = 4;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var questionAndResultDetails = new Object();
        questionAndResultDetails["result"] = quizPageAndQuestionDetailsList;

        spyOn(answerDrillPageController, "bindUserScoretoUi");

        answerDrillPageController.getQuestionAndAnswerDetailsAndBindItToUi();

        deferedQuestionDetails.resolve(questionAndResultDetails);
        scope.$root.$apply();

        expect(answerDrillPageController.bindUserScoretoUi).toHaveBeenCalled();
        expect(scope.shortAnswerValue).toEqual(true);
        expect(scope.solutionImageValue).toEqual(true);
        expect(scope.audioVideoValue).toEqual(false);
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(1);
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].questionImagePath).toEqual("http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/5FCD6LGGVL3N08K.png");
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].solutionImagePath).toEqual("http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/G776982WCA4G2IN.png");


    }));


    //bind quetsions and answers and score.
    it('Should bind questions detail to UI for multiple choice questions.', inject(()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 1;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = 1;
        quizPageAndQuestionDetails["NumberOfMarks"] = 7;
        quizPageAndQuestionDetails["CorrectAnswer"] = "A";
        quizPageAndQuestionDetails["PossibleAnswers"] = "ABCD";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/5FCD6LGGVL3N08K.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/G776982WCA4G2IN.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = true;
        quizPageAndQuestionDetails["Score"] = 4;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var questionAndResultDetails = new Object();
        questionAndResultDetails["result"] = quizPageAndQuestionDetailsList;

        spyOn(answerDrillPageController, "bindUserScoretoUi");

        answerDrillPageController.getQuestionAndAnswerDetailsAndBindItToUi();

        deferedQuestionDetails.resolve(questionAndResultDetails);
        scope.$root.$apply();

        expect(answerDrillPageController.bindUserScoretoUi).toHaveBeenCalled();
        expect(scope.shortAnswerValue).toEqual(false);
        expect(scope.solutionImageValue).toEqual(true);
        expect(scope.audioVideoValue).toEqual(false);
        expect(scope.multipleChoiceAnswerQuestion.length).toEqual(4);
        expect(scope.questionImagePath).toEqual("http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/5FCD6LGGVL3N08K.png");
        expect(scope.solutionImagePath).toEqual("http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/G776982WCA4G2IN.png");

    }));


    //bind quetsions and answers and score.
    it('Should bind questions detail to UI and JwPlayer if solution contains audio/video.', inject(()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 7373;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = 1;
        quizPageAndQuestionDetails["NumberOfMarks"] = 7;
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["PossibleAnswers"] = "ABCD";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/5FCD6LGGVL3N08K.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/G776982WCA4G2IN.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = true;
        quizPageAndQuestionDetails["Score"] = 4;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["URL"] = "https://www.youtube.com/watch?v=dMH0bHeiRNg";
        quizPageAndQuestionDetails["Title"] = "What is skin? The layers of human skin";
        quizPageAndQuestionDetails["AudioVideoImagePath"] = { path: "http://www.youtube.com/watch?v=dMH0bHeiRNg" };

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var questionAndResultDetails = new Object();
        questionAndResultDetails["result"] = quizPageAndQuestionDetailsList;

        spyOn(answerDrillPageController, "bindUserScoretoUi");

        answerDrillPageController.getQuestionAndAnswerDetailsAndBindItToUi();

        deferedQuestionDetails.resolve(questionAndResultDetails);
        scope.$root.$apply();

        expect(answerDrillPageController.bindUserScoretoUi).toHaveBeenCalled();
        expect(scope.shortAnswerValue).toEqual(true);
        expect(scope.solutionImageValue).toEqual(false);
        expect(scope.audioVideoValue).toEqual(true);
        expect(scope.shortAndMultipleChoiceAnswerQuestion.length).toEqual(1);
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].questionImagePath).toEqual("http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/5FCD6LGGVL3N08K.png");
        expect(scope.shortAndMultipleChoiceAnswerQuestion[0].solutionImagePath).toEqual("http://localhost/forms/Data/AppWriteWebRead\Quiz/Images/G776982WCA4G2IN.png");

    }));

    //bind user score and user answer.
    it('Should bind QuizResult detail to UI if user has answered the question in time.', inject(()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["NumberOfMarks"] = 7;
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = true;
        quizPageAndQuestionDetails["Score"] = 4;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        answerDrillPageController.bindUserScoretoUi(quizPageAndQuestionDetails);
        scope.$root.$apply();

        expect(scope.userScore).toEqual(4);
        expect(scope.maxScore).toEqual(7);
        expect(scope.userScoreToolTip).toEqual("4 marks");
        expect(scope.maxScore).toEqual(7);
        expect(scope.userAnswer).toEqual("<p>Hydrochloric acid</p>\n");
        expect(scope.timerExpiredValue).toEqual(false);
        expect(scope.scoreGivenValue).toEqual(true);

    }));

    //bind user score and user answer.
    it('Should bind QuizResult detail to UI if user has answered the question after timer got expired.', inject(()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["NumberOfMarks"] = 7;
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = false;
        quizPageAndQuestionDetails["Score"] = 4;
        quizPageAndQuestionDetails["TimeTaken"] = "45";

        answerDrillPageController.bindUserScoretoUi(quizPageAndQuestionDetails);
        scope.$root.$apply();

        expect(scope.userScore).toEqual(4);
        expect(scope.maxScore).toEqual(7);
        expect(scope.userScoreToolTip).toEqual("4 marks");
        expect(scope.maxScore).toEqual(7);
        expect(scope.userAnswer).toEqual("<p>Hydrochloric acid</p>\n");
        expect(scope.timerExpiredValue).toEqual(true);
        expect(scope.scoreGivenValue).toEqual(false);
        expect(scope.multipleChoiceToolTip).toEqual(false);
        expect(scope.shortAnswerToolTip).toEqual(true);

    }));

    //bind user score and user answer.
    it('Should bind QuizResult detail to UI if user has not attempted the question after timer got expired.', inject(function () {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 4;
        quizPageAndQuestionDetails["QuestionNumber"] = 1;
        quizPageAndQuestionDetails["QuestionType"] = 2;
        quizPageAndQuestionDetails["SolutionMediaResourceId"] = 0;
        quizPageAndQuestionDetails["SolutionMediaTitle"] = "";
        quizPageAndQuestionDetails["NoOfAnswersRequired"] = "";
        quizPageAndQuestionDetails["NumberOfMarks"] = 7;
        quizPageAndQuestionDetails["CorrectAnswer"] = "";
        quizPageAndQuestionDetails["ImageWidthPx"] = 0;
        quizPageAndQuestionDetails["ImageHeightPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageWidthPx"] = 0;
        quizPageAndQuestionDetails["SolutionImageHeightPx"] = 0;
        quizPageAndQuestionDetails["MaxScore"] = 3;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 0;
        quizPageAndQuestionDetails["UserAnswer"] = null;
        quizPageAndQuestionDetails["AnsweredInTime"] = false;
        quizPageAndQuestionDetails["Score"] = null;
        quizPageAndQuestionDetails["TimeTaken"] = null;

        answerDrillPageController.bindUserScoretoUi(quizPageAndQuestionDetails);
        scope.$root.$apply();

        expect(scope.userScore).toEqual(0);
        expect(scope.maxScore).toEqual(7);
        expect(scope.userScoreToolTip).toEqual("7 mark");
        expect(scope.maxScore).toEqual(7);
        expect(scope.timerExpiredValue).toEqual(false);
        expect(scope.scoreGivenValue).toEqual(false);
        expect(scope.multipleChoiceToolTip).toEqual(false);
        expect(scope.shortAnswerToolTip).toEqual(true);
        expect(scope.notAttemptedQuestionImage).toEqual(true);

    }));

    function initializeTest() {
        answerDrillPageController = $controllerConstructor('AnswerDrillPageController', {
            $scope: scope,
            answerDrillPageService: mockedEventService,
            $sce: sce,
            $mdDialog: mdDialog,
            $routeParams: { hiddenCode: 'yv2xdir3' }
        });
    }
})