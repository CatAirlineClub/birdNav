import { useState } from "react";
import ReactDOM from "react-dom";
import "./public.css";
import { getMaxZindex } from "@/store/global";
import resolveClasses from "@/utils/resolveClasses";
import { TodoListNode } from "@/logic/todo";
import { channelArchive as todoChannelArchive } from "../../../logic/todo";

export const addUrl = () => {
  let el = document.createElement("div");
  document.body.appendChild(el);

  const onOk = (newTodo: TodoListNode) => {
    const { sender: todoArchiveSender } = todoChannelArchive;
    todoArchiveSender.ping().then((cb) => {
      cb(newTodo);
      document.body.removeChild(el);
    });
  };

  const onCancel = () => {
    document.body.removeChild(el);
  };

  ReactDOM.render(<AddModal onOK={onOk} onCancel={onCancel} />, el);
};

const AddModal = (props: any) => {
  const { onOK, onCancel } = props;

  const [newUrlData, setNewUrlData] = useState<TodoListNode>({
    title: "",
    todoList: [],
    doneList: [],
  });

  const onSubmit = () => {
    if (newUrlData.title && newUrlData.todoList.length) {
      onOK(newUrlData);
    } else {
      alert("请输入名称和链接");
    }
  };

  return (
    <div
      className={resolveClasses("AppModal")}
      style={{ zIndex: getMaxZindex() }}
    >
      <span className="AppModal_title rowcenter">添加链接</span>
      <div className="AppModal_row">
        <span>链接名称：</span>
        <input
          onChange={(e) => {
            setNewUrlData({
              ...newUrlData,
              title: e.target.value,
            });
          }}
          value={newUrlData.title}
          placeholder="请输入名称"
          type="text"
          required
        ></input>
      </div>
      <div className="AppModal_row">
        <span>APP URL：</span>
        <input
          onChange={(e) => {
            setNewUrlData({
              ...newUrlData,
              todoList: [
                {
                  id: Math.random().toString(),
                  title: e.target.value,
                  createTime: +new Date(),
                },
              ],
            });
          }}
          value={newUrlData.todoList.length ? newUrlData.todoList[0].title : ""}
          placeholder="请输入链接"
          type="text"
          required
        ></input>
      </div>
      <div className="AppModal_btns">
        <button onClick={onCancel}>取消</button>
        <button className="confirm" onClick={() => onSubmit()}>
          确认
        </button>
      </div>
    </div>
  );
};
