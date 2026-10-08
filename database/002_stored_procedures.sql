CREATE OR ALTER PROCEDURE dbo.Tasks_List
    @Statuses nvarchar(200) = NULL,
    @Priorities nvarchar(200) = NULL,
    @Page int = 1,
    @PageSize int = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset int = (@Page - 1) * @PageSize;

    SELECT
        Id,
        Title,
        Description,
        Priority,
        Status,
        CreatedAt
    FROM dbo.Tasks
    WHERE
        (
            NULLIF(LTRIM(RTRIM(@Statuses)), N'') IS NULL
            OR EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(@Statuses, N',') AS filterValue
                WHERE TRY_CONVERT(tinyint, LTRIM(RTRIM(filterValue.value))) = dbo.Tasks.Status
            )
        )
        AND
        (
            NULLIF(LTRIM(RTRIM(@Priorities)), N'') IS NULL
            OR EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(@Priorities, N',') AS filterValue
                WHERE TRY_CONVERT(tinyint, LTRIM(RTRIM(filterValue.value))) = dbo.Tasks.Priority
            )
        )
    ORDER BY Priority DESC, CreatedAt DESC, Id ASC
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT_BIG(1)
    FROM dbo.Tasks
    WHERE
        (
            NULLIF(LTRIM(RTRIM(@Statuses)), N'') IS NULL
            OR EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(@Statuses, N',') AS filterValue
                WHERE TRY_CONVERT(tinyint, LTRIM(RTRIM(filterValue.value))) = dbo.Tasks.Status
            )
        )
        AND
        (
            NULLIF(LTRIM(RTRIM(@Priorities)), N'') IS NULL
            OR EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(@Priorities, N',') AS filterValue
                WHERE TRY_CONVERT(tinyint, LTRIM(RTRIM(filterValue.value))) = dbo.Tasks.Priority
            )
        );
END;
GO

CREATE OR ALTER PROCEDURE dbo.Tasks_GetById
    @Id uniqueidentifier
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Title,
        Description,
        Priority,
        Status,
        CreatedAt
    FROM dbo.Tasks
    WHERE Id = @Id;
END;
GO
