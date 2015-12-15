using PdfSharp.Pdf;
using System;
using System.Collections.Generic;
using TSFXGenform.DomainModel.ApplicationClasses;

namespace TSFXGenform.Repository.IRepository
{
    public interface IResourceRepository : IDisposable
    {
        Resources GetResourceXmlData(string resourceFilePath);
        Resource CheckHiddenCodeExists(string code, Resources resources);
        Resources SetAndGetResourceDataIntoCacheMemory(string filePath, string resourceXmlFilePath);
        Resources GetXmlFileDataFromCacheMemory();
        //bool CheckModifiedTimeStampOfXmlFileForResource(string xmlFilePtah);
        //bool CheckResourceLinkDetailsIsNotNull(Resource resource);
        bool ImageForResourceLinkExist(string resourceImagePath, string resourceImageName);
        bool CheckHiddenCodeLength(string code,string hiddenCodeLength);
        bool CheckIfPdfFileExists(string strSourcePdfPath, string[] listOfFiles);
        Dictionary<string, List<string>> CreatePdftoSvgFiles(string sourcePdfPath, string hiddenCode, string destFilePath, string appWriteWebWriteFolderPath, string appWriteWebReadFolderPath, List<string> listOfPdfFiles, string svgFileNameFromUrl, string hostNameForDownloadFile);
        List<string> GetPdfFilePathsForHiddenCode(string strSourcePdfPathWithHiddenCode, List<string> listOfPdfFiles);
        void GetListOfSvgFiles(string destFilePath, string appWriteWebWriteFolderPath, string appWriteWebReadFolderPath, PdfDocument inpuPdfDocument, string pdfDocName, List<string> strSvgFileNamesPerPage,
            ref List<string> svgFileList);
       // bool CheckResourceNotesDetailsIsNotNull(Resource selectedResource);
        string GetSvgFilesIfExists(string outputfolderPathForSvgFiles, string pdfFileName, string pdfFilePath);
        bool IpBoardGroupPermission(string connectionString, int ipBoardMemberId, string ipCurrentUserSession);
        bool IpBoardApplyViewResourcePermission(string connectionString, int ipBoardMemberId,
            string ipCurrentUserSession, string strTsfxHiddenCode);
        void Dispose();
    }
}
