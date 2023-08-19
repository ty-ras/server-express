/**
 * @file This file contains unit tests for functionality in file `../server.ts`.
 */

import test from "ava";

import * as spec from "../server";
import * as secure from "./secure";

import * as testSupport from "@ty-ras/server-test-support";

const createServer: testSupport.CreateServer = (
  endpoints,
  info,
  httpVersion,
  secure,
) =>
  httpVersion === 1
    ? secure
      ? spec.createServer({
          endpoints,
          ...getCreateState(info),
          options: {
            ...secureInfo,
          },
        })
      : spec.createServer({ endpoints, ...getCreateState(info) })
    : httpVersion === 2
    ? secure
      ? {
          server: spec.createServer({
            endpoints,
            ...getCreateState(info),
            httpVersion,
            options: {
              ...secureInfo,
            },
          }),
          secure,
        }
      : {
          server: spec.createServer({
            endpoints,
            ...getCreateState(info),
            httpVersion,
          }),
          secure,
        }
    : doThrow(`Invalid http version: ${httpVersion}`);

const secureInfo = secure.generateKeyAndCert();
const doThrow = (msg: string) => {
  throw new Error(msg);
};

const defaultOpts: testSupport.RegisterTestsOptions = {
  run500Test: true,
  // Automatically appended by Express
  contentTypeHeaderSuffix: "; charset=utf-8",
};

testSupport.registerTests(test, createServer, {
  ...defaultOpts,
  httpVersion: 1,
  secure: false,
});

testSupport.registerTests(test, createServer, {
  ...defaultOpts,
  httpVersion: 1,
  secure: true,
});

test("HTTP2 support should not work yet until 5.x release", (c) => {
  c.plan(1);
  c.throws(() => spec.createServer({ endpoints: [], httpVersion: 2 }), {
    instanceOf: Error,
    message:
      "Unfortunately, express v4.x does not support HTTP protocol version 2, and couldn't find any workaround for that (http2-express-bridge didn't work).",
  });
});

// testSupport.registerTests(test, createServer, {
//   ...defaultOpts,
//   httpVersion: 2,
//   secure: false,
// });

// testSupport.registerTests(test, createServer, {
//   ...defaultOpts,
//   httpVersion: 2,
//   secure: true,
// });

const getCreateState = (
  info: testSupport.ServerTestAdditionalInfo[0],
): Pick<
  spec.ServerCreationOptions<unknown, never, never, never>,
  "createState"
> =>
  info == 500
    ? {
        createState: () => {
          throw new Error("This should be catched.");
        },
      }
    : {};
