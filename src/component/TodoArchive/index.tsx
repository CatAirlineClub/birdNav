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
import { arch } from "os";
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

  const [archivedTodos, setArchivedTodos] = useState<TodoListTree[]>([[]]);
  const [path, setPath] = useState<number[]>([]);
  useEffect(() => {
    todoArchiveReceiver.pong((item) => {
      if (viewing) {
        currentFolder.push(item);
      } else {
        archivedTodos[0].push(item);
      }
      setArchivedTodos([...archivedTodos]);
    });
  });
  function getFolder(fromPath = path, fromTree = archivedTodos) {
    let ptr: TodoListTree = fromTree;
    for (const idx of fromPath) {
      ptr = ptr[idx] as TodoListTree;
    }
    console.log(
      "重新计算得到",
      ptr,
      "fromPath",
      fromPath,
      "archivedTodos",
      archivedTodos
    );
    return ptr;
  }

  const viewing = path.length > 0;
  const currentFolder = viewing ? getFolder() : [[]];

  function enterArchive(idx: number) {
    props.setAppListVisibility(false);
    setPath([...path, idx]);
  }

  function leaveArchive() {
    if (path.length <= 1) props.setAppListVisibility(true);
    setPath(path.slice(0, path.length - 1));
  }

  function deleteTodo(idx: number) {
    setOpeningMode(false);
    currentFolder.splice(idx, 1);
    setArchivedTodos([...archivedTodos]);
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
    currentFolder.push(folder);
    setArchivedTodos([...archivedTodos]);
  }

  function deleteFolder() {
    getFolder(path.slice(0, path.length - 1)).splice(path[path.length - 1], 1);

    setArchivedTodos([...archivedTodos]);
    leaveArchive();
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
              onClick={enterArchive.bind(null, index)}
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
              <i>{viewing ? item.length : archivedTodos[0].length}</i>
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
                onClick={deleteTodo.bind(null, index)}
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
      <Delete
        className={resolveClasses(path.length > 1 ? "" : "remove")}
        onClick={deleteFolder}
        theme="outline"
        size="30"
        fill="slateblue"
        strokeWidth={3}
        title="删除文件夹"
      />
      {/*
      {["path", "currentFolder", "archivedTodos"].map((x) => {
        function format(array: Array<unknown>): Array<unknown> {
          return array.map((x) => (x instanceof Array ? format(x) : x));
        }
        const array = eval(x);
        return x + JSON.stringify(format(array));
      })}
    */}
    </>
  );
};

export default TodoArchive;
