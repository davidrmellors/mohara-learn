import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { sanityClient } from '~/sanity';
import { TRPCError } from '@trpc/server';

export const courseRouter = createTRPCRouter({
  getCourseProgress: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { courseId } = input;
      const { userId } = ctx;

      try {
        // Fetch modules associated with the course
        const modules = await sanityClient.fetch(
          `*[_type == "module" && references($courseId)]{_id}`,
          { courseId },
        );
        const moduleIds = modules.map((module: any) => module._id);

        // Fetch lessons associated with those modules
        const lessons = await sanityClient.fetch(
          `*[_type == "lesson" && references($moduleIds)]`,
          { moduleIds },
        );
        const totalLessons = lessons.length;

        console.log('Modules:', modules);
        console.log('Lessons:', lessons);

        // Fetch the user and calculate completed lessons
        const user = await sanityClient.fetch(
          `*[_type == "user" && _id == $userId][0]`,
          { userId },
        );
        const completedLessons = user
          ? user.lessonsCompleted.filter((lessonId: string) =>
              lessons.some((lesson: any) => lesson._id === lessonId),
            ).length
          : 0;

        console.log('User:', user);
        console.log('Completed Lessons:', completedLessons);

        const completionPercentage =
          totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

        console.log('Total Lessons:', totalLessons);
        console.log('Completion Percentage:', completionPercentage);

        return {
          totalLessons,
          completedLessons,
          completionPercentage,
        };
      } catch (error) {
        console.error('Failed to fetch course progress:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch course progress',
        });
      }
    }),
});
