// SPDX-License-Identifier: MIT

import chalk from "chalk";
import program from "commander";

import p2panda from "p2panda-js";
import { EntryRecord } from "./types";

const printHeader = (long) => {
  let header = chalk.cyan("author".padEnd(9));
  header += chalk.green("action".padEnd(7));
  header += chalk.grey("entry".padEnd(9));
  header += chalk.grey("payload".padEnd(9));
  if (!long) header += chalk.white("message fields");
  else header += "\n";
  console.log(header);
};

const formatMessage = (message, long) => {
  let rv: string;
  if (long) {
    if (message == null) {
      rv = "\nno message available";
    } else {
      rv =
        "\n" +
        Object.keys(message.fields)
          .map((k) => `${k}: ${message.fields[k].slice(0, 60)}\n`)
          .join("");
    }
  } else {
    if (message == null) {
      rv = "---";
    } else {
      rv = Object.keys(message.fields).join(" ");
    }
  }
  return rv;
};

const queryBySchema = async (schema: string, options) => {
  const session = new p2panda.Session(options.node);
  let entries: EntryRecord[];
  try {
    entries = await session.queryEntries(schema);
  } catch(err) {
    throw new Error(`Error querying entries: ${err.message}`)
  }

  console.log(
    chalk.white(`${entries.length} entries with schema ${schema.slice(-8)}\n`)
  );

  if (entries.length === 0) return;

  printHeader(options.long);

  for (const entry of entries) {
    const message = formatMessage(entry.operation, options.long);
    console.log(
      chalk.cyan(entry.encoded.author.slice(-8)),
      chalk.green(entry.operation.action),
      chalk.grey(entry.encoded.entryHash.slice(-8)),
      chalk.grey(entry.encoded.payloadHash.slice(-8)),
      chalk.white(message)
    );
  }
};

async function main() {
  program
    .command("schema <schemaHash>")
    .description("list all entries of this schema", {
      schemaHash: "hash of a p2panda schema to query",
    })
    .option("-l, --long", "long format", false)
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .action(queryBySchema);

  await program.parseAsync(process.argv);
}
main();
