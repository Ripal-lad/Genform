// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var resourceNotesService = (function () {
    //Constructor
    function resourceNotesService($resource) {
        this.$resource = $resource;
        this.getSelectedResourceAndcreateResourceNotesPreview = this.$resource(apiPaths.getResourceDetailsForHiddenCodePassed);
        this.createResourcesNotesPreviewWithSvgFile = this.$resource(apiPaths.createResourcesNotesPreview);
        this.downLoadPdfFileFromServer = this.$resource(apiPaths.downloadFile);
    }
    //Returns details of selected Resource.
    resourceNotesService.prototype.getResourceDetailsForHiddenCodePassed = function (hiddenCode) {
        return this.getSelectedResourceAndcreateResourceNotesPreview.get({ hiddenCode: hiddenCode }).$promise;
    };
    //Returns  svg file path.
    resourceNotesService.prototype.createResourcesNotesPreview = function (hiddenCode, svgFileName) {
        return this.createResourcesNotesPreviewWithSvgFile.get({ svgFileName: svgFileName, hiddenCode: hiddenCode }).$promise;
    };
    //Download pdf file.
    resourceNotesService.prototype.downloadFile = function (downloadPdfFilePath) {
        return this.downLoadPdfFileFromServer.get({ downloadPdfFilePath: downloadPdfFilePath }).$promise;
    };
    resourceNotesService.serviceId = "resourceNotesService";
    return resourceNotesService;
})();
app.factory(resourceNotesService.serviceId, ['$resource', function ($resource) { return new resourceNotesService($resource); }]);
//# sourceMappingURL=resourceNotesService.js.map