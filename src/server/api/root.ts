import { createTRPCRouter } from '~/server/api/trpc';
import { lessonRouter } from './routers/lessonRouter';
import { courseRouter } from './routers/courseRouter';

export const appRouter = createTRPCRouter({
  lesson: lessonRouter,
  course: courseRouter,
});

export type AppRouter = typeof appRouter;
