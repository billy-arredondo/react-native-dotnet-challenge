IF OBJECT_ID(N'dbo.Tasks', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Tasks
    (
        Id uniqueidentifier NOT NULL
            CONSTRAINT PK_Tasks PRIMARY KEY
            CONSTRAINT DF_Tasks_Id DEFAULT NEWSEQUENTIALID(),
        Title nvarchar(200) NOT NULL,
        Description nvarchar(2000) NOT NULL,
        Priority tinyint NOT NULL,
        Status tinyint NOT NULL,
        CreatedAt datetime2(7) NOT NULL
            CONSTRAINT DF_Tasks_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT CK_Tasks_Title_NotBlank CHECK (LEN(LTRIM(RTRIM(Title))) > 0),
        CONSTRAINT CK_Tasks_Description_NotBlank CHECK (LEN(LTRIM(RTRIM(Description))) > 0),
        CONSTRAINT CK_Tasks_Priority_Valid CHECK (Priority BETWEEN 1 AND 4),
        CONSTRAINT CK_Tasks_Status_Valid CHECK (Status BETWEEN 1 AND 3)
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_Tasks_Priority_CreatedAt'
      AND object_id = OBJECT_ID(N'dbo.Tasks')
)
BEGIN
    CREATE INDEX IX_Tasks_Priority_CreatedAt
        ON dbo.Tasks (Priority DESC, CreatedAt DESC, Id ASC)
        INCLUDE (Title, Description, Status);
END;
GO
