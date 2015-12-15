
interface IbrowserBackButtonForQuestionPage extends ng.IDirective { }

interface IbrowserBackButtonForQuestionPageScope extends ng.IScope {

}

class browserBackButtonForQuestionPage implements IbrowserBackButtonForQuestionPage {
    static directiveId: string = "browserBackButtonForQuestionPage";
    restrict: string = "A";

    constructor(private $rootScope) { }

    link = (scope, elem) => {
        elem.on("mouseover", ()=> {
            //If mouse pointer is inside the page.
            this.$rootScope.backIsNotClicked = true;
        });

        elem.on("mouseleave", ()=> {

            //If mouse pointer leaves the Page.s
            this.$rootScope.backIsNotClicked = false;
            this.$rootScope.$broadcast("onHashChangeEvent", false);

        });

    }
}

// Update the app variable name to be that of your module variable
app.directive(browserBackButtonForQuestionPage.directiveId, ['$rootScope', ($rootScope) =>
    new browserBackButtonForQuestionPage($rootScope)
]);
    