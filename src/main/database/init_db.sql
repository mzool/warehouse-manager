-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    country TEXT,
    city TEXT,
    phone TEXT,
    contact_person TEXT,
    UNIQUE(email) ON CONFLICT IGNORE
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    code TEXT UNIQUE,
    ar_name TEXT,
    active INTEGER DEFAULT 1,
    measure_unit TEXT,
    reorder_on INTEGER,
    brand TEXT,
    unit_price REAL,
    price_unit_of_measure TEXT
);

-- Inventories Table
CREATE TABLE IF NOT EXISTS inventories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_level INTEGER DEFAULT 0,
    material_id INTEGER NOT NULL,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- Supplier-Material Association Table
CREATE TABLE IF NOT EXISTS supplier_material (
    material_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    PRIMARY KEY (material_id, supplier_id),
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- Material Specifications Table (JSON Format for Specs)
CREATE TABLE IF NOT EXISTS materials_specs (
    material_id INTEGER PRIMARY KEY,
    specs TEXT CHECK (json_valid(specs)),
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    manager TEXT,
    location TEXT,
    budget REAL
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    role TEXT,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Receives Table
CREATE TABLE IF NOT EXISTS receives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    quantity INTEGER,
    invoice_number TEXT,
    grn TEXT,
    closed_by INTEGER,
    date TEXT DEFAULT (datetime('now')),
    notes TEXT,
    pallets INTEGER DEFAULT 1,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    base_price REAL
);

-- Product-Material Table (for BOM)
CREATE TABLE IF NOT EXISTS product_material (
    product_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    calculation_factor REAL,
    PRIMARY KEY (product_id, material_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- Units Table (for Unit Conversions)
CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    base_conversion_formula TEXT,
    base_unit_id INTEGER,
    FOREIGN KEY (base_unit_id) REFERENCES units(id) ON DELETE SET NULL
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- Group-Material Association Table
CREATE TABLE IF NOT EXISTS group_material (
    group_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, material_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- Production Table
CREATE TABLE IF NOT EXISTS production (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    date_of_production TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_inventories_material_id ON inventories(material_id);
CREATE INDEX IF NOT EXISTS idx_product_material ON product_material(product_id, material_id);
CREATE INDEX IF NOT EXISTS idx_group_material ON group_material(group_id, material_id);