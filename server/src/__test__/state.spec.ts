/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import test from "ava";

import * as spec from "../state";
import * as ctx from "./context";

test("Validate getStateFromContext works", (t) => {
  t.plan(1);
  t.deepEqual(
    spec.getStateFromContext(ctx.dummyContext),
    ctx.dummyContext.res.locals,
  );
});

test("Validate modifyState works", (t) => {
  t.plan(1);
  const ctxCopy: typeof ctx.dummyContext = {
    ...ctx.dummyContext,
    res: {
      ...ctx.dummyContext.res,
      locals: {
        ...ctx.dummyContext.res.locals,
      },
    } as any,
  };
  spec.modifyState(ctxCopy.res, (state) => (state.property = "Modified"));
  t.deepEqual(ctxCopy.res, { locals: { property: "Modified" } });
});
