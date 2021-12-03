ALTER TABLE highkick_schedulers ADD COLUMN scheduler_type ENUM('timer', 'exact_time') NOT NULL DEFAULT 'timer';
ALTER TABLE highkick_schedulers ADD COLUMN exact_times VARCHAR(255) NOT NULL DEFAULT '';