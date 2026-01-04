"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanItem } from "@/types/kanban";

interface KanbanCardProps {
  item: KanbanItem;
  style?: "default" | "compact" | "detailed";
  readOnly?: boolean;
  onClick?: () => void;
}

export function KanbanCard({
  item,
  style: _style = "detailed",
  readOnly = false,
  onClick,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: readOnly,
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...(readOnly ? {} : { ...attributes, ...listeners })}
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-slate-200 p-4 
        ${readOnly ? "cursor-default" : "cursor-grab hover:shadow-lg hover:-translate-y-0.5 active:cursor-grabbing"}
        transition-all duration-300 group
        ${isDragging ? "opacity-50 rotate-3 scale-105 shadow-2xl z-50" : "shadow-sm"}
        ${readOnly ? "select-text" : "active:scale-95"}
      `}
    >
      {/* Header */}
      {/* <div className="flex items-start justify-between mb-3">
        {!readOnly && (
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        )}
      </div> */}

      {/* Title & Description */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold truncate text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 truncate">
            {item.description}
          </p>
        )}
      </div>

      {/* Metadata Grid */}
      {item.metadata && (
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 pb-4 border-b border-slate-50">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
              Material
            </span>
            <span className="text-xs font-medium text-slate-700 truncate block">
              {item.metadata.material || "—"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
              Quantity
            </span>
            <span className="text-xs font-medium text-slate-700 block">
              {item.metadata.quantity || 0} pcs
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
              Lead Time
            </span>
            <span className="text-xs font-medium text-slate-700 block">
              {item.metadata.leadTime || 0} days
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-400 uppercase tracking-wide block">
              Total Price
            </span>
            <span className="text-sm font-bold text-indigo-600 block">
              ${Number(item.metadata.totalPrice || 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
