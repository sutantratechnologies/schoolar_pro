import { GraphQLError } from 'graphql';
import type { ApiContext } from './auth.context.js';

type TodoContext = Pick<ApiContext, 'prisma'>;

type TodoRecord = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TodoResolverMap = {
  Query: {
    todos: (
      parent: unknown,
      args: Record<string, never>,
      context: TodoContext
    ) => Promise<TodoRecord[]>;
  };
  Mutation: {
    createTodo: (
      parent: unknown,
      args: { title: string },
      context: TodoContext
    ) => Promise<TodoRecord>;
    updateTodo: (
      parent: unknown,
      args: {
        id: string;
        title?: string | null;
        completed?: boolean | null;
      },
      context: TodoContext
    ) => Promise<TodoRecord>;
    deleteTodo: (
      parent: unknown,
      args: { id: string },
      context: TodoContext
    ) => Promise<string>;
  };
  Todo: {
    createdAt: (todo: TodoRecord) => string;
    updatedAt: (todo: TodoRecord) => string;
  };
};

function validateTitle(title: string): string {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0 || trimmedTitle.length > 200) {
    throw new GraphQLError('Todo title must be between 1 and 200 characters.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  return trimmedTitle;
}

export const todoResolvers: TodoResolverMap = {
  Query: {
    todos: (_parent, _args, { prisma }) =>
      prisma.todo.findMany({
        orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
      }),
  },
  Mutation: {
    createTodo: (_parent, { title }, { prisma }) =>
      prisma.todo.create({
        data: { title: validateTitle(title) },
      }),
    updateTodo: async (_parent, { id, title, completed }, { prisma }) => {
      if (title == null && completed == null) {
        throw new GraphQLError('Provide a title or completed value to update.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      return prisma.todo.update({
        where: { id },
        data: {
          ...(title != null ? { title: validateTitle(title) } : {}),
          ...(completed != null ? { completed } : {}),
        },
      });
    },
    deleteTodo: async (_parent, { id }, { prisma }) => {
      const todo = await prisma.todo.delete({ where: { id } });
      return todo.id;
    },
  },
  Todo: {
    createdAt: (todo) => todo.createdAt.toISOString(),
    updatedAt: (todo) => todo.updatedAt.toISOString(),
  },
};
