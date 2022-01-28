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
  
export interface TodoClone {
  todoList : TodoItem[],
  doneList : DoneItem[],
}


const resolvers : ((value: ((title: string, value : unknown) => void) | PromiseLike<(title: string, value : unknown) => void>)=>void)[] = [];
const callback_collection : ((title: string, value : unknown)=>void)[] = [];

export const sender = {
    ping() : Promise<(title: string, value : unknown)=>void> {
        return new Promise((resolve) => {
            if (callback_collection.length) {
                return resolve(callback_collection.pop()!)
            }
            resolvers.push(resolve);
        });
    }
}

export const receiver = {
    pong(cb : (title: string, value : unknown)=>unknown) {
        if (resolvers.length) {
            return resolvers.pop()!(cb);
        }
        callback_collection.push(cb);
    }
}
