import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';

import { createAppCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({ req: { headers: heads } as any });
});

export const api = async () => {
  const context = await createContext();
  return createAppCaller(context.req);
};
