app.directive('ckEditor', ['$rootScope',function ($rootScope) {
    return {
        require: '?ngModel',
        restrict: 'AE',
        link: function (scope, elm, attr, model) {
            var isReady = false;
            var data = [];
            var ck = CKEDITOR.replace(elm[0], {
                toolbar: [
                    { name: 'styles', items: ['Font', 'FontSize'] },
                    { name: 'basicstyles', items: ['Bold', 'Italic'] },
                    { name: 'colors', items: ['TextColor'] },
                    { name: 'insert', items: ['Smiley'] },
                    { name: 'wiris', items: ['ckeditor_wiris_formulaEditor'] }
                ],
                extraPlugins: 'ckeditor_wiris',
                removePlugins: 'elementspath,resize',
                uiColor: '#8BC33E',
                readOnly: $rootScope.isCkEditorReadonly
              
        });

            function setData() {
                if (!data.length) {
                    return;
                }

                var d = data.splice(0, 1);
                ck.setData(d[0] || '<span></span>', function () {
                    setData();
                    isReady = true;
                });
            }

            ck.on('key', function () {
                if ($rootScope.nextIsClicked) {
                    var id = angular.element(elm)[0].parentElement.attributes[0].value;
                    if (angular.element("#" + id).find('.error')) {
                        angular.element("#" + id).siblings('p.error').remove();
                        
                    }
                    console.log("hello");
                }
            });

            ck.on('instanceReady', function (e) {
                if (model) {
                    setData();
                }
            });

            elm.bind('$destroy', function () {
                ck.destroy(false);
            });

          
            if (model) {
                ck.on('change', function () {
                    scope.$apply(function () {
                        var data = ck.getData();
                        if (data == '<span></span>') {
                            data = null;
                        }
                        model.$setViewValue(data);
                    });
                });

                model.$render = function (value) {
                    if (model.$viewValue === undefined) {
                        model.$setViewValue(null);
                        model.$viewValue = null;
                    }

                    data.push(model.$viewValue);

                    if (isReady) {
                        isReady = false;
                        setData();
                    }
                };
            }

        }
    };
}]);

