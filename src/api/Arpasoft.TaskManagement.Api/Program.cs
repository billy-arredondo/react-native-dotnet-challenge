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
        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddCors(options =>
                options.AddPolicy("DevelopmentCors", policy =>
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()));
        }
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
        builder.Services.AddOpenApi();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        if (!app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }
        if (app.Environment.IsDevelopment())
        {
            app.UseCors("DevelopmentCors");
        }
        app.MapControllers();
        app.MapHealthChecks("/health");

        app.Run();
    }
}
