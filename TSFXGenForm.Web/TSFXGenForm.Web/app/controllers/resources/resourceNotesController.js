/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
var ResourceNotesController = (function () {
    function ResourceNotesController($scope, resourceNotesService, resourceLinkService, $rootScope, $mdDialog, $location, $routeParams, $sce, $timeout, $log) {
        var _this = this;
        this.$scope = $scope;
        this.resourceNotesService = resourceNotesService;
        this.resourceLinkService = resourceLinkService;
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.$sce = $sce;
        this.$timeout = $timeout;
        this.$log = $log;
        $scope.title = "ResourceNotesController";
        this.$scope.listofFiles = [];
        this.$scope.svgFileContentArray = new Array();
        this.$scope.resourceTitle = "";
        this.$scope.multipleFileButtonValue = false;
        this.$scope.multipleFileData = new Array();
        this.$scope.progerssBarShow = true;
        this.$scope.downloadPdfPath = "";
        this.$scope.svgFilepath = "";
        this.$scope.isDownLoadAllowed = false;
        $scope.multipleFile = function (fileData) { return _this.multipleFile(fileData); };
        this.$scope.downloadFile = function (downLoadFilePath) { return _this.downloadFile(downLoadFilePath); };
        //Routeparams.
        this.ips4MemberId = this.$routeParams.ips4_member_id;
        this.ips4IpSessionFront = this.$routeParams.ips4_IPSessionFront;
        this.$scope.filecountNumber = $routeParams.currentFileNo;
        this.$scope.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
        this.$scope.fileNameFromUrl = $routeParams.fileName; //Get FileName from URL.
        this.$scope.svgFilepath = "";
        if (this.ips4MemberId != null && this.ips4MemberId != undefined && this.ips4IpSessionFront != null && this.ips4IpSessionFront != undefined) {
            this.getSelectedResource();
            //Call method to check for permission of IPBoard.
            var promise = this.resourceLinkService.ipBoardGroupPermission(this.ips4MemberId, this.ips4IpSessionFront);
            promise.then(function (isUserAllowedToDownload) {
                if (isUserAllowedToDownload.result) {
                    //User is allowed to read more.
                    _this.$scope.isDownLoadAllowed = true;
                }
                else {
                    _this.$scope.isDownLoadAllowed = false;
                }
            });
            promise.catch(function () {
                _this.$log.error("Note controller - Exception in ipBoardGroupPermission()");
                //this.$mdDialog.show(this.$mdDialog.alert({
                //    title: 'Alert Box !!',
                //    content: "Exception in ipBoardGroupPermission().",
                //    ok: 'Ok',
                //    escapetoclose: false,
                //    clickoutsidetoclose: false
                //}));
            });
        }
        else {
            this.$log.error("Note controller - Route params are not defined");
            //this.$mdDialog.show(this.$mdDialog.alert({
            //    title: 'Alert Box !!',
            //    content: "Route params are not defined.",
            //    ok: 'Ok',
            //    escapetoclose: false,
            //    clickoutsidetoclose: false
            //}));
            this.$scope.isDownLoadAllowed = false;
        }
        $timeout(function () {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);
    }
    //Get selected resource details form XML file.
    ResourceNotesController.prototype.getSelectedResource = function () {
        var _this = this;
        this.resourceNotesService.getResourceDetailsForHiddenCodePassed(this.$scope.hiddenCode).then(function (xmldata) {
            if (xmldata != null && xmldata.Title != null && xmldata.FileNames != null && xmldata.FileSizes != null && xmldata.FilePages != null) {
                //call method to bind svg files.
                _this.bindSvgFileToUi();
                _this.$scope.listofFiles = xmldata.FileNames.split("|"); //split list of files.
                //var listofFilesizes = xmldata.FileSizes.split("|"); //split list of file sizes.
                var listofFilesizes = xmldata.CalculatedPdfFileSizesinKb.split("|"); //split list of file sizes.
                var listofFilePages = xmldata.FilePages.split("|"); //split list of file pages.
                _this.$scope.resourceTitle = xmldata.Title;
                //Bind filesize and filepageno.
                var i;
                for (i = 0; i < _this.$scope.listofFiles.length - 1; i++) {
                    if (_this.$scope.listofFiles[i] == _this.$scope.fileNameFromUrl) {
                        _this.$scope.fileSizes = listofFilesizes[i + 1];
                        _this.$scope.filePages = listofFilePages[i];
                    }
                }
                //If files are multiple than bind detaols to array.
                if (_this.$scope.listofFiles.length > 2) {
                    _this.$scope.multipleFileButtonValue = true;
                    for (i = 0; i < _this.$scope.listofFiles.length - 1; i++) {
                        _this.$scope.multipleFileData.push({ Key: i, count: i + 1, filesize: listofFilesizes[i + 1], filepage: listofFilePages[i], fileName: _this.$scope.listofFiles[i] });
                    }
                }
            }
            else {
                _this.$log.log("Xml file returns null values. " + JSON.stringify(xmldata));
            }
        });
    };
    //Bind svg data to UI.
    ResourceNotesController.prototype.bindSvgFileToUi = function () {
        var _this = this;
        //Get svg file path and pdf file path. 
        this.resourceNotesService.createResourcesNotesPreview(this.$scope.hiddenCode, this.$scope.fileNameFromUrl).then(function (svgFiledata) {
            _this.$scope.progerssBarShow = false;
            if (svgFiledata != null && svgFiledata != "undefined" && svgFiledata != "null") {
                var svgdata = svgFiledata;
                angular.forEach(svgdata, function (value, key) {
                    if (value != "$$state" && key != "$promise" && key != "$resolved") {
                        if (value.length > 0) {
                            //Add svg file path to array.
                            angular.forEach(value, function (svgFilePath, svgFilePathKey) {
                                _this.$scope.svgFileContentArray.push({ svgFilePath: svgFilePath });
                            });
                            if (_this.$scope.isDownLoadAllowed) {
                                _this.$scope.path = key + "/api/downloadfile/?fileName=" + _this.$scope.fileNameFromUrl + "&hiddenCode=" + _this.$scope.hiddenCode;
                            }
                        }
                        else {
                            _this.$log.log("Svg files does not exist");
                        }
                    }
                });
            }
            else {
                _this.$location.path('/');
                _this.$log.log("SvgFile does not exist");
            }
        });
    };
    //Click event for multiple files.
    ResourceNotesController.prototype.multipleFile = function (filedata) {
        this.$location.path("resource-notes/" + this.$scope.hiddenCode + "/" + filedata.fileName + "/" + filedata.count + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront); //filedata.count is to apply the css changes on button for multiple files.
    };
    ResourceNotesController.prototype.downloadFile = function (downLoadFilePath) {
        if (this.$scope.isDownLoadAllowed) {
        }
        else {
            this.$mdDialog.show(this.$mdDialog.alert({
                title: 'Permission Denied  !!',
                content: "You must log in to download these notes.",
                ok: 'Ok',
                escapetoclose: false,
                clickoutsidetoclose: false
            }));
        }
    };
    ResourceNotesController.controllerId = "ResourceNotesController";
    return ResourceNotesController;
})();
app.controller(ResourceNotesController.controllerId, ['$scope', 'resourceNotesService', 'resourceLinkService', '$rootScope', '$mdDialog', '$location', '$routeParams', '$sce', '$timeout', '$log', function ($scope, resourceNotesService, resourceLinkService, $rootScope, $mdDialog, $location, $routeParams, $sce, $timeout, $log) { return new ResourceNotesController($scope, resourceNotesService, resourceLinkService, $rootScope, $mdDialog, $location, $routeParams, $sce, $timeout, $log); }]);
//# sourceMappingURL=resourceNotesController.js.map