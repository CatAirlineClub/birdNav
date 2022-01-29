export interface TodoItem {
  id: string;
  title: string;
  createTime: number;
}

export interface DoneItem {
  id: string;
  title: string;
  createTime: number;
  doneTime: number;
}

export interface TodoListNode {
  title: string;
  todoList: TodoItem[];
  doneList: DoneItem[];
}

export type TodoListTree = (TodoListTree | TodoListNode)[];

type BePromise<T> = (value: T | PromiseLike<T>) => void;
type Acknowleage<T> = (value: T) => void;
export type Receiver<T> = {
  pong: (cb: Acknowleage<T>) => void;
};

export function channel<T>() {
  const resolvers: BePromise<Acknowleage<T>>[] = [];
  const callback_collection: Acknowleage<T>[] = [];

  const sender = {
    ping(): Promise<Acknowleage<T>> {
      return new Promise((resolve) => {
        if (callback_collection.length) {
          return resolve(callback_collection.pop()!);
        }
        resolvers.push(resolve);
      });
    },
  };

  const receiver: Receiver<T> = {
    pong(cb: Acknowleage<T>) {
      if (resolvers.length) {
        return resolvers.pop()!(cb);
      }
      callback_collection.push(cb);
    },
  };

  return { sender, receiver };
}

export const channelArchive = channel<TodoListNode>();
export const channelLeftView = channel<TodoListNode>();
export const channelRightView = channel<TodoListNode>();
