using System;
using System.IO;
using System.Runtime.Caching;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Caching;
using System.Xml.Linq;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Utils.GlobalUtils;
using CacheItemPriority = System.Runtime.Caching.CacheItemPriority;

namespace TSFXGenform.Repository.Repository
{
    public class CacheMemoryRepository : ICacheMemoryRepository
    {

        /// <summary>
        /// Method to set and get values of the XML file in cache memory.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cacheKey"></param>
        /// <param name="callMethodTodeserializeXmlFile"></param>
        /// <param name="xmlFilePath"></param>
        /// <param name="hiddeCode"></param>
        /// <returns>T</returns>
        public T SetAndGetXmlFileDataIntoCacheMemoryOnLoad<T>(string cacheKey, Func<T> callMethodTodeserializeXmlFile,string xmlFilePath,[Optional] string hiddeCode) where T : class
        {
            try
            {
                if (!string.IsNullOrEmpty(cacheKey) && !string.IsNullOrEmpty(xmlFilePath) && callMethodTodeserializeXmlFile != null)
                {
                  
                    if (!string.IsNullOrEmpty(hiddeCode))
                    {
                        cacheKey = cacheKey + "-" + hiddeCode;   //Cache key for quiz with hiddencode.
                    }

                    //Get values from cache.
                    var xmlFileContent = HttpContext.Current.Cache.Get(cacheKey) as T;

                    //if cache is not null then clear the cache.
                    if (xmlFileContent != null){
                        HttpContext.Current.Cache.Remove(cacheKey);
                    }
                 
                    //Call method to deserialize xml file data.
                    xmlFileContent = callMethodTodeserializeXmlFile();

                    //Get the File info on the XML file.
                    var xmlFileInfo = new FileInfo(xmlFilePath);

                    //Get last modified time of Xml file.
                    var modifiedTimeStamp = xmlFileInfo.LastWriteTime;

                    //Assign time stamp values to cache memory.
                    if (cacheKey.Equals("QuizRoot-" +hiddeCode))
                    {
                        HttpContext.Current.Cache["quizXmlModifiedTimeStamp-" + hiddeCode] = modifiedTimeStamp;
                    }
                    else if (cacheKey.Equals("Resource"))
                    {
                        HttpContext.Current.Cache["resourcexmlModifiedTimeStamp"] = modifiedTimeStamp;
                    }
                  
                    //Assign Xml file data to cache memory.
                    HttpContext.Current.Cache.Add(cacheKey, xmlFileContent, null, Cache.NoAbsoluteExpiration,
                        Cache.NoSlidingExpiration, System.Web.Caching.CacheItemPriority.Low, null);
                    //MemoryCache.Default.Add(cacheKey, xmlFileContent, DateTime.Now.AddDays(1));
                  
                    return xmlFileContent;
                }
                
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "CacheMemoryRepository : SetAndGetXmlFileDataIntoCacheMemoryOnLoad");
                throw;
            }
            return null;
        }
        
        /// <summary>
        /// Method to get values from Cache memory.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cacheKey"></param>
        /// <returns>T</returns>
        public T GetXmlFileDataFromCacheMemory<T>(string cacheKey) where T : class
        {
            try
            {
                if (!string.IsNullOrEmpty(cacheKey))
                {
                    //Get values from cache.
                    var xmlFileContent = HttpContext.Current.Cache.Get(cacheKey) as T;
                    return xmlFileContent;
                }

            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "CacheMemoryRepository : SetAndGetXmlFileDataIntoCacheMemoryOnLoad");
                throw;
            }
            return null;
        }

        /// <summary>
        /// Check whether the Xml file has been modified or not.
        /// </summary>
        /// <param name="xmlFilePath"></param>
        /// <param name="cacheKey"></param>
        /// <param name="hiddenCode"></param>
        /// <returns>bool</returns>
        public bool CheckModifiedTimeStampOfXmlFile(string xmlFilePath,string cacheKey,[Optional] string hiddenCode)
        {
            try
            {
                if (!string.IsNullOrEmpty(xmlFilePath) && !string.IsNullOrEmpty(cacheKey))
                {
                   var fileInfo = new FileInfo(xmlFilePath);

                    //If Xml file is of Resource.
                    if (cacheKey.Equals("ResourceModifiedTimeStamp"))
                    {
                        if (HttpContext.Current.Cache["resourcexmlModifiedTimeStamp"] != null)
                        {
                            var modifiedTimeStampFromcache =
                                HttpContext.Current.Cache["resourcexmlModifiedTimeStamp"];

                            var currentModifiedTiemStamp = fileInfo.LastWriteTime;

                         
                            //If Xml file has been modified since the last write time then return true.
                            if ((currentModifiedTiemStamp.Subtract((DateTime) (modifiedTimeStampFromcache))).TotalSeconds>0)
                            {
                                return true;
                            }
                        }
                    }
                    else if (cacheKey.Equals("quizXmlModifiedTimeStamp-" + hiddenCode))
                    {
                        //If Xml file is of Quiz.
                        if (HttpContext.Current.Cache["quizXmlModifiedTimeStamp-" + hiddenCode] != null)
                        {
                            var modifiedTimeStampFromcache = HttpContext.Current.Cache[cacheKey];

                           var currentModifiedTiemStamp = fileInfo.LastWriteTime;

                           //If Xml file has been modified since the last write time then return true.
                           if ((currentModifiedTiemStamp.Subtract((DateTime)(modifiedTimeStampFromcache))).TotalSeconds > 0)
                           {
                               return true;
                           }
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "CacheMemoryRepository : CheckModifiedTimeStampOfXmlFile");
                throw;
            }
        }

        
        /// <summary>
        /// Method to set and get time remaining.
        /// </summary>
        /// <param name="timeRemaning"></param>
        /// <param name="setValue"></param>
        /// <param name="cacheKey"></param>
        /// <returns>int</returns>
        public int SetAndGetRemainingtime(int timeRemaning, bool setValue, string cacheKey)
        {
            try
            {
                if (!string.IsNullOrEmpty(cacheKey))
                {
                    if (setValue)
                    {
                        HttpContext.Current.Cache[cacheKey] = timeRemaning;
                        return timeRemaning;
                    }
                    else
                    {
                        var time = Convert.ToInt32(HttpContext.Current.Cache[cacheKey]);
                        return time;
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "QuizRepository : SetAndGetRemainingtime");
                throw;
            }
            return 0;
        }

        
        /// <summary>
        /// Method to set and get question number of previous question.
        /// </summary>
        /// <param name="questionNo"></param>
        /// <param name="setValue"></param>
        /// <param name="cacheKey"></param>
        /// <returns>int</returns>
        public int SetValueOfFirstQuestionToHidePreviousButton(int questionNo, bool setValue, string cacheKey)
        {
            try
            {
                if (!string.IsNullOrEmpty(cacheKey))
                {
                    if (setValue)
                    {
                        HttpContext.Current.Cache[cacheKey] = questionNo;
                        return questionNo;
                    }
                    else
                    {
                        var preQuestionNo = Convert.ToInt32(HttpContext.Current.Cache[cacheKey]);
                        return preQuestionNo;
                    }
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "QuizRepository : SetValueOfFirstQuestionToHidePreviousButton");
                throw;
            }
            return 0;
        }
       
        #region "Dispose Method(s)"

        /// <summary>
        /// Dispose  method
        /// </summary>
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        #endregion

    }
}
