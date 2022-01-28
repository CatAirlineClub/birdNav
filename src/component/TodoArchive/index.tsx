import { ArrowDown as TodoArchiveIcon } from "@icon-park/react";
import { MouseEventHandler, SyntheticEvent } from "react";

interface Props {
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
  onMouseMove: MouseEventHandler<HTMLDivElement>,
  archivedTodos: Map<unknown, unknown>,
}

const TodoArchive = (props : Props) => {
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
          <i>{props.archivedTodos.size}</i>
        </div>
    );
}

export default TodoArchive;
