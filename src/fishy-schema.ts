import chalk from "chalk";
import program from "commander";

import { Instance, Session } from "./p2panda-api/index.js";
import { Entry, EntryRecord } from "./p2panda-api/types.js";
import { getKeyPair } from "./utils.js";

const SCHEMA_SCHEMA =
  "00401d76566758a5b6bfc561f1c936d8fc86b5b42ea22ab1dabf40d249d27dd906401fde147e53f44c103dd02a254916be113e51de1077a946a3a0c1272b9b348437";

const createSchema = async (
  name: string,
  description: string,
  fields: string[],
  options
) => {
  const keyPair = await getKeyPair();
  const session = new Session(options.node);

  const schemaDefinition = {
    name,
    description,
    fields: fields.map((field) => `${field}(text)`).join(","),
  };

  console.log(chalk.grey(JSON.stringify(schemaDefinition, null, 2)));

  try {
    await Instance.create(schemaDefinition, {
      keyPair,
      schema: SCHEMA_SCHEMA,
      session,
    });
  } catch (err) {
    console.log(chalk.grey("node rejects fishy"), chalk.red(err.message));
    process.exit(1);
  }
  console.log(chalk.blue(`New schema ${chalk.white(name)}`));
};

const listSchemas = async (options) => {
  const session = new Session(options.node);
  const entries: EntryRecord[] = await session.queryEntries(SCHEMA_SCHEMA);

  entries.map((entry: EntryRecord) => {
    const name = chalk.cyan(entry.message.fields.name);
    const description = entry.message.fields.description;
    const fields = "- " + entry.message.fields.fields?.split(",").join("\n- ");
    // Split hash onto two lines by regexing groups of max 66 char length
    const hash = chalk.grey(
      entry.encoded.entryHash.match(/(.{1,66})/g).join("\n")
    );
    console.log(`${name}: ${description}\n${fields}\n${hash}\n`);
  });
};

async function main() {
  program
    .command("list")
    .description("list all available schemas")
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .action(listSchemas);

  program
    .command("create <name> <description> <fields...>")
    .description("create a new schema", {
      name: "Name of the schema (80 characters, no whitespace characters)",
      description: "Description (200 characters)",
      fields:
        "Comma-separated list of fields in this schema (only text values)",
    })
    .option(
      "-n, --node <node>",
      "node endpoint to connect with",
      "http://localhost:2020"
    )
    .action(createSchema);

  await program.parseAsync(process.argv);
}
main();
