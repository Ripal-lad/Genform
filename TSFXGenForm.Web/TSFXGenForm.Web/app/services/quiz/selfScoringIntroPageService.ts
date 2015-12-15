// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

interface IselfScoringIntroPageService{
    getFirstSelfScoringQuestionNo: (hiddenCode, userId) => ng.IPromise<any>;
    getQuestionNoToSelfScoreAfterTimerExpired: (hiddenCode, quizResultSummaryId) => ng.IPromise<any>;
    getTotalTimeTakenByUser: (hiddenCode, userId, quizResultSummaryId) => ng.IPromise<any>;
    getCurrentQuizName: (hiddenCode) => ng.IPromise<any>;
}

class selfScoringIntroPageService implements IselfScoringIntroPageService {
    static serviceId: string = "selfScoringIntroPageService";

    //Api routes to call api actions
    private getSelfScoringQuestionNoToLoadPage: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuestionNoeAfterTimerExpiredToSelfScore: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getTotalTimeTakenByUserToCompleteTheQuiz: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private getQuizName: ng.resource.IResourceClass<ng.resource.IResource<any>>;


    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getSelfScoringQuestionNoToLoadPage = this.$resource(apiPaths.getFirstSelfScoringQuestionNo);
        this.getQuestionNoeAfterTimerExpiredToSelfScore = this.$resource(apiPaths.getQuestionNoToSelfScoreAfterTimerExpired);
        this.getTotalTimeTakenByUserToCompleteTheQuiz = this.$resource(apiPaths.getTotalTimeTakenByUser);
        this.getQuizName = this.$resource(apiPaths.getCurrentQuizName);}

    //Returns question number to self score.
    getFirstSelfScoringQuestionNo(hiddenCode, userId) {
        return this.getSelfScoringQuestionNoToLoadPage.get({ hiddenCode: hiddenCode, userId: userId }).$promise;
    }

    //Returns question number to self score after timer gets expired.
    getQuestionNoToSelfScoreAfterTimerExpired(hiddenCode, quizResultSummaryId) {
        return this.getQuestionNoeAfterTimerExpiredToSelfScore.get({ hiddenCode: hiddenCode, quizResultSummaryId: quizResultSummaryId }).$promise;
    }

    //Returns totlal time taken by user to complete the quiz.
    getTotalTimeTakenByUser(hiddenCode, userId,quizResultSummaryId) {
        return this.getTotalTimeTakenByUserToCompleteTheQuiz.get({ hiddenCode: hiddenCode, userId: userId, quizResultSummaryId: quizResultSummaryId  }).$promise;
    }
    
    //Returns current quiz name.
    getCurrentQuizName(hiddenCode) {
        return this.getQuizName.get({ hiddenCode: hiddenCode }).$promise;
    }
    
}


app.factory(selfScoringIntroPageService.serviceId, ['$resource', ($resource) =>
    new selfScoringIntroPageService($resource)
])
