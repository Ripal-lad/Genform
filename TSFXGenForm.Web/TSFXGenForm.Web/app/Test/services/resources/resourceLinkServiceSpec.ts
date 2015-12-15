describe("resourceLinkServiceSpec", () => {
    var httpBackend, _resourceLinkService,hiddenCode;

    beforeEach(angular.mock.module("app"));

    beforeEach(inject((resourceLinkService, $httpBackend) => {
        httpBackend = $httpBackend;
        _resourceLinkService = resourceLinkService;
        hiddenCode = "wmbhwquq";
    }));


    //should return selected resource.
    it("should return selected resource", ()=> {

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


        httpBackend.expectGET(apiPaths.createResourceLinkPreview + "?hiddenCode=" + hiddenCode).respond(selectedResource);
        _resourceLinkService.createResourceLinkPreview(hiddenCode).then((data)=> {
            expect(data).not.toBeNull();
            expect(data.URL).not.toBeNull();
            expect(data.Description).not.toBeNull();
            expect(data.Title).not.toBeNull();
            expect(data.ResourceLinkImagePath).not.toBeNull();

        });
        httpBackend.flush();

    });
});  