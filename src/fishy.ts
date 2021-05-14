#!/usr/bin/env node
import program from "commander";

async function main() {
  program
    .version("1.0.0")
    .description("A command line interface for p2panda nodes")
    .command("query [selector]", "query entries")
    .command("schema [command]", "create and list schemas");

  await program.parseAsync(process.argv);
}
main();
