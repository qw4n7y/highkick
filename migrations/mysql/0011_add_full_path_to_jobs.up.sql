-- https://www.compose.com/articles/mysql-for-json-generated-columns-and-indexing/

ALTER TABLE `jobs`
  ADD COLUMN `full_path` JSON NOT NULL DEFAULT ('[]');

ALTER TABLE `jobs`
  ADD COLUMN `full_path1` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[0]') NOT NULL,
  ADD COLUMN `full_path2` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[1]') NOT NULL,
  ADD COLUMN `full_path3` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[2]') NOT NULL,
  ADD COLUMN `full_path4` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[3]') NOT NULL,
  ADD COLUMN `full_path5` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[4]') NOT NULL,
  ADD COLUMN `full_path6` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[5]') NOT NULL,
  ADD COLUMN `full_path7` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[6]') NOT NULL,
  ADD COLUMN `full_path8` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[7]') NOT NULL,
  ADD COLUMN `full_path9` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[8]') NOT NULL,
  ADD COLUMN `full_path10` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[9]') NOT NULL,
  ADD COLUMN `full_path11` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[10]') NOT NULL,
  ADD COLUMN `full_path12` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[11]') NOT NULL,
  ADD COLUMN `full_path13` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[12]') NOT NULL,
  ADD COLUMN `full_path14` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[13]') NOT NULL,
  ADD COLUMN `full_path15` INT(11) GENERATED ALWAYS AS (`full_path` ->> '$[14]') NOT NULL;

-- DO NOT FORGET! Migrate old data to new schema

CREATE INDEX `jobs_fullpath1_idx` ON `jobs` (`full_path1`);
CREATE INDEX `jobs_fullpath2_idx` ON `jobs` (`full_path2`);
CREATE INDEX `jobs_fullpath3_idx` ON `jobs` (`full_path3`);
CREATE INDEX `jobs_fullpath4_idx` ON `jobs` (`full_path4`);
CREATE INDEX `jobs_fullpath5_idx` ON `jobs` (`full_path5`);
CREATE INDEX `jobs_fullpath6_idx` ON `jobs` (`full_path6`);
CREATE INDEX `jobs_fullpath7_idx` ON `jobs` (`full_path7`);
CREATE INDEX `jobs_fullpath8_idx` ON `jobs` (`full_path8`);
CREATE INDEX `jobs_fullpath9_idx` ON `jobs` (`full_path9`);
CREATE INDEX `jobs_fullpath10_idx` ON `jobs` (`full_path10`);
CREATE INDEX `jobs_fullpath11_idx` ON `jobs` (`full_path11`);
CREATE INDEX `jobs_fullpath12_idx` ON `jobs` (`full_path12`);
CREATE INDEX `jobs_fullpath13_idx` ON `jobs` (`full_path13`);
CREATE INDEX `jobs_fullpath14_idx` ON `jobs` (`full_path14`);
CREATE INDEX `jobs_fullpath15_idx` ON `jobs` (`full_path15`);

