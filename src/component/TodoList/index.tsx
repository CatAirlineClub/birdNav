import LongTimeTodo from "./LongTimeTodo";
import ShortTimeTodo from "./ShortTimeTodo";
import View from "./TodoView";
import "./index.css";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { defaultLongTodoList } from "@/store/todo";
import { useState } from "react";
import { DoneItem, TodoListNode } from "@/logic/todo";

const TodoList = () => {
  const [todoList, setTodoList] = useLocalStorageState(
    "long-todolist",
    defaultLongTodoList
  );
  const [doneList, setDoneList] = useLocalStorageState<DoneItem[]>(
    "long-donelist",
    []
  );
  const [title, setTitle] = useState("月度计划");
  const [data, setData] = useState<TodoListNode>({
    title: "月度计划",
    todoList,
    doneList,
  });
  function setDataWrap(data: TodoListNode) {
    if (data.title == "月度计划") {
      setTodoList(data.todoList);
      setDoneList(data.doneList);
    }
    setData(data);
  }
  return (
    <div className="todo-container rowcenter">
      <View data={data} setData={setDataWrap}></View>
      <ShortTimeTodo></ShortTimeTodo>
    </div>
  );
};

export default TodoList;
