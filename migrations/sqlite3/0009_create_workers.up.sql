CREATE TABLE `highkick_workers`
(
    `id`            INTEGER NOT NULL PRIMARY KEY,
    `sid`           TEXT     NOT NULL DEFAULT '',
    `process_sid`   TEXT     NOT NULL DEFAULT '',
    `stopped`       BOOL       NOT NULL DEFAULT 0,
    `running_jobs_count` INTEGER NOT NULL DEFAULT 0,
    `healthchecked_at`   TIMESTAMP      NULL DEFAULT NULL,
    `created_at`         TIMESTAMP      NULL DEFAULT NULL
);