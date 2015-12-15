
using System.ComponentModel;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using TSFXGenform.DomainModel.DataRepository;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Repository.Repository;
using IContainer = Autofac.IContainer;


namespace TSFXGenform.Core.Tests.Config
{
    class IocConfig
    {
        // Method register dependencies within the IOC.
        public static IContainer RegisterDependencies()
        {

            var containerBuilder = new ContainerBuilder();

            /*Register Libs Files Here*/
            containerBuilder.RegisterGeneric(typeof(XmlDataRepository<>)).As(typeof(IXmlDataRepository<>));
            containerBuilder.RegisterGeneric(typeof(DataRepository<>)).As(typeof(IDataRepository<>));

            containerBuilder.RegisterType<CacheMemoryRepository>().As<ICacheMemoryRepository>();
            containerBuilder.RegisterType<ResourceRepository>().As<IResourceRepository>();
            containerBuilder.RegisterType<QuizRepository>().As<IQuizRepository>();
            containerBuilder.RegisterType<ExecuteMySqlQueries>().As<IExecuteMySqlQueries>();
        
            /*Register other dependencies.*/
         

            var container = containerBuilder.Build();
            var resolver = new AutofacDependencyResolver(container);
            DependencyResolver.SetResolver(resolver);
            return container;
        }
    }
}
