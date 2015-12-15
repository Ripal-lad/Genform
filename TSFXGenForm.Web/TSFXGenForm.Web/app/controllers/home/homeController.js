app.controller("HomeController", ['homeService', '$rootScope', '$timeout', '$controller', '$routeParams', '$mdDialog', "$scope", '$location','$log',
    function (homeService, $rootScope, $timeout, $controller, $routeParams, $mdDialog, $scope, $location, $log) {
    
    $scope.url = [
            { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=wmbhwquq", "type": "Resources" },
            { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=uwybuyuj", "type": "Resources" },
            { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=wbtqbuac", "type": "Resources" },
            { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=mbgiolku", "type": "Resources" },
            { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=ssvnsouh", "type": "Resources" },
             { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=yv2xdir3", "type": "Resources" },
              { "url": "http://community.tsfx.com.au/genformedge/default.aspx?reskey=abcdefgh", "type": "Resources" }
    ];

    $scope.getUrl = function(url) {

        $scope.parser = document.createElement('a');
        $scope.parser.href = url;
        $scope.searchString = $scope.parser.search;
        var splittedString = $scope.searchString.split("=");

        if (splittedString.length >= 1 && splittedString[1] != null) {

            var hiddenCode = splittedString[1];
            if (hiddenCode != undefined && hiddenCode != "null" && hiddenCode != null) {

                //Get media handler id of the selected resources and check whether it is quiz ,link or notes.
                homeService.CallBasedOnMediaHandlerID(hiddenCode).then(function(xmlFileSeletedResource) {

                    if (xmlFileSeletedResource.result != "null" && xmlFileSeletedResource.result != null && xmlFileSeletedResource.result != undefined && xmlFileSeletedResource != undefined) {

                        var mediaHandlerId = xmlFileSeletedResource.result.MediaHandlerId;
                        if (mediaHandlerId == 1 || mediaHandlerId == 6 || mediaHandlerId == 7) {
                            //Notes preview.
                            //Pass the file name to Notes URL.
                            var splittedFile = xmlFileSeletedResource.result.FileNames.split("|");
                            var pdfFile = splittedFile[0];

                            $scope.path = "/resource-notes" + "/" + hiddenCode + "/" + pdfFile + "/1/1/1";// Passed static value for to work independently
                            $location.path($scope.path);

                            //$scope.path = "#/Resource-Notes" + "/" + hiddenCode + "/" + pdfFile;
                            //return $scope.path;

                        } else if (mediaHandlerId == 2) {
                            //Link preview.
                            $scope.message = "Link preview.";
                       
                            $scope.path = "/resource-link" + "/" + hiddenCode + "/1/2";// Passed static value for to work independently
                            $location.path($scope.path);

                            //$scope.path = "#/Resource-Link" + "/" + hiddenCode;
                            //return $scope.path;

                        } else if (mediaHandlerId == 3) {
                            //Quiz.
                            $scope.checkWhetherToShowIntroPageAndRedirect(hiddenCode);

                            //$scope.path = "#/quiz-intro/" + hiddenCode;
                            //return $scope.path;


                        } else if (mediaHandlerId == 4) {
                            //Quizzes that contain a video solution as defined by the SolutionResourceId will be displayed using these link.

                            $scope.message = "Video link from the Reource.xml";

                        } else if (mediaHandlerId == 5) {
                            //This type of video wil be displayed directly form YouTube link.

                            $scope.message = "Video link for youtube link.";
                        }
                    } else {

                        this.$log.log("Selected resource not found.");
                     
                    }

                });
            }

        } else {

            this.$log.log("Key in the Url is not available.");
         
        }
    }

    //Check whether to display intro page or not and redirect to question page or intro page.
    $scope.checkWhetherToShowIntroPageAndRedirect = function (hiddenCode) {

        //Call method to read Xml file and load data into application classes.
        homeService.GetDetailsOfQuizOnIntroLoadPage(hiddenCode).then(function (dataLoaded) {
         
            if (dataLoaded.result) {

                //Get QuizDetails.
                homeService.GetDetailsForIntroPage(hiddenCode).then(function (introPageDetails) {
                    if (introPageDetails != null && introPageDetails != undefined) {

                        //Check whether to show introduction page or not.
                        if (!introPageDetails.ShowIntroductionPage) {

                            //If inroduction page is not to be shown then execute all database operation and redirect it to QuestionPage or CountDownTimerPage.
                            if (introPageDetails.ShowStartCountDownTimer) {
                                $rootScope.showStartCountDownTimer = true;
                            } else {
                                $rootScope.showStartCountDownTimer = false;
                            }

                            homeService.CheckQuizIsAvailableOrNot(hiddenCode).then(function (isAvailable) {

                                //If quiz is available than add details to Quiz define table and bind details to uI.
                                if (isAvailable.result) {

                                    //If introduction page is not to be shown.
                                    $routeParams.hiddenCode = hiddenCode;
                                    //Create scope for IntroPageController.
                                    var testCtrl1ViewModel = $scope.$new();
                                    //Inject intropage controller to call its all methods.
                                    $controller('IntroPageController', { $scope: testCtrl1ViewModel });

                                    $timeout(function () {
                                        //Call method to redirect on question page without displaying intro page.
                                        testCtrl1ViewModel.beginQuiz();

                                    }, 100);

                                } else {
                                    $scope.path = "/quiz-availablequizmessage/" + hiddenCode;
                                    $location.path($scope.path);
                                }
                            });
                        } else {

                            //If intropage is to be shown.
                            $scope.message = "Quiz";
                            $scope.path = "/quiz-intro/" + hiddenCode + "/1/1"; // Passed static value for to work independently
                            $location.path($scope.path);
                        }
                    } else {
                        this.$log.log("Home controller - checkWhetherToShowIntroPageAndRedirect - Quiz details are not available");
                    }
                });
            } else {
                this.$log.log("Home controller - checkWhetherToShowIntroPageAndRedirect - Xml file not loaded properly");
            }
        });
    }
    
}]);

