/**
 * @file This file contains internal code for e.g. implementing Express HTTP server -specific functionality of {@link server.ServerFlowCallbacksWithoutState}.
 */

import type * as server from "@ty-ras/server";
import type * as ctx from "./context.types";

import * as stream from "node:stream";

/**
 * This object implements the {@link server.ServerFlowCallbacksWithoutState} functionality for Express servers.
 */
export const staticCallbacks: server.ServerFlowCallbacksWithoutState<ctx.ServerContext> =
  {
    getURL: ({ req }) => req.originalUrl,
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
  };
