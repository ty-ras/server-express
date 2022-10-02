import * as server from "@ty-ras/server";
import type * as express from "express";

export interface HKTContext extends server.HKTContext {
  readonly type: Context<this["_TState"]>;
}

export type Context<T> = {
  req: express.Request;
  // eslint-disable-next-line @typescript-eslint/ban-types
  res: express.Response<unknown, T extends object ? T : {}>;
};
