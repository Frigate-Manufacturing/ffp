CREATE OR REPLACE FUNCTION get_orders (
        p_organization_id UUID,
        p_status TEXT DEFAULT NULL,
        p_payment_status TEXT DEFAULT NULL,
        p_rfq_id UUID DEFAULT NULL,
        p_limit INT DEFAULT 20,
        p_offset INT DEFAULT 0
    ) RETURNS TABLE (
        order_id UUID,
        order_code TEXT,
        rfq_id UUID,
        status TEXT,
        payment_status TEXT,
        subtotal NUMERIC(12, 2),
        shipping_cost NUMERIC(12, 2),
        tax_amount NUMERIC(12, 2),
        total_amount NUMERIC(12, 2),
        created_at TIMESTAMP,
        confirmed_at TIMESTAMP,
        part_count INT,
        organization_name TEXT
    ) LANGUAGE sql STABLE AS $$
SELECT o.id AS order_id,
    o.order_code,
    o.rfq_id,
    o.status,
    o.payment_status,
    o.subtotal,
    o.shipping_cost,
    o.tax_amount,
    o.total_amount,
    o.created_at,
    o.confirmed_at,
    COUNT(op.id)::INT AS part_count,
    org.name AS organization_name
FROM orders o
    JOIN organizations org ON org.id = o.organization_id
    LEFT JOIN order_parts op ON op.order_id = o.id
WHERE (
        p_organization_id IS NULL
        OR o.organization_id = p_organization_id
    )
    AND (
        p_status IS NULL
        OR o.status = p_status
    )
    AND (
        p_payment_status IS NULL
        OR o.payment_status = p_payment_status
    )
    AND (
        p_rfq_id IS NULL
        OR o.rfq_id = p_rfq_id
    )
GROUP BY o.id,
    org.name
ORDER BY o.created_at DESC
LIMIT p_limit OFFSET p_offset;
$$;