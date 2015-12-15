var browserBackButtonForQuestionPage = (function () {
    function browserBackButtonForQuestionPage($rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.restrict = "A";
        this.link = function (scope, elem) {
            elem.on("mouseover", function () {
                //If mouse pointer is inside the page.
                _this.$rootScope.backIsNotClicked = true;
            });
            elem.on("mouseleave", function () {
                //If mouse pointer leaves the Page.s
                _this.$rootScope.backIsNotClicked = false;
                _this.$rootScope.$broadcast("onHashChangeEvent", false);
            });
        };
    }
    browserBackButtonForQuestionPage.directiveId = "browserBackButtonForQuestionPage";
    return browserBackButtonForQuestionPage;
})();
// Update the app variable name to be that of your module variable
app.directive(browserBackButtonForQuestionPage.directiveId, ['$rootScope', function ($rootScope) { return new browserBackButtonForQuestionPage($rootScope); }]);
//# sourceMappingURL=browserBackButtonDirectiveForQuestionPage.js.map