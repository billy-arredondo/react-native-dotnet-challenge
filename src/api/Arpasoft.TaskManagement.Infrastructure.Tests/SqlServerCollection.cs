namespace Arpasoft.TaskManagement.Infrastructure.Tests;

using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;
using Testcontainers.MsSql;

[CollectionDefinition(Name)]
public sealed class SqlServerCollection : ICollectionFixture<SqlServerFixture>
{
    public const string Name = "sqlserver";
}

public sealed class SqlServerFixture : IAsyncLifetime
{
    private readonly MsSqlContainer container = new MsSqlBuilder()
        .WithImage("mcr.microsoft.com/mssql/server@sha256:b1395aa51b4ec39981883560f1379ea9eba2a1c0719bf8e6477902769316bb79")
        .Build();

    public string ConnectionString => container.GetConnectionString();

    public async Task InitializeAsync()
    {
        await container.StartAsync();

        await using var connection = new SqlConnection(ConnectionString);
        await connection.OpenAsync();

        foreach (var scriptName in new[] { "001_schema.sql", "002_stored_procedures.sql", "003_seed.sql" })
        {
            var scriptPath = FindRepositoryFile(Path.Combine("database", scriptName));
            var script = await File.ReadAllTextAsync(scriptPath);

            foreach (var batch in Regex.Split(script, @"^\s*GO\s*(?:--.*)?$", RegexOptions.Multiline | RegexOptions.IgnoreCase))
            {
                if (string.IsNullOrWhiteSpace(batch))
                {
                    continue;
                }

                await using var command = new SqlCommand(batch, connection);
                command.CommandTimeout = 60;
                await command.ExecuteNonQueryAsync();
            }
        }
    }

    public async Task DisposeAsync()
    {
        await container.DisposeAsync();
    }

    private static string FindRepositoryFile(string relativePath)
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, relativePath);
            if (File.Exists(candidate))
            {
                return candidate;
            }

            directory = directory.Parent;
        }

        throw new FileNotFoundException($"Could not locate repository file '{relativePath}'.");
    }
}
