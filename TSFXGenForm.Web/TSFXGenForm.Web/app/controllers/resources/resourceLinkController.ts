/// <reference path="../../app.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../models/resources/resource.ts" />

interface IresourceLinkControllerScope extends ng.IScope {
    getSelectedResource: Function;
    title: string;
    hiddenCode: string;
    imageShow: boolean;
    messageShow: boolean;
    resource: Model.Resource;
    message: string;
    readMoreUrl: string;
    isReadMoreAllowed: boolean;
    readMoreButtonclick: () => void;
}

interface IresourceLinkController {

}

class ResourceLinkController implements IresourceLinkController {
    static controllerId: string = "ResourceLinkController";

    private ips4MemberId;
    private ips4IpSessionFront;

    //Constructor.
    constructor(private $scope: IresourceLinkControllerScope,
        private $window,
        private resourceLinkService,
        private $mdDialog,
        private $routeParams,
        private $log,
        private $timeout) {

        this.$scope.title = "ResourceLinkController";
        this.$scope.imageShow = false;
        this.$scope.messageShow = false;
        this.$scope.resource = new Model.Resource();
        this.$scope.isReadMoreAllowed = false;

        this.$scope.readMoreButtonclick = () => this.readMoreButtonclick();

        //Routeparams.
        this.ips4MemberId = this.$routeParams.ips4_member_id;
        this.ips4IpSessionFront = this.$routeParams.ips4_IPSessionFront;
        this.$scope.hiddenCode = this.$routeParams.hiddenCode;

        if (this.ips4MemberId != null && this.ips4MemberId != undefined && this.ips4IpSessionFront != null && this.ips4IpSessionFront != undefined) {


            //Call method to check for permission of IPBoard to read more about resource.
            var promise = this.resourceLinkService.ipBoardGroupPermission(this.ips4MemberId, this.ips4IpSessionFront);

            promise.then((isUserAllowedToreadMore) => {

                if (isUserAllowedToreadMore.result) {

                    //User is allowed to read more.
                    this.$scope.isReadMoreAllowed = true;

                } else {
                    this.$scope.isReadMoreAllowed = false;
                }
                this.getSelectedResource();
            });


            promise.catch(() => {

                this.$log.error("Note controller - Exception in ipBoardGroupPermission()");
                //this.$mdDialog.show(this.$mdDialog.alert({
                //    title: 'Alert Box !!',
                //    content: "Exception in ipBoardApplyViewResourcePermission().",
                //    ok: 'Ok',
                //    escapetoclose: false,
                //    clickoutsidetoclose: false
               // }));
            });
            //new
            $timeout(() => {
                parent.postMessage({}, location.protocol + "//" + location.host);
            }, 0);

        }
    }

    //Get selected resource.
    private getSelectedResource() {

        this.resourceLinkService.createResourceLinkPreview(this.$scope.hiddenCode).then((xmldata) => {

            if (xmldata != null && xmldata.Title != null && xmldata.URL != null && xmldata.Description != null && xmldata.ResourceLinkImagePath != null) {

                this.$scope.imageShow = true;
                this.$scope.messageShow = false;
                this.$scope.resource = xmldata;

            } else if (xmldata != null && xmldata.Title != null && xmldata.URL != null && xmldata.Description != null && xmldata.ResourceLinkImagePath == null) {

                this.$scope.messageShow = true;
                this.$scope.imageShow = false;
                this.$scope.resource = xmldata;
                this.$scope.message = "Image not found";

            } else {

                this.$log.log("Resource controller - getSelectedResource() - Resource not available " + JSON.stringify(xmldata));
             
            }
        });
    }

    //Read more button click event.
    private readMoreButtonclick() {

        if (this.$scope.isReadMoreAllowed) {
            //If user is allowed to read more.

            this.$window.open(this.$scope.resource.URL, '_blank');

        } else {

            this.$mdDialog.show(this.$mdDialog.alert({
                title: 'Permission Denied !!',
                content: "You must log in to view this link.",
                ok: 'Ok',
                escapetoclose: false,
                clickoutsidetoclose: false
            }));

        }
    }
}
//new
app.controller(ResourceLinkController.controllerId, ['$scope', '$window', 'resourceLinkService', '$mdDialog', '$routeParams','$log','$timeout',
    ($scope, $window, resourceLinkService, $mdDialog, $routeParams,$log,$timeout) =>
        new ResourceLinkController($scope, $window, resourceLinkService, $mdDialog, $routeParams, $log, $timeout)
]);

