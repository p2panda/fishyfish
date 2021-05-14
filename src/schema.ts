import chalk from "chalk";
import { Instance, Session } from "./p2panda-api/index.js";
import { getKeyPair } from "./utils.js";

const SCHEMA_SCHEMA =
  "00401d76566758a5b6bfc561f1c936d8fc86b5b42ea22ab1dabf40d249d27dd906401fde147e53f44c103dd02a254916be113e51de1077a946a3a0c1272b9b348437";

export const createSchema = async (
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
    fields: fields.join(","),
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