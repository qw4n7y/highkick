ALTER TABLE highkick_schedulers ADD COLUMN scheduler_type TEXT NOT NULL DEFAULT 'timer';
ALTER TABLE highkick_schedulers ADD COLUMN exact_times TEXT NOT NULL DEFAULT '';