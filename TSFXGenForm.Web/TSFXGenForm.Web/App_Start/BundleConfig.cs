using System.Web;
using System.Web.Optimization;

namespace TSFXGenForm.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery/dist/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/jquery/dist/jquery.js",
                      "~/Scripts/bootstrap/dist/js/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Scripts/bootstrap/dist/css/bootstrap.css",
                      "~/Scripts/bootstrap/dist/css/bootstrap.min.css",
                      "~/Content/style.css",
                      "~/Content/site.css",
                      "~/Scripts/angular-material/angular-material.css"
                      ));

            //bundles for angular files.
            bundles.Add(new StyleBundle("~/angular/js").Include(
                "~/Scripts/hammerjs/hammer.js",
                "~/Scripts/angular/angular.js",
                "~/Scripts/angular-mocks/angular-mocks.js",
                "~/Scripts/angular-animate/angular-animate.js",
                "~/Scripts/angular-aria/angular-aria.js",
                "~/Scripts/angular-resource/angular-resource.js",
                "~/Scripts/angular-route/angular-route.js",
                "~/Scripts/angular-material/angular-material.js",
               "~/Scripts/angular-sanitize/angular-sanitize.js",
                "~/Scripts/angular-messages/angular-messages.js",
                "~/Scripts/angular-cookies/angular-cookies.js",
                "~/Scripts/ng-cookies/dist/ng-cookies.js",
                "~/Scripts/momentjs/min/moment.min.js",
                "~/Scripts/momentjs/min/locales.min.js",
                "~/Scripts/humanize-duration/humanize-duration.js",
                "~/Scripts/angular-timer/app/js/timer.js",
                "~/Scripts/angular-timer/dist/angular-timer.js",
                "~/Scripts/angular-timer/app/js/i18nService.js",
                "~/Scripts/ckeditor/ckeditor.js",
                "~/Scripts/jwplayer/jwplayer.js"
              ));

            //bundles for Genform javascripts.
            bundles.Add(new StyleBundle("~/Genform/js").Include(
              

               "~/app/app.js",
               "~/app/controllers/indexController.js",
               "~/app/controllers/home/homeController.js",
             //   "~/app/stringConstant.js",
               //Models 
                "~/app/models/resources/resource.js",
               

               //Services for Home page.
               "~/app/services/home/homeService.js",

                //Services for Resources
                "~/app/services/resource/resourceLinkService.js",
                "~/app/services/resource/resourceNotesService.js",

                "~/app/directives/quiz/ckEditorDirective.js",
                "~/app/directives/quiz/imageScaling.js",
                "~/app/directives/quiz/jWPlayerDirective.js",
                "~/app/directives/quiz/browserBackButtonDirectiveForQuestionPage.js",
                "~/app/directives/quiz/broswerBackButtonForOtherPages.js",
                "~/app/directives/quiz/scrollContent.js",
                "~/app/directives/quiz/indentDirective.js",

             
               //Controllers for Resources
               "~/app/controllers/home/homeController.js",
               "~/app/controllers/resources/resourceLinkController.js",
               "~/app/controllers/resources/resourceNotesController.js",
               

              //services.
            "~/app/services/quiz/introPageSevice.js",
            "~/app/services/quiz/quizManagerPageService.js",
            "~/app/services/quiz/resultPageService.js",
            "~/app/services/quiz/selfScoringIntroPageService.js",
            "~/app/services/quiz/savedAndPausedPageService.js",
            "~/app/services/quiz/endMessagePageService.js",
            "~/app/services/quiz/answerDrillPageService.js",
            "~/app/services/quiz/selfScoringQuestionPageService.js",
              "~/app/services/quiz/questionPageService.js",

             //controllers for Quiz.
            "~/app/controllers/quiz/introPageController.js",
            "~/app/controllers/quiz/quizManagerPageController.js",
            "~/app/controllers/quiz/resultPageController.js",
            "~/app/controllers/quiz/selfScoringIntroPageController.js",
            "~/app/controllers/quiz/savedAndPausedPageController.js",
            "~/app/controllers/quiz/timerExpiredPageContoroller.js",
            "~/app/controllers/quiz/endMessagePageController.js",
            "~/app/controllers/quiz/countDownController.js",
            "~/app/controllers/quiz/availableQuizMessagePageController.js",
            "~/app/controllers/quiz/answerDrillPageController.js",
            "~/app/controllers/quiz/selfScoringQuestionpageController.js",
            "~/app/controllers/quiz/questionPageController.js"
            ));


            //bundles.Add(new StyleBundle("~/Content/css").Include(
            //        "~/Scripts/bootstrap/dist/css/bootstrap.css",
            //        "~/Content/site.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
