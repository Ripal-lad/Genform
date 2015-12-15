// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

interface IresultPageService {
    getCurrentQuizName: (hiddenCode) => ng.IPromise<any>;
    getResultsPageListOnPageLoad: (hiddenCode, quizResultSummaryId) => ng.IPromise<any>;
    getDetailsOnResultsPageLoad: (hiddenCode, userId, prevRoutePageController, quizResultSummaryId) => ng.IPromise<any>;   
    getQuizSettingDetails: (hiddenCode) => ng.IPromise<any>;
   
}

class resultPageService implements IresultPageService {
    static serviceId: string = "resultPageService";

    //Api routes to call api actions
    private getQuizName: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getResultsPageList: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getDetailsOfResults: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuizSettings: ng.resource.IResourceClass<ng.resource.IResource<any>>;
 

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);
        this.getResultsPageList = this.$resource(apiPaths.getResultsPageListOnPageLoad);
        this.getDetailsOfResults = this.$resource(apiPaths.getDetailsOnResultsPageLoad);
        this.getQuizSettings = this.$resource(apiPaths.getQuizSettingDetails);
    }

    //Returns current quiz name.
    getCurrentQuizName(hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    }

  
    //Initialize quiz into QuizDefine table.
    getResultsPageListOnPageLoad(hiddenCode, quizResultSummaryId) {
        return this.getResultsPageList.get({ hiddenCode: hiddenCode, quizResultSummaryId: quizResultSummaryId}).$promise;
    }

    //Get details of quizintor page.
    getDetailsOnResultsPageLoad(hiddenCode, userId, prevRoutePageController,quizResultSummaryId) {
        return this.getDetailsOfResults.get({ hiddenCode: hiddenCode, UserId: userId, prevRoutePageController: prevRoutePageController, quizResultSummaryId: quizResultSummaryId }).$promise;
    }

    //Check if quiz is saved and paused by user.
    getQuizSettingDetails(hiddenCode) {
        return this.getQuizSettings.get({ hiddenCode: hiddenCode }).$promise;
    }
       
}

app.factory(resultPageService.serviceId, ['$resource', ($resource) =>
    new resultPageService($resource)
]);
   



   