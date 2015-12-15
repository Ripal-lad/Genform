using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace TSFXGenform.DomainModel.DataRepository
{
    public class DataRepository<T> : IDataRepository<T> where T :class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _objectDbSet;
        private bool _isDisposed;
        private DbContextTransaction _transaction;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context"></param>
        public DataRepository(DbContext context)
        {
            _context = context;
            _objectDbSet = _context.Set<T>();
            _isDisposed = false;
        }
        public DbContextTransaction BeginTransaction()
        {
            _transaction = _context.Database.BeginTransaction();
            return _transaction;
        }

        public void Commit()
        {
            _transaction.Commit();
        }
        /// <summary>
        /// DB Fetch method
        /// </summary>
        /// <returns></returns>
        public IQueryable<T> Fetch()
        {
            return _objectDbSet;
        }



        /// <summary>
        /// Method fetches the IQueryable based on expression.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public IQueryable<T> Fetch(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return _objectDbSet.Where(predicate).AsQueryable();
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Method fetches the IQueryable based on expression.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public async Task<IEnumerable<T>> FetchAsync(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await _objectDbSet.Where(predicate).ToListAsync();
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Method fetches the IQueryable based on filter,size and index.
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="total"></param>
        /// <param name="index"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        public IQueryable<T> Fetch(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50)
        {
            total = 0;
            try
            {
                var skipCount = index * size;
                var resetSet = filter != null ? _objectDbSet.Where(filter).AsQueryable() : _objectDbSet.AsQueryable();
                resetSet = skipCount == 0 ? resetSet.Take(size) : resetSet.Skip(skipCount).Take(size);
                total = resetSet.Count();
                return resetSet.AsQueryable();
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Method fetches the set of record based on the supplied fucntion.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public IQueryable<T> Fetch(Func<T, bool> predicate)
        {
            try
            {
                return _objectDbSet.Where<T>(predicate).AsQueryable();
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// DB GetAll method
        /// </summary>
        /// <returns></returns>
        public IEnumerable<T> GetAll()
        {
            return _objectDbSet;
        }



        /// <summary>
        /// Method to get all record which are cache
        /// </summary>
        /// <returns></returns>
        public List<T> GetAllCache()
        {
            return new List<T>();
        }

        /// <summary>
        /// DB Find method
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public IEnumerable<T> Find(Func<T, bool> predicate)
        {
            return _objectDbSet.Where<T>(predicate);
        }

        /// <summary>
        /// DB  get single  record method
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T Single(Func<T, bool> predicate)
        {
            return _objectDbSet.Single<T>(predicate);
        }

        /// <summary>
        /// Method fetches the entity by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public T GetById(object id)
        {
            try
            {
                return _objectDbSet.Find(id);
            }
            catch (Exception)
            {
                return null;
            }
        }


        /// <summary>
        /// Method fetches the entity by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<T> GetByIdAsync(object id)
        {
            try
            {
                return await _objectDbSet.FindAsync(id);
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Method fetches the first or default item from the datacontext based on the the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T FirstOrDefault(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return _objectDbSet.FirstOrDefault(predicate);

            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Method fetches the first or default item from the datacontext based on the the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public async Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await _objectDbSet.FirstOrDefaultAsync(predicate);

            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// DB get First record method
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T First(Func<T, bool> predicate)
        {
            return _objectDbSet.First<T>(predicate);
        }

        /// <summary>
        /// DB Add record method
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="isRedisCache"></param>
        public void Add(T entity)
        {
            _objectDbSet.Add(entity);
        }

        /// <summary>
        /// DB Update record method
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="isRedisCache"></param>
        public void Update(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        /// <summary>
        /// DB Delete record method
        /// </summary>
        /// <param name="entity"></param>
        public void Delete(T entity)
        {
            _objectDbSet.Remove(entity);
        }


        /// <summary>
        /// Method deletes the entity from the datacontext by Id
        /// </summary>
        /// <param name="id"></param>
        public void Delete(object id)
        {
            try
            {
                var entityToDelete = _objectDbSet.Find(id);
                if (entityToDelete != null) Delete(entityToDelete);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Method deletes the entity based on the supplied function.
        /// </summary>
        /// <param name="predicate"></param>
        public void Delete(Expression<Func<T, bool>> predicate)
        {
            try
            {
                var entitiesToDelete = Fetch(predicate);
                foreach (var entity in entitiesToDelete)
                {
                    if (_context.Entry(entity).State == EntityState.Detached)
                    {
                        _objectDbSet.Attach(entity);
                    }
                    _objectDbSet.Remove(entity);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        /// <summary>
        /// DB Attach record method
        /// </summary>
        /// <param name="entity"></param>
        public void Attach(T entity)
        {
            var entry = _context.Entry(entity);
            _objectDbSet.Attach(entity);
            entry.State = EntityState.Modified;
        }

        /// <summary>
        /// DB Save record method
        /// </summary>
        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        /// <summary>
        /// Method save the changes into the context
        /// </summary>
        public async Task<int> SaveChangesAsync()
        {
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }


        /// <summary>
        /// DB Dispose based on disposing value method
        /// </summary>
        /// <param name="disposing"></param>
        public void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    if (_context != null)
                    {
                        _context.Dispose();
                    }
                    _isDisposed = true;
                }
            }
        }

        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~DataRepository()
        {
            Dispose(false);
        }
    }
}
