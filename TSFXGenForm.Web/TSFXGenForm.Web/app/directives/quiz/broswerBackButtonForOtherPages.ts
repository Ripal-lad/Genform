
interface IbrowserBackButtonForOtherPages extends ng.IDirective { }

interface IbrowserBackButtonForOtherPagesScope extends ng.IScope {

}

class browserBackButtonForOtherPages implements IbrowserBackButtonForOtherPages {
    static directiveId: string = "browserBackButtonForOtherPages";
    restrict: string = "A";

    constructor(private $rootScope) { }

    link = (scope, elem, attr) => {
        elem.on("mouseover", ()=> {

            //If mouse pointer is inside the page.
            this.$rootScope.browserBackIsClicked = true;

        });

        elem.on("mouseleave", ()=> {

            //If mouse pointer will leave the page.
            this.$rootScope.browserBackIsClicked = false;
            this.$rootScope.$broadcast("onRouteChangeEvent", false);
        });

    }
}

// Update the app variable name to be that of your module variable
app.directive(browserBackButtonForOtherPages.directiveId, ['$rootScope', ($rootScope) =>
    new browserBackButtonForOtherPages($rootScope)
]);
   