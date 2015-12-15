// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var EndMessagePageController = (function () {
    //Constructor.
    function EndMessagePageController($scope, $rootScope, $cookieStore, endMessagePageService, $routeParams, $location, $log) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$cookieStore = $cookieStore;
        this.endMessagePageService = endMessagePageService;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.$log = $log;
        $scope.title = "EndMessagePageController";
        this.$scope.progressBarValue = true; //Start progress bar.
        this.$scope.pageDetailsValue = false; //Stop details.
        this.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.ips4MemberId = $cookieStore.get("ips4_member_id");
        this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
        if (this.hiddenCode != null && this.hiddenCode != "undefined") {
            this.getQuizDetailsAndBindMessageToUi();
        }
        else {
            this.$log.log("EndMessagePageController - construtor - Routeparams are not defined");
        }
        $rootScope.$on("onRouteChangeEvent", function (event, result) {
            $rootScope.$on('$locationChangeStart', function () {
                _this.goBack();
            });
        });
    }
    //If browser back buton is clicked then redirect it to IntroPage.
    EndMessagePageController.prototype.goBack = function () {
        if (!this.$rootScope.browserBackIsClicked) {
            this.$rootScope.browserBackIsClicked = true;
            this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);
        }
    };
    //Get details to bind it to ui.
    EndMessagePageController.prototype.getQuizDetailsAndBindMessageToUi = function () {
        var _this = this;
        this.endMessagePageService.getQuizSettingDetails(this.hiddenCode).then(function (introPageDetails) {
            if (introPageDetails != null) {
                _this.$scope.endMessage = introPageDetails.EndMessage;
                _this.$scope.quizTitle = introPageDetails.Name;
                _this.$scope.progressBarValue = false; //Stop progress bar.
                _this.$scope.pageDetailsValue = true; //Show details.
            }
            else {
                _this.$log.log("EndMessagePageController - getQuizDetailsAndBindMessageToUi() - Details of intro page are not available");
            }
        });
    };
    EndMessagePageController.controllerId = "EndMessagePageController";
    return EndMessagePageController;
})();
app.controller(EndMessagePageController.controllerId, ['$scope', '$rootScope', '$cookieStore', 'endMessagePageService', '$routeParams', '$location', '$log', function ($scope, $rootScope, $cookieStore, endMessagePageService, $routeParams, $location, $log) { return new EndMessagePageController($scope, $rootScope, $cookieStore, endMessagePageService, $routeParams, $location, $log); }]);
//# sourceMappingURL=endMessagePageController.js.map