describe("Quiz-answerDrillPageServiceSpec", function () {
    var httpBackend, _answerDrillPageService, hiddenCode;
    beforeEach(angular.mock.module("app"));
    beforeEach(inject(function (answerDrillPageService, $httpBackend) {
        httpBackend = $httpBackend;
        _answerDrillPageService = answerDrillPageService;
        hiddenCode = "yv2xdir3";
    }));
    //get name of the Quiz.
    it("should return Quiz Name.", function () {
        var quizName = new Object();
        quizName["result"] = "VCAA Chemistry Section A Quiz";
        httpBackend.expectGET(apiPaths.getCurrentQuizName + "?hiddenCode=" + hiddenCode).respond(quizName);
        _answerDrillPageService.getCurrentQuizName(hiddenCode).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.result).toEqual('VCAA Chemistry Section A Quiz');
        });
        httpBackend.flush();
    });
    //get total number of quiz questions.
    it("should return total number of quiz questions.", function () {
        var response = new Object();
        response["totalQuizQuestion"] = 4;
        var totalQuizQuestion = new Object();
        totalQuizQuestion["result"] = 4;
        httpBackend.expectGET(apiPaths.getTotalNumberOfQuestions + "?hiddenCode=" + hiddenCode).respond(totalQuizQuestion);
        _answerDrillPageService.getTotalNumberOfQuestions(hiddenCode).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(4);
        });
        httpBackend.flush();
    });
    //get QuizQuestion for QuestionType 2 based on questionId passed from URL.
    it("should return QuizQuestion QuestionType 2 i.e. short answer questions.", function () {
        var quizQuestionAndResultDeatils = new Object();
        var quizPageAndQuestionDetailsList = [];
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
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        quizPageAndQuestionDetails = new Object();
        quizPageAndQuestionDetails["QuestionId"] = 16;
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
        quizPageAndQuestionDetails["MaxScore"] = 2;
        quizPageAndQuestionDetails["TimeAllotted"] = 300;
        quizPageAndQuestionDetails["RecommendedTime"] = 0;
        quizPageAndQuestionDetails["TimeRemaining"] = 0;
        quizPageAndQuestionDetails["SolutionImageRequiredScaling"] = 1;
        quizPageAndQuestionDetails["QuestionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//KI2OKKTLJWB1Q3O.png";
        quizPageAndQuestionDetails["SolutionImagePath"] = "http://localhost/EventData/Quiz/QuestionAndSolutionImages//CM2AECMO5GE4SWY.png";
        quizPageAndQuestionDetails["QuizResultSummaryId"] = 0;
        quizPageAndQuestionDetails["UserId"] = 1;
        quizPageAndQuestionDetails["UserAnswer"] = "<p>Acid</p>\n";
        quizPageAndQuestionDetails["AnsweredInTime"] = true;
        quizPageAndQuestionDetails["Score"] = 3;
        quizPageAndQuestionDetails["TimeTaken"] = "45";
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        quizQuestionAndResultDeatils["result"] = quizPageAndQuestionDetailsList;
        var quizQuestionNo = 4;
        var quizResultSummaryId = 2;
        var userId = 1;
        httpBackend.expectGET(apiPaths.getQuestionAndAnswerDetailsForAnswerDrillResultPage + "?hiddenCode=" + hiddenCode + "&quizQuestionNo=" + quizQuestionNo + "&quizResultSummaryId=" + quizResultSummaryId + "&userId=" + userId).respond(quizQuestionAndResultDeatils);
        _answerDrillPageService.getQuestionAndAnswerDetailsForAnswerDrillResultPage(hiddenCode, quizQuestionNo, userId, quizResultSummaryId).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.QuestionId).not.toBeNull();
            expect(data.QuestionType).not.toBeNull();
            expect(data.QuestionNumber).not.toBeNull();
            expect(data.MaxScore).not.toBeNull();
            expect(data.TimeAllotted).not.toBeNull();
            expect(data.QuestionImagePath).not.toBeNull();
            expect(data.SolutionImagePath).not.toBeNull();
        });
        httpBackend.flush();
    });
    //get QuizQuestion for QuestionType 1 based on questionId passed from URL.
    it("should return QuizQuestion for QuestionType 1 i.e. multiple choice answers.", function () {
        var quizPageAndQuestionDetailsList = [];
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
        quizPageAndQuestionDetailsList.push(quizPageAndQuestionDetails);
        var questionAndResultDetials = new Object();
        questionAndResultDetials["result"] = quizPageAndQuestionDetailsList;
        var quizQuestionNo = 4;
        var quizResultSummaryId = 2;
        var userId = 1;
        httpBackend.expectGET(apiPaths.getQuestionAndAnswerDetailsForAnswerDrillResultPage + "?hiddenCode=" + hiddenCode + "&quizQuestionNo=" + quizQuestionNo + "&quizResultSummaryId=" + quizResultSummaryId + "&userId=" + userId).respond(questionAndResultDetials);
        _answerDrillPageService.getQuestionAndAnswerDetailsForAnswerDrillResultPage(hiddenCode, quizQuestionNo, userId, quizResultSummaryId).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.QuestionId).not.toBeNull();
            expect(data.QuestionType).not.toBeNull();
            expect(data.QuestionNumber).not.toBeNull();
            expect(data.MaxScore).not.toBeNull();
            expect(data.TimeAllotted).not.toBeNull();
            expect(data.QuestionImagePath).not.toBeNull();
            expect(data.SolutionImagePath).not.toBeNull();
        });
        httpBackend.flush();
    });
});
//# sourceMappingURL=answerDrillPageServiceSpec.js.map