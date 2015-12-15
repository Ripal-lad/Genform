using System;
using System.Runtime.InteropServices;

namespace TSFXGenform.Repository.IRepository
{
    public interface ICacheMemoryRepository : IDisposable
    {
        T SetAndGetXmlFileDataIntoCacheMemoryOnLoad<T>(string cacheKey, Func<T> getItemCallback, string xmlFilePath,
            [Optional] string hiddenCode) where T : class;

        T GetXmlFileDataFromCacheMemory<T>(string cacheKey) where T : class;
        bool CheckModifiedTimeStampOfXmlFile(string xmlFilePath, string cacheKey, [Optional] string hiddenCode);
        int SetAndGetRemainingtime(int timeRemaing, bool setValue, string cacheKey);
        int SetValueOfFirstQuestionToHidePreviousButton(int questionNo, bool setValue, string cacheKey);
    }
}
