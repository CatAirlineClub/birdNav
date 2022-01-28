import resolveClasses from "@/utils/resolveClasses";
import {
  FolderOpen as TodoArchiveIcon,
  ArrowCircleLeft,
  Schedule,
} from "@icon-park/react";
import { MouseEventHandler, useState } from "react";
import {
  receiver as todoArchiveReceiver,
  TodoListNode,
  TodoListTree,
} from "../../logic/todo";

interface Props {
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  onMouseMove: MouseEventHandler<HTMLDivElement>;
  setAppListVisibility: (arg0: boolean) => void;
}

const TodoArchive = (props: Props) => {
  const [depth, setDepth] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<TodoListTree[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<TodoListTree[]>([]);

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

  return (
    <>
      <div
        className={resolveClasses("center", depth == 0 ? "remove" : "")}
        onClick={leaveArchive}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseMove={props.onMouseMove}
      >
        <ArrowCircleLeft
          theme="outline"
          size="30"
          fill="slateblue"
          strokeWidth={3}
        />
      </div>
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
              onClick={enterArchive}
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
    </>
  );
};

export default TodoArchive;
