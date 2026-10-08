namespace Arpasoft.TaskManagement.Application.Tasks.GetTaskById;

using MediatR;

public sealed class GetTaskByIdQueryHandler(ITaskReadRepository repository)
    : IRequestHandler<GetTaskByIdQuery, TaskItemDto?>
{
    public async Task<TaskItemDto?> Handle(
        GetTaskByIdQuery request,
        CancellationToken cancellationToken)
    {
        if (request.Id == Guid.Empty)
        {
            throw new ArgumentException("Task id cannot be empty.", nameof(request.Id));
        }

        var task = await repository.GetByIdAsync(request.Id, cancellationToken);
        return task is null
            ? null
            : new TaskItemDto(
                task.Id,
                task.Title,
                task.Description,
                task.Priority,
                task.Status,
                task.CreatedAt);
    }
}
