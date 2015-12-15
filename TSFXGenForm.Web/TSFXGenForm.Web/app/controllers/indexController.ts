/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />

/*============ Index Controller ============*/
/*============ Auther: Dharmesh Pipariya ============*/

interface IindexControllerScope extends ng.IScope {
    toggleLeft: Function;
}

interface IindexController { }

class indexController implements IindexController {
    static controllerId: string = "indexController";

    constructor(private $scope: IindexControllerScope, private $resource: ng.resource.IResourceService) {
        this.$scope.toggleLeft = () => this.toggleLeft();
    }
    private toggleLeft() {
    }
    //$scope.toggleLeft = function () {
    //    $mdSidenav('right').toggle()
    //        .then(function () {
    //            $log.debug("toggle RIGHT is done");
    //        });
    //};

}

// Update the app variable name to be that of your module variable
app.controller(indexController.controllerId, ['$scope', '$resource', ($scope, $resource) =>
    new indexController($scope, $resource)
]);
