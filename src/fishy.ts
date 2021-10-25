#!/usr/bin/env node
// SPDX-License-Identifier: MIT

import program from "commander";

async function main() {
  program
    .version("0.0.1")
    .description("A command line interface for p2panda nodes")
    .command("query [selector]", "query entries")
    .command("schema [command]", "create and list schemas");

  await program.parseAsync(process.argv);
}
main();
