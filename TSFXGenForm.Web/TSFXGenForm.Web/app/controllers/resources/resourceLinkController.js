/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../models/resources/resource.ts" />
var ResourceLinkController = (function () {
    //Constructor.
    function ResourceLinkController($scope, $window, resourceLinkService, $mdDialog, $routeParams, $log, $timeout) {
        var _this = this;
        this.$scope = $scope;
        this.$window = $window;
        this.resourceLinkService = resourceLinkService;
        this.$mdDialog = $mdDialog;
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.$timeout = $timeout;
        this.$scope.title = "ResourceLinkController";
        this.$scope.imageShow = false;
        this.$scope.messageShow = false;
        this.$scope.resource = new Model.Resource();
        this.$scope.isReadMoreAllowed = false;
        this.$scope.readMoreButtonclick = function () { return _this.readMoreButtonclick(); };
        //Routeparams.
        this.ips4MemberId = this.$routeParams.ips4_member_id;
        this.ips4IpSessionFront = this.$routeParams.ips4_IPSessionFront;
        this.$scope.hiddenCode = this.$routeParams.hiddenCode;
        if (this.ips4MemberId != null && this.ips4MemberId != undefined && this.ips4IpSessionFront != null && this.ips4IpSessionFront != undefined) {
            //Call method to check for permission of IPBoard to read more about resource.
            var promise = this.resourceLinkService.ipBoardGroupPermission(this.ips4MemberId, this.ips4IpSessionFront);
            promise.then(function (isUserAllowedToreadMore) {
                if (isUserAllowedToreadMore.result) {
                    //User is allowed to read more.
                    _this.$scope.isReadMoreAllowed = true;
                }
                else {
                    _this.$scope.isReadMoreAllowed = false;
                }
                _this.getSelectedResource();
            });
            promise.catch(function () {
                _this.$log.error("Note controller - Exception in ipBoardGroupPermission()");
                //this.$mdDialog.show(this.$mdDialog.alert({
                //    title: 'Alert Box !!',
                //    content: "Exception in ipBoardApplyViewResourcePermission().",
                //    ok: 'Ok',
                //    escapetoclose: false,
                //    clickoutsidetoclose: false
                // }));
            });
            //new
            $timeout(function () {
                parent.postMessage({}, location.protocol + "//" + location.host);
            }, 0);
        }
    }
    //Get selected resource.
    ResourceLinkController.prototype.getSelectedResource = function () {
        var _this = this;
        this.resourceLinkService.createResourceLinkPreview(this.$scope.hiddenCode).then(function (xmldata) {
            if (xmldata != null && xmldata.Title != null && xmldata.URL != null && xmldata.Description != null && xmldata.ResourceLinkImagePath != null) {
                _this.$scope.imageShow = true;
                _this.$scope.messageShow = false;
                _this.$scope.resource = xmldata;
            }
            else if (xmldata != null && xmldata.Title != null && xmldata.URL != null && xmldata.Description != null && xmldata.ResourceLinkImagePath == null) {
                _this.$scope.messageShow = true;
                _this.$scope.imageShow = false;
                _this.$scope.resource = xmldata;
                _this.$scope.message = "Image not found";
            }
            else {
                _this.$log.log("Resource controller - getSelectedResource() - Resource not available " + JSON.stringify(xmldata));
            }
        });
    };
    //Read more button click event.
    ResourceLinkController.prototype.readMoreButtonclick = function () {
        if (this.$scope.isReadMoreAllowed) {
            //If user is allowed to read more.
            this.$window.open(this.$scope.resource.URL, '_blank');
        }
        else {
            this.$mdDialog.show(this.$mdDialog.alert({
                title: 'Permission Denied !!',
                content: "You must log in to view this link.",
                ok: 'Ok',
                escapetoclose: false,
                clickoutsidetoclose: false
            }));
        }
    };
    ResourceLinkController.controllerId = "ResourceLinkController";
    return ResourceLinkController;
})();
//new
app.controller(ResourceLinkController.controllerId, ['$scope', '$window', 'resourceLinkService', '$mdDialog', '$routeParams', '$log', '$timeout', function ($scope, $window, resourceLinkService, $mdDialog, $routeParams, $log, $timeout) { return new ResourceLinkController($scope, $window, resourceLinkService, $mdDialog, $routeParams, $log, $timeout); }]);
//# sourceMappingURL=resourceLinkController.js.map