// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var AvailableQuizMessageController = (function () {
    function AvailableQuizMessageController($scope, $routeParams, endMessagePageService, $location, $log) {
        this.$scope = $scope;
        this.$routeParams = $routeParams;
        this.endMessagePageService = endMessagePageService;
        this.$location = $location;
        this.$log = $log;
        //Get Quiz settings.
        this.getQuizDetailsAndBindMessageToUi = function () {
            var _this = this;
            //Get quiz details to bind QuizName.
            this.endMessagePageService.getQuizSettingDetails(this.hiddenCode).then(function (quizSettings) {
                if (quizSettings != null && quizSettings != undefined && quizSettings.result != "null") {
                    _this.$scope.progressBarValue = false; //Stop progress bar.
                    _this.$scope.pageDetailsValue = true; //Show page details.
                    _this.$scope.quizTitle = quizSettings.result.Name;
                }
                else {
                    _this.$log.log("AvailableQuizMessageController - getQuizDetailsAndBindMessageToUi() - Details of QuizSettings are not available. ");
                    _this.$location.path('/');
                }
            });
        };
        $scope.title = "AvailableQuizMessagePageController";
        this.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.$scope.progressBarValue = true; //Start progress bar.
        this.$scope.pageDetailsValue = false; //Hide page details.
        if (this.hiddenCode != null && this.hiddenCode != "undefined") {
            this.getQuizDetailsAndBindMessageToUi();
        }
        else {
            this.$log.log("AvailableQuizMessageController - construtor - Routeparams are not defined ");
        }
    }
    AvailableQuizMessageController.controllerId = "AvailableQuizMessageController";
    return AvailableQuizMessageController;
})();
app.controller(AvailableQuizMessageController.controllerId, ['$scope', '$routeParams', 'endMessagePageService', '$location', '$log', function ($scope, $routeParams, endMessagePageService, $location, $log) { return new AvailableQuizMessageController($scope, $routeParams, endMessagePageService, $location, $log); }]);
//# sourceMappingURL=availableQuizMessagePageController.js.map