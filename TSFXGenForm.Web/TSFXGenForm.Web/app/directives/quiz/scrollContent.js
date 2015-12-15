var scrollContent = (function () {
    function scrollContent() {
        this.restrict = "A";
        this.link = function (scope, elem, attr) {
            elem.on('click', function () {
                if ($("[aria-expanded =true]")) {
                    angular.element('body').css("overflow", "hidden");
                    angular.element('.body-container').css({
                        "overflow": "auto",
                        "height": "100%"
                    });
                }
            });
        };
    }
    scrollContent.directiveId = "scrollContent";
    return scrollContent;
})();
// Update the app variable name to be that of your module variable
app.directive(scrollContent.directiveId, [function () { return new scrollContent(); }]);
//# sourceMappingURL=scrollContent.js.map