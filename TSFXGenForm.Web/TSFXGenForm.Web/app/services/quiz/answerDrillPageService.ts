// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IanswerDrillPageService {
    getTotalNumberOfQuestions: (hiddenCode) => ng.IPromise<any>;
    getCurrentQuizName: (hiddenCode) => ng.IPromise<any>;
    getQuestionAndAnswerDetailsForAnswerDrillResultPage: (hiddenCode, quizQuestionNo, userId, quizResultSummaryId)=>ng.IPromise<any>;
}

class answerDrillPageService implements IanswerDrillPageService {
    static serviceId: string = "answerDrillPageService";

    //Api routes to call api actions
    private getTotalCountOfQuestions: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuizName: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuestionAndAnswersForAnswerDrillResultPage: ng.resource.IResourceClass<ng.resource.IResource<any>>;


    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getTotalCountOfQuestions = this.$resource(apiPaths.getTotalNumberOfQuestions);
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getQuestionAndAnswersForAnswerDrillResultPage = this.$resource(apiPaths.getQuestionAndAnswerDetailsForAnswerDrillResultPage);
    }

    //Returns details of QuizManagerPage.
    getTotalNumberOfQuestions(hiddenCode) {
        return this.getTotalCountOfQuestions.get({ hiddenCode: hiddenCode }).$promise;
    }
    getCurrentQuizName(hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    }
    getQuestionAndAnswerDetailsForAnswerDrillResultPage(hiddenCode, quizQuestionNo, userId, quizResultSummaryId) {
        return this.getQuestionAndAnswersForAnswerDrillResultPage.get({ hiddenCode: hiddenCode, quizQuestionNo: quizQuestionNo, userId: userId, quizResultSummaryId: quizResultSummaryId }).$promise;
    }
}

app.factory(answerDrillPageService.serviceId, ['$resource', ($resource) =>
    new answerDrillPageService($resource)
]);


