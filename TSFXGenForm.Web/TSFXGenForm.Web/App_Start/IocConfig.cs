using System.Data.Entity;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using TSFXGenform.Core.Controllers;
using TSFXGenform.DomainModel.DataRepository;
using TSFXGenform.DomainModel.Models;
using TSFXGenform.Repository.IRepository;
using TSFXGenform.Repository.Repository;
using Autofac.Integration.WebApi;
using System.Web.Http;
using TSFXGenform.Utils.GlobalUtils;
using TSFXGenform.Utils;
using TSFXGenform.Utils.Repository;
using TSFXGenform.Utils.IRepository;

namespace TSFXGenForm.Web
{
    public class IocConfig
    {
        public static IContainer RegisterDependencies()
        {
           
            var containerBuilder = new ContainerBuilder();

            //Register DbContext.
            containerBuilder.RegisterType<TsfxDataContext>()
                .As<DbContext>()
                .InstancePerDependency();

            //Register GlobalUtilities for LifeTime
            containerBuilder.RegisterType<GlobalPath>().InstancePerLifetimeScope();

            //Register all the controllers within the current assembly.
            containerBuilder.RegisterControllers(typeof(ResourceController).Assembly);           

            //Register API controllers
            containerBuilder.RegisterApiControllers(typeof(ResourceController).Assembly);
            containerBuilder.RegisterApiControllers(typeof(QuizController).Assembly);

            //Register Libs Files Here
            containerBuilder.RegisterGeneric(typeof(XmlDataRepository<>)).As(typeof(IXmlDataRepository<>));
            containerBuilder.RegisterGeneric(typeof(DataRepository<>)).As(typeof(IDataRepository<>));

            containerBuilder.RegisterType<CacheMemoryRepository>().As<ICacheMemoryRepository>();
            containerBuilder.RegisterType<ResourceRepository>().As<IResourceRepository>();
            containerBuilder.RegisterType<QuizRepository>().As<IQuizRepository>();
            containerBuilder.RegisterType<ExecuteMySqlQueries>().As<IExecuteMySqlQueries>();
            containerBuilder.RegisterType<GLobalRepository>().As<IGLobalRepository>();
          
            //Register StringConstant
            containerBuilder.RegisterType<StringConstant>().AsSelf();

            var container = containerBuilder.Build();
         //   var resolver = new AutofacDependencyResolver(container);

            //Sets depencency resolver for MVC
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            //For Web API dependency resolver
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;

            return container;
        }
    }
}