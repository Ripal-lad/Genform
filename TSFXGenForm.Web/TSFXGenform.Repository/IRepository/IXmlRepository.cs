using System;

namespace TSFXGenform.Repository.IRepository
{
    public interface IXmlDataRepository<TDataSource> : IDisposable where TDataSource : class
    {
        TDataSource DeserializeXmlData(string resourceFilePath);
     
    }
 }
