namespace Arpasoft.TaskManagement.Application.Tasks;

using Arpasoft.TaskManagement.Application.Common.Pagination;
using Arpasoft.TaskManagement.Domain.Tasks;

public interface ITaskReadRepository
{
    Task<PagedResult<TaskItem>> GetPagedAsync(
        TaskQueryFilter filter,
        CancellationToken cancellationToken);

    Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
}

public sealed record TaskQueryFilter(
    IReadOnlyCollection<TaskItemStatus> Statuses,
    IReadOnlyCollection<TaskPriority> Priorities,
    int Page,
    int PageSize);
