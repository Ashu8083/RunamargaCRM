-- backend\app\database_triggers\reminder_trigger.sql

-- Reminder database notification trigger.
-- Does not modify the reminders table structure.

CREATE OR REPLACE FUNCTION notify_reminder_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    event_type TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        event_type := 'REMINDER_CREATED';

    ELSIF TG_OP = 'UPDATE' THEN
        -- Ignore updates that do not affect reminder data
        -- relevant to the frontend.
        IF OLD.employee_id IS NOT DISTINCT FROM NEW.employee_id
           AND OLD.application_id IS NOT DISTINCT FROM NEW.application_id
           AND OLD.reminder_at IS NOT DISTINCT FROM NEW.reminder_at
           AND OLD.note IS NOT DISTINCT FROM NEW.note
           AND OLD.status IS NOT DISTINCT FROM NEW.status
           AND OLD.completed_at IS NOT DISTINCT FROM NEW.completed_at
           AND OLD.deleted_at IS NOT DISTINCT FROM NEW.deleted_at
        THEN
            RETURN NEW;
        END IF;

        event_type := 'REMINDER_UPDATED';
    END IF;

    PERFORM pg_notify(
        'reminder_events',
        json_build_object(
            'event', event_type,
            'reminder_id', NEW.id,
            'employee_id', NEW.employee_id
        )::TEXT
    );

    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS trg_reminder_change_notification
ON reminders;

CREATE TRIGGER trg_reminder_change_notification
AFTER INSERT OR UPDATE ON reminders
FOR EACH ROW
EXECUTE FUNCTION notify_reminder_change();
