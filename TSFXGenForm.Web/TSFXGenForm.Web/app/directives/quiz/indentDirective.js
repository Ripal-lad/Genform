var indentQuestions = (function () {
    function indentQuestions() {
        this.restrict = "A";
        this.link = function (scope, elem, attr) {
            var indentValue = attr.indentpx;
            elem.css({
                "margin-left": indentValue + 'px',
                "padding-right": ''
            });
            var windowWidth = angular.element(window).width();
            var windowHeight = angular.element(window).height();
            //for mobile devise 
            if (windowWidth < 600) {
                if (indentValue > 40) {
                    elem.css({ 'margin-left': '10px' });
                }
                else {
                    elem.css({ "margin-left": indentValue + 'px',  });
                }
            }
            else if (windowWidth > 600 && windowWidth <= 1024) {
                elem.css({ 'margin-left': '20px' });
            }
        };
    }
    indentQuestions.directiveId = "indentQuestions";
    return indentQuestions;
})();
// Update the app variable name to be that of your module variable
app.directive(indentQuestions.directiveId, [function () { return new indentQuestions(); }]);
//# sourceMappingURL=indentDirective.js.map