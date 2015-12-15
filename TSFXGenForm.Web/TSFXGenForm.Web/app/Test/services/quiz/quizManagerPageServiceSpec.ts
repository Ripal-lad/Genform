describe("quizManagerPageServiceSpec", () => {
    var httpBackend, _quizManagerPageService, hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((quizManagerPageService, $httpBackend) => {
        httpBackend = $httpBackend;
        _quizManagerPageService = quizManagerPageService;
        hiddenCode = "wmbhwquq";
    }));

    it("should return QuizManagerPage details if user has attempted multiple quiz earlier.", ()=> {

        var quizManager = [];
        var quizManagerDetailList = new Object();

        var quizManagerDetail = new Object();
        quizManagerDetail["QuizTitle"] = "VCAA Chemistry Section A Quiz";
        quizManagerDetail["DueDate"] = "11 Jul 2014  12:00 AM";
        quizManagerDetail["EndDate"] = "25 Mar 2015  11:00 AM";
        quizManagerDetail["Score"] = "10%";
        quizManagerDetail["RelativeRankValue"] = "100%";
        quizManagerDetail["FormId"] = 245;
        quizManagerDetail["StartDate"] = "2015-03-25T10:59:24";

        quizManager.push(quizManagerDetail);

        //insert data if user has started Quiz but not completed.
        quizManagerDetail = new Object();
        quizManagerDetail["QuizTitle"] = "VCAA Chemistry Section A Quiz";
        quizManagerDetail["DueDate"] = "11 Jul 2014  12:00 AM";
        quizManagerDetail["EndDate"] = null;
        quizManagerDetail["Score"] = "10%";
        quizManagerDetail["RelativeRankValue"] = "100%";
        quizManagerDetail["FormId"] = 245;
        quizManagerDetail["StartDate"] = "2015-03-25T10:59:24";

        quizManager.push(quizManagerDetail);
        quizManagerDetailList["result"] = quizManager;

        var userId = 1;
        httpBackend.expectGET(apiPaths.getQuizDetailListForQuizManagerPage + "?hiddenCode=" + hiddenCode + "&userId=" + userId).respond(quizManagerDetailList);
        _quizManagerPageService.getQuizDetailListForQuizManagerPage(hiddenCode, userId).then((data) =>{

            expect(data).not.toBeNull();
            expect(data.result[0].StartDate).not.toBeNull();
            expect(data.result[0].EndDate).not.toBeNull();
            expect(data.result[1].StartDate).not.toBeNull();
            expect(data.result[1].EndDate).toBeNull();
            expect(data.result[0].QuizTitle).toEqual('VCAA Chemistry Section A Quiz');
        });
        httpBackend.flush();

    });

    //get  quizManagerPage details if user has not given any of the quiz earlier
    it("should return QuizManagerPage details if user has not given any of the quiz yet.", ()=> {

        var quizManager = [];
        var quizManagerDetailList = new Object();

        var response = new Object();
        response["QuizTitle"] = "VCAA Chemistry Section A Quiz";
        response["DueDate"] = "11 Jul 2014  12:00 AM";;
        response["EndDate"] = null;
        response["Score"] = null;
        response["RelativeRankValue"] = null;
        response["HiddenCodeForQuiz"] = "yv2xdir3";
        response["StartDate"] = null;

        quizManager.push(response);
        quizManagerDetailList["result"] = quizManager;

        var userId = 1;

        httpBackend.expectGET(apiPaths.getQuizDetailListForQuizManagerPage + "?hiddenCode=" + hiddenCode + "&userId=" + userId).respond(quizManagerDetailList);
        _quizManagerPageService.getQuizDetailListForQuizManagerPage(hiddenCode, userId).then((data)=> {

            expect(data).not.toBeNull();
            expect(data.result[0].StartDate).toBeNull();
            expect(data.result[0].EndDate).toBeNull();
            expect(data.result[0].QuizTitle).toEqual('VCAA Chemistry Section A Quiz');
        });
        httpBackend.flush();

    });
   
})