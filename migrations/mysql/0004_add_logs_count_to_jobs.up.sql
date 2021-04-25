ALTER TABLE `jobs`
  ADD COLUMN `logs_count` INT NOT NULL DEFAULT 0;

UPDATE `jobs` j SET
  j.logs_count = (SELECT COUNT(jl.id) FROM `job_logs` jl WHERE jl.job_id = j.id);