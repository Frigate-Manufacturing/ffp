import { Service, Member } from "./types";

export const SAMPLE_SERVICES: Service[] = [
  {
    id: "inventory",
    name: "Inventory",
    description: "Manage inventory and stock",
    resources: [
      {
        id: "materials",
        name: "Materials",
        permissions: [
          { id: "inv-mat-read", code: "inventory.materials.read", name: "View Materials", description: "View material listings and details", type: "read", impact: "Low - Read-only access to material data" },
          { id: "inv-mat-write", code: "inventory.materials.write", name: "Edit Materials", description: "Create and update materials", type: "write", impact: "Medium - Can modify material information" },
          { id: "inv-mat-delete", code: "inventory.materials.delete", name: "Delete Materials", description: "Remove materials from inventory", type: "delete", impact: "High - Permanent data removal" },
          { id: "inv-mat-manage", code: "inventory.materials.manage", name: "Manage Materials", description: "Full control over materials", type: "manage", impact: "Critical - Complete administrative access" },
        ],
      },
      {
        id: "warehouses",
        name: "Warehouses",
        permissions: [
          { id: "inv-wh-read", code: "inventory.warehouses.read", name: "View Warehouses", description: "View warehouse listings", type: "read", impact: "Low - Read-only access" },
          { id: "inv-wh-write", code: "inventory.warehouses.write", name: "Edit Warehouses", description: "Create and update warehouses", type: "write", impact: "Medium - Can modify warehouse data" },
          { id: "inv-wh-delete", code: "inventory.warehouses.delete", name: "Delete Warehouses", description: "Remove warehouses", type: "delete", impact: "High - Permanent removal" },
          { id: "inv-wh-manage", code: "inventory.warehouses.manage", name: "Manage Warehouses", description: "Full control over warehouses", type: "manage", impact: "Critical - Full administrative access" },
        ],
      },
      {
        id: "stock",
        name: "Stock Levels",
        permissions: [
          { id: "inv-stk-read", code: "inventory.stock.read", name: "View Stock", description: "View stock levels", type: "read", impact: "Low - Read-only access" },
          { id: "inv-stk-write", code: "inventory.stock.write", name: "Update Stock", description: "Adjust stock levels", type: "write", impact: "Medium - Can modify stock quantities" },
        ],
      },
    ],
  },
  {
    id: "orders",
    name: "Orders",
    description: "Order management and processing",
    resources: [
      {
        id: "quotes",
        name: "Quotes",
        permissions: [
          { id: "ord-qt-read", code: "orders.quotes.read", name: "View Quotes", description: "View quote requests", type: "read", impact: "Low - Read-only access" },
          { id: "ord-qt-write", code: "orders.quotes.write", name: "Create Quotes", description: "Create and respond to quotes", type: "write", impact: "Medium - Can create pricing quotes" },
          { id: "ord-qt-manage", code: "orders.quotes.manage", name: "Manage Quotes", description: "Full control over quotes", type: "manage", impact: "Critical - Full quote management" },
        ],
      },
      {
        id: "fulfillment",
        name: "Fulfillment",
        permissions: [
          { id: "ord-ff-read", code: "orders.fulfillment.read", name: "View Orders", description: "View order details", type: "read", impact: "Low - Read-only access" },
          { id: "ord-ff-write", code: "orders.fulfillment.write", name: "Process Orders", description: "Update order status", type: "write", impact: "Medium - Can update order status" },
          { id: "ord-ff-manage", code: "orders.fulfillment.manage", name: "Manage Fulfillment", description: "Full control over fulfillment", type: "manage", impact: "Critical - Full order management" },
        ],
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    description: "Financial and billing operations",
    resources: [
      {
        id: "invoices",
        name: "Invoices",
        permissions: [
          { id: "bil-inv-read", code: "billing.invoices.read", name: "View Invoices", description: "View invoice details", type: "read", impact: "Low - Read-only access" },
          { id: "bil-inv-write", code: "billing.invoices.write", name: "Create Invoices", description: "Generate invoices", type: "write", impact: "Medium - Can create invoices" },
          { id: "bil-inv-manage", code: "billing.invoices.manage", name: "Manage Invoices", description: "Full control over invoices", type: "manage", impact: "Critical - Full invoice management" },
        ],
      },
      {
        id: "payments",
        name: "Payments",
        permissions: [
          { id: "bil-pay-read", code: "billing.payments.read", name: "View Payments", description: "View payment history", type: "read", impact: "Low - Read-only access" },
          { id: "bil-pay-write", code: "billing.payments.write", name: "Process Payments", description: "Handle payment processing", type: "write", impact: "High - Financial transactions" },
          { id: "bil-pay-manage", code: "billing.payments.manage", name: "Manage Payments", description: "Full control over payments", type: "manage", impact: "Critical - Full payment control" },
        ],
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Reports and analytics",
    resources: [
      {
        id: "reports",
        name: "Reports",
        permissions: [
          { id: "ana-rep-read", code: "analytics.reports.read", name: "View Reports", description: "Access analytics reports", type: "read", impact: "Low - Read-only access" },
          { id: "ana-rep-write", code: "analytics.reports.write", name: "Create Reports", description: "Generate custom reports", type: "write", impact: "Low - Report generation" },
          { id: "ana-rep-manage", code: "analytics.reports.manage", name: "Manage Reports", description: "Full control over reports", type: "manage", impact: "Medium - Report management" },
        ],
      },
      {
        id: "dashboards",
        name: "Dashboards",
        permissions: [
          { id: "ana-dash-read", code: "analytics.dashboards.read", name: "View Dashboards", description: "Access dashboards", type: "read", impact: "Low - Read-only access" },
          { id: "ana-dash-write", code: "analytics.dashboards.write", name: "Edit Dashboards", description: "Customize dashboards", type: "write", impact: "Low - Dashboard customization" },
        ],
      },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    description: "Organization settings",
    resources: [
      {
        id: "organization",
        name: "Organization",
        permissions: [
          { id: "set-org-read", code: "settings.organization.read", name: "View Settings", description: "View organization settings", type: "read", impact: "Low - Read-only access" },
          { id: "set-org-write", code: "settings.organization.write", name: "Edit Settings", description: "Modify organization settings", type: "write", impact: "High - Organization configuration" },
          { id: "set-org-manage", code: "settings.organization.manage", name: "Manage Organization", description: "Full control over organization", type: "manage", impact: "Critical - Full org control" },
        ],
      },
      {
        id: "members",
        name: "Members",
        permissions: [
          { id: "set-mem-read", code: "settings.members.read", name: "View Members", description: "View team members", type: "read", impact: "Low - Read-only access" },
          { id: "set-mem-write", code: "settings.members.write", name: "Invite Members", description: "Add new team members", type: "write", impact: "Medium - Can add members" },
          { id: "set-mem-delete", code: "settings.members.delete", name: "Remove Members", description: "Remove team members", type: "delete", impact: "High - Can remove members" },
          { id: "set-mem-manage", code: "settings.members.manage", name: "Manage Members", description: "Full control over members", type: "manage", impact: "Critical - Full member control" },
        ],
      },
    ],
  },
];

export const SAMPLE_MEMBERS: Member[] = [
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "Admin", permissions: ["inventory.materials.manage", "inventory.warehouses.manage", "orders.quotes.manage", "orders.fulfillment.manage", "billing.invoices.manage", "billing.payments.manage", "analytics.reports.manage", "analytics.dashboards.write", "settings.organization.manage", "settings.members.manage"] },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@company.com", role: "Manager", permissions: ["inventory.materials.write", "inventory.warehouses.read", "inventory.stock.write", "orders.quotes.write", "orders.fulfillment.write", "billing.invoices.read", "analytics.reports.read"] },
  { id: "3", name: "Mike Chen", email: "mike.chen@company.com", role: "Operator", permissions: ["inventory.materials.read", "inventory.stock.read", "orders.quotes.read", "orders.fulfillment.read"] },
  { id: "4", name: "Emily Davis", email: "emily.d@company.com", role: "Viewer", permissions: ["inventory.materials.read", "analytics.reports.read", "analytics.dashboards.read"] },
  { id: "5", name: "Alex Wilson", email: "alex.w@company.com", role: "Manager", permissions: ["inventory.materials.write", "inventory.warehouses.write", "orders.quotes.manage", "billing.invoices.write"] },
];

export const PERMISSION_TEMPLATES = {
  viewer: {
    name: "Viewer",
    description: "Read-only access to most resources",
    permissions: SAMPLE_SERVICES.flatMap(s => s.resources.flatMap(r => r.permissions.filter(p => p.type === "read").map(p => p.code))),
  },
  editor: {
    name: "Editor",
    description: "Read and write access to operational resources",
    permissions: SAMPLE_SERVICES.filter(s => ["inventory", "orders"].includes(s.id)).flatMap(s => s.resources.flatMap(r => r.permissions.filter(p => ["read", "write"].includes(p.type)).map(p => p.code))),
  },
  admin: {
    name: "Admin",
    description: "Full access to all resources",
    permissions: SAMPLE_SERVICES.flatMap(s => s.resources.flatMap(r => r.permissions.map(p => p.code))),
  },
};

export const PERMISSION_TYPE_COLORS: Record<string, string> = {
  read: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  write: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  manage: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
