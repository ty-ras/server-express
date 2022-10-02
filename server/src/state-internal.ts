import type * as ctx from "./context";
import type * as express from "express";

export const doGetStateFromContext = <T>({ res }: ctx.Context<T>) =>
  doGetStateFromRequest<T>(res);

export const doGetStateFromRequest = <T>(res: express.Response) =>
  res.locals as T;
