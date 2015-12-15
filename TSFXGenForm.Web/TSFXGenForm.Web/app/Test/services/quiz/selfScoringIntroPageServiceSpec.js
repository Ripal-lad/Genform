describe("Quiz-selfScoringIntroPageServiceSpec", function () {
    var httpBackend, _selfScoringIntroPageService, hiddenCode;
    beforeEach(angular.mock.module("app"));
    beforeEach(inject(function (selfScoringIntroPageService, $httpBackend) {
        httpBackend = $httpBackend;
        _selfScoringIntroPageService = selfScoringIntroPageService;
        hiddenCode = "yv2xdir3";
    }));
    //get name of the Quiz.
    it("should return Quiz Name.", function () {
        var quizName = new Object();
        quizName["result"] = "VCAA Chemistry Section A Quiz";
        httpBackend.expectGET(apiPaths.getCurrentQuizName + "?hiddenCode=" + hiddenCode).respond(quizName);
        _selfScoringIntroPageService.getCurrentQuizName(hiddenCode).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.result).toEqual('VCAA Chemistry Section A Quiz');
        });
        httpBackend.flush();
    });
    //get total time taken by user to complete quiz.
    it("should return total time taken by user to complete quiz.", function () {
        var totalTimeTaken = new Object();
        totalTimeTaken["result"] = 300;
        httpBackend.expectGET(apiPaths.getTotalTimeTakenByUser + "?hiddenCode=" + hiddenCode).respond(totalTimeTaken);
        _selfScoringIntroPageService.getTotalTimeTakenByUser(hiddenCode).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(300);
        });
        httpBackend.flush();
    });
    //get question number for selfscoring questionpPage
    it("should return question number for selfscoring questionpPage.", function () {
        var selfScoringPageNo = new Object();
        selfScoringPageNo["result"] = 2;
        var userId = 1;
        httpBackend.expectGET(apiPaths.getFirstSelfScoringQuestionNo + "?hiddenCode=" + hiddenCode + "&userId=" + userId).respond(selfScoringPageNo);
        _selfScoringIntroPageService.getFirstSelfScoringQuestionNo(hiddenCode, userId).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.result).toEqual(2);
        });
        httpBackend.flush();
    });
});
//# sourceMappingURL=selfScoringIntroPageServiceSpec.js.map