/**
 * @file This types-only file refines generic TyRAS server-related types to Koa -specific types.
 */

import * as server from "@ty-ras/server";
import type * as express from "express";

/**
 * This is server context for Express server.
 */
export interface ServerContext {
  /**
   * The Express HTTP request.
   */
  req: express.Request;

  /**
   * The Express HTTP response.
   */
  res: express.Response;
}
/**
 * This is type for callbacks which create endpoint-specific state when processing requests in Node HTTP1 or HTTP2 server.
 */
export type CreateState<TStateInfo> = server.StateProvider<
  ServerContext,
  TStateInfo
>;
