import * as server from "@ty-ras/server";
import * as state from "./state-internal";
import type * as ctx from "./context-types";

export interface HKTContext extends server.HKTContext {
  readonly type: ctx.Context<this["_TState"]>;
}

export const validateContextState: server.ContextValidatorFactory<
  HKTContext
> = (validator, protocolErrorInfo) => ({
  validator: (ctx) => {
    const transformed = validator(state.doGetStateFromContext(ctx));
    if (transformed.error === "none") {
      return {
        error: "none" as const,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        data: ctx as any,
      };
    } else {
      return protocolErrorInfo === undefined
        ? transformed
        : {
            error: "protocol-error",
            statusCode:
              typeof protocolErrorInfo === "number"
                ? protocolErrorInfo
                : protocolErrorInfo.statusCode,
            body:
              typeof protocolErrorInfo === "number"
                ? undefined
                : protocolErrorInfo.body,
          };
    }
  },
  getState: state.doGetStateFromContext,
});
