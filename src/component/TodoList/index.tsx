import View from "./TodoView";
import "./index.css";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { defaultLongTodoList, defaultShortTodoList } from "@/store/todo";
import { useState } from "react";
import {
  channelLeftView,
  channelRightView,
  DoneItem,
  TodoListNode,
} from "@/logic/todo";

const TodoList = () => {
  const [longTodoList, setLongTodoList] = useLocalStorageState(
    "long-todolist",
    defaultLongTodoList
  );
  const [longDoneList, setLongDoneList] = useLocalStorageState<DoneItem[]>(
    "long-donelist",
    []
  );
  const [longData, setLongData] = useState<TodoListNode>({
    title: "月度计划",
    todoList: longTodoList,
    doneList: longDoneList,
  });
  function setLongDataWrap(data: TodoListNode) {
    if (data.title == "月度计划") {
      setLongTodoList(data.todoList);
      setLongDoneList(data.doneList);
    }
    setLongData(data);
  }

  const [shortTodoList, setShortTodoList] = useLocalStorageState(
    "short-todolist",
    defaultShortTodoList
  );
  const [shortDoneList, setShortDoneList] = useLocalStorageState<DoneItem[]>(
    "short-donelist",
    []
  );

  const [shortData, setShortData] = useState<TodoListNode>({
    title: "近期待办",
    todoList: shortTodoList,
    doneList: shortDoneList,
  });
  function setShortDataWrap(data: TodoListNode) {
    if (data.title == "近期待办") {
      setShortTodoList(data.todoList);
      setShortDoneList(data.doneList);
    }
    setShortData(data);
  }

  return (
    <div className="todo-container rowcenter">
      <View
        data={longData}
        setData={setLongDataWrap}
        viewReceiver={channelLeftView.receiver}
      />
      <View
        data={shortData}
        setData={setShortDataWrap}
        viewReceiver={channelRightView.receiver}
      />
    </div>
  );
};

export default TodoList;
