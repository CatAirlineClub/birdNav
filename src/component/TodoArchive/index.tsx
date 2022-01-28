import { ArrowDown as TodoArchiveIcon } from "@icon-park/react";
import { MouseEventHandler, useState } from "react";
import { receiver as todoArchiveReceiver } from "./logic";

interface Props {
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
  onMouseMove: MouseEventHandler<HTMLDivElement>,
}

const TodoArchive = (props : Props) => {
    const [archivedTodos, setArchivedTodos] = useState(new Map);

    todoArchiveReceiver.pong((title, item) => {
      console.log(item);
      archivedTodos.set(title, item);
      console.log('archivedTodos', archivedTodos);
      setArchivedTodos(new Map(archivedTodos));
      console.log('archivedTodos', archivedTodos);
    });

    return (
        <div
          className="AppList-app center"
          onClick={() => {}}
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
          <i>{archivedTodos.size}</i>
        </div>
    );
}

export default TodoArchive;
