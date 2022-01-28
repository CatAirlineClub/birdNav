export interface TodoItem {
  id: string;
  title: string;
  createTime: number;
}
  
export interface DoneItem {
  id: string;
  title: string;
  createTime: number;
  doneTime: number;
}
  
export interface TodoClone {
  todoList : TodoItem[],
  doneList : DoneItem[],
}
