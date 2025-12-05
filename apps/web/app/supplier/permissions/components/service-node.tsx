"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Service, Permission, SelectionState } from "../types";
import { PERMISSION_TYPE_COLORS } from "../data";
import { SelectionCheckbox } from "./selection-checkbox";

interface ServiceNodeProps {
  service: Service;
  isExpanded: boolean;
  expandedResources: Set<string>;
  selectedPermissions: Set<string>;
  onToggleService: () => void;
  onToggleResource: (resourceId: string) => void;
  onTogglePermission: (code: string) => void;
  onToggleGroup: (codes: string[]) => void;
  getSelectionState: (codes: string[]) => SelectionState;
  onSelectPermissionDetail: (permission: Permission | null) => void;
}

export function ServiceNode({
  service,
  isExpanded,
  expandedResources,
  selectedPermissions,
  onToggleService,
  onToggleResource,
  onTogglePermission,
  onToggleGroup,
  getSelectionState,
  onSelectPermissionDetail,
}: ServiceNodeProps) {
  const allServiceCodes = service.resources.flatMap(r => r.permissions.map(p => p.code));
  const serviceState = getSelectionState(allServiceCodes);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Service header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={onToggleService}
      >
        <button className="p-0.5">
          {isExpanded ? (
            <ChevronDown size={16} className="text-slate-400" />
          ) : (
            <ChevronRight size={16} className="text-slate-400" />
          )}
        </button>
        <SelectionCheckbox
          state={serviceState}
          onClick={(e) => {
            e.stopPropagation();
            onToggleGroup(allServiceCodes);
          }}
        />
        <div className="flex-1">
          <span className="font-medium text-slate-800 dark:text-white">{service.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{service.description}</span>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {allServiceCodes.filter(c => selectedPermissions.has(c)).length}/{allServiceCodes.length}
        </span>
      </div>

      {/* Resources */}
      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          {service.resources.map(resource => {
            const resourceKey = `${service.id}-${resource.id}`;
            const isResourceExpanded = expandedResources.has(resourceKey);
            const resourceCodes = resource.permissions.map(p => p.code);
            const resourceState = getSelectionState(resourceCodes);

            return (
              <div key={resource.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
                {/* Resource header */}
                <div
                  className="flex items-center gap-3 px-4 py-2.5 pl-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  onClick={() => onToggleResource(resource.id)}
                >
                  <button className="p-0.5">
                    {isResourceExpanded ? (
                      <ChevronDown size={14} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-400" />
                    )}
                  </button>
                  <SelectionCheckbox
                    state={resourceState}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleGroup(resourceCodes);
                    }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{resource.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                    {resourceCodes.filter(c => selectedPermissions.has(c)).length}/{resourceCodes.length}
                  </span>
                </div>

                {/* Permissions */}
                {isResourceExpanded && (
                  <div className="bg-white dark:bg-slate-900/30">
                    {resource.permissions.map(permission => (
                      <div
                        key={permission.id}
                        className="flex items-center gap-3 px-4 py-2 pl-16 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer group"
                        onClick={() => onSelectPermissionDetail(permission)}
                      >
                        <SelectionCheckbox
                          state={selectedPermissions.has(permission.code) ? "all" : "none"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePermission(permission.code);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-slate-700 dark:text-slate-300">{permission.name}</span>
                          <code className="text-xs text-slate-400 dark:text-slate-500 ml-2 hidden group-hover:inline">
                            {permission.code}
                          </code>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded font-medium",
                          PERMISSION_TYPE_COLORS[permission.type]
                        )}>
                          {permission.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
