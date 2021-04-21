ALTER TABLE jobs MODIFY COLUMN status ENUM('scheduled', 'initial', 'processing', 'failed', 'completed') NOT NULL DEFAULT 'initial';

CREATE INDEX `jobs_status_idx` ON `jobs` (`status`);