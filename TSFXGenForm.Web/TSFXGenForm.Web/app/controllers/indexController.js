/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../scripts/typings/angularjs/angular-route.d.ts" />
var indexController = (function () {
    function indexController($scope, $resource) {
        var _this = this;
        this.$scope = $scope;
        this.$resource = $resource;
        this.$scope.toggleLeft = function () { return _this.toggleLeft(); };
    }
    indexController.prototype.toggleLeft = function () {
    };
    indexController.controllerId = "indexController";
    return indexController;
})();
// Update the app variable name to be that of your module variable
app.controller(indexController.controllerId, ['$scope', '$resource', function ($scope, $resource) { return new indexController($scope, $resource); }]);
//# sourceMappingURL=indexController.js.map