namespace Arpasoft.TaskManagement.Domain.Tests.Tasks;

using Arpasoft.TaskManagement.Domain.Tasks;

public sealed class TaskItemTests
{
    private static readonly DateTime CreatedAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    [Fact]
    public void Constructor_trims_required_text()
    {
        var task = new TaskItem(
            Guid.NewGuid(),
            "  Prepare report  ",
            "  Review the pending items  ",
            TaskPriority.High,
            TaskItemStatus.Todo,
            CreatedAt);

        Assert.Equal("Prepare report", task.Title);
        Assert.Equal("Review the pending items", task.Description);
    }

    [Fact]
    public void Constructor_rejects_empty_id()
    {
        var exception = Assert.Throws<ArgumentException>(() => new TaskItem(
            Guid.Empty,
            "Title",
            "Description",
            TaskPriority.Low,
            TaskItemStatus.Todo,
            CreatedAt));

        Assert.Contains("id", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Constructor_rejects_blank_description()
    {
        Assert.Throws<ArgumentException>(() => new TaskItem(
            Guid.NewGuid(),
            "Title",
            " ",
            TaskPriority.Low,
            TaskItemStatus.Todo,
            CreatedAt));
    }

    [Fact]
    public void Constructor_rejects_non_utc_creation_date()
    {
        Assert.Throws<ArgumentException>(() => new TaskItem(
            Guid.NewGuid(),
            "Title",
            "Description",
            TaskPriority.Low,
            TaskItemStatus.Todo,
            new DateTime(2026, 1, 1)));
    }

    [Fact]
    public void Constructor_rejects_undefined_priority()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new TaskItem(
            Guid.NewGuid(),
            "Title",
            "Description",
            (TaskPriority)99,
            TaskItemStatus.Todo,
            CreatedAt));
    }
}
