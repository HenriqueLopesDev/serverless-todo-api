import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const saveTodo = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'save',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};

export const getAllTodos = {
  handler: `${handlerPath(__dirname)}/handler.getAllTodos`,
  events: [
    {
      http: {
        method: 'get',
        path: '/getAllTodos',
      },
    },
  ],
};

export const getTodo = {
  handler: `${handlerPath(__dirname)}/handler.getOneTodo`,
  events: [
    {
      http: {
        method: 'get',
        path: '/todo/{id}',
      },
    },
  ],
};

export const updateTodo = {
  handler: `${handlerPath(__dirname)}/handler.updateOneTodo`,
  events: [
    {
      http: {
        method: 'put',
        path: '/todo/{id}',
      },
    },
  ],
};

export const deleteTodo = {
  handler: `${handlerPath(__dirname)}/handler.deleteOneTodo`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/todo/{id}',
      },
    },
  ],
};
