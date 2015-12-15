describe("Audio-Video Directive", function() {

    var compile, rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function($compile, $rootScope) {

        compile = $compile;
        rootScope = $rootScope;
    }));

    it("should have audio player if the URL contains mp3 or ACC extensions", function (){
        var elem = '<div id="myElement_0_1" width="640" height="30" solutionResourcveTitle="A short movie - Emo - The Chemistry of Balance" url="http://cdn.enjoypur.vc/upload_file/5570/6757/%20Bollywood%20Hindi%20Mp3%20Songs%202015/PIKU%20(2015)%20Movie%20Mp3%20Songs/02%20Bezubaan-%20Piku%20%28Anupam%20Roy%29%20190kbps.mp3"  j-w-player-directive></div><br/>';
        $(document.body).append(elem);
        compile($(document.body))(rootScope);
        rootScope.$digest();
        var element = $(document.body).find('#myElement_0_1');
        expect(parseInt(element.attr("height"))).toEqual(30);
    });

    it("should have single video player if the URL is of video.", function () {
        var elem = '<div id="myElement_0_2" width="640" height="360" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://www.youtube.com/watch?v=ti_E2ZKZpC4"  j-w-player-directive></div><br/>';
        $(document.body).append(elem);
        compile($(document.body))(rootScope);
        rootScope.$digest();
        var element = $(document.body).find('#myElement_0_2');
        expect(parseInt(element.attr("height"))).toEqual(360);
        expect(element.attr("solutionResourcveTitle")).toEqual("Chemical Curiosities: Surprising Science and Dramatic Demonstrations");
    });

    it("should have multiple video player if URL is of video.", function () {
        var elem = '<div><div id="myElement_0_3" width="640" height="360" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://localhost/forms/Data/AppWriteWebRead/ResourceData/VCE--Videos-6255.mp4"  j-w-player-directive></div><br/><div id="myElement_1_3" width="640" height="360" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://www.youtube.com/watch?v=u6MfZbCvPCw"  j-w-player-directive></div></div><br/>';
        $(document.body).append(elem);
        compile($(document.body))(rootScope);
        rootScope.$digest();
        var element = $(document.body).find('#myElement_0_3');
        expect(parseInt(element.attr("height"))).toEqual(360);
        expect(element.attr("solutionResourcveTitle")).toEqual("Chemical Curiosities: Surprising Science and Dramatic Demonstrations");
    });

    it("should have multiple audio player if the URL is of audio.", function () {
        var elem = '<div><div id="myElement_0_4" width="640" height="360" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://cdn.enjoypur.vc/upload_file/5570/6757/%20Bollywood%20Hindi%20Mp3%20Songs%202015/PIKU%20(2015)%20Movie%20Mp3%20Songs/02%20Bezubaan-%20Piku%20%28Anupam%20Roy%29%20190kbps.mp3"  j-w-player-directive></div><br/><div id="myElement_1_4" width="640" height="360" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://cdn.enjoypur.vc/upload_file/5570/6757/%20Bollywood%20Hindi%20Mp3%20Songs%202015/PIKU%20(2015)%20Movie%20Mp3%20Songs/02%20Bezubaan-%20Piku%20%28Anupam%20Roy%29%20190kbps.mp3"  j-w-player-directive></div></div><br/>';
        $(document.body).append(elem);
        compile($(document.body))(rootScope);
        rootScope.$digest();
        var element = $(document.body).find('#myElement_0_3');
        expect(parseInt(element.attr("height"))).toEqual(360);
        expect(element.attr("solutionResourcveTitle")).toEqual("Chemical Curiosities: Surprising Science and Dramatic Demonstrations");
    });

    it("should have audio and video player.", function () {
        var elem = '<div><div id="myElement_0_5" width="640" height="360" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://www.youtube.com/watch?v=yKAzVC0WcmI"  j-w-player-directive></div><br/><div id="myElement_1_5" width="640" height="30" solutionResourcveTitle="Chemical Curiosities: Surprising Science and Dramatic Demonstrations" url="http://cdn.enjoypur.vc/upload_file/5570/6757/%20Bollywood%20Hindi%20Mp3%20Songs%202015/PIKU%20(2015)%20Movie%20Mp3%20Songs/02%20Bezubaan-%20Piku%20%28Anupam%20Roy%29%20190kbps.mp3"  j-w-player-directive></div></div><br/>';
        $(document.body).append(elem);
        compile($(document.body))(rootScope);
        rootScope.$digest();
        var element = $(document.body).find('#myElement_0_5');
        expect(parseInt(element.attr("height"))).toEqual(360);

        var audioElement = $(document.body).find('#myElement_1_5');
        expect(parseInt(audioElement.attr("height"))).toEqual(30);
        expect(element.attr("solutionResourcveTitle")).toEqual("Chemical Curiosities: Surprising Science and Dramatic Demonstrations");
    });
})