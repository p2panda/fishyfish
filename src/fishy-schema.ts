import chalk from "chalk";
import program from "commander";

import { Session } from "./p2panda-api/index.js";
import { EntryRecord } from "./p2panda-api/types.js";
import { getKeyPair } from "./utils.js";

const SCHEMA_SCHEMA =
  "00401d76566758a5b6bfc561f1c936d8fc86b5b42ea22ab1dabf40d249d27dd906401fde147e53f44c103dd02a254916be113e51de1077a946a3a0c1272b9b348437";

/**
 * Validate fields for a new schema-schema entry.
 *
 * This should probably be part of `p2panda-js`
 *
 * @param name Name of the new schema
 * @param description Explains purpose and limitations of the schema
 * @param fields comma-separated list of fieldnames
 */
const validateSchema = (
  name: string,
  description: string,
  fields: string[]
): boolean => {
  let error = "";
  if (!name.match(/^\w{1,80}$/))
    error += "Schema name must have 1-80 alphanumeric characters\n";

  if (!description.match(/^.{0,256}$/))
    error += "Schema description must have 0-256 characters\n";

  if (
    !fields.reduce((acc, cur) => (cur.match(/^\w{1,80}$/) ? acc : false), true)
  )
    error +=
      "Field names must be a list of 1-80 character alphanumeric names\n";

  if (error.length > 0) {
    console.log(chalk.red(error));
    return false;
  }

  return true;
};

type CreateSchemaOptions = {
  node: string;
};

const createSchema = async (
  name: string,
  description: string,
  fields: string[],
  options: CreateSchemaOptions
) => {
  const keyPair = await getKeyPair();
  const session = new Session(options.node).schema(SCHEMA_SCHEMA);

  if (!validateSchema(name, description, fields)) process.exit(1);

  const schemaDefinition = {
    name,
    description,
    fields: fields.map((field) => `${field}(text)`).join(","),
  };

  console.log(chalk.grey(JSON.stringify(schemaDefinition, null, 2)));

  try {
    await session.create(schemaDefinition, {
      keyPair,
      session,
    });
  } catch (err) {
    console.log(chalk.grey("fishy rejected"), chalk.red(err.message));
    process.exit(1);
  }
  console.log(chalk.blue(`New schema ${chalk.white(name)}`));
};

type ListSchemasOptions = {
  node: string;
};

const listSchemas = async (options: ListSchemasOptions) => {
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
      fields: "Space-separated list of fields in this schema",
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
