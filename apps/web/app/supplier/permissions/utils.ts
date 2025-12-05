import { Service, Permission } from "./types";

export const getAllPermissionCodes = (services: Service[]): string[] => {
  return services.flatMap(s => s.resources.flatMap(r => r.permissions.map(p => p.code)));
};

export const findPermissionByCode = (code: string, services: Service[]): Permission | undefined => {
  for (const service of services) {
    for (const resource of service.resources) {
      const perm = resource.permissions.find(p => p.code === code);
      if (perm) return perm;
    }
  }
  return undefined;
};
