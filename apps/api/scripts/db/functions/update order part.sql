CREATE OR REPLACE FUNCTION update_order_part_status(
        p_order_part_id UUID,
        p_new_status TEXT,
        p_changed_by UUID DEFAULT NULL,
        p_reason TEXT DEFAULT NULL,
        p_metadata JSONB DEFAULT NULL
    ) RETURNS VOID AS $$
DECLARE v_old_status TEXT;
v_order_id UUID;
v_order_status TEXT;
v_remaining_parts INT;
BEGIN -- Lock order part
SELECT status,
    order_id INTO v_old_status,
    v_order_id
FROM order_parts
WHERE id = p_order_part_id FOR
UPDATE;
IF v_old_status IS NULL THEN RAISE EXCEPTION 'Order part % not found',
p_order_part_id;
END IF;
-- Idempotency
IF v_old_status = p_new_status THEN RETURN;
END IF;
-- Update order part
UPDATE order_parts
SET status = p_new_status,
    status_changed_at = now(),
    updated_at = now()
WHERE id = p_order_part_id;
-- Write order part history
INSERT INTO order_part_status_history (
        order_part_id,
        from_status,
        to_status,
        changed_by,
        reason,
        metadata
    )
VALUES (
        p_order_part_id,
        v_old_status,
        p_new_status,
        p_changed_by,
        p_reason,
        p_metadata
    );
-- Only evaluate order completion when a part becomes completed
IF p_new_status <> 'completed' THEN RETURN;
END IF;
-- Lock order
SELECT status INTO v_order_status
FROM orders
WHERE id = v_order_id FOR
UPDATE;
-- Do nothing if order already completed
IF v_order_status = 'completed' THEN RETURN;
END IF;
-- Check if any non-completed parts remain
SELECT COUNT(*) INTO v_remaining_parts
FROM order_parts
WHERE order_id = v_order_id
    AND status <> 'completed';
-- If all parts completed → complete order
IF v_remaining_parts = 0 THEN
UPDATE orders
SET status = 'completed',
    updated_at = now()
WHERE id = v_order_id;
INSERT INTO order_status_history (
        order_id,
        from_status,
        to_status,
        changed_by,
        reason,
        metadata
    )
VALUES (
        v_order_id,
        v_order_status,
        'completed',
        p_changed_by,
        'All order parts completed',
        jsonb_build_object('source', 'order_part_status')
    );
END IF;
END;
$$ LANGUAGE plpgsql;