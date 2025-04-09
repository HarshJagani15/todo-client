import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ITodos } from "../store/slices/panel/panel.slice";
import { defaultImage, profileDefultImage } from "../utils/get-Image";

interface TodoProps {
  todo: ITodos;
  sourcePanelId: string;
  setIsOpen: (value: boolean) => void;
  setDialogBoxTodo: (value: ITodos) => void;
}

export const Todo: React.FC<TodoProps> = ({
  todo,
  sourcePanelId,
  setIsOpen,
  setDialogBoxTodo,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TODO",
    item: { todoId: todo._id, sourcePanelId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className="bg-white shadow-md rounded-md flex flex-col gap-8 p-4"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      onClick={() => {
        setIsOpen(true);
        setDialogBoxTodo(todo);
      }}
    >
      <h1 className="text-lg">{todo.heading}</h1>
      <div className="flex justify-between items-end">
        <img
          src={defaultImage(profileDefultImage)}
          alt="img"
          className="h-6 w-6"
        />
        <div className="flex items-center gap-2">
          <h3 className="text-sm">{todo.description}</h3>
          <img
            src={defaultImage(profileDefultImage)}
            alt="img"
            className="h-7 w-7"
          />
        </div>
      </div>
    </div>
  );
};
