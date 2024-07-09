import { appRouter } from '~/server/api/root';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '~/server/api/trpc';
import type { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
  });
};

export const POST = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
  });
};