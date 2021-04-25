CREATE TABLE `highkick_schedulers`
(
    `id`           INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `job_type`         VARCHAR(255)     NOT NULL DEFAULT '',
    `job_input`        JSON     NOT NULL DEFAULT (JSON_OBJECT()),
    `run_every_seconds`           INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `stopped`       tinyint(1)     NOT NULL DEFAULT 0,
    `last_run_at`   DATETIME      NULL DEFAULT NULL,
    `last_error`         VARCHAR(255)     NOT NULL DEFAULT '',
    `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;