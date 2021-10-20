CREATE TABLE `highkick_workers`
(
    `id`            INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `sid`           VARCHAR(255)     NOT NULL DEFAULT '',
    `process_sid`   VARCHAR(255)     NOT NULL DEFAULT '',
    `stopped`       tinyint(1)       NOT NULL DEFAULT 0,
    `running_jobs_count` INT(11) NOT NULL DEFAULT 0,
    `healthchecked_at`   DATETIME      NULL DEFAULT NULL,
    `created_at`         DATETIME      NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;