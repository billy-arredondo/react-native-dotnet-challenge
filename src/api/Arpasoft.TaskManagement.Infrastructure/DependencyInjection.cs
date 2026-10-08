namespace Arpasoft.TaskManagement.Infrastructure;

using Arpasoft.TaskManagement.Application.Tasks;
using Arpasoft.TaskManagement.Infrastructure.Tasks;
using Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddSingleton(new SqlConnectionFactory(connectionString));
        services.AddScoped<ITaskReadRepository, SqlTaskReadRepository>();

        return services;
    }
}
