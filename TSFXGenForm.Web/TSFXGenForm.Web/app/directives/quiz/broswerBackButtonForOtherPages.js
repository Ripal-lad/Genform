var browserBackButtonForOtherPages = (function () {
    function browserBackButtonForOtherPages($rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.restrict = "A";
        this.link = function (scope, elem, attr) {
            elem.on("mouseover", function () {
                //If mouse pointer is inside the page.
                _this.$rootScope.browserBackIsClicked = true;
            });
            elem.on("mouseleave", function () {
                //If mouse pointer will leave the page.
                _this.$rootScope.browserBackIsClicked = false;
                _this.$rootScope.$broadcast("onRouteChangeEvent", false);
            });
        };
    }
    browserBackButtonForOtherPages.directiveId = "browserBackButtonForOtherPages";
    return browserBackButtonForOtherPages;
})();
// Update the app variable name to be that of your module variable
app.directive(browserBackButtonForOtherPages.directiveId, ['$rootScope', function ($rootScope) { return new browserBackButtonForOtherPages($rootScope); }]);
//# sourceMappingURL=broswerBackButtonForOtherPages.js.map