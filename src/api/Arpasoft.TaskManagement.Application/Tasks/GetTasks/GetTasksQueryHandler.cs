namespace Arpasoft.TaskManagement.Application.Tasks.GetTasks;

using Arpasoft.TaskManagement.Domain.Tasks;
using MediatR;

public sealed class GetTasksQueryHandler(ITaskReadRepository repository)
    : IRequestHandler<GetTasksQuery, PagedResult<TaskItemDto>>
{
    public async Task<PagedResult<TaskItemDto>> Handle(
        GetTasksQuery request,
        CancellationToken cancellationToken)
    {
        var filter = CreateFilter(request);
        var result = await repository.GetPagedAsync(filter, cancellationToken);

        return new PagedResult<TaskItemDto>(
            [.. result.Items.Select(Map)],
            result.Page,
            result.PageSize,
            result.TotalItems);
    }

    private static TaskQueryFilter CreateFilter(GetTasksQuery request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        if (request.Page < 1)
        {
            errors["page"] = ["Page must be greater than zero."];
        }

        if (request.PageSize is < 1 or > 100)
        {
            errors["pageSize"] = ["Page size must be between 1 and 100."];
        }

        var statuses = ParseValues(
            request.Statuses,
            "status",
            errors,
            value => Enum.TryParse<TaskItemStatus>(value, true, out var status) && Enum.IsDefined(status),
            value => Enum.Parse<TaskItemStatus>(value, true));

        var priorities = ParseValues(
            request.Priorities,
            "priority",
            errors,
            value => Enum.TryParse<TaskPriority>(value, true, out var priority) && Enum.IsDefined(priority),
            value => Enum.Parse<TaskPriority>(value, true));

        if (errors.Count > 0)
        {
            throw new TaskQueryValidationException(errors);
        }

        return new TaskQueryFilter(statuses, priorities, request.Page, request.PageSize);
    }

    private static IReadOnlyCollection<TEnum> ParseValues<TEnum>(
        IReadOnlyCollection<string>? values,
        string field,
        IDictionary<string, string[]> errors,
        Func<string, bool> isValid,
        Func<string, TEnum> parse)
        where TEnum : struct, Enum
    {
        if (values is null or { Count: 0 })
        {
            return [];
        }

        var parsed = new List<TEnum>();
        foreach (var rawValue in values)
        {
            var value = rawValue.Trim();
            if (!isValid(value))
            {
                errors[field] = [$"'{rawValue}' is not a valid {field} value."];
                continue;
            }

            parsed.Add(parse(value));
        }

        return [.. parsed.Distinct()];
    }

    private static TaskItemDto Map(Domain.Tasks.TaskItem task)
    {
        return new TaskItemDto(
            task.Id,
            task.Title,
            task.Description,
            task.Priority,
            task.Status,
            task.CreatedAt);
    }
}
