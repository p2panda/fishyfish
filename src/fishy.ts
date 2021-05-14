#!/usr/bin/env node
import program from "commander";

import { queryBySchema } from "./query.js";
import { createSchema } from "./schema.js";

async function main() {
  program
    .version("1.0.0")
    .description("A command line interface for p2panda nodes")
    .command("query <schemaHash> [format]")
    .description("request all entries of this schema", {
      schemaHash: "hash of a schema to query",
      format: "either 'compact' (default) or 'long'",
    })
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .action(queryBySchema);

  program
    .command("schema <name> <description> [fields...]")
    .description("create a new schema")
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .action(createSchema);

  await program.parseAsync(process.argv);
}
main();
