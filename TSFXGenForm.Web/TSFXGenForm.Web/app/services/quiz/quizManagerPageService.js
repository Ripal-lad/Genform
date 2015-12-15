var quizManagerPageService = (function () {
    //Constructor
    function quizManagerPageService($resource) {
        this.$resource = $resource;
        this.getDetailListForQuizManagerPage = this.$resource(apiPaths.getQuizDetailListForQuizManagerPage);
    }
    //Returns details of QuizManagerPage.
    quizManagerPageService.prototype.getQuizDetailListForQuizManagerPage = function (hiddenCode, userId) {
        return this.getDetailListForQuizManagerPage.query({ hiddenCode: hiddenCode, userId: userId }).$promise;
    };
    quizManagerPageService.serviceId = "quizManagerPageService";
    return quizManagerPageService;
})();
app.factory(quizManagerPageService.serviceId, ['$resource', function ($resource) { return new quizManagerPageService($resource); }]);
//# sourceMappingURL=quizManagerPageService.js.map