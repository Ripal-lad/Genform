
interface IselfScoringQuestionPageService {
    getCurrentQuizName: (hiddenCode) => ng.IPromise<any>;
    getQuestionForSelfScoringQuestionPage: (hiddenCode, quizQuestionNo, userId) => ng.IPromise<any>;
    getNextQuizPageOfSelfScoringQuestion: (hiddenCode, userId, quizResultSummaryId) => ng.IPromise<any>;
    getPreviousQuizPageOfSelfScoringQuestion:(hiddenCode, userId, quizResultSummaryId) => ng.IPromise < any>;
    getSelfScoringQuestionsCount: (hiddenCode, quizResultSummaryId) => ng.IPromise<any>;
    checkIfQuizQuestionPageIsSaveAndPausedByUser: (hiddenCode, userId) => ng.IPromise<any>;
    setValueOfFirstQuestionToHidePreviousButton: (questionNo, setValue, hiddenCode, userId) => ng.IPromise<any>;
}

class selfScoringQuestionPageService implements IselfScoringQuestionPageService {
    static serviceId: string = "selfScoringQuestionPageService";

    //Api routes to call api actions
    private getQuizName: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuestionDetailsForSelfScoringQuestionPage: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getNextQuizPageDetailsOfSelfScoringQuestion: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getPreviousQuizPageDetailsOfSelfScoringQuestion: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalSelfScoringQuestionsCount: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private checkIfQuizIsSaveAndPausedByUser: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private setValueOfFirstQuestionToHidePreviousButtonOnFirstQuestion: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    
    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getQuestionDetailsForSelfScoringQuestionPage = this.$resource(apiPaths.getQuestionForSelfScoringQuestionPage);
        this.getNextQuizPageDetailsOfSelfScoringQuestion = this.$resource(apiPaths.getNextQuizPageOfSelfScoringQuestion);
        this.getPreviousQuizPageDetailsOfSelfScoringQuestion = this.$resource(apiPaths.getPreviousQuizPageOfSelfScoringQuestion);
        this.getTotalSelfScoringQuestionsCount = this.$resource(apiPaths.getSelfScoringQuestionsCount);
        this.checkIfQuizIsSaveAndPausedByUser = this.$resource(apiPaths.checkIfQuizQuestionPageIsSaveAndPausedByUser);
        this.setValueOfFirstQuestionToHidePreviousButtonOnFirstQuestion = this.$resource(apiPaths.setValueOfFirstQuestionToHidePreviousButton);
        
    }

    //Returns details of QuizManagerPage.
    getCurrentQuizName(hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    }
    //Returns details of QuizManagerPage.
    getQuestionForSelfScoringQuestionPage(hiddenCode, quizQuestionNo, userId) {
        return this.getQuestionDetailsForSelfScoringQuestionPage.get({ hiddenCode: hiddenCode, quizQuestionNo: quizQuestionNo, userId: userId }).$promise;
    }
    //Returns details of QuizManagerPage.
    getNextQuizPageOfSelfScoringQuestion(quizQuestionsAndAnswerDetails) {
        return this.getNextQuizPageDetailsOfSelfScoringQuestion.save(quizQuestionsAndAnswerDetails).$promise;
    }
   
     //Returns details of QuizManagerPage.
    getPreviousQuizPageOfSelfScoringQuestion(hiddenCode, quizQuestionNo, userId) {
        return this.getPreviousQuizPageDetailsOfSelfScoringQuestion.get({ hiddenCode: hiddenCode, quizQuestionNo: quizQuestionNo, userId: userId }).$promise;
    }
    //Returns details of QuizManagerPage.
    getSelfScoringQuestionsCount(hiddenCode, quizResultSummaryId) {
        return this.getTotalSelfScoringQuestionsCount.get({ hiddenCode: hiddenCode, quizResultSummaryId: quizResultSummaryId  }).$promise;
    }
    //Returns details of QuizManagerPage.
    checkIfQuizQuestionPageIsSaveAndPausedByUser(hiddenCode, userId) {
        return this.checkIfQuizIsSaveAndPausedByUser.get({ hiddenCode: hiddenCode, userId: userId  }).$promise;
    }
    //Returns details of QuizManagerPage.
    setValueOfFirstQuestionToHidePreviousButton(questionNo, setValue, hiddenCode, userId) {
        return this.setValueOfFirstQuestionToHidePreviousButtonOnFirstQuestion.get({ questionNo: questionNo, setValue: setValue, hiddenCode: hiddenCode, userId: userId }).$promise;
    }
   
}

app.factory(selfScoringQuestionPageService.serviceId, ['$resource', ($resource) =>
    new selfScoringQuestionPageService($resource)
]);


 