"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import React from "react";

type EducationItem = {
  id: string;
  degree: string;
  college: string;
  startYear: string;
  endYear: string;
};

interface EducationListProps {
  items: EducationItem[];
  onReorder: (newOrder: EducationItem[]) => void;
  onRemove: (index: number) => void;
}

function SortableEduItem({
  edu,
  index,
  id,
  onRemove,
}: {
  edu: EducationItem;
  index: number;
  id: string;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="skill-tag w-fit flex items-center justify-content-center"
    >
      <span>
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="#F66135" />
          <circle cx="1.5" cy="7" r="1.5" fill="#F66135" />
          <circle cx="1.5" cy="12.5" r="1.5" fill="#F66135" />
          <circle cx="6.5" cy="1.5" r="1.5" fill="#F66135" />
          <circle cx="6.5" cy="7" r="1.5" fill="#F66135" />
          <circle cx="6.5" cy="12.5" r="1.5" fill="#F66135" />
        </svg>
      </span>
      <span className="mr-2">
        {edu.degree} - {edu.college} ({edu.startYear}–{edu.endYear})
      </span>
      <button type="button" onClick={() => onRemove(index)}>
        <X color="#5c5c5c" />
      </button>
    </div>
  );
}

const EducationList: React.FC<EducationListProps> = ({
  items,
  onReorder,
  onRemove,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onReorder(newOrder);
      }}
    >
      <SortableContext
        items={items.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {items.map((edu, index) => (
            <SortableEduItem
              key={edu.id}
              id={edu.id}
              edu={edu}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default EducationList;
