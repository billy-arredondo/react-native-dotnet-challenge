DECLARE @Tasks TABLE
(
    Id uniqueidentifier NOT NULL,
    Title nvarchar(200) NOT NULL,
    Description nvarchar(2000) NOT NULL,
    Priority tinyint NOT NULL,
    Status tinyint NOT NULL,
    CreatedAt datetime2(7) NOT NULL
);

INSERT INTO @Tasks (Id, Title, Description, Priority, Status, CreatedAt)
VALUES
    ('11111111-1111-1111-1111-111111111111', N'Prepare quarterly report', N'Compile the metrics and prepare the review draft.', 4, 1, '2026-01-10T09:00:00Z'),
    ('22222222-2222-2222-2222-222222222222', N'Update project documentation', N'Review the architecture notes and update the setup instructions.', 3, 2, '2026-01-12T09:00:00Z'),
    ('33333333-3333-3333-3333-333333333333', N'Plan sprint backlog', N'Prioritize the next sprint items with the team.', 3, 1, '2026-01-15T09:00:00Z'),
    ('44444444-4444-4444-4444-444444444444', N'Review pull requests', N'Review the open changes and leave actionable feedback.', 2, 2, '2026-01-17T09:00:00Z'),
    ('55555555-5555-5555-5555-555555555555', N'Clean up local branches', N'Remove stale local branches after confirming their remote status.', 1, 3, '2026-01-20T09:00:00Z'),
    ('66666666-6666-6666-6666-666666666666', N'Create release notes', N'Summarize the changes included in the next release.', 2, 3, '2026-01-22T09:00:00Z');

INSERT INTO dbo.Tasks (Id, Title, Description, Priority, Status, CreatedAt)
SELECT source.Id, source.Title, source.Description, source.Priority, source.Status, source.CreatedAt
FROM @Tasks AS source
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Tasks AS target
    WHERE target.Id = source.Id
);
GO
