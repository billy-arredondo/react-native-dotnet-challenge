namespace Arpasoft.TaskManagement.Infrastructure;

using Microsoft.Data.SqlClient;

public sealed class SqlConnectionFactory(string connectionString)
{
    public SqlConnection Create() => new(connectionString);
}
