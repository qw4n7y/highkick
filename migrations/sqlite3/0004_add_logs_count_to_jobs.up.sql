ALTER TABLE `jobs`
  ADD COLUMN `logs_count` INTEGER NOT NULL DEFAULT 0;

UPDATE `jobs` SET
  logs_count = (SELECT COUNT() FROM `job_logs` WHERE `job_logs`.job_id = `jobs`.id);