import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { sanityClient } from '~/sanity';
import { TRPCError } from '@trpc/server';

export const lessonRouter = createTRPCRouter({
  completeLesson: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { lessonId } = input;
      const { userId } = ctx;

      try {
        // Fetch the user document in Sanity
        const user = await sanityClient.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });

        // If the user doesn't exist, create a new user document
        if (!user) {
          await sanityClient.create({
            _type: 'user',
            _id: userId,
            lessonsCompleted: [lessonId],
          });
        } else {
          // Update the user document with the completed lesson
          await sanityClient.patch(userId)
            .setIfMissing({ lessonsCompleted: [] })
            .append('lessonsCompleted', [lessonId])
            .commit();
        }

        return { success: true };
      } catch (error) {
        console.error('Failed to update lesson completion:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update lesson completion' });
      }
    }),
  fetchCompletedLessons: protectedProcedure
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      try {
        const user = await sanityClient.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });
        if (!user) {
          return [];
        }
        return user.lessonsCompleted || [];
      } catch (error) {
        console.error('Failed to fetch completed lessons:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch completed lessons' });
      }
    }),
});