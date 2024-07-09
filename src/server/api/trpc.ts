import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getAuth } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';
import type { NextRequest } from 'next/server';

const createTRPCContext = async ({ req }: { req: NextRequest }) => {
  const auth = getAuth(req);

  return {
    req,
    auth,
    userId: auth.userId,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { ...ctx, userId } });
  })
);

export { createTRPCContext };