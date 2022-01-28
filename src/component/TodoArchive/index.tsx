import resolveClasses from "@/utils/resolveClasses";
import {
  ArrowDown as TodoArchiveIcon,
  ArrowCircleLeft,
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
    setDepth(depth + 1);
    props.setAppListVisibility(false);
  }

  function leaveArchive() {
    setDepth(depth - 1);
    props.setAppListVisibility(true);
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
        className="AppList-app center"
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
    </>
  );
};

export default TodoArchive;
