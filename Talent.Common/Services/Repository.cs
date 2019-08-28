using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class Repository<T> : IRepository<T> where T : IMongoCommon, new()
    {
        private readonly IMongoDatabase _database;
        private IMongoCollection<T> _collection => _database.GetCollection<T>(typeof(T).Name);
        private IMongoCollection<BsonDocument> _collectionUser => _database.GetCollection<BsonDocument>(typeof(T).Name);

        public Repository(IMongoDatabase database)
        {
            _database = database;
        }

        public IQueryable<T> Collection => _collection.AsQueryable();

        public async Task Add(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new ArgumentNullException("entity");
                }
                await _collection.InsertOneAsync(entity);
            }
            catch (Exception dbEx)
            {
                throw dbEx;
            }
        }

        public T Create()
        {
            var entity = new T();
            return entity;
        }

        public async Task Delete(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new ArgumentNullException("entity");
                }

                await _collection.DeleteOneAsync(w => w.Id.Equals(entity.Id));
            }
            catch (Exception dbEx)
            {
                throw dbEx;
            }

        }

        public async Task<IEnumerable<T>> Get(Expression<Func<T, bool>> predicate)
        {
            for (int i = 0; i < 5; ++i)
            {
                try
                {
                    return _collection.AsQueryable().Where(predicate).AsEnumerable();
                }
                catch (MongoException e)
                {
                    await Task.Delay(1000);
                }
            }
            throw new ApplicationException("Hit retry limit while trying to query MongoDB");
        }

        public IQueryable<T> GetQueryable(bool includeDeleted = false) => _collection.AsQueryable();

        public async Task Update(T entity)
        {
            try
            {
                if (entity == null)
                {
                    throw new ArgumentNullException("entity");
                }
                await _collection.ReplaceOneAsync(w => w.Id.Equals(entity.Id),
                    entity, new UpdateOptions { IsUpsert = true });
            }
            catch (Exception dbEx)
            {
                throw dbEx;
            }
        }

        public async Task<T> GetByIdAsync(object id)
        {
            for (int i = 0; i < 5; ++i)
            {
                try
                {
                    var foundById = _collection.Find(x => x.Id == id.ToString()).FirstOrDefault();
                    return foundById;
                }
                catch (MongoException e)
                {
                    await Task.Delay(1000);
                }
            }
            throw new ApplicationException("Hit retry limit while trying to query MongoDB");
        }

        //public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        //{
        //    for (int i = 0; i < 5; ++i)
        //    {
        //        try
        //        {
        //            return _collection.Find(predicate).ToEnumerable();
        //        }
        //        catch (MongoException e)
        //        {
        //            await Task.Delay(1000);
        //        }
        //    }
        //    throw new ApplicationException("Hit retry limit while trying to query MongoDB");
        //}


        //temp workaround; get all document
        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            for (int i = 0; i < 5; ++i)
            {
                try
                {
                    var results = new List<T>();
                    FilterDefinition<BsonDocument> filter = new BsonDocument();
                    await _collectionUser.Find(filter)
                        .ForEachAsync((document) =>
                        {
                            try
                            {
                                var documentObject = BsonSerializer.Deserialize<T>(document);
                                results.Add(documentObject);
                            }
                            catch (Exception e)
                            {
                                //do logging
                            }
                        }
                    );
                    return results;
                }
                catch (MongoException e)
                {
                    await Task.Delay(1000);
                }
            }
            throw new ApplicationException("Hit retry limit while trying to query MongoDB");
        }
    }


}
