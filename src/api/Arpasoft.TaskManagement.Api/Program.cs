namespace Arpasoft.TaskManagement.Api;

using Arpasoft.TaskManagement.Application;
using Arpasoft.TaskManagement.Infrastructure;
using System.Text.Json.Serialization;

public sealed class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("TaskManagement")
            ?? throw new InvalidOperationException("Connection string 'TaskManagement' was not configured.");

        builder.Services.AddApplication();
        builder.Services.AddInfrastructure(connectionString);
        builder.Services.AddHealthChecks();
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
        builder.Services.AddOpenApi();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.MapControllers();
        app.MapHealthChecks("/health");

        app.Run();
    }
}
