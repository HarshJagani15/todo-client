export interface IParams {
  search: string | null;
}

export interface IPanel {
  _id?: string;
  name: string;
  todos?: ITodos[];
}

export interface IAddPanel extends IPanel {}

export interface IEditPanel extends IPanel {
  _id: string;
}

export interface IDeletePanel {
  _id: string;
}

export interface ITodos {
  _id: string;
  heading?: string;
  description?: string;
  comments?: Comment[];
  histories?: History[];
}

export interface IAddTodo extends ITodos {
  heading: string;
}

export interface IChangeTodoHeading extends ITodos {
  heading: string;
}

export interface IChangeTodoDescription extends ITodos {
  description: string;
}

export interface IAddComment extends ITodos {
  comment: string;
}

export interface IUpdateTodoStatus {
  todoId: string;
  sourcePanelId: string;
  targetPanelId: string;
}

export interface Comment {
  _id: string;
  date?: number;
  comment?: string;
}
export interface IEditComment extends Comment {
  todo_id: string;
  comment: string;
}

export interface IDeleteComment {
  todo_id: string;
  comment_id: string;
}

export interface History {
  timestamp: string;
  field: string;
  previous: {
    heading: string;
    description: string;
  };
  updated: {
    heading: string;
    description: string;
  };
}

export interface IPanel_InitialState {
  panels: IPanel[];
}

export interface ITodoProps {
  todo: ITodos;
  sourcePanelId: string;
  setIsOpen: (value: boolean) => void;
  setDialogBoxTodo: (value: ITodos) => void;
}

export interface IPanelProps {
  searchTodoValue: string;
  setSearchTodoValue: (value: string) => void;
  isTodoAdding: boolean;
  setIsTodoAdding: (value: boolean) => void;
  setIsPanelAdding: (value: boolean) => void;
  index: number;
  panel: IPanel;
  setIsOpen: (value: boolean) => void;
  setDialogBoxTodo: (value: ITodos) => void;
  moveTodo: (
    todoId: string,
    sourcePanelId: string,
    targetPanelId: string
  ) => void;
}
