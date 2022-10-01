import type * as express from "express";

export type Context<T> = {
  req: express.Request;
  // eslint-disable-next-line @typescript-eslint/ban-types
  res: express.Response<unknown, T extends object ? T : {}>;
};
