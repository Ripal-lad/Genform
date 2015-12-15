// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


    interface IendMessagePageControllerScope extends ng.IScope {
        title: string;
        endMessage: string;
        quizTitle: string;
        progressBarValue: boolean;
        pageDetailsValue: boolean;
     
    }

    interface IendMessagePageController {
      
    }

    class EndMessagePageController implements IendMessagePageController {
        static controllerId = "EndMessagePageController";

        private hiddenCode;
        private ips4MemberId;
        private ips4IpSessionFront;

        //Constructor.
        constructor(private $scope: IendMessagePageControllerScope,
            private $rootScope,
            private $cookieStore,
            private endMessagePageService,
            private $routeParams,
            private $location,
            private $log) {
            $scope.title = "EndMessagePageController";
            
            this.$scope.progressBarValue = true;    //Start progress bar.
            this.$scope.pageDetailsValue = false;  //Stop details.

          this.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.

            this.ips4MemberId = $cookieStore.get("ips4_member_id");
            this.ips4IpSessionFront = $cookieStore.get("ips4_IPSessionFront");
            
            if (this.hiddenCode != null && this.hiddenCode != "undefined") {
                this.getQuizDetailsAndBindMessageToUi();
            } else {
                this.$log.log("EndMessagePageController - construtor - Routeparams are not defined");
            }

            $rootScope.$on("onRouteChangeEvent", (event, result)=> {

                $rootScope.$on('$locationChangeStart', ()=> {

                    this.goBack();

                });
            });
        }

        //If browser back buton is clicked then redirect it to IntroPage.
        private goBack() {

            if (!this.$rootScope.browserBackIsClicked) {
                this.$rootScope.browserBackIsClicked = true;
                this.$location.path("/quiz-intro/" + this.hiddenCode + "/" + this.ips4MemberId + "/" + this.ips4IpSessionFront );
            }
        }
        
        //Get details to bind it to ui.
        private getQuizDetailsAndBindMessageToUi() {

            this.endMessagePageService.getQuizSettingDetails(this.hiddenCode).then((introPageDetails) => {

                if (introPageDetails != null) {

                    this.$scope.endMessage = introPageDetails.EndMessage;
                    this.$scope.quizTitle = introPageDetails.Name;
                    this.$scope.progressBarValue = false;    //Stop progress bar.
                    this.$scope.pageDetailsValue = true;  //Show details.
                } else {
                    this.$log.log("EndMessagePageController - getQuizDetailsAndBindMessageToUi() - Details of intro page are not available");
                }

            });
        }
    }
    app.controller(EndMessagePageController.controllerId, ['$scope', '$rootScope','$cookieStore','endMessagePageService', '$routeParams',  '$location','$log',
        ($scope, $rootScope, $cookieStore, endMessagePageService, $routeParams, $location, $log) =>
            new EndMessagePageController($scope, $rootScope, $cookieStore, endMessagePageService, $routeParams, $location, $log)
    ]);