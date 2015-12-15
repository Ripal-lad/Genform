// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var resourceLinkService = (function () {
    //Constructor
    function resourceLinkService($resource) {
        this.$resource = $resource;
        this.getSelectedResourceAndcreateResourceLinkPreview = this.$resource(apiPaths.createResourceLinkPreview);
        this.permissionForIpBoardGroup = this.$resource(apiPaths.ipBoardGroupPermission);
    }
    //Returns details of selected Resource.
    resourceLinkService.prototype.createResourceLinkPreview = function (hiddenCode) {
        return this.getSelectedResourceAndcreateResourceLinkPreview.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Check whether user has permission to view raed more resources.
    resourceLinkService.prototype.ipBoardGroupPermission = function (ipBoardMemberId, ipCurrentUserSession) {
        return this.permissionForIpBoardGroup.get({ ipBoardMemberId: ipBoardMemberId, ipCurrentUserSession: ipCurrentUserSession }).$promise;
    };
    resourceLinkService.serviceId = "resourceLinkService";
    return resourceLinkService;
})();
app.factory(resourceLinkService.serviceId, ['$resource', function ($resource) { return new resourceLinkService($resource); }]);
//# sourceMappingURL=resourceLinkService.js.map