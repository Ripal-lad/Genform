// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

// <reference path="../../references/references.ts" />

interface IresourceLinkService {
    createResourceLinkPreview: (hiddenCode) => ng.IPromise<any>;
    ipBoardGroupPermission: (ipBoardMemberId, ipCurrentUserSession) => ng.IPromise<any>;
}

class resourceLinkService implements IresourceLinkService {
    static serviceId: string = "resourceLinkService";

    //Api routes to call api actions
    private getSelectedResourceAndcreateResourceLinkPreview: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private permissionForIpBoardGroup: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getSelectedResourceAndcreateResourceLinkPreview = this.$resource(apiPaths.createResourceLinkPreview);
        this.permissionForIpBoardGroup = this.$resource(apiPaths.ipBoardGroupPermission);
    }

    //Returns details of selected Resource.
    createResourceLinkPreview(hiddenCode) {
        return this.getSelectedResourceAndcreateResourceLinkPreview.get({ hiddenCode: hiddenCode}).$promise;
    }

    //Check whether user has permission to view raed more resources.
    ipBoardGroupPermission(ipBoardMemberId, ipCurrentUserSession) {
        return this.permissionForIpBoardGroup.get({ ipBoardMemberId: ipBoardMemberId, ipCurrentUserSession: ipCurrentUserSession}).$promise;
    }
 }

app.factory(resourceLinkService.serviceId, ['$resource', ($resource) =>
    new resourceLinkService($resource)
]);
   