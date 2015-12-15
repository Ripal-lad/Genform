/// <reference path="../../../scripts/typings/jwplayer/jwplayer.d.ts" />
var jWPlayerDirective = (function () {
    function jWPlayerDirective($rootScope) {
        this.$rootScope = $rootScope;
        this.restrict = "A";
        this.link = function (scope, elem, attr) {
            scope.$watch("jwPlayerArray", function () {
                var audioVideoUrl = attr.url;
                var solutionResourcveTitle = attr.resourcetitle;
                //Get the Id of div which contains jWPlayerDirective directive.
                var elementId = "audiovideo-" + elem.attr("id");
                var videoaudioDivHolder = "<div id='" + elementId + "'></div>";
                // appending a div which will hold the jwplayer
                elem.append(videoaudioDivHolder);
                if (audioVideoUrl != undefined) {
                    //To check whether the entered URL is an audio file or not
                    var audioFormatRegExp = /http:\/\/[\S]+?\.(mp3|aac)/i;
                    var match = audioVideoUrl.match(audioFormatRegExp);
                    if (match) {
                        //Append the URL to display audio.
                        jwplayer(elementId).setup({
                            file: audioVideoUrl,
                            width: 640,
                            height: 30,
                            title: solutionResourcveTitle,
                        });
                    }
                    else {
                        //Append the URL to display video.
                        jwplayer(elementId).setup({
                            file: audioVideoUrl,
                            width: 640,
                            height: 360,
                            title: solutionResourcveTitle,
                        });
                    }
                }
            });
        };
    }
    jWPlayerDirective.directiveId = "jWPlayerDirective";
    return jWPlayerDirective;
})();
// Update the app variable name to be that of your module variable
app.directive(jWPlayerDirective.directiveId, ['$rootScope', function ($rootScope) { return new jWPlayerDirective($rootScope); }]);
//# sourceMappingURL=jWPlayerDirective.js.map