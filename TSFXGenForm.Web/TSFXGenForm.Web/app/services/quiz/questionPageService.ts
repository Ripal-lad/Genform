// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IquestionPageService {
    getQuizSettingDetails: (hiddenCode) => ng.IPromise<any>;
    initializeQuizResultSummaryAndQuizCompilation: (hiddenCode,userId) => ng.IPromise<any>;
    getTotalNumberOfQuestions: (hiddenCode) => ng.IPromise<any>;
    getTotalAllottedTimeForQuiz: (hiddenCode) => ng.IPromise<any>;
    saveAnswersOfQuestions: (questionAndResult) => ng.IPromise<any>;
    getPreviousQuizPageOfQuiz: (hiddenCode, questionNumber) => ng.IPromise<any>;
    getSelfScoringQuestionsCount: (hiddenCode, resultSummaryId) => ng.IPromise<any>;
    checkIfQuizQuestionPageIsSaveAndPausedByUser: (hiddenCode, userId) => ng.IPromise<any>;
    getTotalTimeTakenByUser: (hiddenCode, userId, quizResultSummaryId) => ng.IPromise<any>;
    getNextQuizPageOfQuiz: (questionAndResult) => ng.IPromise<any>;
    setAndGetRemainingtime: (timeRemaining, setValue, hiddenCode, userId) => ng.IPromise<any>;
    getQuestionAndPageDetailsForQuestionPage: (hiddenCode, questionNumber, userId) => ng.IPromise<any>;
    storeTimerExpiredvalue: (isTimerExpiredd) => ng.IPromise<any>;
    setValueOfFirstQuestionToHidePreviousButton: (questionNo, setValue, hiddenCode, userI) => ng.IPromise<any>;
    getDetailsOnResultsPageLoad: (hiddenCode, userId, prevRoutePageController, quizResultSummaryId) => ng.IPromise<any>;
    
}

class questionPageService implements IquestionPageService {
    static serviceId: string = "questionPageService";

    //Api routes to call api actions
    private getQuizSettings: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private initializeQuizResultSummaryAndQuizCompilationEntities: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalCountOfQuestions: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalAllottedTimeToCompleteQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private saveUserAnswersOfQuestions: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getPreviousQuizPageDetailsOfQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalSelfScoringQuestionsCount: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private checkIfQuizQuestionPageIsSaveAndPaused: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalTimeTakenByUserToCompleteQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getNextQuizPageDetailsOfQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private setAndGetRemainingtimeFromCache: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuestionAndPageDetails: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private storeTimerExpired: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private setValueOfQuestionToHidePreviousButton: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getDetailsForResultsPageLoad: ng.resource.IResourceClass<ng.resource.IResource<any>>;

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getQuizSettings = this.$resource(apiPaths.getQuizSettingDetails);
        this.initializeQuizResultSummaryAndQuizCompilationEntities = this.$resource(apiPaths.initializeQuizResultSummaryAndQuizCompilation);
        this.getTotalCountOfQuestions = this.$resource(apiPaths.getTotalNumberOfQuestions);
        this.getTotalAllottedTimeToCompleteQuiz = this.$resource(apiPaths.getTotalAllottedTimeForQuiz);
        this.saveUserAnswersOfQuestions = this.$resource(apiPaths.saveAnswersOfQuestions);
        this.getPreviousQuizPageDetailsOfQuiz = this.$resource(apiPaths.getPreviousQuizPageOfQuiz);
        this.getTotalSelfScoringQuestionsCount = this.$resource(apiPaths.getSelfScoringQuestionsCount);
        this.checkIfQuizQuestionPageIsSaveAndPaused = this.$resource(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser);
        this.getTotalTimeTakenByUserToCompleteQuiz = this.$resource(apiPaths.getTotalTimeTakenByUser);
        this.getNextQuizPageDetailsOfQuiz = this.$resource(apiPaths.getNextQuizPageOfQuiz);
        this.setAndGetRemainingtimeFromCache = this.$resource(apiPaths.setAndGetRemainingtime);
        this.getQuestionAndPageDetails = this.$resource(apiPaths.getQuestionAndPageDetailsForQuestionPage);
        this.storeTimerExpired = this.$resource(apiPaths.storeTimerExpiredvalue);
        this.setValueOfQuestionToHidePreviousButton = this.$resource(apiPaths.setValueOfFirstQuestionToHidePreviousButton);
        this.getDetailsForResultsPageLoad = this.$resource(apiPaths.getDetailsOnResultsPageLoad);

    }

    //Returns details of QuizManagerPage.
    getQuizSettingDetails(hiddenCode) {
        return this.getQuizSettings.get({ hiddenCode: hiddenCode }).$promise;
    }
    //Returns details of QuizManagerPage.
    initializeQuizResultSummaryAndQuizCompilation(hiddenCode,userId) {
        return this.initializeQuizResultSummaryAndQuizCompilationEntities.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    }
   
    //Returns details of QuizManagerPage.
    getTotalNumberOfQuestions(hiddenCode) {
        return this.getTotalCountOfQuestions.get({ hiddenCode: hiddenCode}).$promise;
    }
    //Returns details of QuizManagerPage.
    getTotalAllottedTimeForQuiz(hiddenCode) {
        return this.getTotalAllottedTimeToCompleteQuiz.get({ hiddenCode: hiddenCode}).$promise;
    }
    //Returns details of QuizManagerPage.
    saveAnswersOfQuestions(questionAndResult) {
        return this.saveUserAnswersOfQuestions.save(questionAndResult).$promise;
    }
    //Returns details of QuizManagerPage.
    getPreviousQuizPageOfQuiz(hiddenCode, questionNumber) {
        return this.getPreviousQuizPageDetailsOfQuiz.get({ hiddenCode: hiddenCode, questionNumber: questionNumber }).$promise;
    }
    //Returns details of QuizManagerPage.
    getSelfScoringQuestionsCount(hiddenCode, resultSummaryId) {
        return this.getTotalSelfScoringQuestionsCount.get({ hiddenCode: hiddenCode, quizResultSummaryId: resultSummaryId}).$promise;
    }
    //Returns details of QuizManagerPage.
    checkIfQuizQuestionPageIsSaveAndPausedByUser(hiddenCode, userId) {
        return this.checkIfQuizQuestionPageIsSaveAndPaused.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    }
    //Returns details of QuizManagerPage.
    getTotalTimeTakenByUser(hiddenCode, userId, quizResultSummaryId) {
        return this.getTotalTimeTakenByUserToCompleteQuiz.get({ hiddenCode: hiddenCode, userId: userId, quizResultSummaryId: quizResultSummaryId }).$promise;
    }
    getNextQuizPageOfQuiz(questionAndResult) {
        return this.getNextQuizPageDetailsOfQuiz.save(questionAndResult ).$promise;
    }
    //Returns details of QuizManagerPage.
    setAndGetRemainingtime(timeRemaining, setValue, hiddenCode, userId) {
        return this.setAndGetRemainingtimeFromCache.get({ timeRemaining: timeRemaining, setValue: setValue, hiddenCode: hiddenCode, userId: userId }).$promise;
    }
    //Returns details of QuizManagerPage.
    getQuestionAndPageDetailsForQuestionPage(hiddenCode, questionNumber,userId) {
        return this.getQuestionAndPageDetails.query({ hiddenCode: hiddenCode, questionNumber: questionNumber, userId: userId }).$promise;
    }
    //Returns details of QuizManagerPage.
    storeTimerExpiredvalue(isTimerExpired) {
        return this.storeTimerExpired.get({ isTimerExpired: isTimerExpired }).$promise;
    }
    //Returns details of QuizManagerPage.
    setValueOfFirstQuestionToHidePreviousButton(questionNo, setValue, hiddenCode, userId) {
        return this.setValueOfQuestionToHidePreviousButton.get({ questionNo: questionNo, setValue: setValue, hiddenCode: hiddenCode, userId: userId }).$promise;
    }
    //Returns details of QuizManagerPage.
    getDetailsOnResultsPageLoad(hiddenCode, userId, prevRoutePageController, quizResultSummaryId) {
        return this.getDetailsForResultsPageLoad.get({ hiddenCode: hiddenCode, UserId: userId, prevRoutePageController: prevRoutePageController, quizResultSummaryId: quizResultSummaryId}).$promise;
    }
}

app.factory(questionPageService.serviceId, ['$resource', ($resource) =>
    new questionPageService($resource)
]);


 

  