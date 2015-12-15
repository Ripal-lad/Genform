 /// <reference path="../../../../scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../scripts/typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../../app.ts" />

describe('resourceLinkControllerSpec', () => {
    var scope,
        $controllerConstructor: ng.IControllerService,
        mockedEventService,
        $qservice,
        resourceLinkController,
        defered;
    
    beforeEach(angular.mock.module('app'));

    beforeEach(inject(($controller: ng.IControllerService,
        $rootScope: ng.IRootScopeService,
        $q: ng.IQService,
        resourceLinkService) => {

        scope = $rootScope.$new(true);
        $controllerConstructor = $controller;
        mockedEventService = resourceLinkService;
        $qservice = $q;
        defered = $q.defer();
        spyOn(mockedEventService, 'createResourceLinkPreview').and.returnValue(defered.promise);
      
        //Initialize fixture
        initializeTest();
    }));

    //setup controller.
    it('should setup controller scope',() =>{
        expect(scope).toBeDefined();
    });

    //should get selected resource and bind it to UI.
    it('Should get selected resource and bind it to UI.',()=> {

        var selectedResource = new Object();
        selectedResource["Id"] = 7379;
        selectedResource["MediaHandlerId"] = 2;
        selectedResource["HiddenCode"] = "wmbhwquq";
        selectedResource["FileSizes"] = null;
        selectedResource["FilePages"] = null;
        selectedResource["FileNames"] = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry/|";
        selectedResource["URL"] = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry|";
        selectedResource["Description"] = "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog ";
        selectedResource["ResourceLinkImagePath"] = "http://localhost/tsfxresources/wmbhwquq/thumb_1_750x750.jpg";
        selectedResource["Title"] = "Bride's special dance will probably make you cry";
        selectedResource["ShortDescription"] = null;
        selectedResource["CreateDateTime"] = "27-Mar-2013 9:52:39 PM";

        defered.resolve(selectedResource);
        resourceLinkController.getSelectedResource();
        scope.$root.$apply();
        expect(scope.imageShow).toEqual(true);
        expect(scope.messageShow).toEqual(false);
        expect(scope.resource).toEqual(selectedResource);

    });


    function initializeTest() {
        resourceLinkController = $controllerConstructor('ResourceLinkController', {
            $scope: scope,
            resourceLinkService: mockedEventService,
            $routeParams: { hiddenCode: 'wmbhwquq' }
        });

    }
})