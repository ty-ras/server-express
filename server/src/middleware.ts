/**
 * @file This file contains helper function to create Express middleware callback.
 */

import * as ep from "@ty-ras/endpoint";
import * as server from "@ty-ras/server";
import type * as express from "express";
import type * as context from "./context.types";
import * as internal from "./internal";

/**
 * Creates a new {@link express.Middleware} to server the given TyRAS {@link ep.AppEndpoint}s.
 * @param endpoints The TyRAS {@link ep.AppEndpoint}s to serve through this Koa middleware.
 * @param createState The optional callback to create state for the endpoints.
 * @param events The optional {@link server.ServerEventHandler} callback to observe server events.
 * @returns The Koa middleware which will serve the given endpoints.
 */
export const createMiddleware = <TStateInfo>(
  endpoints: ReadonlyArray<ep.AppEndpoint<context.ServerContext, TStateInfo>>,
  createState?: context.CreateState<TStateInfo>,
  events?: server.ServerEventHandler<
    server.GetContext<context.ServerContext>,
    TStateInfo
  >,
): express.RequestHandler => {
  const flow = server.createTypicalServerFlow(
    endpoints,
    {
      ...internal.staticCallbacks,
      getState: async (ctx, stateInfo) =>
        await createState?.({ context: ctx, stateInfo }),
    },
    events,
  );
  return asyncToVoid(
    async (req: express.Request, res: express.Response) =>
      await flow({ req, res }),
  );
};

/**
 * Helper method to convert Promise-utilizing asynchronous callbacks to `void`-returning callbacks, used by many places in Node.
 * @param asyncCallback The Promise-utilizing asynchronous callback.
 * @returns The callback which loses Promise and returns `void`.
 */
const asyncToVoid =
  <TCallback extends (...args: Array<any>) => Promise<any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
    asyncCallback: TCallback,
  ): ((...args: Parameters<typeof asyncCallback>) => void) =>
  (...args) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void asyncCallback(...args);
  };
