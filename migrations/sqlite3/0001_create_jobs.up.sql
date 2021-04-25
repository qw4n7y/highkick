CREATE TABLE `jobs` (
    `id`           INTEGER NOT NULL PRIMARY KEY,
    `type`         TEXT     NOT NULL DEFAULT '',
    `path`         TEXT     NOT NULL DEFAULT '',
    `sid`          TEXT     NULL DEFAULT NULL,
    `input`        TEXT             NULL DEFAULT NULL,
    `output`       TEXT             NULL DEFAULT NULL,
    `status`       TEXT NOT NULL DEFAULT 'initial',
    `retries_left` INTEGER              NOT NULL DEFAULT 0,
    `created_at`   TIMESTAMP        NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX `jobs_path_idx` ON `jobs` (`path`);