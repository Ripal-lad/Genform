// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var endMessagePageService = (function () {
    //Constructor
    function endMessagePageService($resource) {
        this.$resource = $resource;
        this.getQuizSettings = this.$resource(apiPaths.getQuizSettingDetails);
    }
    //Returns details of QuizManagerPage.
    endMessagePageService.prototype.getQuizSettingDetails = function (hiddenCode) {
        return this.getQuizSettings.get({ hiddenCode: hiddenCode }).$promise;
    };
    endMessagePageService.serviceId = "endMessagePageService";
    return endMessagePageService;
})();
app.factory(endMessagePageService.serviceId, ['$resource', function ($resource) { return new endMessagePageService($resource); }]);
//# sourceMappingURL=endMessagePageService.js.map