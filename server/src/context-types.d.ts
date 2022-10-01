import type * as express from "express";

export type Context<T extends Record<string, unknown>> = {
  req: express.Request;
  res: express.Response<unknown, T>;
};
