
using System;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Collections.Generic; 
using Autofac;
using Autofac.Integration.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NUnit.Framework;
using TSFXGenform.Core.Tests.Config;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Repository.Repository;
using TSFXGenform.Utils.GlobalUtils;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;
using IContainer = Autofac.IContainer;

namespace TSFXGenform.Core.Tests.Lib
{
    [TestClass]
    public class ResourceLibTest
    {

        #region "Private Members"

        private IResourceRepository _resourceRepository;
        private ICacheMemoryRepository _cacheRepository;
        private IContainer _mainContainer;
        private Mock<IXmlDataRepository<Resource>> _mockResourceRepository;
        private IContainer _childContainer;

        //Link Preview

        private const string PathForFormsFolder = "http://localhost";
       
         private const string AppWriteWebReadFolderPath="forms/Data/AppWriteWebRead";

         private const string AppWriteWebReadResourceFolderPath = "Resource";
         private const string AppWriteWebReadResourceDataFolderPath = "ResourceData";
        private const string OutputFolderPathToViewSvgFilesLocally = "D:\\Projects\\TSFX Genform\\Genform\\Source\\forms\\Data\\AppWriteWebRead\\Resource";
        private const string AppWriteWebWrite = "D:\\Projects\\TSFX Genform\\Genform\\Source\\forms\\Data\\AppWriteWebWrite";
        private readonly string _destPdfFilePath = Path.Combine(PathForFormsFolder, AppWriteWebReadFolderPath,AppWriteWebReadResourceFolderPath);
    
        const string Filepath = "D:/Projects/TSFX Genform/Genform/Source/forms/Data/AppRead/Resource/resource.xml";
        private const string OutputFileFolder = @"D:\Projects\TSFX Genform\Genform\Source";
        
        const string ResourceImageName="thumb_1_750x750.jpg ";
        private const string Hiddencode = "wmbhwquq";
        private static readonly string ResourceImagePath = Path.Combine(PathForFormsFolder, AppWriteWebReadFolderPath, AppWriteWebReadResourceDataFolderPath, Hiddencode);
        private string HostName = "http://localhost:3000";

      
        //Notes Preview 
        private const string StrSingleDocHiddenCodePath = PathForFormsFolder + "/tsfxresources/wbtqbuac";
        private const string StrSingleDocWithImageHiddenCodePath = PathForFormsFolder + "/tsfxresources/mbgiolku";
        private const string StrMultipleDocHiddenCodePath = PathForFormsFolder + "/tsfxresources/ssvnsouh";

        private readonly string[] _listOfFiles = {"MyEng.pdf", "vic-sample-notes-biology.pdf"};

        readonly List<string> _listOfPdfFilesForSingleDocument = new List<string>();
        readonly List<string> _listOfPdfFilesForImageBasedSingleDocument = new List<string>();
        readonly List<string> _listOfPdfFilesMultipleDocument = new List<string>();

        private const string SingleDocHiddenCode = "wbtqbuac";
        private const string SingleDocWithImageHiddenCode = "mbgiolku";
        private const string MultipleDocHiddenCode = "ssvnsouh";
        
        #endregion
      
        #region "SetUp & TearDown"
        
        /// <summary>
        /// SetUp method
        /// </summary>
        [SetUp]
        public void SetUp()
        {
            XmlDataFileTest.InitializeXmlDataForResources();
            _mainContainer = IocConfig.RegisterDependencies();
            var childContainerBuilder = new ContainerBuilder();
            _mockResourceRepository = new Mock<IXmlDataRepository<Resource>>();
            
            childContainerBuilder.RegisterGeneric(typeof(XmlDataRepository<>)).As(typeof(IXmlDataRepository<>));
            childContainerBuilder.RegisterType<ResourceRepository>().As<IResourceRepository>();
            childContainerBuilder.RegisterType<CacheMemoryRepository>().As<ICacheMemoryRepository>();
            childContainerBuilder.RegisterInstance(_mockResourceRepository.Object).As<IXmlDataRepository<Resource>>();
            _childContainer = childContainerBuilder.Build();
            var resolver = new AutofacDependencyResolver(_childContainer);
            DependencyResolver.SetResolver(resolver);
        }

        /// <summary>
        /// Dispose method
        /// </summary>
        [TearDown]
        public void CleanUpTest()
        {
            if (_resourceRepository != null)
                _resourceRepository.Dispose();
        }

        #endregion

        #region "Resources - Link Preview"
        
        
        /// <summary>
        /// Check Resources in the XML file is not null. 
        /// </summary>
        [Test]
        public void LinkPreview_CheckIfResourceList_IsNotNull()
        {
           _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
            var actual = _resourceRepository.GetResourceXmlData(Filepath);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if data from Xml file is got and store it in cache memory.
        /// </summary>
        //[Test]
        //public void Resource_SetAndGetResourceDataIntoCacheMemory_IsNotNull()
        //{
        //    const string filePath = "D:/Projects/TSFX Genform/Genform/Source/forms/Data/AppRead/Resource";
        //    _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
        //    var actual = _resourceRepository.SetAndGetResourceDataIntoCacheMemory(filePath, "resource.xml");
        //    Assert.IsNotNull(actual);
        //}

         
        /// <summary>
        /// Check to get XML file data from cache memory.
        /// </summary>
        //[Test]
        //public void Resource_GetXmlFileDataFromCacheMemory_IsNotNull()
        //{
        //    const string filePath = "D:/Projects/TSFX Genform/Genform/Source/forms/Data/AppRead/Resource";
        //    _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
        //    var actual = _resourceRepository.GetXmlFileDataFromCacheMemory();
        //    Assert.IsNull(actual);
        //}

        
        /// <summary>
        /// Check if XML file is modified or not.
        /// </summary>
        //[Test]
        //public void Quiz_CheckModifiedTimeStampOfXmlFileForQuiz_IsNotNull()
        //{
        //    _cacheRepository = _childContainer.Resolve<ICacheMemoryRepository>();

        //    var actual = _cacheRepository.CheckModifiedTimeStampOfXmlFile(Filepath, "ResourceModifiedTimeStamp");
        //    Assert.IsNotNull(actual);
        //}

        
        /// <summary>
        /// Check whether the matched hidden code value exist in the resource XML file.
        /// </summary>
        [Test]
        public void LinkPreview_CheckHiddenCode_ExistInTheResourcesXMLFile()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
            var resources = XmlDataFileTest.GetAll();
            var resourceList = new Resources {ListOfResourceses = resources.ToList()};
            var result = _resourceRepository.CheckHiddenCodeExists(Hiddencode, resourceList);
            Assert.IsNotNull(result);
        }
       
        
        /// <summary>
        /// Check values for the resources are not null.
        /// </summary>
        //[Test]
        //public void LinkPreview_CheckResourceLinkDetails_IsNotNull()
        //{
        //    _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
        //    var resources = new Resource
        //    {
        //        Id = 7379,
        //        MediaHandlerId = 6,
        //        Title = "Bride's special dance will probably make you cry",
        //        FileSizes = "",
        //        FilePages = "",
        //        FileNames ="http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry",
        //        HiddenCode = Hiddencode,
        //        CreateDateTime = new DateTime(2015, 12, 01, 16, 42, 54),
        //        URL = "http://www.cbsnews.com/8301-504784_162-57566978-10391705/brides-special-dance-will-probably-make-you-cry|",
        //        Description = "(CBS News) Be warned in advance: this is an emotional roller coaster ride and will probably make you cry (or at least get teary-eyed). If it becomes too much, and you need a quick break, I'd recommend clicking here to watch a kitten meet a hedgehog",
        //        ShortDescription = ""
        //    };
        //    var actual = _resourceRepository.CheckResourceLinkDetailsIsNotNull(resources);
        //    Assert.AreEqual(true, actual);
        //}

        
        /// <summary>
        /// Check whether image exist on the specific path or not.
        /// </summary>
        [Test]
        public void LinkPreview_CheckImageForResourceLinkExist()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
            var actual = _resourceRepository.ImageForResourceLinkExist(ResourceImagePath, ResourceImageName);
            Assert.AreEqual(true, actual);
        }

        
        /// <summary>
        /// Check whether length of the hidden code is 8 or not.
        /// </summary>
        [Test]
        public void LinkPreview_CheckHiddenCodeLength_isEqualtoEight()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
            var actual = _resourceRepository.CheckHiddenCodeLength(Hiddencode, "8");
            Assert.AreEqual(true, actual);
        }

        #endregion

        #region "Resources - Notes Preview"

        
        /// <summary>
        /// Check whether length of the hidden code is 8 or not.
        /// </summary>
        [Test]
        public void NotesPreview_CheckHiddenCodeLength_isEqualtoEight()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();

            //Check for Single document
            var actualSingleDocHiddenCode = _resourceRepository.CheckHiddenCodeLength(SingleDocHiddenCode, "8");
            Assert.AreEqual(true, actualSingleDocHiddenCode);

            //Check for Single document - image based
            var actualSingleDocImageHiddenCode = _resourceRepository.CheckHiddenCodeLength(SingleDocWithImageHiddenCode, "8");
            Assert.AreEqual(true, actualSingleDocImageHiddenCode);

            //Check for Multiple document
            var actualMultipleDocHiddenCode = _resourceRepository.CheckHiddenCodeLength(MultipleDocHiddenCode, "8");
            Assert.AreEqual(true, actualMultipleDocHiddenCode);
        }

       
        /// <summary>
        /// Check whether the matched hidden code value exist in the resource XML file.
        /// </summary>
        [Test]
        public void NotesPreview_CheckHiddenCode_ExistInTheResourcesXMLFile()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
            var resources = XmlDataFileTest.GetAll();
            var resourceList = new Resources { ListOfResourceses = resources.ToList() };

            //Check for Single document 
            var singleDocResult = _resourceRepository.CheckHiddenCodeExists(SingleDocHiddenCode, resourceList);
            Assert.IsNotNull(singleDocResult);

            //Check for Single document - image based
            var singleImageDocResult = _resourceRepository.CheckHiddenCodeExists(SingleDocWithImageHiddenCode, resourceList);
            Assert.IsNotNull(singleImageDocResult);

            //Check for Multiple document
            var multipleDocResult = _resourceRepository.CheckHiddenCodeExists(MultipleDocHiddenCode, resourceList);
            Assert.IsNotNull(multipleDocResult);
        }

        
        /// <summary>
        /// Check values for the resources Notes Preview are not null
        /// </summary>
        //[Test]
        //public void NotesPreview_CheckResourceLinkDetails_IsNotNull()
        //{
        //    _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
        //    var singleDocResource = new Resource
        //    {
        //        Id = 4701,
        //        MediaHandlerId = 1,
        //        Title = "Maths Methods - Unit 4 - Exam 2 - 2005",
        //        FileSizes = "188258|",
        //        FilePages = "18|",
        //        FileNames = "VCE-Maths Methods_Yr 12-Exam Papers-4701.pdf|",
        //        HiddenCode = "wbtqbuac",
        //        CreateDateTime = new DateTime(2012, 07, 02, 0, 0, 0),
        //        URL = null,
        //        Description = null,
        //        ShortDescription = null
        //    };
        //    var actual = _resourceRepository.CheckResourceNotesDetailsIsNotNull(singleDocResource);
        //    Assert.AreEqual(true, actual);
        //}
       
        
        /// <summary>
        /// Check if PDF file exists  
        /// </summary>
        [Test]
        public void NotesPreview_CheckIfPdfFileExists()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();

            var actual = _resourceRepository.CheckIfPdfFileExists(StrSingleDocHiddenCodePath, _listOfFiles);
            Assert.IsNotNull(actual);
        }

        
        /// <summary>
        /// Check if method to convet PDF to SVG does not return null
        /// </summary>
        [Test]
        public void NotesPreview_CreatePdftoSvgFiles_IsNotNull()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();
            GlobalPath.ApplicationCurrentDomainPath =
                @"D:\Projects\TSFX Genform\Genform\Source\TSFXGenForm.Web\TSFXGenForm.Web\";

            _listOfPdfFilesForSingleDocument.Add("VCE-Maths Methods_Yr 12-Exam Papers-4701.pdf");
            _listOfPdfFilesForImageBasedSingleDocument.Add("VCE-Accounting_Yr 12-Essays and Projects-3915.pdf");
            _listOfPdfFilesMultipleDocument.Add("MyEng.pdf");
            _listOfPdfFilesMultipleDocument.Add("vic-sample-notes-biology.pdf");

            //Check for Single document
            var actualSvgFileList = _resourceRepository.CreatePdftoSvgFiles(StrSingleDocHiddenCodePath, "wbtqbuac", _destPdfFilePath, AppWriteWebWrite, OutputFolderPathToViewSvgFilesLocally, _listOfPdfFilesForSingleDocument, "MyEng.pdf", HostName);
            Assert.IsNotNull(actualSvgFileList);
            
            //Check for Single document - image based
            var actualSvgFileListImageBased = _resourceRepository.CreatePdftoSvgFiles(StrSingleDocWithImageHiddenCodePath, "mbgiolku", _destPdfFilePath, AppWriteWebWrite, OutputFolderPathToViewSvgFilesLocally, _listOfPdfFilesForImageBasedSingleDocument, "MyEng.pdf", HostName);
            Assert.IsNotNull(actualSvgFileListImageBased);
            
            //Check for Multiple document
            var actualSvgFileListMultiDoc = _resourceRepository.CreatePdftoSvgFiles(StrMultipleDocHiddenCodePath, "ssvnsouh", _destPdfFilePath, AppWriteWebWrite, OutputFolderPathToViewSvgFilesLocally, _listOfPdfFilesMultipleDocument, "MyEng.pdf", HostName);
            Assert.IsNotNull(actualSvgFileListMultiDoc);
            
        }

        
        /// <summary>
        /// Check if method to convert PDF to SVG return svg file path
        /// </summary>
        [Test]
        public void NotesPreview_CreatePdftoSvgFiles_ReturnSvgFilePathAndPdfDocName()
        {
            _resourceRepository = _mainContainer.Resolve<IResourceRepository>();

            GlobalPath.ApplicationCurrentDomainPath =
               @"D:\Projects\TSFX Genform\Genform\Source\TSFXGenForm.Web\TSFXGenForm.Web\";

            #region "Check for Single document"

            var actualSvgFileList = _resourceRepository.CreatePdftoSvgFiles(StrSingleDocHiddenCodePath, "wbtqbuac", _destPdfFilePath, AppWriteWebWrite, OutputFolderPathToViewSvgFilesLocally, _listOfPdfFilesForSingleDocument, "MyEng.pdf", HostName);
            if (actualSvgFileList != null)
            {
                #region "Check SVG file extension and PDF file not null"

                foreach (var valuePair in actualSvgFileList)
                {
                    //Check if it contains SVG files
                    if (valuePair.Value != null)
                    {
                        foreach (var value in valuePair.Value) {
                            var actualExtension = Path.GetExtension(value);
                            Assert.AreEqual(".svg", actualExtension);
                        }
                     
                    }

                    //Check PDF doc name is not null
                    Assert.IsNotNull(valuePair.Key);
                }

                #endregion
            }
            else
            {
                Assert.IsNotNull(actualSvgFileList);
            }
            #endregion

            #region "Check for Single document - image based"

            var actualSvgFileListImageBased = _resourceRepository.CreatePdftoSvgFiles(StrSingleDocWithImageHiddenCodePath, "mbgiolku", _destPdfFilePath, AppWriteWebWrite, OutputFolderPathToViewSvgFilesLocally, _listOfPdfFilesForImageBasedSingleDocument, "MyEng.pdf", HostName);
            if (actualSvgFileListImageBased != null)
            {
                #region "Check SVG file extension and PDF file not null"

                foreach (var valuePair in actualSvgFileListImageBased)
                {
                    //Check if it contains SVG files

                    if (valuePair.Value != null)
                    {
                        foreach (var value in valuePair.Value)
                        {
                            var actualExtension = Path.GetExtension(value);
                            Assert.AreEqual(".svg", actualExtension);
                        }
                    }

                    //Check PDF doc name is not null
                    Assert.IsNotNull(valuePair.Key);
                }

                #endregion
            }
            else
            {
                Assert.IsNotNull(actualSvgFileListImageBased);
            }

            #endregion

            #region "Check for Multiple document"

            var actualSvgFileListMultiDoc = _resourceRepository.CreatePdftoSvgFiles(StrMultipleDocHiddenCodePath, "ssvnsouh", _destPdfFilePath, AppWriteWebWrite, OutputFolderPathToViewSvgFilesLocally, _listOfPdfFilesMultipleDocument, "MyEng.pdf", HostName);
            if (actualSvgFileListMultiDoc != null)
            {
                #region "Check SVG file extension and PDF file not null"

                foreach (var valuePair in actualSvgFileListMultiDoc)
                {
                    //Check if it contains SVG files
                    if (valuePair.Value != null)
                    {
                        foreach (var value in valuePair.Value)
                        {
                            var actualExtension = Path.GetExtension(value);
                            Assert.AreEqual(".svg", actualExtension);
                        }
                    }


                    //Check PDF doc name is not null
                    Assert.IsNotNull(valuePair.Key);
                }

                #endregion
            }
            else
            {
                Assert.IsNotNull(actualSvgFileListMultiDoc);
            }

            #endregion

        }

        
        #endregion
    }
}


