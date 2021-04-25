CREATE TABLE `job_logs`
(
    `id`           INTEGER NOT NULL PRIMARY KEY,
    `job_id`       INTEGER              NOT NULL,
    `job_path`     TEXT     NOT NULL DEFAULT '',
    `content`      TEXT             NULL DEFAULT NULL,
    `created_at`   TIMESTAMP        NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX `job_logs_job_id_idx` ON `job_logs` (`job_id`);
CREATE INDEX `job_logs_job_path_idx` ON `job_logs` (`job_path`);