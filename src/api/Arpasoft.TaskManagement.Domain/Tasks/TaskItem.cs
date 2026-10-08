namespace Arpasoft.TaskManagement.Domain.Tasks;

public sealed class TaskItem
{
    public TaskItem(
        Guid id,
        string title,
        string description,
        TaskPriority priority,
        TaskItemStatus status,
        DateTime createdAt)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Task id cannot be empty.", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Task title is required.", nameof(title));
        }

        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException("Task description is required.", nameof(description));
        }

        if (!Enum.IsDefined(priority))
        {
            throw new ArgumentOutOfRangeException(nameof(priority), "Task priority is invalid.");
        }

        if (!Enum.IsDefined(status))
        {
            throw new ArgumentOutOfRangeException(nameof(status), "Task status is invalid.");
        }

        if (createdAt.Kind != DateTimeKind.Utc)
        {
            throw new ArgumentException("Task creation date must be UTC.", nameof(createdAt));
        }

        Id = id;
        Title = title.Trim();
        Description = description.Trim();
        Priority = priority;
        Status = status;
        CreatedAt = createdAt;
    }

    public Guid Id { get; }

    public string Title { get; }

    public string Description { get; }

    public TaskPriority Priority { get; }

    public TaskItemStatus Status { get; }

    public DateTime CreatedAt { get; }
}
