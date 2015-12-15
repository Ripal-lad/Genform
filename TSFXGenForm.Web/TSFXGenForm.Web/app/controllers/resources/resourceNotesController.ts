/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />


interface IresourceNotesControllerScope extends ng.IScope {
    title: string;
    hiddenCode: string;
    fileNameFromUrl: string;
    listofFiles: string[];
    resourceTitle: string;
    bindSvgFileToUi: Function;
    fileSizes: number;
    filePages: number;
    multipleFileButtonValue: boolean;
    multipleFileData: any;
    progerssBarShow: boolean;
    downloadPdfPath: string;
    svgFilepath: string;
    trustSrc: (trustSrc) => string;
    multipleFile: (fileData) => void;
    downloadFile: (downLoadFilePath) => void;
    goBack: Function;
    filecountNumber: number;
    isDownLoadAllowed: boolean;
    path: string;

    svgFileContentArray:any;
}

interface IresourceNotesController {

}

class ResourceNotesController implements IresourceNotesController {
    static controllerId: string = "ResourceNotesController";

    private ips4MemberId;
    private ips4IpSessionFront;
    private downloadpath;
    constructor(private $scope: IresourceNotesControllerScope,
        private resourceNotesService,
        private resourceLinkService,
        private $rootScope,
        private $mdDialog,
        private $location,
        private $routeParams,
        private $sce: ng.ISCEService,
        private $timeout,
        private $log) {

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

        $scope.multipleFile = (fileData) => this.multipleFile(fileData);
        this.$scope.downloadFile = (downLoadFilePath) => this.downloadFile(downLoadFilePath);

        //Routeparams.
        this.ips4MemberId = this.$routeParams.ips4_member_id;
        this.ips4IpSessionFront = this.$routeParams.ips4_IPSessionFront;
        this.$scope.filecountNumber = $routeParams.currentFileNo;
        this.$scope.hiddenCode = this.$routeParams.hiddenCode;      //Get hiddenCode from URL.
        this.$scope.fileNameFromUrl = $routeParams.fileName;        //Get FileName from URL.

        this.$scope.svgFilepath = "";

        if (this.ips4MemberId != null && this.ips4MemberId != undefined && this.ips4IpSessionFront != null && this.ips4IpSessionFront != undefined) {

            this.getSelectedResource();
            //Call method to check for permission of IPBoard.
            var promise = this.resourceLinkService.ipBoardGroupPermission(this.ips4MemberId, this.ips4IpSessionFront);

            promise.then((isUserAllowedToDownload) => {

                if (isUserAllowedToDownload.result) {
                    //User is allowed to read more.
                    this.$scope.isDownLoadAllowed = true;

                } else {
                    this.$scope.isDownLoadAllowed = false;
                }

            });
            promise.catch(() => {

                this.$log.error("Note controller - Exception in ipBoardGroupPermission()");
                //this.$mdDialog.show(this.$mdDialog.alert({
                //    title: 'Alert Box !!',
                //    content: "Exception in ipBoardGroupPermission().",
                //    ok: 'Ok',
                //    escapetoclose: false,
                //    clickoutsidetoclose: false
                //}));
            });

        } else {

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
        $timeout(() => {
            parent.postMessage({}, location.protocol + "//" + location.host);
        }, 0);
    }


    //Get selected resource details form XML file.
    private getSelectedResource() {

        this.resourceNotesService.getResourceDetailsForHiddenCodePassed(this.$scope.hiddenCode).then((xmldata) => {

            if (xmldata != null && xmldata.Title != null && xmldata.FileNames != null && xmldata.FileSizes != null && xmldata.FilePages != null) {

                //call method to bind svg files.
                this.bindSvgFileToUi();

                this.$scope.listofFiles = xmldata.FileNames.split("|"); //split list of files.
                //var listofFilesizes = xmldata.FileSizes.split("|"); //split list of file sizes.

                var listofFilesizes = xmldata.CalculatedPdfFileSizesinKb.split("|"); //split list of file sizes.
                var listofFilePages = xmldata.FilePages.split("|"); //split list of file pages.
                this.$scope.resourceTitle = xmldata.Title;

                //Bind filesize and filepageno.
                var i;
                for (i = 0; i < this.$scope.listofFiles.length - 1; i++) {
                    if (this.$scope.listofFiles[i] == this.$scope.fileNameFromUrl) {
                        this.$scope.fileSizes = listofFilesizes[i + 1];
                        this.$scope.filePages = listofFilePages[i];
                    }
                }

                //If files are multiple than bind detaols to array.
                if (this.$scope.listofFiles.length > 2) {
                    this.$scope.multipleFileButtonValue = true;
                    for (i = 0; i < this.$scope.listofFiles.length - 1; i++) {
                        this.$scope.multipleFileData.push({ Key: i, count: i + 1, filesize: listofFilesizes[i + 1], filepage: listofFilePages[i], fileName: this.$scope.listofFiles[i] });
                    }
                }
            } else {
                this.$log.log("Xml file returns null values. " + JSON.stringify(xmldata));

                //this.$location.path('/');
                //this.$mdDialog.show(this.$mdDialog.alert({
                //    title: 'Alert box  !!',
                //    content: "Xml file returns null values.",
                //    ok: 'Ok',
                //    escapetoclose: false,
                //    clickoutsidetoclose: false
                //}));
            }
        });
    }

    //Bind svg data to UI.
    private bindSvgFileToUi() {
        //Get svg file path and pdf file path. 
        this.resourceNotesService.createResourcesNotesPreview(this.$scope.hiddenCode, this.$scope.fileNameFromUrl).then((svgFiledata) => {
          
            this.$scope.progerssBarShow = false;
            if (svgFiledata != null && svgFiledata != "undefined" && svgFiledata != "null") {
               
                var svgdata = svgFiledata;

                angular.forEach(svgdata, (value, key) => {

                    if (value != "$$state" && key != "$promise" && key != "$resolved") {

                        if (value.length > 0) {

                            //Add svg file path to array.
                            angular.forEach(value, (svgFilePath, svgFilePathKey) => {

                                this.$scope.svgFileContentArray.push({ svgFilePath: svgFilePath });
                            });

                            if (this.$scope.isDownLoadAllowed) {

                                this.$scope.path = key + "/api/downloadfile/?fileName=" + this.$scope.fileNameFromUrl + "&hiddenCode=" + this.$scope.hiddenCode;
                            }

                        } else {
                            this.$log.log("Svg files does not exist");
                            //this.$mdDialog.show(this.$mdDialog.alert({
                            //    title: 'Alert Box !!',
                            //    content: "Svg files does not exist.hgfdchgfh",
                            //    ok: 'Ok',
                            //    escapetoclose: false,
                            //    clickoutsidetoclose: false
                            //}));
                        }
                    }
                });
            }
            else {
                this.$location.path('/');
                this.$log.log("SvgFile does not exist");
                //this.$mdDialog.show(this.$mdDialog.alert({
                //    title: 'Alert box  !!',
                //    content: "SvgFile does not exist",
                //    ok: 'Ok',
                //    escapetoclose: false,
                //    clickoutsidetoclose: false
                //}));
            }
        });
    }

    //Click event for multiple files.
    private multipleFile(filedata) {

        this.$location.path("resource-notes/" + this.$scope.hiddenCode + "/" + filedata.fileName + "/" + filedata.count + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront);     //filedata.count is to apply the css changes on button for multiple files.

    }

    private downloadFile(downLoadFilePath) {

        if (this.$scope.isDownLoadAllowed) {
            //If download is allowed.
            // this.$scope.path = this.downloadpath;

        } else {

            this.$mdDialog.show(this.$mdDialog.alert({
                title: 'Permission Denied  !!',
                content: "You must log in to download these notes.",
                ok: 'Ok',
                escapetoclose: false,
                clickoutsidetoclose: false
            }));

        }
    }


}

app.controller(ResourceNotesController.controllerId, ['$scope', 'resourceNotesService', 'resourceLinkService', '$rootScope', '$mdDialog', '$location', '$routeParams', '$sce', '$timeout', '$log',
    ($scope, resourceNotesService, resourceLinkService, $rootScope, $mdDialog, $location, $routeParams, $sce, $timeout, $log) =>
        new ResourceNotesController($scope, resourceNotesService, resourceLinkService, $rootScope, $mdDialog, $location, $routeParams, $sce, $timeout, $log)
]);
