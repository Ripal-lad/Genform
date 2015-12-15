

interface IscrollContent extends ng.IDirective { }

interface IscrollContentScope extends ng.IScope {
    
}

class scrollContent implements IscrollContent {
    static directiveId: string = "scrollContent";
    restrict: string = "A";

    constructor() { }

    link = (scope, elem, attr) => {
        elem.on('click', ()=> {
            if ($("[aria-expanded =true]")) {
                angular.element('body').css("overflow", "hidden");
                angular.element('.body-container').css({
                    "overflow": "auto",
                    "height": "100%"
                });
            }
        });
    }
}

// Update the app variable name to be that of your module variable
app.directive(scrollContent.directiveId, [ () =>
    new scrollContent()
]);
  