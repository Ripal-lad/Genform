using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace TSFXGenform.DomainModel.DataRepository
{
    public interface IDataRepository<T> : IDisposable where T:class
    {

        void Add(T entity);
        void Attach(T entity);
        void Delete(T entity);
        void Delete(object id);
        void Delete(Expression<Func<T, bool>> predicate);
        void Update(T entity);
        IQueryable<T> Fetch();
        IQueryable<T> Fetch(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> FetchAsync(Expression<Func<T, bool>> predicate);
        IEnumerable<T> Find(Func<T, bool> predicate);
        T FirstOrDefault(Expression<Func<T, bool>> predicate);
        Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        T First(Func<T, bool> predicate);
        IEnumerable<T> GetAll();
        List<T> GetAllCache();
        void SaveChanges();
        Task<int> SaveChangesAsync();
        T Single(Func<T, bool> predicate);
        T GetById(object id);
        Task<T> GetByIdAsync(object id);
        DbContextTransaction BeginTransaction();
        void Commit();

    }
}
