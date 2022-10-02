/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import test from "ava";

import * as spec from "../state";
import type * as ctx from "../context";

test("Validate getStateFromContext works", (t) => {
  t.plan(1);
  t.deepEqual(spec.getStateFromContext(dummyContext), dummyContext.res.locals);
});

test("Validate modifyState works", (t) => {
  t.plan(1);
  const ctxCopy: typeof dummyContext = {
    ...dummyContext,
    res: {
      ...dummyContext.res,
      locals: {
        ...dummyContext.res.locals,
      },
    } as any,
  };
  spec.modifyState(ctxCopy.res, (state) => (state.property = "Modified"));
  t.deepEqual(ctxCopy.res, { locals: { property: "Modified" } });
});

export const dummyContext: ctx.Context<State> = {
  res: {
    locals: {
      property: "Property",
    },
  },
} as any;

export interface State {
  property: string;
}
