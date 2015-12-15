
interface IimageScaling extends ng.IDirective { }

interface IimageScalingScope extends ng.IScope {
}

class imageScaling implements IimageScaling {
    static directiveId: string = "imageScaling";
    restrict: string = "A";

    constructor(private $interval,private $rootScope) { }

    link = (scope, elem, attrs) => {
        var that = this;
        scope.$watch("shortAndMultipleChoiceAnswerQuestion", ()=> {
            var w = angular.element(window).width();
            var h = angular.element(window).height();
            var imgId = elem.attr('id');

            //get scaling value of image.
            var scalingValue = elem.attr("scaling");

            //Check element is not null.
            if (imgId != "") {
                if (angular.element("img#" + imgId).next("canvas").length < 1)
                    draw(angular.element("img#" + imgId));
            }
            //Function to scale the Images.    
            function draw(image) {
                var scalevalue = image.attr("scaling");
                // alert(scalevalue);

                image = image.get(0);
                console.log("image is" +image);
               
                var cv = document.createElement('canvas'),
                 ctx = cv.getContext("2d");
                image.parentElement.appendChild(cv);
                var timerInterval = that.$interval(() => {
                    var imgWidth = $(image).width();
                    var imgHeight = $(image).height(); 
                    cv.width = imgWidth;
                    cv.height= imgHeight;
                    var setHeight, setWidth;

                    if (scalevalue > 1) {
                        setHeight = (imgHeight / 2.8) * scalevalue;
                        setWidth = (imgWidth / 2.8) * scalevalue;
                    }
                    else {
                        setHeight = imgHeight / 2.8;
                        setWidth = imgWidth / 2.8;
                     
                    }
                    var p = angular.element("div.my-div").width();
                  

                    ctx.drawImage(image, 0, 0, cv.width, cv.height);
                    //for mobile devices
                    if (w < 750) {
                        // for portrait mode 
                        if (w < h) {
                            cv.style.width = setWidth / 2.3 + "px";
                            cv.style.height = setHeight / 2.3 + "px";
                        }
                        //for landscape mode
                        else {
                            cv.style.width = setWidth / 1.9 + "px";
                            cv.style.height = setHeight / 1.9 + "px";
                        }
                    } else if (setWidth > p) {
                        cv.style.width = setWidth / 1.2 + "px";
                        cv.style.height = setHeight / 1.2 + "px";
                    }
                    //desktop and tablet
                    else {
                        cv.style.width = setWidth + "px";
                        cv.style.height = setHeight + "px";
                    }

                }, 2000);
            }
        });
    }
}

// Update the app variable name to be that of your module variable
app.directive(imageScaling.directiveId, ["$interval", "$rootScope", ($interval, $rootScope) =>
    new imageScaling( $interval,$rootScope)
]);
