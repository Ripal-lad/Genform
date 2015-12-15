describe('resourceNotesControllerSpec', function () {
    var scope, $controllerConstructor, mockedEventService, $qservice, resourceNotesController, mdDialog, defered, deferedSvgFile;
    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function ($controller, $rootScope, $q, $mdDialog, resourceNotesService) {
        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = resourceNotesService;
        mdDialog = $mdDialog;
        $qservice = $q;
        defered = $q.defer();
        deferedSvgFile = $q.defer();
        spyOn(mockedEventService, 'getResourceDetailsForHiddenCodePassed').and.returnValue(defered.promise);
        spyOn(mockedEventService, 'createResourcesNotesPreview').and.returnValue(deferedSvgFile.promise);
        //Initialize fixture
        initializeTest();
    }));
    //setup controller.
    it('should setup controller scope', function () {
        expect(scope).toBeDefined();
        expect(scope.multipleFile).toBeDefined();
    });
    it('multipleFileData should not be null', inject(function () {
        var multipleFileData = new Object();
        multipleFileData["Key"] = "1";
        multipleFileData["count"] = "2";
        multipleFileData["filesize"] = "254";
        multipleFileData["filepage"] = "10";
        multipleFileData["fileName"] = "MyEng.pdf";
        scope.multipleFile(multipleFileData);
        expect(scope.multipleFile).toBeDefined();
    }));
    //get selected resource.
    it('should get selected resource details for single pdf file.', inject(function () {
        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 2;
        selectedResource["HiddenCode"] = "wmbhwquq";
        selectedResource["FilePages"] = "18|";
        selectedResource["FileNames"] = "MyEng.pdf| ";
        selectedResource["FileSizes"] = "|188258|";
        selectedResource["Title"] = "Maths Methods - Unit 4 - Exam 2 - 2005";
        selectedResource["URL"] = null;
        selectedResource["Description"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["ShortDescription"] = null;
        selectedResource["CreateDateTime"] = "27-Mar-2013 9:52:39 PM";
        selectedResource["CalculatedPdfFileSizesinKb"] = "|180|";
        var listofFiles = [];
        listofFiles.push("MyEng.pdf", " ");
        defered.resolve(selectedResource);
        resourceNotesController.getSelectedResource();
        scope.$root.$apply();
        expect(scope.listofFiles.length).toEqual(listofFiles.length);
        expect(scope.resourceTitle).toEqual("Maths Methods - Unit 4 - Exam 2 - 2005");
    }));
    it('should get selected resource details for multiple pdf file.', inject(function () {
        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 2;
        selectedResource["HiddenCode"] = "ssvnsouh";
        selectedResource["FilePages"] = "13|10";
        selectedResource["FileNames"] = "MyEng.pdf|vic-sample-notes-biology.pdf| ";
        selectedResource["FileSizes"] = "365133|259741";
        selectedResource["Title"] = " A Collection of Files ";
        selectedResource["URL"] = null;
        selectedResource["Description"] = null;
        selectedResource["ResourceLinkImagePath"] = null;
        selectedResource["ShortDescription"] = null;
        selectedResource["CreateDateTime"] = "27-Mar-2013 9:52:39 PM";
        selectedResource["CalculatedPdfFileSizesinKb"] = "365133|259741";
        defered.resolve(selectedResource);
        resourceNotesController.getSelectedResource();
        scope.$root.$apply();
        expect(scope.multipleFileData.length).toEqual(2);
    }));
    it('should bind svg file to UI.', inject(function () {
        var svgAndPdfFilepath = new Object();
        svgAndPdfFilepath["http://localhost:3000"] = "http://localhost/forms/Data/AppWriteWebRead/Resource/PDFPreview/MyEng.svg";
        var svgAndPdfFilepathList = new Object();
        svgAndPdfFilepathList["result"] = svgAndPdfFilepath;
        deferedSvgFile.resolve(svgAndPdfFilepath);
        resourceNotesController.bindSvgFileToUi();
        scope.$root.$apply();
        expect(scope.svgFilepath).toBeDefined();
    }));
    it('should prompt alert box if svg file does not exist.', inject(function () {
        var svgAndPdfFilepathList = new Object();
        svgAndPdfFilepathList["result"] = "null";
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        deferedSvgFile.resolve(svgAndPdfFilepathList);
        resourceNotesController.bindSvgFileToUi();
        scope.$root.$apply();
        mdDialog.alert("Alert box  !!");
        expect(resourceNotesController.bindSvgFileToUi).toBeDefined();
    }));
    it('should prompt alert box if xml file does not have any data.', inject(function () {
        var selectedResource = new Object();
        selectedResource["result"] = "null";
        spyOn(mdDialog, "alert").and.returnValue({
            dismiss: function () {
            }
        });
        defered.resolve(selectedResource);
        resourceNotesController.getSelectedResource();
        scope.$root.$apply();
        mdDialog.alert("Alert box  !!");
        expect(resourceNotesController.getSelectedResource).toBeDefined();
    }));
    function initializeTest() {
        resourceNotesController = $controllerConstructor('ResourceNotesController', {
            $scope: scope,
            $mdDialog: mdDialog,
            resourceNotesService: mockedEventService,
            $routeParams: { hiddenCode: 'wbtqbuac', fileName: 'MyEng.pdf' }
        });
    }
});
//# sourceMappingURL=resourceNotesControllerSpec.js.map