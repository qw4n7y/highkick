DROP INDEX `jobs_fullpath1_idx`;
DROP INDEX `jobs_fullpath2_idx`;
DROP INDEX `jobs_fullpath3_idx`;
DROP INDEX `jobs_fullpath4_idx`;
DROP INDEX `jobs_fullpath5_idx`;
DROP INDEX `jobs_fullpath6_idx`;
DROP INDEX `jobs_fullpath7_idx`;
DROP INDEX `jobs_fullpath8_idx`;
DROP INDEX `jobs_fullpath9_idx`;
DROP INDEX `jobs_fullpath10_idx`;
DROP INDEX `jobs_fullpath11_idx`;
DROP INDEX `jobs_fullpath12_idx`;
DROP INDEX `jobs_fullpath13_idx`;
DROP INDEX `jobs_fullpath14_idx`;
DROP INDEX `jobs_fullpath15_idx`;

ALTER TABLE `jobs`
  DROP `jobs_fullpath1`,
  DROP `jobs_fullpath2`,
  DROP `jobs_fullpath3`,
  DROP `jobs_fullpath4`,
  DROP `jobs_fullpath5`,
  DROP `jobs_fullpath6`,
  DROP `jobs_fullpath7`,
  DROP `jobs_fullpath8`,
  DROP `jobs_fullpath9`,
  DROP `jobs_fullpath10`,
  DROP `jobs_fullpath11`,
  DROP `jobs_fullpath12`,
  DROP `jobs_fullpath13`,
  DROP `jobs_fullpath14`,
  DROP `jobs_fullpath15`;

ALTER TABLE `jobs`
  DROP `jobs_fullpath`,