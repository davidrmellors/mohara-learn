import { trpc } from '~/utils/trpc';

export const useCourseProgress = (courseId: string) => {
  return trpc.course.getCourseProgress.useQuery({ courseId });
};
