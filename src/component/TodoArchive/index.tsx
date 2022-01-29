import resolveClasses from "@/utils/resolveClasses";
import {
  FolderOpen as TodoArchiveIcon,
  ArrowCircleLeft,
  Schedule,
  ArrowLeftUp,
  ArrowRightUp,
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
const { sender: todoRightViewSender } = todoLeftView;

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
  const [archivedTodos, setArchivedTodos] = useState<TodoListTree>([]);

  todoArchiveReceiver.pong((item) => {
    console.log(item);
    console.log("archivedTodos", archivedTodos);
    const list = archivedTodos.filter(() => true);
    list.push(item);
    setArchivedTodos(list);
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
      {currentFolder.map((item) => {
        if (item instanceof Array) {
          return (
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
          return (
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
        }
      })}
      <ArrowLeftUp
        className={resolveClasses(openingMode ? "" : "remove")}
        onClick={toLeftView}
        theme="outline"
        size="30"
        fill="slateblue"
        strokeWidth={3}
      />
      <ArrowRightUp
        className={resolveClasses(openingMode ? "" : "remove")}
        onClick={toRightView}
        theme="outline"
        size="30"
        fill="slateblue"
        strokeWidth={3}
      />
    </>
  );
};

export default TodoArchive;
