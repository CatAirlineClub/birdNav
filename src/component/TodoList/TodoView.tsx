import resolveClasses from "@/utils/resolveClasses";
import { CheckOne, CloseOne, Plus, ReduceOne } from "@icon-park/react";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import "./index.css";
import {
  channelArchive as todoChannelArchive,
  Receiver,
} from "../../logic/todo";
import { TodoItem, DoneItem, TodoListNode } from "../../logic/todo";

const { sender: todoArchiveSender } = todoChannelArchive;

interface TodoProps {
  data: TodoListNode;
  setData: (value: TodoListNode) => void;
  viewReceiver: Receiver<TodoListNode>;
}

const LongTimeTodo = ({
  data: todoData,
  setData: setTodoData,
  viewReceiver: todoViewReceiver,
}: TodoProps) => {
  const [visible, setVisibility] = useState(true);
  const [type, setType] = useState("todo");

  todoViewReceiver.pong((item: TodoListNode) => {
    setTodoData(item);
    setVisibility(true);
  });

  const addTodoItem = (content: { title: string; createTime: number }) => {
    if (!content.title) return;
    const newTodoItem = { id: nanoid(), ...content };
    const newTodoList = [newTodoItem, ...todoData.todoList];
    const newTodoData = Object.assign(
      {},
      {
        title: todoData.title,
        todoList: newTodoList,
        doneList: todoData.doneList,
      }
    );
    setTodoData(newTodoData);
  };

  const deleteTodoItem = (item: TodoItem) => {
    const newTodoList = todoData.todoList.filter(
      (todo: TodoItem) => todo.id !== item.id
    );
    const newTodoData = Object.assign(
      {},
      {
        title: todoData.title,
        todoList: newTodoList,
        doneList: todoData.doneList,
      }
    );
    setTodoData(newTodoData);
  };

  const competeTodoItem = (item: TodoItem) => {
    const newTodoList = todoData.todoList.filter(
      (todo: TodoItem) => todo.id !== item.id
    );
    const newDoneList = [
      {
        ...item,
        doneTime: new Date().getTime(),
      },
      ...(todoData.doneList as DoneItem[]),
    ];
    setTodoData({
      title: todoData.title,
      todoList: newTodoList,
      doneList: newDoneList,
    });
  };

  const deleteDoneItem = (item: TodoItem) => {
    const newDoneList = todoData.doneList.filter((done) => done.id !== item.id);
    setTodoData({
      title: todoData.title,
      todoList: todoData.todoList,
      doneList: newDoneList,
    });
  };

  const redoDoneItem = (item: TodoItem) => {
    const newDoneList = todoData.doneList.filter(
      (done: DoneItem) => done.id !== item.id
    );
    const newTodoList = [item, ...todoData.todoList];
    setTodoData({
      title: todoData.title,
      todoList: newTodoList,
      doneList: newDoneList,
    });
  };

  return (
    <section className={resolveClasses("todo", visible ? "" : "hide")}>
      <TodoHeader
        todoData={todoData}
        type={type}
        setType={setType}
        setVisible={setVisibility}
      />
      {type === "todo" && (
        <TodoContent
          list={todoData.todoList}
          onAdd={addTodoItem}
          onDelete={deleteTodoItem}
          onCompete={competeTodoItem}
        />
      )}
      {type === "done" && (
        <DoneContent
          list={todoData.doneList}
          onDelete={deleteDoneItem}
          onRedo={redoDoneItem}
        />
      )}
    </section>
  );
};

interface TodoHeaderProps {
  type: string;
  todoData: TodoListNode;
  setType: (value: string) => void;
  setVisible: (value: boolean) => void;
}

const TodoHeader: React.FC<TodoHeaderProps> = (props) => {
  const { type, setType, setVisible, todoData } = props;

  function save() {
    todoArchiveSender.ping().then((callback) => {
      callback(todoData);
    });
  }

  const date = new Date();

  return (
    <section className="todo-header">
      <span className="todo-header-title">{todoData.title}</span>
      <section className="todo-header-btns">
        <section
          className={resolveClasses("todo-header-btn center")}
          onClick={() => {
            save();
            setVisible(false);
          }}
        >
          Save
        </section>
        <section
          className={resolveClasses(
            "todo-header-btn center",
            type === "todo" ? "active" : ""
          )}
          onClick={() => setType("todo")}
        >
          Todo
        </section>
        <section
          className={resolveClasses(
            "todo-header-btn center",
            type === "todo" ? "" : "active"
          )}
          onClick={() => setType("done")}
        >
          Done
        </section>
      </section>
    </section>
  );
};

interface TodoContentProps {
  list: Array<{
    id: string;
    title: string;
    createTime: number;
  }>;
  onAdd: (content: { title: string; createTime: number }) => void;
  onDelete: (item: TodoItem) => void;
  onCompete: (item: TodoItem) => void;
}

const TodoContent: React.FC<TodoContentProps> = (props) => {
  const { list, onAdd, onDelete, onCompete } = props;
  const [text, setText] = useState("");
  const onSubmit = (e: any) => {
    e.preventDefault();
    onAdd({
      title: text,
      createTime: new Date().getTime(),
    });
    setText("");
  };

  return (
    <div className="TodoContent">
      <ul className="TodoContent-list">
        {list.map((item: TodoItem, index: number) => (
          <li className="TodoContent-item" key={index}>
            <section className="TodoContent-item-title">
              {index + 1}、{item.title}
            </section>
            <section className="TodoContent-item-btns">
              <div
                className="TodoContent-item-btn"
                onClick={() => onDelete(item)}
              >
                <CloseOne theme="outline" size="23" fill="rgb(196,196,196)" />
              </div>
              <div
                className="TodoContent-item-btn"
                onClick={() => onCompete(item)}
              >
                <CheckOne theme="outline" size="23" fill="rgb(196,196,196)" />
              </div>
            </section>
          </li>
        ))}
      </ul>
      <form className="TodoContent-add" onSubmit={onSubmit}>
        <input
          className={text.length > 0 ? "input-active" : "input-default"}
          type="text"
          placeholder="something"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="TodoContent-add-btn center" onClick={onSubmit}>
          <Plus theme="outline" size="23" fill="rgb(196,196,196)" />
        </div>
      </form>
    </div>
  );
};

interface DoneContentProps {
  list: Array<{
    id: string;
    title: string;
    createTime: number;
    doneTime: number;
  }>;
  onDelete: (item: TodoItem) => void;
  onRedo: (item: TodoItem) => void;
}

const DoneContent: React.FC<DoneContentProps> = (props) => {
  const { list, onDelete, onRedo } = props;

  return (
    <div className="DoneContent">
      <ul className="DoneContent-list">
        {list.map((item: DoneItem, index: number) => (
          <li className="DoneContent-item" key={index}>
            <section className="DoneContent-item-title">
              {index + 1}、{item.title}
            </section>
            <section className="DoneContent-item-btns">
              <div
                className="DoneContent-item-btn"
                onClick={() => onRedo(item)}
              >
                <ReduceOne theme="outline" size="23" fill="rgb(196,196,196)" />
              </div>
              <div
                className="DoneContent-item-btn"
                onClick={() => onDelete(item)}
              >
                <CloseOne theme="outline" size="23" fill="rgb(196,196,196)" />
              </div>
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LongTimeTodo;
