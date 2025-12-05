create or replace function add_stock_to_warehouse(
  p_supplier_id uuid,
  p_material_id uuid,
  p_warehouse_id uuid,
  p_quantity numeric,
  p_unit text,
  p_price numeric,
  p_currency text,
  p_max_stock numeric
)
returns void
language plpgsql
as $$
begin
  -- Capacity check and update
  update warehouses
  set used_capacity = used_capacity + p_quantity
  where id = p_warehouse_id
    and used_capacity + p_quantity <= total_capacity;

  if not found then
    raise exception 'Not enough warehouse capacity';
  end if;

  -- Insert/update stock
  insert into supplier_materials (
    supplier_id, material_id, warehouse_id,
    current_stock, stock_unit, supplier_price,
    currency, max_stock
  )
  values (
    p_supplier_id, p_material_id, p_warehouse_id,
    p_quantity, p_unit, p_price,
    p_currency, p_max_stock
  )
  on conflict (supplier_id, material_id, warehouse_id)
  do update set current_stock =
      supplier_materials.current_stock + excluded.current_stock;
end;
$$;
