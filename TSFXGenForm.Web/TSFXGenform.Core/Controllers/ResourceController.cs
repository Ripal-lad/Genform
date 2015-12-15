
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Utils.GlobalUtils;
using TSFXGenform.Utils.Repository;
using TSFXGenform.Utils.IRepository;
using TSFXGenform.Utils;

namespace TSFXGenform.Core.Controllers
{
    public class ResourceController : ApiController
    {

        #region "Private variable(s)"

        private readonly IGLobalRepository _globalRepsoitory;
        private readonly IResourceRepository _repository;
        private readonly ICacheMemoryRepository _cacheMemoryRepository;
        private readonly StringConstant _stringConstant;
        private readonly string _resourceFilePath;

        #endregion

        #region "Public variable(s)"

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="cacheMemoryRepository"></param>
        /// <param name="stringConstant"></param>
        public ResourceController(IResourceRepository repository,
            ICacheMemoryRepository cacheMemoryRepository,
            StringConstant stringConstant,
            IGLobalRepository globalRepsoitory)
        {
            _globalRepsoitory = globalRepsoitory;
            _repository = repository;
            _cacheMemoryRepository = cacheMemoryRepository;
            _stringConstant = stringConstant;
            _resourceFilePath = Path.Combine(_stringConstant.BaseXmlFileFolderPath, _stringConstant.XmlFileFolderPath);
        }

        #region "Resources"

        /// <summary>
        /// Method to get all the resouces from XML file of Resource
        /// </summary>
        /// <returns>Resources</returns>
        //public Resources GetResourceXmlData()
        //{
        //    if (!string.IsNullOrEmpty(_stringConstant.ResourceXmlFilePath) &&
        //        !string.IsNullOrEmpty(_stringConstant.ResourceXmlFilePath))
        //    {
        //        var xmlFilePath = Path.Combine(_resourceFilePath, _stringConstant.ResourceXmlFilePath);

        //        //Check whether xml file exist or not.
        //        if (File.Exists(xmlFilePath))
        //        {
        //            var extension = Path.GetExtension(xmlFilePath);

        //            if (!string.IsNullOrWhiteSpace(extension) && extension.Equals(".xml"))
        //            {
        //                //Call method to set list of Resources into cache memory.
        //                var resourceList = _repository.SetAndGetResourceDataIntoCacheMemory(_resourceFilePath,
        //                    _stringConstant.ResourceXmlFilePath);

        //                return resourceList;
        //            }
        //        }
        //        else
        //        {
        //            var ex = new Exception("File does not exist.");
        //            LogSystem.EmailLogException(ex, 0,
        //                "ResourceController : GetResourceXmlData - Resource xml does not exist ");
        //        }

        //    }
        //    else
        //    {
        //        if (string.IsNullOrEmpty(_resourceFilePath))
        //        {
        //            var ex = new Exception("Path does not exist.");
        //            LogSystem.EmailLogException(ex, 0,
        //                "ResourceController : GetResourceXmlData - ResourceFilePath does not exist ");
        //        }

        //        if (string.IsNullOrEmpty(_stringConstant.ResourceXmlFilePath))
        //        {
        //            var ex = new Exception("Path does not exist.");
        //            LogSystem.EmailLogException(ex, 0,
        //                "ResourceController : GetResourceXmlData - _resourceXmlFilePath does not exist ");
        //        }
        //    }
        //    return null;
        //}

        
        /// <summary>
        /// Method to get resource details from Resource XML file based on hiddencode passed 
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/callbaseonmediahandlerid")]
        [HttpGet]
        public IHttpActionResult CallBasedOnMediaHandlerID(string hiddenCode)
        {
            try
            {
                //Check for its MediaHandlerId and call Link,Notes and Quiz
                if (!string.IsNullOrWhiteSpace(hiddenCode))
                {
                    if (!string.IsNullOrWhiteSpace(_resourceFilePath) &&
                        !string.IsNullOrWhiteSpace(_stringConstant.ResourceXmlFilePath))
                    {
                        var xmlFilePath = Path.Combine(_resourceFilePath, _stringConstant.ResourceXmlFilePath);

                        #region "Get Xml file data"

                        //Get resource xml file data from cache memory.
                        var resourceDetailList =
                            _repository.GetXmlFileDataFromCacheMemory();
                        //GetResourceDataFromCacheMemory(_resourceFilePath, _stringConstant.ResourceXmlFilePath);

                        if (resourceDetailList == null)
                        {
                            //If cache memory contains null value then read Xml file and store it in the Cache memory.
                            resourceDetailList = _repository.SetAndGetResourceDataIntoCacheMemory(_resourceFilePath,
                                _stringConstant.ResourceXmlFilePath);
                        }
                        else
                        {
                            //If cache contains data then check whether the file has been modified or not.
                            var isFileModiFied = _cacheMemoryRepository.CheckModifiedTimeStampOfXmlFile(xmlFilePath,
                                _stringConstant.ResourceXmlFileCacheKey);

                            if (isFileModiFied)
                            {
                                //If file has been modified read Xml file data and store it in cache memory.
                                resourceDetailList = _repository.SetAndGetResourceDataIntoCacheMemory(_resourceFilePath,
                                    _stringConstant.ResourceXmlFilePath);
                            }
                        }

                        #endregion

                        //Check length of hiddencode
                        if (_repository.CheckHiddenCodeLength(hiddenCode, _stringConstant.HiddenCodeLength) &&
                            resourceDetailList != null &&
                            resourceDetailList.ListOfResourceses != null &&
                            resourceDetailList.ListOfResourceses.Count > 0)
                        {
                            //Check if passed hiddencode exits in XML file and get its details
                            var selectedResourceDetails = _repository.CheckHiddenCodeExists(hiddenCode,
                                resourceDetailList);
                            selectedResourceDetails.IsRunningLocally = GlobalPath.IsRunningLocally;
                            if (selectedResourceDetails != null)
                            {
                                return Ok(new {result = selectedResourceDetails});
                            }
                        }
                    }
                }
                return Ok(new {result = "null"});
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "ResourceController : CallBasedOnMediaHandlerID");
                throw;
            }
        }

        #endregion

        #region "Resources - Link Preview"

       
        /// <summary>
        /// Method to generate Resource link preview and return selected resource for the matched hiddencode.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/resource/link")]
        [HttpGet]
        public IHttpActionResult CreateResourceLinkPreview(string hiddenCode)
        {
            Resource selectedResource = null;
            if (!string.IsNullOrWhiteSpace(hiddenCode) && !string.IsNullOrWhiteSpace(_stringConstant.ResourceImageName) &&
                !string.IsNullOrWhiteSpace(_stringConstant.AppWriteWebReadResourceDataFolderPath) &&
                !string.IsNullOrWhiteSpace(_stringConstant.AppWriteWebReadFolderPath))
            {
                var imagepath = _stringConstant.PathForFormsFolder + "/" + _stringConstant.AppWriteWebReadFolderPath +
                                "/" +
                                _stringConstant.AppWriteWebReadResourceDataFolderPath;

                //Check hidden code length.
                var hiddenCodelength = _repository.CheckHiddenCodeLength(hiddenCode, _stringConstant.HiddenCodeLength);
                if (hiddenCodelength)
                {
                    if (!string.IsNullOrWhiteSpace(_resourceFilePath) &&
                        !string.IsNullOrWhiteSpace(_stringConstant.ResourceXmlFilePath))
                    {
                        //Get Resources data from cache memory.
                        var resourceList = _repository.GetXmlFileDataFromCacheMemory();
                            //GetResourceDataFromCacheMemory(_resourceFilePath, _stringConstant.ResourceXmlFilePath);
                        if (resourceList != null && resourceList.ListOfResourceses != null &&
                            resourceList.ListOfResourceses.Count > 0)
                        {
                            //Get selected resource.
                           selectedResource = _repository.CheckHiddenCodeExists(hiddenCode, resourceList);
                            if (selectedResource != null)
                            {
                                var resourceImagePath = imagepath + "/" + selectedResource.HiddenCode;

                                //Check image exist.
                                var imageExist = _repository.ImageForResourceLinkExist(resourceImagePath,
                                    _stringConstant.ResourceImageName);
                                if (imageExist)
                                {
                                    //Assign image path.
                                    selectedResource.ResourceLinkImagePath = Path.Combine(resourceImagePath,
                                        _stringConstant.ResourceImageName);
                                }
                            }
                        }
                    }
                    else
                    {
                        var ex = new Exception("Path does not exist.");
                        LogSystem.EmailLogException(ex, 0,
                            "ResourceController : CreateResourceLinkPreview - ResourceFilePath Does not exist ");
                        return Ok(new {result = "Xml File for the Resource Link feature is empty."});
                    }

                }
            }
            else
            {
                if (string.IsNullOrEmpty(_stringConstant.ResourceImageName))
                {
                    var ex = new Exception("Path does not exist");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourceLinkPreview - resourceImageName Does not exist ");
                }

                if (string.IsNullOrEmpty(_stringConstant.AppWriteWebReadResourceDataFolderPath))
                {
                    var ex = new Exception("Path does not exist");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourceLinkPreview - AppWriteWebReadResourceDataFolderPath Does not exist ");
                }

                if (string.IsNullOrEmpty(_stringConstant.AppWriteWebReadFolderPath))
                {
                    var ex = new Exception("Path does not exist");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourceLinkPreview - AppWriteWebReadFolderPath Does not exist ");
                }
            }
            return Ok(selectedResource);
        }

        #endregion

        #region "Resources - Notes Preview"

    
        /// <summary>
        /// Method to get PDF to SVG files for passed Hidden code
        /// </summary>
        /// <param name="svgFileName"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/resource/notes")]
        [HttpGet]
        public IHttpActionResult CreateResourcesNotesPreview(string svgFileName, string hiddenCode)
        {
            GlobalPath.Path();
            Dictionary<string, List<string>> svgFileList = null;
            var listOfPdfFiles = new List<string>();

            if (string.IsNullOrWhiteSpace(hiddenCode)) return null;

            //Get selected resource.
            var selectedResource = GetResourceDetailsForHiddenCodePassed(hiddenCode);

            if (selectedResource == null) return Ok(new {result = "null"});

            //Get filename from selected resource.
            var fileNames =
                ((System.Web.Http.Results.OkNegotiatedContentResult<Resource>) (selectedResource)).Content.FileNames;
            string[] listOfFiles = fileNames.Split('|');

            for (var i = 0; i < listOfFiles.Count() - 1; i++)
            {
                var splittedFile = listOfFiles[i].Split('.');
                listOfPdfFiles.Add(listOfFiles[i]);

                //"-Preview.pdf" is appended to filename(s) obtained from Xml to check whether the filename with 
                //"-Preview" exists or not.
                listOfPdfFiles.Add(splittedFile[0] + "-Preview.pdf");
            }

            if (string.IsNullOrWhiteSpace(_stringConstant.LocalOutPutFolderPath))
            {
                var ex = new Exception("Path does not exist.");
                LogSystem.EmailLogException(ex, 0,
                    "ResourceController : CreateResourcesNotesPreview - LocalOutPutFolderPath Does not exist ");
            }
            var fileName = svgFileName.Split('.');

            //Path where the svg file is stored.
            var destFilePath = Path.Combine(GlobalPath.DestPdfFilePath, hiddenCode, fileName[0] + "");
            //Temporary path to create svg file path.
            var appWriteWebWriteFolderPath = Path.Combine(GlobalPath.AppWriteWebWriteTempFilesFolderPath,
                hiddenCode, fileName[0] + "");
            //Local PC path fro Svg file.
            var appWriteWebReadFolderPath = Path.Combine(GlobalPath.AppWriteWebReadPath, hiddenCode,
                fileName[0] + "");

            if (!string.IsNullOrWhiteSpace(_stringConstant.PathForFormsFolder) &&
                !string.IsNullOrWhiteSpace(_stringConstant.ServerOutPutFolderPath) &&
                !string.IsNullOrWhiteSpace(_stringConstant.AppWriteWebReadResourceDataFolderPath) &&
                !string.IsNullOrWhiteSpace(_stringConstant.AppWriteWebReadFolderPath) &&
                !string.IsNullOrWhiteSpace(_stringConstant.HostNameForDownloadFile))
            {
                var sourcePath = Path.Combine(_stringConstant.PathForFormsFolder,
                    _stringConstant.AppWriteWebReadFolderPath,
                    _stringConstant.AppWriteWebReadResourceDataFolderPath);

                var sourcePathWithHiddenCode = Path.Combine(sourcePath, hiddenCode);

                //Check if PDF file exists
                if (_repository.CheckIfPdfFileExists(sourcePathWithHiddenCode, listOfFiles))
                {
                    //Convert PDF files to SVG
                    svgFileList =
                        _repository.CreatePdftoSvgFiles(sourcePathWithHiddenCode, hiddenCode,
                            destFilePath, appWriteWebWriteFolderPath, appWriteWebReadFolderPath, listOfPdfFiles,
                            svgFileName, _stringConstant.HostNameForDownloadFile);
                    //CreatePdftoSvgFiles(sourcePathWithHiddenCode,
                    //    hiddenCode,
                    //    destFilePath,
                    //    appWriteWebWriteFolderPath, appWriteWebReadFolderPath, listOfPdfFiles, svgFileName, _stringConstant.HostNameForDownloadFile);
                   
                       // return Ok(svgFileList);
                }
            }
            else
            {
                if (string.IsNullOrEmpty(destFilePath))
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourcesNotesPreview - outputFolderPathToViewSvgFiles Does not exist ");
                }
                if (string.IsNullOrEmpty(_stringConstant.ServerOutPutFolderPath))
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourcesNotesPreview - ServerOutPutFolderPath Does not exist ");
                }
                if (string.IsNullOrEmpty(appWriteWebWriteFolderPath))
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourcesNotesPreview - outputFolderPathToViewSvgFilesLocally Does not exist ");
                }
                if (string.IsNullOrEmpty(_stringConstant.PathForFormsFolder))
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourcesNotesPreview - PathForFormsFolder Does not exist ");
                }

                if (string.IsNullOrEmpty(_stringConstant.AppWriteWebReadResourceDataFolderPath))
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourcesNotesPreview - AppWriteWebReadResourceDataFolderPath Does not exist ");
                }

                if (string.IsNullOrEmpty(_stringConstant.AppWriteWebReadFolderPath))
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : CreateResourcesNotesPreview - AppWriteWebReadFolderPath Does not exist ");
                }
            }
            return Ok(svgFileList);
        }


        /// <summary>
        /// Method to get selected Resource for File Name, File Size and File Pages details
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <returns>IHttpActionResult</returns>
        [Route("api/resource/selectedresourcedetail")]
        [HttpGet]
        public IHttpActionResult GetResourceDetailsForHiddenCodePassed(string hiddenCode)
        {
            if (string.IsNullOrWhiteSpace(hiddenCode)) return null; //return message "Parameter code value is null"

            //Check length of Hidden code
            var isHiddenCodelengthProper = _repository.CheckHiddenCodeLength(hiddenCode, _stringConstant.HiddenCodeLength);

            if (isHiddenCodelengthProper)
            {
                if (!string.IsNullOrWhiteSpace(_resourceFilePath) && !string.IsNullOrWhiteSpace(_stringConstant.ResourceXmlFilePath))
                {
                    //get Resources data from cache memory.
                    var resourceList = _repository.GetXmlFileDataFromCacheMemory();//GetResourceDataFromCacheMemory(_resourceFilePath, _stringConstant.ResourceXmlFilePath);
                    if (resourceList != null && resourceList.ListOfResourceses != null &&
                        resourceList.ListOfResourceses.Count > 0)
                    {
                        //Check if Hidden code exists
                        var selectedResource = _repository.CheckHiddenCodeExists(hiddenCode, resourceList);
                        if (selectedResource != null)
                        {
                            //Check if selected resource details are not null
                            //if (CheckResourceNotesDetailsIsNotNull(selectedResource))
                            //{
                            //Calculate File Size
                            var pdfFileSizes = selectedResource.FileSizes.Split('|');
                            string calculatedPdfFileSizes =
                                (from pdfFileSize in pdfFileSizes
                                 where !string.IsNullOrEmpty(pdfFileSize)
                                 select Math.Round(Convert.ToDouble(pdfFileSize) /_stringConstant.PdfFileSizeInBytes)).Aggregate(
                                        string.Empty,
                                        (current, calcResult) => current + "|" + Convert.ToString(calcResult));

                            selectedResource.CalculatedPdfFileSizesinKb = calculatedPdfFileSizes;

                            return Ok(selectedResource);
                            //}
                            //else
                            //{
                            //    return Ok(new { result = "Matched Resource contains null value" });
                            //}
                        }
                        else
                        {
                            return Ok(new { result = "Resource not found" });
                        }
                    }
                    else
                    {
                        return Ok(new { result = "Xml file does not contain data." });
                    }
                }
                else
                {
                    var ex = new Exception("Path does not exist.");
                    LogSystem.EmailLogException(ex, 0,
                        "ResourceController : GetResourceDetailsForHiddenCodePassed - ResourceFilePath Does not exist ");
                    return Ok(new { result = "Xml File for the Resource Link feature is empty." });
                }
            }
            else
            {
                return Ok(new { result = "Invalid Preview Code." });
            }

        }

       
        #endregion

        #region "Download file"

        /// <summary>
        /// Download pdf file from web.
        /// </summary>
        /// <param name="hiddenCode"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [Route("api/downloadfile")]
        [HttpGet]
        public HttpResponseMessage DownloadFile(string hiddenCode, string fileName)
        {
            try
            {
                HttpResponseMessage httpResponse = null;
                if (!string.IsNullOrWhiteSpace(hiddenCode) && !string.IsNullOrWhiteSpace(fileName))
                {
                    //Path to download PDF file.
                    if (!string.IsNullOrWhiteSpace(_stringConstant.BaseXmlFileFolderPath) && !string.IsNullOrWhiteSpace(_stringConstant.AppWriteWebReadFolderPath) &&
                        !string.IsNullOrWhiteSpace(_stringConstant.AppWriteWebReadResourceDataFolderPath))
                    {
                        var downLodPdfpath = Path.Combine(_stringConstant.PathForFormsFolder, _stringConstant.AppWriteWebReadFolderPath,
                            _stringConstant.AppWriteWebReadResourceDataFolderPath, hiddenCode, fileName);

                        LogSystem.EmailLogMessage(1, "DownloadFile", "Local downLodPdfpath : " + downLodPdfpath);

                        var request = (HttpWebRequest)WebRequest.Create(downLodPdfpath);
                        var response = request.GetResponse();
                        byte[] bytes = null;
                        if (response != null)
                        {
                            using (var stream = response.GetResponseStream())
                            {
                                if (stream != null)
                                    using (var sr = new StreamReader(stream))
                                    {
                                        var content = sr.ReadToEnd();
                                        var len = content.Length;
                                        bytes = PdfDocuments.CompatiblePdfReader.Httpwebrequest(downLodPdfpath, len);
                                        if (bytes.Length == 0) return null;
                                    }
                            }
                        }

                        //Read all the bytes of the file.
                        httpResponse = new HttpResponseMessage(HttpStatusCode.OK)
                        {
                            Content = new ByteArrayContent(bytes)
                        };

                        httpResponse.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                        httpResponse.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                        {
                            FileName = fileName
                        };
                    }
                }
                return httpResponse;
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "ResourceController : DownLoadPdfFile");
                throw;
            }
        }


        #endregion

        #region "IP Board permission(s)"

        /// <summary>
        /// Method to call IP Board Group permission repository method
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="ipBoardMemberId"></param>
        /// <param name="ipCurrentUserSession"></param>
        /// <returns>bool</returns>
        [Route("api/ipboardgrouppermission")]
        [HttpGet]
        public IHttpActionResult IpBoardGroupPermission(int ipBoardMemberId, string ipCurrentUserSession)
        {
            try
            {
                //var result = _repository.IpBoardGroupPermission(_stringConstant.StrIpBoardConnectionString, ipBoardMemberId, ipCurrentUserSession);
                return Ok(new { result = true });
            }
            catch (Exception ex)
            {
                LogSystem.HandleLogException(ex, "ResourceController : IpBoardGroupPermission");
                throw;
            }

        }

        /// <summary>
        /// Method to call IP Board view resource permission repository method
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="ipBoardMemberId"></param>
        /// <param name="ipCurrentUserSession"></param>
        /// <param name="strTsfxHiddenCode"></param>
        /// <returns>bool</returns>
        [Route("api/ipboardapplyviewresourcepermission")]
        [HttpGet]
        public IHttpActionResult IpBoardApplyViewResourcePermission(int ipBoardMemberId,
            string ipCurrentUserSession, string strTsfxHiddenCode)
        {
            try
            {
                var result = _repository.IpBoardApplyViewResourcePermission(_stringConstant.StrIpBoardConnectionString, ipBoardMemberId,
                ipCurrentUserSession, strTsfxHiddenCode);
                return Ok(new { result = result });
            }
            catch (Exception ex)
            {
                LogSystem.HandleLogException(ex, "ResourceController : IpBoardGroupPermission");
                throw;

            }

        }

        #endregion


        #endregion
    }


}
