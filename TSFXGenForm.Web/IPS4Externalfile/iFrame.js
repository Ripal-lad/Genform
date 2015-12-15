// iframe dynamic height based on content 

function iframeLoaded(hiddenCode) {

    var iframeId = document.getElementById("iframe1");
    var tsfxdomainpath = "http://www.tsfx.com.au/genform3/";
    
    console.log("Load :" + iframeId.src);

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }


    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
    }

    var ips4MemberId;
    var ips4IpSessionFront;
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    console.log("List of cookies = " + cookies);
    for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('=');
        var name = decode(parts.shift());
        var cookie = parts.join('=');

        if (name == "ips4_member_id") {
            ips4MemberId = cookie;
            console.log("Iframe.js : ips4_member_id = " + cookie);
        }
        if (name == "ips4_IPSessionFront") {
            ips4IpSessionFront = cookie;
            console.log("Iframe.js : ips4_IPSessionFront = " + cookie);
        }
    }

    var userId = 1;
    var quizResultSummaryId;
    if (ips4MemberId == undefined || ips4MemberId == "") {
        ips4MemberId = 0;
    }
    if (ips4IpSessionFront == undefined || ips4IpSessionFront == "") {
        ips4IpSessionFront = 1;
    }

    if (iframeId.src == undefined || iframeId.src == "") {


        $.ajax({
            type: 'GET',
            url: "/genform3/api/ipboardgrouppermission",
            data: { "ipBoardMemberId": "" + ips4MemberId + "", "ipCurrentUserSession": "" + ips4IpSessionFront + "", "strTsfxHiddenCode": "" + hiddenCode + "" },
            success: function (isPermissionToViewFile) {

                //If user has permisssion to view Resources and quiz..
                if (isPermissionToViewFile.result) {

                    $.ajax({
                        type: 'GET',
                        url: "/genform3/api/callbaseonmediahandlerid",
                        data: { "hiddenCode": "" + hiddenCode + "" },
                        success: function (xmlFileSeletedResource) {

                            if (xmlFileSeletedResource.result != "null" && xmlFileSeletedResource.result != null && xmlFileSeletedResource.result != undefined && xmlFileSeletedResource != undefined) {

                                var mediaHandlerId = xmlFileSeletedResource.result.MediaHandlerId;
                                var path;
                                if (mediaHandlerId == 1 || mediaHandlerId == 6 || mediaHandlerId == 7) {

                                    //Notes preview.
                                    //Pass the file name to Notes URL.
                                    var splittedFile = xmlFileSeletedResource.result.FileNames.split("|");
                                    var pdfFile = splittedFile[0];

                                    path = "#/resource-notes" + "/" + hiddenCode + "/" + pdfFile + "/" + 1 + "/" + ips4MemberId + "/" + ips4IpSessionFront;
                                    //window.location.href = path;
                                    iframeId.src = tsfxdomainpath + path;
                                    console.log("Path : " + path);


                                } else if (mediaHandlerId == 2) {
                                    //Link preview.

                                    path = "#/resource-link" + "/" + hiddenCode + "/" + ips4MemberId + "/" + ips4IpSessionFront;
                                    iframeId.src = tsfxdomainpath + path;

                                } else if (mediaHandlerId == 3) {

                                    //Quiz.
                                    checkWhetherToShowIntroPageAndRedirect(hiddenCode);

                                    //$scope.path = "#/Quiz-IntroPage/" + hiddenCode;
                                    //return $scope.path;


                                } else if (mediaHandlerId == 4) {
                                    //Quizzes that contain a video solution as defined by the SolutionResourceId will be displayed using these link.

                                    //$scope.message = "Video link from the Reource.xml";

                                } else if (mediaHandlerId == 5) {
                                    //This type of video wil be displayed directly form YouTube link.

                                    //$scope.message = "Video link for youtube link.";
                                }
                               
                            } else {

                                console.log("Selected resource not found.");

                            }

                            if (iframeId.src != null) {
                             
                              

                                window.addEventListener("message", function () {
                                    setTimeout(function () {
                                        $(".spinner").css('display', 'none');
                                        document.getElementById("showIFrame").style.display = "block";
                                        iframeId.height = iframeId.contentWindow.document.body.scrollHeight + "px";
                                        
                                        iframeId.width = "100%";
                                     
                                    }, 4000);
                                });


                            }
                        },
                        error: function () {
                            console.log("Error while retrieving data from CallBasedOnMediaHandlerID method.");
                        }
                    });


                }

                else {

                    alert("You must log in to access this resource.");
                }


                //Check whether to display intro page or not and redirect to question page or intro page.
                function checkWhetherToShowIntroPageAndRedirect(hiddencode) {

                    //Call method to read Xml file and load data into application classes.

                    $.ajax({
                        type: 'GET',
                        url: "/genform3/api/quiz/intropagedetailsonpageload",
                        data: { "hiddenCode": "" + hiddenCode + "" },
                        success: function (dataLoaded) {
                            console.log("Hello1");
                            if (dataLoaded.result) {

                                $.ajax({
                                    type: 'GET',
                                    url: "/genform3/api/Quiz/intropagedetails",
                                    data: { "hiddenCode": "" + hiddenCode + "" },
                                    success: function (introPageDetails) {
                                        //Get QuizDetails.
                                        if (introPageDetails != null && introPageDetails != undefined) {


                                            //Check whether to show introduction page or not.
                                            var path;
                                            if (!introPageDetails.ShowIntroductionPage) {

                                                executeMethodsOfIntroPageAndRedirectToQuestioPageOrCountDownTimerPage(introPageDetails);

                                            } else {

                                                //If intropage is to be shown.
                                                path = "#/quiz-intro/" + hiddenCode + "/" + ips4MemberId + "/" + ips4IpSessionFront;
                                                iframeId.src = tsfxdomainpath + path;
                                            }
                                        } else {

                                            console.log("Quiz details are not available.");
                                        }
                                    },
                                    error: function () {
                                        console.log("Error while retrieving data from CallBasedOnMediaHandlerID method.");
                                    }
                                });
                            } else {

                                console.log("Xml file not loaded properly.");

                            }
                        },
                        error: function () {
                            console.log("Error while retrieving data from CallBasedOnMediaHandlerID method.");
                        }
                    });
                }

                //If Intropage is not to be shown
                function executeMethodsOfIntroPageAndRedirectToQuestioPageOrCountDownTimerPage(introPageDetails) {

                    $.ajax({
                        type: 'GET',
                        url: "/genform3/api/quiz/isquizavailable",
                        data: { "hiddenCode": "" + hiddenCode + "" },
                        success: function (isAvailable) {
                            if (isAvailable.result) {

                                $.ajax({
                                    type: 'GET',
                                    url: "/genform3/api/initializequizdefine",
                                    data: { "hiddenCode": "" + hiddenCode + "" },
                                    success: function (isInitiate) {

                                        if (isInitiate.result) {

                                            //If count down timer page is to be shown.
                                            if (introPageDetails.ShowStartCountDownTimer) {

                                                path = "#/quiz-countdowntimer/" + hiddenCode;
                                                iframeId.src = tsfxdomainpath + path;
                                            } else {


                                                $.ajax({
                                                    type: 'GET',
                                                    url: "/genform3/api/checkifquizquestionpageissaveandpausedbyuser",
                                                    data: { "hiddenCode": "" + hiddenCode + "", "userId": "" + userId + "" },
                                                    success: function (quizResumed) {

                                                        if (quizResumed.result == 0) {

                                                            quizResultSummaryId = quizResumed.result;
                                                            //If quiz is not resumed.
                                                            $.ajax({
                                                                type: 'GET',
                                                                url: "/genform3/api/quiz/firstquestionnumber",
                                                                data: { "hiddenCode": "" + hiddenCode + "" },
                                                                success: function (firstQuestionPage) {

                                                                    var questionNumber = firstQuestionPage.QuestionNumber;
                                                                    path = "#/quiz-question/" + hiddenCode + "/" + questionNumber;
                                                                    iframeId.src = tsfxdomainpath + path;
                                                                },
                                                                error: function () {
                                                                    alert("Error while retrieving data from GetFirstQuestionNumberToLoadOnQuestionPage method.");
                                                                }
                                                            });


                                                        } else {

                                                            //If quiz is resumed.

                                                            $.ajax({
                                                                type: 'GET',
                                                                url: "/genform3/api/quizpagetoresumequiz",
                                                                data: { "hiddenCode": "" + hiddenCode + "", "userId": "" + userId + "" },
                                                                success: function (resumeQuizQuestion) {

                                                                    if (resumeQuizQuestion != null && resumeQuizQuestion.result != null && resumeQuizQuestion.result != undefined) {
                                                                        //Resume from  the question number where user has left the quiz.
                                                                        var questionNumber = resumeQuizQuestion.result.QuestionNumber;
                                                                        path = "#/quiz-question/" + hiddenCode + "/" + questionNumber;
                                                                        iframeId.src = tsfxdomainpath + path;

                                                                    } else {

                                                                        $.ajax({
                                                                            type: 'GET',
                                                                            url: "/genform3/api/checkifselfscoringquestionissaveandpausedbyuser",
                                                                            data: { "hiddenCode": "" + hiddenCode + "", "userId": "" + userId + "" },
                                                                            success: function (selfScoring) {
                                                                                if (!selfScoring.result) {

                                                                                    $.ajax({
                                                                                        type: 'GET',
                                                                                        url: "/genform3/api/selfscoringquestionscount",
                                                                                        data: { "hiddenCode": "" + hiddenCode + "", "quizResultSummaryId": "" + quizResultSummaryId + "" },
                                                                                        success: function (selfScoringQuestion) {

                                                                                            if (selfScoringQuestion.result != 0 && selfScoringQuestion.result != null && selfScoringQuestion.result != "" && selfScoringQuestion.result != "null") {
                                                                                                var selfScoringQuestionCount = selfScoringQuestion.result;
                                                                                                path = "#/quiz-selfscoringintro/" + hiddenCode + "/" + selfScoringQuestionCount + "/" + quizResultSummaryId + "/" + 1;
                                                                                                iframeId.src = tsfxdomainpath + path;

                                                                                            } else {

                                                                                                path = "#/quiz-result/" + hiddenCode + "/" + quizResultSummaryId;
                                                                                                iframeId.src = tsfxdomainpath + path;
                                                                                            }
                                                                                        },
                                                                                        error: function () {
                                                                                            alert("Error while retrieving data from GetSelfScoringQuestionsCount method.");
                                                                                        },
                                                                                    });


                                                                                } else {

                                                                                    path = "#/quiz-result/" + hiddenCode + "/" + quizResultSummaryId;
                                                                                    iframeId.src = tsfxdomainpath + path;

                                                                                }
                                                                            },
                                                                            error: function () {
                                                                                console.log("Error while retrieving data from CheckIfSelfScoringQuestionIsSaveAndPausedByUser method.");
                                                                            }
                                                                        });
                                                                    }
                                                                },
                                                            });


                                                        }
                                                    },
                                                    error: function () {
                                                        console.log("Error while retrieving data from CheckIfQuizQuestionPageIsSaveAndPausedByUser method.");
                                                    }
                                                });

                                            }
                                        }
                                    },
                                    error: function () {
                                        console.log("Error while retrieving data from InitializeQuizDefineOnPageLoad method.");
                                    }
                                });

                            } else {

                                //If intropage is to be shown.
                                var path = "#/quiz-availablequizmessage/" + hiddenCode;;
                                iframeId.src = tsfxdomainpath + path;
                            }
                        },
                        error: function () {
                            console.log("Error while retrieving data from GetDetailsOfQuizOnIntroLoadPage method.");
                        }
                    });
                }
            },
            error: function () {
                console.log("Exception in IpBoardApplyViewResourcePermission().");
            },
        });

    }
}