describe("resourceNotesServiceSpec", function () {
    var httpBackend, _resourceNotesService, hiddenCode;
    beforeEach(angular.mock.module("app"));
    beforeEach(inject(function (resourceNotesService, $httpBackend) {
        httpBackend = $httpBackend;
        _resourceNotesService = resourceNotesService;
        hiddenCode = "wbtqbuac";
    }));
    //should return selected resource.
    it("should return selected resource", function () {
        var selectedResource = new Object();
        selectedResource["FilePages"] = "18|";
        selectedResource["FileNames"] = "VCE-Maths Methods_Yr 12-Exam Papers-4701.pdf| ";
        selectedResource["FileSizes"] = "188258|";
        selectedResource["ResourceTitle"] = " Maths Methods - Unit 4 - Exam 2 - 2005 ";
        httpBackend.expectGET(apiPaths.getResourceDetailsForHiddenCodePassed + '?hiddenCode=' + hiddenCode).respond(selectedResource);
        _resourceNotesService.getResourceDetailsForHiddenCodePassed(hiddenCode).then(function (data) {
            expect(data).not.toBeNull();
            expect(data.FilePages).not.toBeNull();
            expect(data.FileNames).not.toBeNull();
            expect(data.ResourceTitle).not.toBeNull();
            expect(data.FileSizes).not.toBeNull();
        });
        httpBackend.flush();
    });
    //should return svgfilepath.
    it("should return path for svg files and pdf files", function () {
        var svgFileName = "MyEng.pdf";
        var svgAndPdfFilepath = new Object();
        svgAndPdfFilepath["http://localhost/tsfxresources/ssvnsouh/MyEng.pdf"] = "http://localhost/Output/WebUserRead/PDFPreview/MyEng.svg";
        var svgAndPdfFilepathList = new Object();
        svgAndPdfFilepathList["result"] = svgAndPdfFilepath;
        httpBackend.expectGET(apiPaths.createResourcesNotesPreview + "?hiddenCode=" + hiddenCode + "&svgFileName=" + svgFileName).respond(svgAndPdfFilepathList);
        _resourceNotesService.createResourcesNotesPreview(hiddenCode, svgFileName).then(function (data) {
            expect(data).not.toBeNull();
        });
        httpBackend.flush();
    });
});
//# sourceMappingURL=resourceNotesServiceSpec.js.map