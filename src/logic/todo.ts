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
type Acknowleage = (value: TodoListTree) => void;

const resolvers: BePromise<Acknowleage>[] = [];
const callback_collection: Acknowleage[] = [];

export const sender = {
  ping(): Promise<Acknowleage> {
    return new Promise((resolve) => {
      if (callback_collection.length) {
        return resolve(callback_collection.pop()!);
      }
      resolvers.push(resolve);
    });
  },
};

export const receiver = {
  pong(cb: Acknowleage) {
    if (resolvers.length) {
      return resolvers.pop()!(cb);
    }
    callback_collection.push(cb);
  },
};
