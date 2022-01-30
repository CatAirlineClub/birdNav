import resolveClasses from "@/utils/resolveClasses";
import {
  FolderOpen as TodoArchiveIcon,
  ArrowCircleLeft,
  Schedule,
  ArrowLeftUp,
  ArrowRightUp,
  AddOne,
  Delete,
} from "@icon-park/react";
import { MouseEventHandler, useState } from "react";
import {
  channelArchive as todoChannelArchive,
  channelLeftView as todoLeftView,
  channelRightView as todoRightView,
  TodoListNode,
  TodoListTree,
} from "../../logic/todo";

const { receiver: todoArchiveReceiver } = todoChannelArchive;
const { sender: todoLeftViewSender } = todoLeftView;
const { sender: todoRightViewSender } = todoRightView;

interface Props {
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  onMouseMove: MouseEventHandler<HTMLDivElement>;
  setAppListVisibility: (arg0: boolean) => void;
}

const TodoArchive = (props: Props) => {
  const [depth, setDepth] = useState<0 | 1>(0);
  const [openingMode, setOpeningMode] = useState(false);
  const [openingTodoList, setOpeningTodoList] = useState<
    TodoListNode | undefined
  >();

  const [archivedTodos, setArchivedTodos] = useState<TodoListTree>([]);
  const currentFolder = depth == 0 ? [archivedTodos] : archivedTodos;

  todoArchiveReceiver.pong((item) => {
    console.log(item);
    console.log("archivedTodos", archivedTodos);
    const list = archivedTodos.filter(() => true);
    list.push(item);
    setArchivedTodos(list);
    console.log("archivedTodos", archivedTodos);
  });

  function enterArchive() {
    props.setAppListVisibility(false);
    if (depth == 1) return;
    setDepth(1);
  }

  function leaveArchive() {
    props.setAppListVisibility(true);
    setDepth(0);
  }

  function deleteTodo(todo: TodoListNode) {
    setArchivedTodos(archivedTodos.filter((x) => x !== todo));
    setOpeningMode(false);
  }

  function toLeftView() {
    todoLeftViewSender.ping().then((cb) => {
      cb(openingTodoList!);
      setOpeningMode(false);
    });
  }

  function toRightView() {
    todoRightViewSender.ping().then((cb) => {
      cb(openingTodoList!);
      setOpeningMode(false);
    });
  }

  function newFolder() {
    const list = archivedTodos.filter(() => true);
    list.push([]);
    setArchivedTodos(list);
  }

  return (
    <>
      <ArrowCircleLeft
        className={resolveClasses(depth == 0 ? "remove" : "")}
        onClick={() => {
          if (openingMode) {
            setOpeningMode(false);
          } else {
            leaveArchive();
          }
        }}
        theme="outline"
        size="30"
        fill="slateblue"
        strokeWidth={3}
      />
      {currentFolder.flatMap((item, index) => {
        const ret = [];
        if (item instanceof Array) {
          ret.push(
            <div
              key={"todo-" + index + "-1"}
              className={resolveClasses("AppList-app", "center")}
              onClick={enterArchive}
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}
              onMouseMove={props.onMouseMove}
            >
              <TodoArchiveIcon
                theme="outline"
                size="30"
                fill="slateblue"
                strokeWidth={3}
              />
              <i>{item.length}</i>
            </div>
          );
        } else {
          const todoList: TodoListNode = item;
          ret.push(
            <div
              key={"todo-" + index + "-2"}
              className="AppList-app center"
              onClick={() => {
                setOpeningTodoList(todoList);
                setOpeningMode(true);
              }}
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}
              onMouseMove={props.onMouseMove}
              title={todoList.title}
            >
              <Schedule
                theme="outline"
                size="30"
                fill="slateblue"
                strokeWidth={3}
              />
            </div>
          );
          if (openingTodoList == todoList) {
            ret.push(
              <Delete
                key={"todo-" + index + "-3"}
                className={resolveClasses(openingMode ? "" : "remove")}
                onClick={deleteTodo.bind(null, openingTodoList)}
                theme="outline"
                size="30"
                fill="slateblue"
                strokeWidth={3}
              />
            );
            ret.push(
              <ArrowLeftUp
                key={"todo-" + index + "-4"}
                className={resolveClasses(openingMode ? "" : "remove")}
                onClick={toLeftView}
                theme="outline"
                size="30"
                fill="slateblue"
                strokeWidth={3}
              />
            );
            ret.push(
              <ArrowRightUp
                key={"todo-" + index + "-5"}
                className={resolveClasses(openingMode ? "" : "remove")}
                onClick={toRightView}
                theme="outline"
                size="30"
                fill="slateblue"
                strokeWidth={3}
              />
            );
          }
        }
        return ret;
      })}
      <AddOne
        className={resolveClasses(depth == 0 ? "remove" : "")}
        title="新建文件夹"
        onClick={newFolder}
        theme="outline"
        size="30"
        fill="slateblue"
        strokeWidth={3}
      />
      {/*(currentFolder {currentFolder.length})
      (archivedTodos {archivedTodos.length})*/}
    </>
  );
};

export default TodoArchive;
