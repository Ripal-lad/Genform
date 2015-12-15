// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IsavedAndPausedPageService {
    getCurrentQuizName: (hiddenCode) => ng.IPromise<any>;
    getTotalAllottedTimeForQuiz: (hiddenCode) => ng.IPromise<any>;
    getTotalTimeTakenByUser: (hiddenCode, userId, quizResultSummaryId) => ng.IPromise<any>;
}

class savedAndPausedPageService implements IsavedAndPausedPageService {
    static serviceId: string = "savedAndPausedPageService";

    //Api routes to call api actions
    private getQuizName: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalAllottedTimeToCompleteQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalTimeTakenByUserToCompleteQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getTotalAllottedTimeToCompleteQuiz = this.$resource(apiPaths.getTotalAllottedTimeForQuiz);
        this.getTotalTimeTakenByUserToCompleteQuiz = this.$resource(apiPaths.getTotalTimeTakenByUser);

    }

    //Returns details of QuizManagerPage.
    getCurrentQuizName(hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode}).$promise;
    }
    //Returns details of QuizManagerPage.
    getTotalAllottedTimeForQuiz(hiddenCode) {
        return this.getTotalAllottedTimeToCompleteQuiz.get({ hiddenCode: hiddenCode }).$promise;
    }
    //Returns details of QuizManagerPage.
    getTotalTimeTakenByUser(hiddenCode, userId, quizResultSummaryId) {
        return this.getTotalTimeTakenByUserToCompleteQuiz.get({ hiddenCode: hiddenCode, userId: userId, quizResultSummaryId: quizResultSummaryId  }).$promise;
    }
}

app.factory(savedAndPausedPageService.serviceId, ['$resource', ($resource) =>
    new savedAndPausedPageService($resource)
]);

