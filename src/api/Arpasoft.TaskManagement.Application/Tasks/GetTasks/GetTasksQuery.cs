namespace Arpasoft.TaskManagement.Application.Tasks.GetTasks;

using Arpasoft.TaskManagement.Application.Common.Pagination;
using MediatR;

public sealed record GetTasksQuery(
    int Page = 1,
    int PageSize = 20,
    IReadOnlyCollection<string>? Statuses = null,
    IReadOnlyCollection<string>? Priorities = null) : IRequest<PagedResult<TaskItemDto>>;
