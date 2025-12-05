export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "read" | "write" | "manage" | "delete";
  impact?: string;
}

export interface DbPermission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  meta: string;
  sub_meta: string;
}

export interface Resource {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
}

export interface Member {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar?: string;
  role_id: string;
  permissions: string[];
}

export interface AuditLogEntry {
  id: string;
  action: "added" | "removed";
  permission: string;
  timestamp: Date;
  performedBy: string;
}

export type SelectionState = "none" | "partial" | "all";
