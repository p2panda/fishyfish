#!/usr/bin/env node
import program from "commander";

import { queryBySchema } from "./query.js";
import { createSchema, listSchemas } from "./schema.js";

async function main() {
  program
    .version("1.0.0")
    .description("A command line interface for p2panda nodes");

  program
    .command("query <schemaHash>")
    .description("request all entries of this schema", {
      schemaHash: "hash of a p2panda schema to query",
    })
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .option("-l, --long", "long format", false)
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

  program
    .command("schemas [hash]")
    .description("list schemas", {
      hash: "show info for the schema with this hash",
    })
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .action(listSchemas);

  await program.parseAsync(process.argv);
}
main();
