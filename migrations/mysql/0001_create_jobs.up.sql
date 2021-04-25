SET NAMES utf8mb4;

CREATE TABLE `jobs`
(
    `id`           INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `type`         VARCHAR(255)     NOT NULL DEFAULT '',
    `path`         VARCHAR(255)     NOT NULL DEFAULT '',
    `sid`          VARCHAR(255)     NULL DEFAULT NULL,
    `input`        JSON             NULL DEFAULT NULL,
    `output`       JSON             NULL DEFAULT NULL,
    `status`       ENUM('initial', 'processing', 'failed', 'completed') NOT NULL DEFAULT 'initial',
    `retries_left` INT              NOT NULL DEFAULT 0,
    `created_at`   TIMESTAMP        NOT NULL DEFAULT NOW(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE INDEX `jobs_path_idx` ON `jobs` (`path`);