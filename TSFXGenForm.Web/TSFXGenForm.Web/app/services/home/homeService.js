app.factory('homeService', function($resource) {
    return {
        
        CheckQuizIsAvailableOrNot: function (hiddenCode) {

            return $resource(apiPaths.checkQuizIsAvailableOrNot).get({ hiddenCode: hiddenCode }).$promise;
        },
        CallBasedOnMediaHandlerID: function(hiddencode) {
            return $resource(apiPaths.callBasedOnMediaHandlerID).get({ hiddencode: hiddencode }).$promise;
        },
        GetDetailsForIntroPage: function (hiddenCode) {

            return $resource(apiPaths.getDetailsForIntroPage).get({ hiddenCode: hiddenCode }).$promise;

        },
        GetDetailsOfQuizOnIntroLoadPage: function(hiddenCode) {
            return $resource(apiPaths.getDetailsOfQuizOnIntroLoadPage).get({ hiddenCode: hiddenCode }).$promise;
        }
    }

})