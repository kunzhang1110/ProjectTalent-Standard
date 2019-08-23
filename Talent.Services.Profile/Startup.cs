using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Security.Principal;
using Talent.Common.Auth;
using Talent.Common.Aws;
using Talent.Common.Commands;
using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Common.Mongo;
using Talent.Common.RabbitMq;
using Talent.Common.Security;
using Talent.Common.Services;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Domain.Services;
using Talent.Services.Profile.Handler;
using Talent.Services.Profile.Models.Profile;

namespace Talent.Services.Profile
{

    public class AutoMapperPofile : AutoMapper.Profile
    {
        public AutoMapperPofile()
        {
            CreateMap<User, TalentProfileViewModel>()
                .ForMember(x => x.Languages, opt => opt.Ignore())
                .ForMember(x => x.Skills, opt => opt.Ignore());
            CreateMap<TalentProfileViewModel, User>()
                .ForMember(x => x.Languages, opt => opt.Ignore())
                .ForMember(x => x.Skills, opt => opt.Ignore());
            CreateMap<ExperienceViewModel, UserExperience>();
            CreateMap<UserExperience, ExperienceViewModel>();
        }
    }

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(AutoMapperPofile));
            services.AddCors(options =>
            {
                options.AddPolicy("AllowWebAppAccess", builder =>
                {
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue;
                x.MultipartHeadersLengthLimit = int.MaxValue;
            });
            services.AddMvc()
                .AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver
                    = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
            });
            services.AddJwt(Configuration);
            services.AddMongoDB(Configuration);
            services.AddRabbitMq(Configuration);
            services.AddAws(Configuration);
            services.AddScoped<ICommandHandler<AuthenticateUser>, AuthenticateUserHandler>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            Func<IServiceProvider, IPrincipal> getPrincipal =
                     (sp) => sp.GetService<IHttpContextAccessor>().HttpContext.User;
            services.AddScoped(typeof(Func<IPrincipal>), sp =>
            {
                Func<IPrincipal> func = () =>
                {
                    return getPrincipal(sp);
                };
                return func;
            });
            services.AddScoped<IUserAppContext, UserAppContext>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IFileService, FileService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseStaticFiles();


            app.UseCors("AllowWebAppAccess");
            app.UseMvc();
        }
    }
}
