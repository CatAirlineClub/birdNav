import resolveClasses from "@/utils/resolveClasses";
import {
  FolderOpen as TodoArchiveIcon,
  ArrowCircleLeft,
  Schedule,
  ArrowLeftUp,
  ArrowRightUp,
  AddOne,
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
  const [depth, setDepth] = useState(0);
  const [openingMode, setOpeningMode] = useState(false);
  const [openingTodoList, setOpeningTodoList] = useState<
    TodoListNode | undefined
  >();

  const [currentFolder, setCurrentFolder] = useState<TodoListTree>([]);
  const [archivedTodos, setArchivedTodos] = (function () {
    const [val, set] = useState<TodoListTree>([]);
    function wrap(val: TodoListTree) {
      if (depth == 1) {
        setCurrentFolder(archivedTodos);
      }
      set(val);
    }
    return [val, set];
  })();

  todoArchiveReceiver.pong((item) => {
    console.log(item);
    console.log("archivedTodos", archivedTodos);
    const list = archivedTodos.filter(() => true);
    list.push(item);
    setArchivedTodos(list);
    if (depth == 1) {
      setCurrentFolder(list);
    }
    console.log("archivedTodos", archivedTodos);
  });

  function enterArchive() {
    if (depth == 0) {
      setCurrentFolder(archivedTodos);
    } else {
      setCurrentFolder([]);
    }
    setDepth(depth + 1);
    props.setAppListVisibility(false);
  }

  function leaveArchive() {
    if (depth == 1) props.setAppListVisibility(true);
    if (depth == 2) {
      setCurrentFolder(archivedTodos);
    } else {
      setCurrentFolder([]);
    }
    setDepth(depth - 1);
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
      <div
        className={resolveClasses(
          "AppList-app",
          "center",
          depth == 0 ? "" : "remove"
        )}
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
        <i>{archivedTodos.length}</i>
      </div>
      {currentFolder.flatMap((item) => {
        const ret = [];
        if (item instanceof Array) {
          ret.push(
            <div
              className={resolveClasses(
                "AppList-app",
                "center",
                depth == 0 ? "" : "remove"
              )}
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
              key={todoList.title}
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
              <ArrowLeftUp
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
    </>
  );
};

export default TodoArchive;
