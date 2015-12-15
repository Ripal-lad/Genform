describe("Quiz-savedAndPausedPageServiceSpec", () => {
    var httpBackend, _savedAndPausedPageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((savedAndPausedPageService, $httpBackend) => {
        httpBackend = $httpBackend;
        _savedAndPausedPageService = savedAndPausedPageService;
        hiddenCode = "yv2xdir3";
    }));

    //Get name of the Quiz.
    it("should return Quiz Name.", ()=> {

        var quizName = new Object();
        quizName["result"] = "VCAA Chemistry Section A Quiz";

        httpBackend.expectGET(apiPaths.getCurrentQuizName + "?hiddenCode=" + hiddenCode).respond(quizName);
        _savedAndPausedPageService.getCurrentQuizName(hiddenCode).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual('VCAA Chemistry Section A Quiz');
        });
        httpBackend.flush();
    });

    //get total time taken by user to complete quiz.
    it("should return total time taken by user to complete quiz.", ()=> {

        var totalTimeTaken = new Object();
        totalTimeTaken["result"] = 450;

        httpBackend.expectGET(apiPaths.getTotalTimeTakenByUser + "?hiddenCode=" + hiddenCode).respond(totalTimeTaken);
        _savedAndPausedPageService.getTotalTimeTakenByUser(hiddenCode).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(450);
        });
        httpBackend.flush();
    });

    //get total time taken by user to complete quiz.
    it("should return total allotted time to complete quiz.", () =>{

        var response = new Object();
        response["result"] = 804;

        httpBackend.expectGET(apiPaths.getTotalAllottedTimeForQuiz + "?hiddenCode=" + hiddenCode).respond(response);
        _savedAndPausedPageService.getTotalAllottedTimeForQuiz(hiddenCode).then((data) =>{
            expect(data).not.toBeNull();
            expect(data.result).toEqual(804);
        });
        httpBackend.flush();
    });
}) 