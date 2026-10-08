namespace Arpasoft.TaskManagement.Application.Tests.Tasks;

using Arpasoft.TaskManagement.Application.Tasks;
using Arpasoft.TaskManagement.Application.Tasks.GetTasks;
using Arpasoft.TaskManagement.Domain.Tasks;

public sealed class GetTasksQueryHandlerTests
{
    [Fact]
    public async Task Handle_parses_filters_and_maps_results()
    {
        var task = CreateTask();
        var repository = new StubTaskReadRepository(task);
        var handler = new GetTasksQueryHandler(repository);

        var result = await handler.Handle(
            new GetTasksQuery(2, 10, ["Todo", "InProgress"], ["High", "Critical"]),
            CancellationToken.None);

        Assert.Equal(2, repository.LastFilter!.Page);
        Assert.Equal(10, repository.LastFilter.PageSize);
        Assert.Equal([TaskItemStatus.Todo, TaskItemStatus.InProgress], repository.LastFilter.Statuses);
        Assert.Equal([TaskPriority.High, TaskPriority.Critical], repository.LastFilter.Priorities);
        Assert.Single(result.Items);
        Assert.Equal(task.Id, result.Items.Single().Id);
    }

    [Fact]
    public async Task Handle_rejects_page_size_above_maximum()
    {
        var handler = new GetTasksQueryHandler(new StubTaskReadRepository());

        var exception = await Assert.ThrowsAsync<TaskQueryValidationException>(() =>
            handler.Handle(new GetTasksQuery(PageSize: 101), CancellationToken.None));

        Assert.Contains("pageSize", exception.Errors.Keys);
    }

    [Fact]
    public async Task Handle_rejects_unknown_filter_values()
    {
        var handler = new GetTasksQueryHandler(new StubTaskReadRepository());

        var exception = await Assert.ThrowsAsync<TaskQueryValidationException>(() =>
            handler.Handle(new GetTasksQuery(Statuses: ["Unknown"]), CancellationToken.None));

        Assert.Contains("status", exception.Errors.Keys);
    }

    private static TaskItem CreateTask()
    {
        return new TaskItem(
            Guid.NewGuid(),
            "Prepare report",
            "Review pending items",
            TaskPriority.High,
            TaskItemStatus.Todo,
            new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc));
    }

    private sealed class StubTaskReadRepository(params TaskItem[] tasks) : ITaskReadRepository
    {
        private readonly IReadOnlyCollection<TaskItem> tasks = tasks;

        public TaskQueryFilter? LastFilter { get; private set; }

        public Task<PagedResult<TaskItem>> GetPagedAsync(
            TaskQueryFilter filter,
            CancellationToken cancellationToken)
        {
            LastFilter = filter;
            return Task.FromResult(new PagedResult<TaskItem>(tasks, filter.Page, filter.PageSize, tasks.Count));
        }

        public Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return Task.FromResult(tasks.SingleOrDefault(task => task.Id == id));
        }
    }
}
