CREATE OR REPLACE FUNCTION update_order_status(
        p_order_id UUID,
        p_new_status TEXT,
        p_changed_by UUID DEFAULT NULL,
        p_reason TEXT DEFAULT NULL,
        p_metadata JSONB DEFAULT NULL
    ) RETURNS VOID AS $$
DECLARE v_current_status TEXT;
BEGIN -- Lock order row
SELECT status INTO v_current_status
FROM orders
WHERE id = p_order_id FOR
UPDATE;
IF v_current_status IS NULL THEN RAISE EXCEPTION 'Order % not found',
p_order_id;
END IF;
-- Idempotency
IF v_current_status = p_new_status THEN RETURN;
END IF;
-- Enforce valid transitions
IF NOT (
    (
        v_current_status = 'backlog'
        AND p_new_status = 'preparation'
    )
    OR (
        v_current_status = 'preparation'
        AND p_new_status = 'production'
    )
    OR (
        v_current_status = 'production'
        AND p_new_status = 'post-production'
    )
    OR (
        v_current_status = 'post-production'
        AND p_new_status = 'completed'
    )
) THEN RAISE EXCEPTION 'Invalid order status transition: % → %',
v_current_status,
p_new_status;
END IF;
-- Update order
UPDATE orders
SET status = p_new_status,
    updated_at = now(),
    confirmed_at = CASE
        WHEN p_new_status = 'preparation' THEN now()
        ELSE confirmed_at
    END
WHERE id = p_order_id;
-- Write status history
INSERT INTO order_status_history (
        order_id,
        from_status,
        to_status,
        changed_by,
        reason,
        metadata
    )
VALUES (
        p_order_id,
        v_current_status,
        p_new_status,
        p_changed_by,
        p_reason,
        p_metadata
    );
-- Terminal handling
IF p_new_status = 'completed' THEN
UPDATE order_parts
SET status = 'completed',
    status_changed_at = now(),
    updated_at = now()
WHERE order_id = p_order_id;
END IF;
END;
$$ LANGUAGE plpgsql;