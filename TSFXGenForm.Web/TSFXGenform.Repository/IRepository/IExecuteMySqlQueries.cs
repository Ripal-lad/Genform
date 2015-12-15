using System;

namespace TSFXGenform.Repository.IRepository
{
    public interface IExecuteMySqlQueries
    {
        T ExecuteSqlQueryWithParamters<T>(string strQuery, object[] parameters);
    }
}
