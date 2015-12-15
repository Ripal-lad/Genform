// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
interface IquizManagerPageService {
    getQuizDetailListForQuizManagerPage: (hiddenCode, userId) => ng.IPromise<any>;
}

class quizManagerPageService implements IquizManagerPageService {
    static serviceId: string = "quizManagerPageService";

    //Api routes to call api actions
    private getDetailListForQuizManagerPage: ng.resource.IResourceClass<ng.resource.IResource<any>>;

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getDetailListForQuizManagerPage = this.$resource(apiPaths.getQuizDetailListForQuizManagerPage);
    }

    //Returns details of QuizManagerPage.
    getQuizDetailListForQuizManagerPage(hiddenCode,userId) {
        return this.getDetailListForQuizManagerPage.query({ hiddenCode: hiddenCode, userId: userId}).$promise;
    }
}

app.factory(quizManagerPageService.serviceId, ['$resource', ($resource) =>
    new quizManagerPageService($resource)
]);




