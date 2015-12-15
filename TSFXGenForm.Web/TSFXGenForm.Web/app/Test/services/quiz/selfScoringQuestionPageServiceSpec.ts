describe("Quiz-selfScoringQuestionPageServiceSpec", () => {
    var httpBackend, _selfScoringQuestionPageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((selfScoringQuestionPageService, $httpBackend) => {
        httpBackend = $httpBackend;
        _selfScoringQuestionPageService = selfScoringQuestionPageService;
        hiddenCode = "yv2xdir3";
    }));
    //get name of the Quiz.
    it("should return Quiz Name.", ()=> {

        var quizName = new Object();
        quizName["result"] = "VCAA Chemistry Section A Quiz";

        httpBackend.expectGET(apiPaths.getCurrentQuizName + "?hiddenCode=" + hiddenCode).respond(quizName);
        _selfScoringQuestionPageService.getCurrentQuizName(hiddenCode).then((data) =>{
            expect(data).not.toBeNull();
        });
        httpBackend.flush();
    });

    //Get question details
    it("should return single Quiz Question", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 29;
        quizPageAndQuestionDetails["QuestionIds"] = "29";
        quizPageAndQuestionDetails["QuestionNumber"] = 2;
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
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>abcd</p>";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["QuestionImageName"] = "KI2OKKTLJWB1Q3O";
        quizPageAndQuestionDetails["SolutionImageName"] = "CM2AECMO5GE4SWY";


        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var quizPageAndQuestionAndResultDetails = new Object();
        quizPageAndQuestionAndResultDetails["result"] = quizPageAndQuestionDetailsList;

        var userId = 1;
        var quizQuestionNo = 1;
        httpBackend.expectGET(apiPaths.getQuestionForSelfScoringQuestionPage + "?hiddenCode=" + hiddenCode + "&quizQuestionNo=" + quizQuestionNo + "&userId=" + userId).respond(quizPageAndQuestionAndResultDetails);
        _selfScoringQuestionPageService.getQuestionForSelfScoringQuestionPage(hiddenCode, userId, quizQuestionNo).then((data) =>{

            expect(data).not.toBeNull();
            expect(data.result[0].UserAnswer).not.toBeNull();
            expect(data.result[0].QuestionNumber).not.toBeNull();
            expect(data.result[0].QuestionImagePath).not.toBeNull();
            expect(data.result[0].SolutionImagePath).not.toBeNull();
        });
        httpBackend.flush();
    });

    //Get question details fro multiple short answer questions.
    it("should return list of Question", () =>{
        var quizPageAndQuestionDetailsList = [];

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 30;
        quizPageAndQuestionDetails["QuestionIds"] = "30,31,32";
        quizPageAndQuestionDetails["QuestionNumber"] = 3;
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
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>abcd</p>";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["QuestionImageName"] = "KI2OKKTLJWB1Q3O";
        quizPageAndQuestionDetails["SolutionImageName"] = "CM2AECMO5GE4SWY";

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 31;
        quizPageAndQuestionDetails["QuestionIds"] = "30,31,32";
        quizPageAndQuestionDetails["QuestionNumber"] = 2;
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
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//W357HOO0A1N35EY.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//7X2CGAST1RUG25O.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>PQRS</p>";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["QuestionImageName"] = "W357HOO0A1N35EY";
        quizPageAndQuestionDetails["SolutionImageName"] = "7X2CGAST1RUG25O";

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["QuestionId"] = 32;
        quizPageAndQuestionDetails["QuestionIds"] = "30,31,32";
        quizPageAndQuestionDetails["QuestionNumber"] = 2;
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
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//BNZEMHH999JDEN3.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/forms/Data/AppWriteWebRead//Quiz/Images//RJJMMOA6TQF8OAH.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>WXYz</p>";
        quizPageAndQuestionDetails["AnsweredInTime"] = "";
        quizPageAndQuestionDetails["Score"] = 0;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetails["QuestionImageName"] = "BNZEMHH999JDEN3";
        quizPageAndQuestionDetails["SolutionImageName"] = "RJJMMOA6TQF8OAH";

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);


        var response = new Object();
        response["result"] = quizPageAndQuestionDetailsList;

        httpBackend.expectGET(apiPaths.getQuestionForSelfScoringQuestionPage + "?hiddenCode=" + hiddenCode).respond(response);
        _selfScoringQuestionPageService.getQuestionForSelfScoringQuestionPage(hiddenCode).then((data) =>{

            var length = data.result.length;
            expect(data).not.toBeNull();
            expect(data.result.length).toEqual(3);
            for (var i = 0; i < length; i++) {
                expect(data.result[i].UserAnswer).not.toBeNull();
                expect(data.result[i].QuestionNumber).not.toBeNull();
                expect(data.result[i].QuestionImagePath).not.toBeNull();
                expect(data.result[i].SolutionImagePath).not.toBeNull();
            }
        });
        httpBackend.flush();
    });

    //Get next page details
    it("should return next Quiz Page details.", ()=> {

        var quizPageAndQuestionDetails = new Object();

        quizPageAndQuestionDetails["HiddenCodeForQuiz"] = "yv2xdir3";
        quizPageAndQuestionDetails["questionId"] = 29;
        quizPageAndQuestionDetails["QuestionNumber"] = 4;
        quizPageAndQuestionDetails["shortAnswerQuestionNo"] = "a";
        quizPageAndQuestionDetails["correctAnswer"] = "";
        quizPageAndQuestionDetails["maxScore"] = 3;
        quizPageAndQuestionDetails["userId"] = 300;
        quizPageAndQuestionDetails["questionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//943.png";
        quizPageAndQuestionDetails["solutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//944.png";
        quizPageAndQuestionDetails["maxArray"] = "0,1,2,3";
        quizPageAndQuestionDetails["userAnswer"] = "<p>Hydrochloric acid</p>\n";
        quizPageAndQuestionDetails["score"] = 2;

        var quizPageAndQuestionDetailsList = [];

        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);

        var quetionId = [];
        quetionId.push(2, 4, 6, 18);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 5;
        quizPageQuestion["QuestionIds"] = quetionId;

        var nextQuizpageDetails = new Object();
        nextQuizpageDetails["result"] = quizPageQuestion;

        httpBackend.expectPOST(apiPaths.getNextQuizPageOfSelfScoringQuestion).respond(nextQuizpageDetails);
        _selfScoringQuestionPageService.getNextQuizPageOfSelfScoringQuestion(quizPageAndQuestionDetailsList).then((data) =>{

            expect(data).not.toBeNull();
            expect(data.QuestionNumber).not.toBeNull();
            expect(data.HiddenCodeForQuiz).not.toBeNull();

        });
        httpBackend.flush();
    });

    //Get next page details
    it("should return previous Quiz Page details.", () =>{

        var quetionId = [];
        quetionId.push(6, 18);

        var quizPageQuestion = new Object();
        quizPageQuestion["QuestionNumber"] = 3;
        quizPageQuestion["QuestionIds"] = quetionId;

        var previousQuizpageDetails = new Object();
        previousQuizpageDetails["result"] = quizPageQuestion;

        var quizQuestionNo = 4;
        httpBackend.expectGET(apiPaths.getPreviousQuizPageOfSelfScoringQuestion + "?hiddenCode=" + hiddenCode + "&quizQuestionNo=" + quizQuestionNo).respond(previousQuizpageDetails);
        _selfScoringQuestionPageService.getPreviousQuizPageOfSelfScoringQuestion(hiddenCode, quizQuestionNo).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.PageNo).not.toBeNull();

        });
        httpBackend.flush();
    });

    //test case to check for the existence of PageType 6.

    //get total number of short answer quiz questions.
    it("should return total count of self scoring questions.", ()=> {

        var selfScoringQuestionCount = new Object();
        selfScoringQuestionCount["result"] = 2;
        var resultSummaryId = 1;

        httpBackend.expectGET(apiPaths.getSelfScoringQuestionsCount + "?hiddenCode=" + hiddenCode + "&quizResultSummaryId=" + resultSummaryId).respond(selfScoringQuestionCount);
        _selfScoringQuestionPageService.getSelfScoringQuestionsCount(hiddenCode, resultSummaryId).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();

    });

    //get total number of short answer quiz questions.
    it("should check whether user has paused the quiz or not.", ()=> {

        var quizResultSummaryId = new Object();
        quizResultSummaryId["result"] = 2;

        httpBackend.expectGET(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser).respond(quizResultSummaryId);
        _selfScoringQuestionPageService.checkIfQuizQuestionPageIsSaveAndPausedByUser().then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();

    });

    //set timer value in the static variable.
    it("should set question no to check whether the hide previous button or not.", () =>{

        var response = new Object();
        response["result"] = 1;

        var questionNo = 1;
        var setValue = true;

        httpBackend.expectGET(apiPaths.setValueOfFirstQuestionToHidePreviousButton + "?questionNo=" + questionNo + "&setValue=" + setValue).respond(response);
        _selfScoringQuestionPageService.setValueOfFirstQuestionToHidePreviousButton(questionNo, setValue).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(1);
        });
        httpBackend.flush();

    });

    //Get timer value in the static variable.
    it("should get question no to check whether the hide previous button or not.", () =>{

        var response = new Object();
        response["result"] = 1;

        var questionNo = 1;
        var setValue = false;

        httpBackend.expectGET(apiPaths.setValueOfFirstQuestionToHidePreviousButton + "?questionNo=" + questionNo + "&setValue=" + setValue).respond(response);
        _selfScoringQuestionPageService.setValueOfFirstQuestionToHidePreviousButton(questionNo, setValue).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(1);
        });
        httpBackend.flush();

    });

}) 