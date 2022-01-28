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
} from "../../logic/todo";

interface Props {
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  onMouseMove: MouseEventHandler<HTMLDivElement>;
  setAppListVisibility: (arg0: boolean) => void;
}

const TodoArchive = (props: Props) => {
  const [depth, setDepth] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<TodoListNode[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<TodoListNode[]>([]);

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
    setDepth(depth - 1);
    setCurrentFolder([]);
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
      {currentFolder.map((item) => (
        <div
          key={item.title}
          className="AppList-app center"
          onClick={enterArchive}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          onMouseMove={props.onMouseMove}
          title={item.title}
        >
          <Schedule
            theme="outline"
            size="30"
            fill="slateblue"
            strokeWidth={3}
          />
        </div>
      ))}
    </>
  );
};

export default TodoArchive;
