import { createTRPCRouter } from '~/server/api/trpc';
import { lessonRouter } from './routers/lessonRouter';

export const appRouter = createTRPCRouter({
  lesson: lessonRouter,
});

export type AppRouter = typeof appRouter;