CREATE OR REPLACE FUNCTION maybe_complete_order() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_remaining_parts INT;
BEGIN -- Only react when a part becomes completed
IF OLD.status IS DISTINCT
FROM 'completed'
    AND NEW.status = 'completed' THEN -- Check if any parts are NOT completed
SELECT COUNT(*) INTO v_remaining_parts
FROM order_parts
WHERE order_id = NEW.order_id
    AND status <> 'completed';
-- If none remain, complete the order
IF v_remaining_parts = 0 THEN
UPDATE orders
SET status = 'completed',
    completed_at = now(),
    updated_at = now()
WHERE id = NEW.order_id
    AND status <> 'completed';
END IF;
END IF;
RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_complete_order_when_parts_done ON order_parts;
CREATE TRIGGER trg_complete_order_when_parts_done
AFTER
UPDATE OF status ON order_parts FOR EACH ROW EXECUTE FUNCTION maybe_complete_order();