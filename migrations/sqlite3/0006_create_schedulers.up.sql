CREATE TABLE `highkick_schedulers`
(
    `id`           INTEGER NOT NULL PRIMARY KEY,
    `job_type`     TEXT     NOT NULL DEFAULT '',
    `job_input`    TEXT     NOT NULL DEFAULT '{}',
    `run_every_seconds`     INTEGER NOT NULL DEFAULT 0,
    `stopped`       INTEGER  NOT NULL DEFAULT 0,
    `last_run_at`   TIMESTAMP      NULL DEFAULT NULL,
    `last_error`    TEXT NOT NULL DEFAULT '',
    `updated_at`    TIMESTAMP NOT NULL DEFAULT (datetime('now'))
);