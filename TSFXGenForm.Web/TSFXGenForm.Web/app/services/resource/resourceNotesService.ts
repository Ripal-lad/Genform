// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

// <reference path="../../references/references.ts" />

interface IresourceNotesService {
    getResourceDetailsForHiddenCodePassed: (hiddenCode) => ng.IPromise<any>;
    createResourcesNotesPreview: (hiddenCode, svgFileName) => ng.IPromise<any>;
    downloadFile: (downloadPdfFilePath) => ng.IPromise<any>;
  
}

class resourceNotesService implements IresourceNotesService {
    static serviceId: string = "resourceNotesService";

    //Api routes to call api actions
    private getSelectedResourceAndcreateResourceNotesPreview: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private createResourcesNotesPreviewWithSvgFile: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private downLoadPdfFileFromServer: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    private permissionForIpBoardGroup: ng.resource.IResourceClass<ng.resource.IResource<any>>;
    

    //Constructor
    constructor(private $resource: ng.resource.IResourceService) {
        this.getSelectedResourceAndcreateResourceNotesPreview = this.$resource(apiPaths.getResourceDetailsForHiddenCodePassed);
        this.createResourcesNotesPreviewWithSvgFile = this.$resource(apiPaths.createResourcesNotesPreview);
        this.downLoadPdfFileFromServer = this.$resource(apiPaths.downloadFile);
    }

    //Returns details of selected Resource.
    getResourceDetailsForHiddenCodePassed(hiddenCode) {
        return this.getSelectedResourceAndcreateResourceNotesPreview.get({ hiddenCode: hiddenCode }).$promise;
    }

    //Returns  svg file path.
    createResourcesNotesPreview(hiddenCode, svgFileName) {
        return this.createResourcesNotesPreviewWithSvgFile.get({ svgFileName: svgFileName, hiddenCode: hiddenCode }).$promise;
    }

    //Download pdf file.
    downloadFile(downloadPdfFilePath) {
        return this.downLoadPdfFileFromServer.get({ downloadPdfFilePath:downloadPdfFilePath }).$promise;
    }
}

app.factory(resourceNotesService.serviceId, ['$resource', ($resource) =>
    new resourceNotesService($resource)
]);
   


