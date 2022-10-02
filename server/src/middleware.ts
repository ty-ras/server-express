import * as ep from "@ty-ras/endpoint";
import * as prefix from "@ty-ras/endpoint-prefix";
import * as server from "@ty-ras/server";
import type * as ctx from "./context";
import type * as express from "express";
import * as stream from "stream";

// Using given various endpoints, create ExpressJS middlewares.
export const createMiddleware = <TState>(
  endpoints: ReadonlyArray<
    ep.AppEndpoint<ctx.Context<TState>, Record<string, unknown>>
  >,
  events:
    | server.ServerEventEmitter<ctx.Context<TState>, TState>
    | undefined = undefined,
): // Notice that we must use this explicit form
// If we use express.RequestHandler, we will get an error because of asyncness.
// I guess Express typings are lagging behind or something.
((
  req: express.Request,
  // eslint-disable-next-line @typescript-eslint/ban-types
  res: express.Response<unknown, TState extends object ? TState : {}>,
) => Promise<unknown>) => {
  // Combine given endpoints into top-level entrypoint
  const regExpAndHandler = prefix
    .atPrefix("", ...endpoints)
    .getRegExpAndHandler("");
  // Return Koa middleware handler factory
  return async (req, res) => {
    await server.typicalServerFlow(
      {
        req,
        res,
      },
      regExpAndHandler,
      events,
      {
        getURL: ({ req }) => req.originalUrl,
        getState: ({ res }) => res.locals as unknown as TState,
        getMethod: ({ req }) => req.method,
        getHeader: ({ req }, headerName) => req.get(headerName),
        getRequestBody: ({ req }) => req,
        setHeader: ({ res }, headerName, headerValue) =>
          res.set(headerName, headerValue),
        setStatusCode: ({ res }, statusCode, willCallSendContent) => {
          res.status(statusCode);
          if (!willCallSendContent) {
            // Otherwise server becomes stuck
            res.send(undefined);
          }
        },
        sendContent: async ({ res }, content) => {
          if (content instanceof stream.Readable) {
            await stream.promises.pipeline(content, res);
          } else {
            res.send(content);
          }
        },
      },
    );
  };
};
