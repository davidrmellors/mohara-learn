import { createTRPCRouter } from '~/server/api/trpc';
import { courseRouter } from './routers/courseRouter';
import { lessonRouter } from './routers/lessonRouter';
import { createTRPCContext } from '~/server/api/trpc';
import type { NextRequest } from 'next/server';

export const appRouter = createTRPCRouter({
  course: courseRouter,
  lesson: lessonRouter,
});

export type AppRouter = typeof appRouter;

// Create a caller function for the app router
export const createAppCaller = async (req: NextRequest) => {
  const context = await createTRPCContext({ req });
  return appRouter.createCaller(context);
};
