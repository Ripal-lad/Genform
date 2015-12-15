// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


interface IendMessagePageService {
    getQuizSettingDetails: (hiddenCode) => ng.IPromise<any>;
}

class endMessagePageService implements IendMessagePageService {
    static serviceId: string = "endMessagePageService";

    //Api routes to call api actions
    private getQuizSettings: ng.resource.IResourceClass<ng.resource.IResource<any>>;

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getQuizSettings = this.$resource(apiPaths.getQuizSettingDetails);
    }

    //Returns details of QuizManagerPage.
    getQuizSettingDetails(hiddenCode) {
        return this.getQuizSettings.get({ hiddenCode: hiddenCode}).$promise;
    }
}

app.factory(endMessagePageService.serviceId, ['$resource', ($resource) =>
    new endMessagePageService($resource)
]);

