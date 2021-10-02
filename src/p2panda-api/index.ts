// SPDX-License-Identifier: MIT

import debug from "debug";

export const log = debug("p2panda-api");

export type Resolved<T> = T extends PromiseLike<infer U> ? Resolved<U> : T;

export { default as Session } from "./session.js";
export { default as Instance } from "./instance.js";
