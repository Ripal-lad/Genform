// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IintroPageSevice {
    getCurrentQuizName: (hiddenCode) => ng.IPromise<any>;
    checkQuizIsAvailableOrNot: (hiddenCode) => ng.IPromise<any>;
    initializeQuizDefineOnPageLoad: (hiddenCode) => ng.IPromise<any>;
    getDetailsForIntroPage: (hiddenCode) => ng.IPromise<any>;
    checkIfQuizQuestionPageIsSaveAndPausedByUser: (hiddenCode, userId) => ng.IPromise<any>;
    getFirstQuestionNumberToLoadOnQuestionPage: (hiddenCode) => ng.IPromise<any>;
    getQuizPageQuestionToResumeQuiz: (hiddenCode, userId) => ng.IPromise<any>;
    checkIfSelfScoringQuestionIsSaveAndPausedByUser: (hiddenCode, userId) => ng.IPromise<any>;
    getSelfScoringQuestionsCount: (hiddenCode, quizResultSummaryId) => ng.IPromise<any>;
    ipBoardGroupPermission: (ipBoardMemberId, ipCurrentUserSession) => ng.IPromise<any>;
  }

class introPageSevice implements IintroPageSevice {
    static serviceId: string  = "introPageSevice";

    //Api routes to call api actions
    private getQuizName: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private checkIfQuizIsAvailableOrNot: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private initializeQuizDefineTable: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getDetailsToBindOnIntroPage: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private checkIfQuizIsSaveAndPausedByUser: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getFirstQuestionNumberOfQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuestionNoToResumeQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private checkIfSelfScoringQuestionIsSaveAndPaused: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getCountOfSelfScoringQuestions: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private permissionForIpBoardGroup: ng.resource.IResourceClass<ng.resource.IResource<any>>;
   
    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.checkIfQuizIsAvailableOrNot = this.$resource(apiPaths.checkQuizIsAvailableOrNot);
        this.initializeQuizDefineTable = this.$resource(apiPaths.initializeQuizDefineOnPageLoad);
        this.getDetailsToBindOnIntroPage = this.$resource(apiPaths.getDetailsForIntroPage);
        this.checkIfQuizIsSaveAndPausedByUser = this.$resource(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser);
        this.getFirstQuestionNumberOfQuiz = this.$resource(apiPaths.getFirstQuestionNumberToLoadOnQuestionPage);
        this.getQuestionNoToResumeQuiz = this.$resource(apiPaths.getQuizPageQuestionToResumeQuiz);
        this.checkIfSelfScoringQuestionIsSaveAndPaused = this.$resource(apiPaths.checkIfSelfScoringQuestionIsSaveAndPausedByUser);
        this.getCountOfSelfScoringQuestions = this.$resource(apiPaths.getSelfScoringQuestionsCount);
        this.permissionForIpBoardGroup = this.$resource(apiPaths.ipBoardGroupPermission);
    }

    //Returns current quiz name.
    getCurrentQuizName(hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    }

    //Check whether the quiz is available or not.
    checkQuizIsAvailableOrNot(hiddenCode) {
        return this.checkIfQuizIsAvailableOrNot.get({ hiddenCode: hiddenCode }).$promise;
    }

    //Initialize quiz into QuizDefine table.
    initializeQuizDefineOnPageLoad(hiddenCode) {
        return this.initializeQuizDefineTable.get({ hiddenCode: hiddenCode }).$promise;
    }

    //Get details of quizintor page.
    getDetailsForIntroPage(hiddenCode) {
        return this.getDetailsToBindOnIntroPage.get({ hiddenCode: hiddenCode }).$promise;
    }

    //Check if quiz is saved and paused by user.
    checkIfQuizQuestionPageIsSaveAndPausedByUser(hiddenCode, userId) {
        return this.checkIfQuizIsSaveAndPausedByUser.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    }
    
    //Get first question number.
    getFirstQuestionNumberToLoadOnQuestionPage(hiddenCode) {
        return this.getFirstQuestionNumberOfQuiz.get({ hiddenCode: hiddenCode }).$promise;
    }

    //Get question number if quiz is resumed.
    getQuizPageQuestionToResumeQuiz(hiddenCode,userId) {
        return this.getQuestionNoToResumeQuiz.get({ hiddenCode: hiddenCode, userId: userId}).$promise;
    }

    //Check if all the questions of the quiz is completed by user by self scroing is remained.
    checkIfSelfScoringQuestionIsSaveAndPausedByUser(hiddenCode, userId) {
        return this.checkIfSelfScoringQuestionIsSaveAndPaused.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    }
    
    //Get total number of self scoring question count.
    getSelfScoringQuestionsCount(hiddenCode, resultSummaryId) {
        return this.getCountOfSelfScoringQuestions.get({ hiddenCode: hiddenCode, quizResultSummaryId: resultSummaryId }).$promise;
    }

    //Check whether the user has permission to view quiz.
    ipBoardGroupPermission(ipBoardMemberId, ipCurrentUserSession) {
        return this.permissionForIpBoardGroup.get({ ipBoardMemberId: ipBoardMemberId, ipCurrentUserSession: ipCurrentUserSession }).$promise;
    }
    
}

app.factory(introPageSevice.serviceId, ['$resource', ($resource) =>
    new introPageSevice($resource)
]);
   

