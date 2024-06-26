import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";

interface Lesson {
  lesson_id: string;
  title: string;
  isPublished: boolean;
  isFree: boolean;
}

interface LessonsListProps {
  items: Lesson[];
  moduleId: string;
  userId: string;
  token: string;
  onReorder: (updateData: { lesson_id: string; position: number }[]) => void;
  onEdit: (lesson_id: string) => void;
}

export const LessonsList = ({
  moduleId,
  userId,
  token,
  onReorder,
  onEdit,
}: LessonsListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonData = await EnrollmentService.getLessonByModuleId({
          userId,
          moduleId,
          token,
        });
        if (lessonData && lessonData.data) {
          setLessons(lessonData.data);
          setIsMounted(true);
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    };

    fetchData();
  }, [moduleId, userId, token]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedLessons = items.slice(startIndex, endIndex + 1);

    setLessons(items);

    const bulkUpdateData = updatedLessons.map((lesson) => ({
      lesson_id: lesson.lesson_id,
      position: items.findIndex((item) => item.lesson_id === lesson.lesson_id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lessons.map((lesson, index) => {
              console.log("Draggable ID:", lesson.lesson_id); // Log the draggableId value
              return (
                <Draggable
                  key={String(lesson.lesson_id)}
                  draggableId={String(lesson.lesson_id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        lesson.isPublished &&
                          "bg-sky-100 border-sky-200 text-sky-700",
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                          lesson.isPublished &&
                            "border-r-sky-200 hover:bg-sky-200",
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      {lesson.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {lesson.isFree && <Badge>Free</Badge>}
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            lesson.isPublished && "bg-sky-700",
                          )}
                        >
                          {lesson.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(lesson.lesson_id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
