"use client";

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useId, type ReactNode } from "react";

function Row({ id, children, grid }: { id: number; children: ReactNode; grid: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "z-10 opacity-80" : ""} ${grid ? "" : "flex items-center gap-2"}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Sürükleyerek sırala"
        className={`grid cursor-grab touch-none place-items-center rounded text-subtle hover:text-fg active:cursor-grabbing ${
          grid ? "absolute top-1.5 left-1.5 z-10 size-7 bg-black/60 text-white" : "size-7 shrink-0"
        }`}
      >
        <GripVertical className="size-4" />
      </button>
      {children}
    </li>
  );
}

/** Drag-to-reorder list (or grid); calls onReorder with the new id order. */
export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  render,
  grid = false,
  className,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  render: (item: T) => ReactNode;
  grid?: boolean;
  className?: string;
}) {
  // Stable id: dnd-kit otherwise generates aria ids that differ between server and client.
  const id = useId();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={grid ? rectSortingStrategy : verticalListSortingStrategy}>
        <ul className={className}>
          {items.map((item) => (
            <Row key={item.id} id={item.id} grid={grid}>
              {render(item)}
            </Row>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
