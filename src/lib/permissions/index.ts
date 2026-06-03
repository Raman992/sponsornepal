import type { UserRole } from "@/store/auth-store";

export interface Permission {
  resource: string;
  action: string;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  creator: [
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" },
    { resource: "campaigns", action: "read" },
    { resource: "applications", action: "create" },
    { resource: "applications", action: "read" },
    { resource: "messages", action: "read" },
    { resource: "messages", action: "send" },
    { resource: "deals", action: "read" },
    { resource: "deals", action: "accept" },
    { resource: "deals", action: "reject" },
  ],
  brand: [
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" },
    { resource: "campaigns", action: "create" },
    { resource: "campaigns", action: "read" },
    { resource: "campaigns", action: "update" },
    { resource: "campaigns", action: "delete" },
    { resource: "applications", action: "read" },
    { resource: "applications", action: "accept" },
    { resource: "applications", action: "reject" },
    { resource: "messages", action: "read" },
    { resource: "messages", action: "send" },
    { resource: "deals", action: "create" },
    { resource: "deals", action: "read" },
    { resource: "deals", action: "update" },
    { resource: "creators", action: "read" },
    { resource: "creators", action: "save" },
  ],
  admin: [
    { resource: "users", action: "read" },
    { resource: "users", action: "update" },
    { resource: "users", action: "verify" },
    { resource: "users", action: "suspend" },
    { resource: "campaigns", action: "read" },
    { resource: "campaigns", action: "update" },
    { resource: "campaigns", action: "delete" },
    { resource: "deals", action: "read" },
    { resource: "deals", action: "update" },
    { resource: "transactions", action: "read" },
    { resource: "notifications", action: "create" },
    { resource: "settings", action: "read" },
    { resource: "settings", action: "update" },
  ],
};

export function hasPermission(role: UserRole, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.some((p) => p.resource === resource && p.action === action);
}

export function canAccessDashboard(role: UserRole): boolean {
  return ["creator", "brand", "admin"].includes(role);
}

export function canManageCampaigns(role: UserRole): boolean {
  return hasPermission(role, "campaigns", "create");
}

export function canManageDeals(role: UserRole): boolean {
  return hasPermission(role, "deals", "create") || hasPermission(role, "deals", "accept");
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === "admin";
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "creator":
      return "/dashboard/creator";
    case "brand":
      return "/dashboard/brand";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}
