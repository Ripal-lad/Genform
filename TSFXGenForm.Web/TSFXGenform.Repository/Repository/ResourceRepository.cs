using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using MySql.Data.MySqlClient;
using PdfSharp.Pdf;
using TSFXGenform.DomainModel.ApplicationClasses;
using TSFXGenform.Repository.IRepository;
//using TSFXGenform.Utils.GlobalUtils;
using System.Net;
using TSFXGenform.Utils.IRepository;
using TSFXGenform.Utils;
using TSFXGenform.Utils.GlobalUtils;


namespace TSFXGenform.Repository.Repository
{
    public class ResourceRepository : IResourceRepository
    {
        #region "Private variables"

        private readonly IXmlDataRepository<Resources> _xmlDataRepository;
        private readonly ICacheMemoryRepository _cacheMemoryRepository;
        private readonly IGLobalRepository _globalRepository;
        private readonly StringConstant _stringConstant;
        private static readonly object PdfToSvgConversionLockerObject = new object();

        #endregion

        #region "Public Method(s)"

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="xmlDataRepository"></param>
        /// <param name="resourceCacheMemoryRepository"></param>
        public ResourceRepository(IXmlDataRepository<Resources> xmlDataRepository,
            ICacheMemoryRepository resourceCacheMemoryRepository,
             IGLobalRepository globalRepository,
            StringConstant stringConstant)
        {
            _xmlDataRepository = xmlDataRepository;
            _cacheMemoryRepository = resourceCacheMemoryRepository;
            _globalRepository = globalRepository;
            _stringConstant = stringConstant;
        }


        /// <summary>
        /// Get all the resources from the XML.
        /// </summary>
        /// <param name="resourceFilePath"></param>
        /// <returns>Resources</returns>
        public Resources GetResourceXmlData(string resourceFilePath)
        {
            //Logic to get values from XML files
            var resourceData = _xmlDataRepository.DeserializeXmlData(resourceFilePath);
            return resourceData;

        }


        /// <summary>
        /// Check whether matched hidden code exist or not in XML.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="resources"></param>
        /// <returns>Resource</returns>
        public Resource CheckHiddenCodeExists(string code, Resources resources)
        {
            //Logic to check if hidden code exists in Resources XML
            Resource selectedResource = null;
            foreach (var resource in resources.ListOfResourceses)
            {
                if (resource.HiddenCode != null && (resource.HiddenCode.Trim()).Equals(code))
                {
                    selectedResource = resource;
                    break;
                }
            }
            return selectedResource;
        }


        /// <summary>
        /// Call method to read data from XML file and load it into cache memory.
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="resourceXmlFilePath"></param>
        /// <returns>Resources</returns>
        public Resources SetAndGetResourceDataIntoCacheMemory(string filePath, string resourceXmlFilePath)
        {
            var xmlFilePath = Path.Combine(filePath, resourceXmlFilePath);
            var resources = _cacheMemoryRepository.SetAndGetXmlFileDataIntoCacheMemoryOnLoad("Resource",
                () => GetResourceXmlData(xmlFilePath), xmlFilePath);
            return resources;

        }


        /// <summary>
        /// Call method to get data from cache memory.
        /// </summary>
        /// <param name="filePath"></param>
        /// <param name="resourceXmlFilePath"></param>
        /// <returns>Resources</returns>
        public Resources GetXmlFileDataFromCacheMemory()
        {
            return _cacheMemoryRepository.GetXmlFileDataFromCacheMemory<Resources>("Resource");
        }

        /// <summary>
        /// Method to check modified time stamp of XML file
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <returns>bool</returns>
        // public bool CheckModifiedTimeStampOfXmlFileForResource(string xmlFilePath)
        // {
        //    try
        //    {
        //        var response = _cacheMemoryRepository.CheckModifiedTimeStampOfXmlFile(xmlFilePath,
        //            "ResourceModifiedTimeStamp");
        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "ResourceRepository : CheckHiddenCodeExists");
        //        throw;
        //    }
        // }


        #region "Resource Link Preview"

        /// <summary>
        /// Check whether the resource values(Title,Url,description,FileNames) are null or not.
        /// </summary>
        /// <param name="resource"></param>
        /// <returns>bool</returns>
        //public bool CheckResourceLinkDetailsIsNotNull(Resource resource)
        //{
        //    try
        //    {
        //        //Logic to check whether the resource values(Title,Url,description,short description) are null or not.
        //        return resource.Title != null && resource.FileNames != null &&
        //               resource.URL != null && resource.Description != null &&
        //               resource.Title != "" && resource.FileNames != "" &&
        //               resource.URL != "" && resource.Description != "";
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "ResourceRepository : CheckResourceLinkDetailsIsNotNull");
        //        throw;
        //    }
        //}

        /// <summary>
        /// Check image for the Resource Link exist on the path or not.
        /// </summary>
        /// <param name="resourceImagePath"></param>
        /// <param name="resourceImageName"></param>
        /// <returns>bool</returns>
        public bool ImageForResourceLinkExist(string resourceImagePath, string resourceImageName)
        {
            //Logic check whether image exist or not.
            var result = _globalRepository.GetHttpWebResponseForFileExists(resourceImagePath, resourceImageName);
            return result != null;

        }


        /// <summary>
        /// Check length of the hiddencode passed in the URL.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="hiddenCodeLength"></param>
        /// <returns>bool</returns>
        public bool CheckHiddenCodeLength(string code, string hiddenCodeLength)
        {
            //Logic to check length of the hidden code .
            var length = int.Parse(hiddenCodeLength);
            var codelength = code.Length;
            return codelength.Equals(length);
        }

        #endregion

        #region "Resources Notes Preview"


        /// <summary>
        /// Method to check if PDF file exists on source path of hidden code.
        /// </summary>
        /// <param name="strSourcePdfPath"></param>
        /// <param name="listOfFiles"></param>
        /// <returns>bool</returns>
        public bool CheckIfPdfFileExists(string strSourcePdfPath, string[] listOfFiles)
        {
            //To check whether file exist on http path.                
            var count = listOfFiles.Count();
            for (var i = 0; i < count - 1; i++)
            {
                var result =  _globalRepository.GetHttpWebResponseForFileExists(strSourcePdfPath, listOfFiles[i]);
                if (result == null)
                {
                    return false;
                }
            }
            return true;
        }


        /// <summary>
        /// Method to check if PDF file,FileSize,FilePages,FileNames,Hidden Code etc are not null
        /// </summary>
        /// <param name="selectedResource"></param>
        /// <returns>bool</returns>
        //public bool CheckResourceNotesDetailsIsNotNull(Resource selectedResource)
        //{
        //    try
        //    {
        //        return selectedResource != null && !string.IsNullOrEmpty(selectedResource.FileNames) &&
        //               !string.IsNullOrEmpty(selectedResource.FilePages) &&
        //               !string.IsNullOrEmpty(selectedResource.FileSizes) &&
        //               !string.IsNullOrEmpty(selectedResource.HiddenCode);
        //    }
        //    catch (Exception ex)
        //    {
        //        LogSystem.EmailLogException(ex, 0, "ResourceRepository : CheckResourceNotesDetailsIsNotNull");
        //        throw;
        //    }
        //}


        /// <summary>
        /// Method to seperate PDF page(s) of PDF file, convert PDF to SVG and delete the PDF page(s) created after converting it.
        /// </summary>
        /// <param name="sourcePdfPath"></param>
        /// <param name="hiddenCode"></param>
        /// <param name="destFilePath"></param>
        /// <param name="appWriteWebWriteFolderPath"></param>
        /// <param name="appWriteWebReadFolderPath"></param>
        /// <param name="listOfPdfFiles"></param>
        /// <param name="svgFileNameFromUrl"></param>
        /// <returns>Dictionary<string, string></returns>
        public Dictionary<string, List<string>> CreatePdftoSvgFiles(string sourcePdfPath, string hiddenCode,
            string destFilePath, string appWriteWebWriteFolderPath, string appWriteWebReadFolderPath,
            List<string> listOfPdfFiles,
            string svgFileNameFromUrl, string hostNameForDownloadFile)
        {
            try
            {
                var svgFileList = new List<string>();

                var dicPdfFilePathWithSvgFilePath = new Dictionary<string, List<string>>();

                LogSystem.EmailLogMessage(0, "CreatePdftoSvgFiles",
                    "Temporary Folder path :" + appWriteWebWriteFolderPath);

                #region  "Get all the PDF file path based on PDF/Preview PDF names"

                var pdfFileNameList = GetPdfFilePathsForHiddenCode(sourcePdfPath, listOfPdfFiles);

                #endregion

                if (pdfFileNameList.Count <= 0) return dicPdfFilePathWithSvgFilePath;

                foreach (var pdfFile in pdfFileNameList)
                {
                    #region Process for each PDF file

                    var strSvgFileNamesPerPage = new List<string>();
                    var pdfDocPath = pdfFile;

                    var svgFileFromUrl = Path.GetFileNameWithoutExtension(svgFileNameFromUrl);
                    var inpuPdfDocument = PdfDocuments.CompatiblePdfReader.Open(pdfDocPath);
                    var pdfDocName = Path.GetFileNameWithoutExtension(pdfDocPath);
                    var tempPdfFileName = pdfDocName;

                    //If pdf file is the preview version than replace "Preview" to compare.
                    if (pdfDocName != null && pdfDocName.Contains("-Preview"))
                    {
                        tempPdfFileName = pdfDocName.Replace("-Preview", "");
                    }

                    //Check whether the file name match with file name passed form the URL.
                    if (svgFileFromUrl != null && svgFileFromUrl.Equals(tempPdfFileName))
                    {

                        #region "Get SVG file path if it already exists"

                        var singleSvgFilePath = GetSvgFilesIfExists(destFilePath, pdfDocName,
                            sourcePdfPath);

                        #endregion

                        if (singleSvgFilePath == null || !singleSvgFilePath.Any())
                        {
                            if (!Directory.Exists(appWriteWebWriteFolderPath))
                            {
                                Directory.CreateDirectory(appWriteWebWriteFolderPath);
                            }
                            else
                            {
                                //Delete svg files if it exist.
                                var directoryInfo = new DirectoryInfo(appWriteWebWriteFolderPath);
                                var svgFiles = directoryInfo.GetFiles("*.svg");
                                if (svgFiles.Any())
                                {
                                    foreach (var svgFile in svgFiles)
                                    {
                                        svgFile.Delete();
                                    }
                                }
                            }

                            //Call method to create svg files and get list of svg files.
                            GetListOfSvgFiles(destFilePath, appWriteWebWriteFolderPath, appWriteWebReadFolderPath, inpuPdfDocument, pdfDocName, strSvgFileNamesPerPage, ref svgFileList);
                        }
                        else
                        {

                            //If svg files exits then check whether the
                            if (Directory.Exists(appWriteWebReadFolderPath))
                            {
                                var directoryInfo = new DirectoryInfo(appWriteWebReadFolderPath);
                                var svgFiles = directoryInfo.GetFiles("*.svg");
                                var svgFileCount = svgFiles.Count();

                                if (inpuPdfDocument.PageCount == svgFileCount)
                                {
                                    svgFileList.AddRange(svgFiles.OrderBy(x => x.CreationTime).Select(svgFile => Path.Combine(destFilePath, svgFile + "")));
                                }
                                else
                                {
                                    #region "Delete SVG files from Folder"

                                    if (svgFileCount > 0)
                                    {
                                        foreach (var svgFile in svgFiles)
                                        {
                                            svgFile.Delete();
                                        }

                                        //Delete svg file folder.
                                        Directory.Delete(appWriteWebReadFolderPath);
                                    }

                                    #endregion
                                    //Call method to create svg file and get list of svg files.
                                    GetListOfSvgFiles(destFilePath, appWriteWebWriteFolderPath, appWriteWebReadFolderPath, inpuPdfDocument, pdfDocName, strSvgFileNamesPerPage, ref svgFileList);
                                }
                            }
                        }


                        var pdfFileDownloadHostName = hostNameForDownloadFile;
                        //Add Pdf file path and svg file path.
                        dicPdfFilePathWithSvgFilePath.Add(pdfFileDownloadHostName, svgFileList);
                    }

                    #endregion
                }
                return dicPdfFilePathWithSvgFilePath;

            }

            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "ResourceRepository : CreatePdftoSvgFiles");
                throw;
            }
        }

        /// <summary>
        /// If svg file does not exist then create new.
        /// </summary>
        /// <param name="destFilePath"></param>
        /// <param name="appWriteWebWriteFolderPath"></param>
        /// <param name="appWriteWebReadFolderPath"></param>
        /// <param name="inpuPdfDocument"></param>
        /// <param name="pdfDocName"></param>
        /// <param name="strSvgFileNamesPerPage"></param>
        /// <param name="svgFileList"></param>
        public void GetListOfSvgFiles(string destFilePath, string appWriteWebWriteFolderPath,
            string appWriteWebReadFolderPath, PdfDocument inpuPdfDocument, string pdfDocName, List<string> strSvgFileNamesPerPage,
            ref List<string> svgFileList)
        {
            try
            {
                string singleSvgFilePath;

                if (Directory.Exists(appWriteWebReadFolderPath))
                {
                    Directory.Delete(appWriteWebReadFolderPath);
                }

                if (Directory.Exists(appWriteWebWriteFolderPath))
                {
                    Directory.Delete(appWriteWebWriteFolderPath);
                }

                #region "Seperate PDF file in PDF pages"

                //Create a new document for each page of PDF Doc
                for (var x = 0; x < inpuPdfDocument.PageCount; x++)
                {
                    //Add PDF page
                    var doc = new PdfDocument { Version = inpuPdfDocument.Version };
                    doc.Info.Creator = inpuPdfDocument.Info.Creator;
                    doc.AddPage(inpuPdfDocument.Pages[x]);

                    //PDF file names
                    var pdfPageName = String.Format(pdfDocName + "_{0}.pdf", Convert.ToString(x + 1));

                    if (!string.IsNullOrEmpty(appWriteWebWriteFolderPath))
                    {
                        if (!Directory.Exists(appWriteWebWriteFolderPath))
                        {
                            Directory.CreateDirectory(appWriteWebWriteFolderPath);
                        }
                        var pdfPageLocation = Path.Combine(appWriteWebWriteFolderPath, pdfPageName);
                        doc.Save(String.Format(pdfPageLocation));
                    }
                }

                var inkscapePath = GlobalPath.InkscapePath;
                var process = new Process
                {
                    //Give path of InkScape directory where inkscape.exe is located
                    StartInfo =
                    {
                        WorkingDirectory = inkscapePath,
                        FileName = _stringConstant.InkscapeFilePath
                    }
                };

                var directoryInfo = new DirectoryInfo(appWriteWebWriteFolderPath);

                //Get all PDF files located in directory
                var pdfFiles = directoryInfo.GetFiles("*.pdf");

                #region Lock Pdf to Svg file conversion till one process get completed

                lock (PdfToSvgConversionLockerObject)
                {
                    foreach (var existingPdfFile in pdfFiles.OrderBy(x => x.LastWriteTime).ToArray())
                    {
                        var pdfFileName = existingPdfFile.FullName;
                        var svgFileName = pdfFileName.Replace(".pdf", ".svg");
                        strSvgFileNamesPerPage.Add(svgFileName);

                        try
                        {
                            var argument =
                                string.Format("--without-gui --file=\"{0}\" --export-plain-svg=\"{1}\"",
                                    pdfFileName, svgFileName);
                            process.StartInfo.Arguments = argument;
                            process.Start();
                            process.WaitForExit();
                            process.Close();

                            //After creating SVG file delete the PDF file page
                            existingPdfFile.Delete();

                            LogSystem.EmailLogMessage(0, "CreatePdftoSvgFiles",
                                "Created SVG file name :" + svgFileName);
                        }
                        catch (Exception ex)
                        {
                            LogSystem.EmailLogException(ex, 1,
                                "ResourceRepository : CreatePdftoSvgFiles : Inkscape error");
                            throw;
                        }
                    }
                    process.Dispose();
                }

                #endregion

                #endregion

                #region "Create single SVG file on destination folder for the viewing purpose if project run locally."

                if (pdfDocName != null)
                {
                    var svgFilesPathLocally = Path.Combine(
                        appWriteWebWriteFolderPath,
                        pdfDocName + ".svg");

                    if (!string.IsNullOrEmpty(svgFilesPathLocally))
                    {
                        if (!Directory.Exists(appWriteWebReadFolderPath))
                        {
                            Directory.CreateDirectory(appWriteWebReadFolderPath);
                        }

                        directoryInfo = new DirectoryInfo(appWriteWebWriteFolderPath);
                        var svgFiles = directoryInfo.GetFiles("*.svg");
                        foreach (var svgFile in svgFiles.OrderBy(x => x.CreationTime))
                        {
                            File.Move(appWriteWebWriteFolderPath + "\\" + svgFile, appWriteWebReadFolderPath + "\\" + svgFile);
                            var svgFilePath = Path.Combine(destFilePath, svgFile + "");

                            svgFileList.Add(svgFilePath);
                        }

                        //Delete temp file folder
                        Directory.Delete(appWriteWebWriteFolderPath);
                    }
                }

                #endregion
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 0, "ResourceRepository : GetListOfSvgFiles");
                throw;
            }
        }




        /// <summary>
        /// Method to get all PDF files path for a HiddenCode passed (For Download button)
        /// </summary>
        /// <param name="strSourcePdfPathWithHiddenCode"></param>
        /// <param name="listOfPdfFiles"></param>
        /// <returns>List<string></returns>
        public List<string> GetPdfFilePathsForHiddenCode(string strSourcePdfPathWithHiddenCode,
            List<string> listOfPdfFiles)
        {
            var pdfFileNamesList = new Dictionary<string, HttpWebResponse>();
            var selectedPdfFileList = new List<string>();

            //Get all the pdf files form the ftp.
            if (!string.IsNullOrEmpty(strSourcePdfPathWithHiddenCode))
            {
                var count = listOfPdfFiles.Count();
                for (var i = 0; i < count; i++)
                {
                    var pdfFilePath = Path.Combine(strSourcePdfPathWithHiddenCode.Replace("\\", "/"),
                        listOfPdfFiles[i]);

                    //Check whether the pdf file exist or not.
                    HttpWebResponse response =
                        _globalRepository.GetHttpWebResponseForFileExists(strSourcePdfPathWithHiddenCode,
                            listOfPdfFiles[i]);

                    if (response != null)
                    {
                        pdfFileNamesList.Add(pdfFilePath, response);
                    }
                }
            }

            //If the source file has been modified since that last time it was created then 
            //you are to use the preview version instead.
            var dictionary = pdfFileNamesList.ToArray();
            if (dictionary.Any())
            {
                for (var i = 0; i < dictionary.Count(); i++)
                {
                    var pdfFile = dictionary.ElementAt(i);
                    var pdfFilePath = pdfFile.Key;
                    var pdfFileLastModified = pdfFile.Value.LastModified;
                    var pdfFileName = Path.GetFileNameWithoutExtension(pdfFilePath);

                    if (pdfFileName != null && pdfFileName.Contains("Preview"))
                    {
                        //Logic to check whether to use "Preview" version file or normal file.
                        var pdfFilePrevious = dictionary.ElementAt(i - 1);
                        var pdfFilePathPrevious = pdfFilePrevious.Key;
                        var pdfFileLastModifiedPrevious = pdfFilePrevious.Value.LastModified;
                        var pdfFileNamePrevious = Path.GetFileNameWithoutExtension(pdfFilePathPrevious);

                        var tempPdfFileName = pdfFileName.Replace("-Preview", "");

                        if (pdfFileNamePrevious == null) continue;

                        var tempPdfFileName1 = pdfFileNamePrevious.Replace("-Preview", "");

                        if (!tempPdfFileName.Equals(tempPdfFileName1)) continue;

                        if (pdfFileLastModified.Subtract(pdfFileLastModifiedPrevious).TotalHours > 0)
                        {
                            if (pdfFileName.Contains("Preview"))
                            {
                                selectedPdfFileList.Add(pdfFilePath);
                                selectedPdfFileList.Remove(pdfFilePathPrevious);
                            }
                        }
                    }
                    else
                    {
                        selectedPdfFileList.Add(pdfFilePath);
                    }
                }
            }
            return selectedPdfFileList;
        }


        /// <summary>
        /// Method to check whether svg file exist or not.
        /// </summary>
        /// <param name="outputfolderPathForSvgFiles"></param>
        /// <param name="pdfFileName"></param>
        /// <param name="pdfFilePath"></param>
        /// <returns>string</returns>
        public string GetSvgFilesIfExists(string outputfolderPathForSvgFiles, string pdfFileName, string pdfFilePath)
        {
            var svgFilePath = Path.Combine(outputfolderPathForSvgFiles.Replace("\\", "/"), pdfFileName + "_1.svg");
            var svgFileResponse =
                _globalRepository.GetHttpWebResponseForFileExists(outputfolderPathForSvgFiles.Replace("\\", "/"), pdfFileName + "_1.svg");

            //If svg files exist than check for the time stamp between Pdf file and svg file.
            if (svgFileResponse != null && svgFileResponse.ContentType == "image/svg+xml" &&
                !string.IsNullOrEmpty(pdfFilePath))
            {
                HttpWebResponse pdfFileResponse = _globalRepository.GetHttpWebResponseForFileExists(pdfFilePath,
                    pdfFileName + ".pdf");

                if (pdfFileResponse != null)
                {
                    var pdfFileLastModified = pdfFileResponse.LastModified;
                    var svgFileLastModified = svgFileResponse.LastModified;

                    //If the pdf file has been modified since the svg file was created than craete new svg file.
                    if (pdfFileLastModified.Subtract(svgFileLastModified).TotalHours > 0)
                    {
                        return null;
                    }
                    return svgFilePath;
                }
            }
            return null;

        }


        #endregion

        #region "IP Board permission(s) method"

        /// <summary>
        /// Method to apply permission on buttons of Link/Notes/Quiz
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="ipBoardMemberId"></param>
        /// <param name="ipCurrentUserSession"></param>
        /// <returns>bool</returns>
        public bool IpBoardGroupPermission(string connectionString, int ipBoardMemberId, string ipCurrentUserSession)
        {
            try
            {
                var isGuest = false;
                if (ipBoardMemberId != 0 && !string.IsNullOrEmpty(ipCurrentUserSession) && !string.IsNullOrEmpty(connectionString))
                {
                    var connection = new MySqlConnection(connectionString);
                    connection.Open();

                    #region "Check for memberId in tynv_core_members table"

                    string strQuery =
                        "select member_id,name,member_group_id,mgroup_others from ipscs.tynv_core_members where member_id=" +
                        ipBoardMemberId;
                    var cmd = new MySqlCommand(strQuery, connection);
                    var da = new MySqlDataAdapter(cmd);
                    var dt = new DataSet();
                    da.Fill(dt);
                    da.Dispose();

                    #endregion

                    if (dt.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[0].Rows)
                        {
                            if (Convert.ToString(row.ItemArray[2]) != "2" && Convert.ToString(row.ItemArray[3]) != "2")
                            {
                                isGuest = false;
                            }
                            else
                            {
                                isGuest = true;
                                break;
                            }
                        }

                        if (!isGuest)
                        {
                            #region Check for current session of a member

                            var strSessionQuery = "select id from ipscs.tynv_core_sessions where id =" +
                                                  ipCurrentUserSession;
                            cmd = new MySqlCommand(strSessionQuery, connection);
                            var daSession = new MySqlDataAdapter(cmd);
                            var dtSet = new DataSet();
                            daSession.Fill(dtSet);
                            daSession.Dispose();
                            return dtSet.Tables[0].Rows.Count > 0;


                            #endregion
                        }
                    }

                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "ResourceRepository : IpBoardGroupPermission");
                throw;
            }
            return false;
        }

        /// <summary>
        /// Method to have permissions to view resource
        /// </summary>
        /// <param name="connectionString"></param>
        /// <param name="ipBoardMemberId"></param>
        /// <param name="ipCurrentUserSession"></param>
        /// <param name="strTsfxHiddenCode"></param>
        /// <returns>bool</returns>
        public bool IpBoardApplyViewResourcePermission(string connectionString, int ipBoardMemberId,
            string ipCurrentUserSession, string strTsfxHiddenCode)
        {
            try
            {
                var isResourceHasGroupPermission = false;
                var isMemberHasGroupPermission = false;
                if (!string.IsNullOrEmpty(connectionString) && !string.IsNullOrEmpty(ipCurrentUserSession) &&
                    ipBoardMemberId != 0 && !string.IsNullOrEmpty(strTsfxHiddenCode))
                {
                    var connection = new MySqlConnection(connectionString);
                    connection.Open();

                    #region Getting CategoryId of a resource and Member Group id from session table of IPS4

                    string strGetSignInSessionQuery = "select current_id,member_group from ipscs.tynv_core_sessions where id = '" +
                                                   ipCurrentUserSession + "'";
                    var cmd = new MySqlCommand(strGetSignInSessionQuery, connection);

                    var daSession = new MySqlDataAdapter(cmd);
                    var dtSession = new DataSet();
                    daSession.Fill(dtSession);
                    daSession.Dispose();

                    #endregion

                    if (dtSession.Tables[0].Rows.Count > 0)
                    {
                        #region "Permissions for Resources : getting the Group Ids for Resources based on HiddenCode and Category Id "

                        string strCheckResourceGroupQuery =
                            "select t3.perm_2 from ipscs.tynv_videos_videos t1 inner join ipscs.tynv_videos_cat t2 on t2.id = t1.cid inner join ipscs.tynv_core_permission_index t3 on t3.app=\"videos\" and t3.perm_type=\"Cat\" and t3.perm_type_id = t2.id where t2.id = " +
                            Convert.ToInt32(dtSession.Tables[0].Rows[0]["current_id"]) + " and t1.tsfxhiddencode = '" +
                            strTsfxHiddenCode + "'";
                        cmd = new MySqlCommand(strCheckResourceGroupQuery, connection);
                        var daResources = new MySqlDataAdapter(cmd);
                        var dtResources = new DataSet();
                        daResources.Fill(dtResources);
                        daResources.Dispose();

                        //return dtResources.Tables[0].Rows.Count > 0;

                        #endregion

                        #region "Permissions for Member : getting the Group Ids for Signed-In Member based on current id of IPS4 cookie value"

                        string strCheckMemberGroupQuery =
                            "select member_id,member_group_id,mgroup_others from ipscs.tynv_core_members where ipscs.tynv_core_members.member_id = " +
                            Convert.ToInt32(ipBoardMemberId);
                        cmd = new MySqlCommand(strCheckMemberGroupQuery, connection);
                        var daMembers = new MySqlDataAdapter(cmd);
                        var dtMembers = new DataSet();
                        daMembers.Fill(dtMembers);

                        #endregion

                        #region "Compare GroupId value"

                        if (dtResources.Tables[0].Rows.Count > 0 && dtMembers.Tables[0].Rows.Count > 0)
                        {
                            #region Compare GroupId of Session with Resource GroupId

                            for (int i = 0; i < dtResources.Tables[0].Rows.Count; i++)
                            {
                                if (dtResources.Tables[0].Rows[i] != null)
                                {
                                    //Check if the group id exists in Resource permission
                                    var strPermissionGroups =
                                        Convert.ToString(dtResources.Tables[0].Rows[i]["perm_2"]);
                                    if (!string.IsNullOrEmpty(strPermissionGroups))
                                    {
                                        var strPermissionList = strPermissionGroups.Split(',').ToList();
                                        if (strPermissionList.Any())
                                        {
                                            foreach (var groupId in strPermissionList)
                                            {
                                                if (!string.IsNullOrEmpty(groupId))
                                                {
                                                    if (groupId ==
                                                        Convert.ToString(dtSession.Tables[0].Rows[0]["member_group"]))
                                                    {
                                                        isResourceHasGroupPermission = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if (isResourceHasGroupPermission)
                                    break;

                            }

                            #endregion

                            #region  Compare GroupId of Session with Member GroupId

                            for (int j = 0; j < dtMembers.Tables[0].Rows.Count; j++)
                            {
                                if (dtMembers.Tables[0].Rows[j] != null)
                                {
                                    //Check if the group id exists in Resource permission
                                    var strMemPermissionGroups =
                                        Convert.ToString(dtMembers.Tables[0].Rows[j]["member_group_id"]);
                                    if (!string.IsNullOrEmpty(strMemPermissionGroups))
                                    {
                                        var strPermissionList = strMemPermissionGroups.Split(',').ToList();
                                        if (strPermissionList.Any())
                                        {
                                            foreach (var groupId in strPermissionList)
                                            {
                                                if (!string.IsNullOrEmpty(groupId))
                                                {
                                                    if (groupId ==
                                                        Convert.ToString(dtSession.Tables[0].Rows[0]["member_group"]))
                                                    {
                                                        isMemberHasGroupPermission = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (isMemberHasGroupPermission)
                                    break;
                            }

                            #endregion

                            if (isResourceHasGroupPermission && isMemberHasGroupPermission)
                                return true;
                        }

                        #endregion

                    }
                    connection.Close();

                }
            }
            catch (Exception ex)
            {

                LogSystem.EmailLogException(ex, 1, "ResourceRepository : IpBoardApplyViewResourcePermission");
                throw;
            }
            return false;
        }


        #endregion


        #endregion

        #region "Dispose Method(s)"

        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            try
            {
                GC.SuppressFinalize(this);
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "ResourceRepository : Dispose");
                throw;
            }

        }

        #endregion


    }


}
