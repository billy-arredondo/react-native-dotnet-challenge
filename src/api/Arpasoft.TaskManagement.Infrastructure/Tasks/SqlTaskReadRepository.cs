namespace Arpasoft.TaskManagement.Infrastructure.Tasks;

using System.Data;
using Arpasoft.TaskManagement.Application.Common.Pagination;
using Arpasoft.TaskManagement.Application.Tasks;
using Arpasoft.TaskManagement.Domain.Tasks;
using Dapper;

public sealed class SqlTaskReadRepository(SqlConnectionFactory connectionFactory)
    : ITaskReadRepository
{
    public async Task<PagedResult<TaskItem>> GetPagedAsync(
        TaskQueryFilter filter,
        CancellationToken cancellationToken)
    {
        await using var connection = connectionFactory.Create();
        await connection.OpenAsync(cancellationToken);

        var command = new CommandDefinition(
            "dbo.Tasks_List",
            new
            {
                Statuses = JoinValues(filter.Statuses),
                Priorities = JoinValues(filter.Priorities),
                filter.Page,
                filter.PageSize
            },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken);

        using var results = await connection.QueryMultipleAsync(command);
        var rows = (await results.ReadAsync<TaskRow>()).ToArray();
        var totalItems = await results.ReadSingleAsync<long>();
        var tasks = rows.Select(Map).ToArray();

        return new PagedResult<TaskItem>(tasks, filter.Page, filter.PageSize, checked((int)totalItems));
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        await using var connection = connectionFactory.Create();
        await connection.OpenAsync(cancellationToken);

        var command = new CommandDefinition(
            "dbo.Tasks_GetById",
            new { Id = id },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken);

        var row = await connection.QuerySingleOrDefaultAsync<TaskRow>(command);
        return row is null ? null : Map(row);
    }

    private static string? JoinValues<TEnum>(IReadOnlyCollection<TEnum> values)
        where TEnum : struct, Enum
    {
        return values.Count == 0
            ? null
            : string.Join(',', values.Select(value => Convert.ToInt32(value)));
    }

    private static TaskItem Map(TaskRow row)
    {
        return new TaskItem(
            row.Id,
            row.Title,
            row.Description,
            (TaskPriority)row.Priority,
            (TaskItemStatus)row.Status,
            DateTime.SpecifyKind(row.CreatedAt, DateTimeKind.Utc));
    }

    private sealed class TaskRow
    {
        public Guid Id { get; init; }

        public string Title { get; init; } = string.Empty;

        public string Description { get; init; } = string.Empty;

        public byte Priority { get; init; }

        public byte Status { get; init; }

        public DateTime CreatedAt { get; init; }
    }
}
