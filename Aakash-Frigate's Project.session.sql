CREATE TABLE supplier_materials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    supplier_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    material_id uuid NOT NULL REFERENCES material(id) ON DELETE CASCADE,

    stock_quantity numeric(14,3) NOT NULL DEFAULT 0,
    stock_unit unit_type NOT NULL,

    supplier_price numeric(14,2),
    currency currency_type NOT NULL DEFAULT 'USD',

    stock_material stock_material_type NOT NULL,

    status material_status NOT NULL DEFAULT 'active',

    updated_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),

    -- One supplier can have block/rod/plate for the same material
    UNIQUE (supplier_id, material_id, stock_material)
);



-- Lookup all materials for a supplier quickly
CREATE INDEX idx_supplier_materials_supplier_id 
    ON supplier_materials (supplier_id);

-- Lookup all suppliers for a given material
CREATE INDEX idx_supplier_materials_material_id 
    ON supplier_materials (material_id);

-- Supplier + material type (block/rod/plate)
CREATE INDEX idx_supplier_materials_supplier_materialtype
    ON supplier_materials (supplier_id, stock_material);

-- Material + stock type (used for matching suppliers by stock form)
CREATE INDEX idx_supplier_materials_material_materialtype
    ON supplier_materials (material_id, stock_material);

-- Queries filtered by active/inactive
CREATE INDEX idx_supplier_materials_status
    ON supplier_materials (status);


-- Warehouses owned by supplier organizations
CREATE TABLE supplier_warehouses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- The warehouse belongs to a supplier organization
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    name text NOT NULL,

    total_capacity numeric(14,3) NOT NULL,            -- max storage capacity (kg or chosen unit)
    capacity_unit unit_type NOT NULL DEFAULT 'kg',     -- enforce consistent measurement

    geolocation geography(Point, 4326),                -- precise lat/lng
    address text NOT NULL,

    status material_status NOT NULL DEFAULT 'active',  -- active | inactive

    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);


CREATE INDEX idx_warehouses_organization_id
    ON warehouses (organization_id);

CREATE INDEX idx_warehouses_status
    ON warehouses (status);

-- If using PostGIS
CREATE INDEX idx_warehouses_geolocation_gist
    ON warehouses USING GIST (geolocation);
