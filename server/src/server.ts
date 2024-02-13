/**
 * @file This file exposes function to create Node HTTP 1 or 2 server serving giving TyRAS {@link ep.AppEndpoint}s.
 */

import * as server from "@ty-ras/server";
import * as express from "express";
import type * as ctx from "./context.types";
import * as middleware from "./middleware";

/**
 * Creates new {@link express.Express} server serving given TyRAS {@link ep.AppEndpoint}s with additional configuration via {@link ServerCreationOptions}.
 * Please set `httpVersion` value of `opts` to `2` to enable HTTP2 protocol, otherwise HTTP1 server will be returned.
 * @param opts The {@link ServerCreationOptions} to use when creating server.
 * @param opts.endpoints Privately deconstructed variable.
 * @param opts.createState Privately deconstructed variable.
 * @param opts.events Privately deconstructed variable.
 * @returns The {@link express.Express} server.
 */
export function createServer<TStateInfo, TState>({
  endpoints,
  createState,
  events,
}: ServerCreationOptions<TStateInfo, TState>): HttpServer {
  return express
    .default()
    .disable("x-powered-by")
    .use(middleware.createMiddleware(endpoints, createState, events));
}
/**
 * This interface contains options common for both HTTP 1 and 2 servers when creating them via {@link createServer}.
 */
export interface ServerCreationOptions<TStateInfo, TState> {
  /**
   * The TyRAS {@link ep.AppEndpoint}s to server via returned HTTP server.
   */
  endpoints: server.ServerEndpoints<ctx.ServerContext, TStateInfo>;

  /**
   * The callback to create endpoint-specific state objects.
   */
  createState?: ctx.CreateState<TStateInfo> | undefined;

  /**
   * The callback for tracking events occurred within the server.
   */
  events?:
    | server.ServerEventHandler<server.GetContext<ctx.ServerContext>, TState>
    | undefined;
}

/**
 * This type contains all the HTTP server types that can be created with TyRAS backend for Express servers.
 */
export type HttpServer = express.Express;
