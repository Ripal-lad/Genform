// Install the angularjs.TypeScript.DefinitelyTyped NuGet package

    interface IavailableQuizMessageControllerScope extends ng.IScope {
        title: string;
        progressBarValue: boolean;
        pageDetailsValue: boolean;
        quizTitle:string;
    }

    interface IavailableQuizMessageController {
       
    }

        class AvailableQuizMessageController implements IavailableQuizMessageController {
        static controllerId: string = "AvailableQuizMessageController";

        private hiddenCode;
        constructor(private $scope: IavailableQuizMessageControllerScope,
            private $routeParams,
            private endMessagePageService,
            private $location,
            private $log) {
            $scope.title = "AvailableQuizMessagePageController";

            this.hiddenCode = this.$routeParams.hiddenCode; //Get hiddenCode from URL.
            this.$scope.progressBarValue = true;    //Start progress bar.
            this.$scope.pageDetailsValue = false;     //Hide page details.

            if (this.hiddenCode != null && this.hiddenCode != "undefined") {
                this.getQuizDetailsAndBindMessageToUi();
            } else {
                this.$log.log("AvailableQuizMessageController - construtor - Routeparams are not defined ");
            }

           
        }
     //Get Quiz settings.
     private getQuizDetailsAndBindMessageToUi = function () {

         //Get quiz details to bind QuizName.
         this.endMessagePageService.getQuizSettingDetails(this.hiddenCode).then((quizSettings) =>{

             if (quizSettings != null && quizSettings != undefined && quizSettings.result != "null") {

                    this.$scope.progressBarValue = false;    //Stop progress bar.
                    this.$scope.pageDetailsValue = true;     //Show page details.
                    this.$scope.quizTitle = quizSettings.result.Name;
                } else {
                    this.$log.log("AvailableQuizMessageController - getQuizDetailsAndBindMessageToUi() - Details of QuizSettings are not available. ");
                    this.$location.path('/');
                  
                }

            });
        }
    }
    
    app.controller(AvailableQuizMessageController.controllerId, ['$scope', '$routeParams', 'endMessagePageService',  '$location','$log',
        ($scope, $routeParams, endMessagePageService,  $location, $log) =>
            new AvailableQuizMessageController($scope, $routeParams, endMessagePageService,  $location, $log)
    ]);
