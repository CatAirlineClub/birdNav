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
import { MouseEventHandler, useEffect, useState } from "react";
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
  const [openingMode, setOpeningMode] = useState(false);
  const [openingTodoList, setOpeningTodoList] = useState<
    TodoListNode | undefined
  >();

  const [archivedTodos, setArchivedTodos] = useState<TodoListTree>([]);
  useEffect(() => {
    todoArchiveReceiver.pong((item) => {
      if (path.length) {
        path[path.length - 1].push(item);
      } else {
        archivedTodos.push(item);
      }

      setPath(path.filter(() => true));
      setArchivedTodos(archivedTodos.filter(() => true));
    });
  });
  const [path, setPath] = useState<TodoListTree[]>([]);

  const viewing = path.length > 0;
  const currentFolder = viewing ? path[path.length - 1] : [[]];

  function enterArchive(node: TodoListTree) {
    props.setAppListVisibility(false);
    const list = path.filter(() => true);
    list.push(node);
    setPath(list);
  }

  function leaveArchive() {
    if (path.length <= 1) props.setAppListVisibility(true);
    setPath(path.filter((_, index) => index < path.length - 1));
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
    const folder: TodoListTree = [];
    path[path.length - 1].push(folder);
    setPath(path.filter(() => true));
    setArchivedTodos(archivedTodos.filter(() => true));
  }

  return (
    <>
      <ArrowCircleLeft
        className={resolveClasses(viewing ? "" : "remove")}
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
              onClick={enterArchive.bind(null, viewing ? item : archivedTodos)}
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
              <i>{viewing ? item.length : archivedTodos.length}</i>
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
                title="删除待办"
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
                title="在左侧打开"
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
                title="在右侧打开"
              />
            );
          }
        }
        return ret;
      })}
      <AddOne
        className={resolveClasses(viewing ? "" : "remove")}
        title="新建文件夹"
        onClick={newFolder}
        theme="outline"
        size="30"
        fill="slateblue"
        strokeWidth={3}
      />
      {/*
      {['path', 'currentFolder', 'archivedTodos'].map(x => x + JSON.stringify(eval(x)))}
      */}
    </>
  );
};

export default TodoArchive;
