using System;
using System.Data.Entity;
using System.Linq;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Utils.GlobalUtils;

namespace TSFXGenform.Repository.Repository
{
    public class ExecuteMySqlQueries : IExecuteMySqlQueries
    {
        #region "Private variables"
        
        private readonly DbContext _context;

        #endregion


        #region "Public method(s)"
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context"></param>
        public ExecuteMySqlQueries(DbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Method to execute My SQL query and return result 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="strQuery"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public T ExecuteSqlQueryWithParamters<T>(string strQuery, object[] parameters)
        {
            var res = default(T);
            try
            {
                if (!string.IsNullOrEmpty(strQuery) && parameters != null && parameters.Any())
                {
                    res = _context.Database.SqlQuery<T>(strQuery, parameters).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                LogSystem.EmailLogException(ex, 1, "ExecuteMySqlQueries : ExecuteSqlQueryWithParamters");
                throw;
            }
            return res;
        }

        #endregion

    }
}
