import * as ep from "@ty-ras/endpoint";
import * as prefix from "@ty-ras/endpoint-prefix";
import * as server from "@ty-ras/server";
import * as ctx from "./context-types";
import type * as express from "express";

// Using given various endpoints, create ExpressJS middlewares.
export const createMiddleware = <TState extends Record<string, unknown>>(
  endpoints: Array<
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
  res: express.Response<unknown, TState>,
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
        getState: ({ res }) => res.locals,
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
        sendContent: ({ res }, content) => {
          res.send(content);
        },
      },
    );
  };
};
