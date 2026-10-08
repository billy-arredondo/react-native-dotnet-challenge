namespace Arpasoft.TaskManagement.Application.Tasks;

using Arpasoft.TaskManagement.Domain.Tasks;

public sealed record TaskItemDto(
    Guid Id,
    string Title,
    string Description,
    TaskPriority Priority,
    TaskItemStatus Status,
    DateTime CreatedAt);
