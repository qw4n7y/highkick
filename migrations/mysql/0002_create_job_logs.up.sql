CREATE TABLE `job_logs`
(
    `id`           INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `job_id`       INT              NOT NULL,
    `job_path`     VARCHAR(255)     NOT NULL DEFAULT '',
    `content`      TEXT             NULL DEFAULT NULL,
    `created_at`   TIMESTAMP        NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE INDEX `job_logs_job_id_idx` ON `job_logs` (`job_id`);
CREATE INDEX `job_logs_job_path_idx` ON `job_logs` (`job_path`);