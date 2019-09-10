using Talent.Common.Services;

namespace Talent.Services.Profile
{
    public class Program
    {
        public static void Main(string[] args)
        {
            ServiceHost.Create<Startup>(args)
                .UseRabbitMq()
                .Build()
                .Run();
        }
    }
}
