import test from "ava";

import * as spec from "../middleware";

import * as express from "express";
import * as http from "http";
import * as testSupport from "@ty-ras/server-test-support";

testSupport.registerTests(
  test,
  (endpoints) =>
    http.createServer(
      express
        .default()
        .disable("x-powered-by")
        .use(spec.createMiddleware(endpoints)),
    ),
  {
    contentTypeHeaderSuffix: "; charset=utf-8",
  },
);

// test("Validate Express middleware works for happy path", async (t) => {
//   await testFastifyServer(t, "; charset=utf-8");
// });

// test("Validate Express middleware works for 404", async (t) => {
//   await testFastifyServer(t, {
//     regExp: /ungrouped-regexp-will-never-match/,
//     expectedStatusCode: 404,
//   });
// });

// test("Validate Express middleware works for 204", async (t) => {
//   await testFastifyServer(t, 204);
// });
// test("Validate Express middleware works for 403", async (t) => {
//   await testFastifyServer(t, 403);
// });

// const testFastifyServer = (
//   t: ExecutionContext,
//   info: Parameters<typeof server.testServer>[2],
// ) =>
//   server.testServer(
//     t,
//     (endpoints) =>
//       http.createServer(
//         express
//           .default()
//           .disable("x-powered-by")
//           .use(spec.createMiddleware(endpoints)),
//       ),
//     info,
//   );
