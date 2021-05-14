import chalk from "chalk";
import { Session } from "./p2panda-api/index.js";

const printHeader = (long) => {
  let header = chalk.blue("author".padEnd(9));
  header += chalk.grey("entry".padEnd(9));
  header += chalk.grey("payload".padEnd(9));
  header += chalk.green("action".padEnd(7));
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

export const queryBySchema = async (schema: string, options) => {
  const session = new Session(options.node);
  const entries = await session.queryEntries(schema);

  console.log(
    chalk.white(`${entries.length} entries with schema ${schema.slice(-8)}\n`)
  );

  printHeader(options.long);

  for (const entry of entries as any[]) {
    const message = formatMessage(entry.message, options.long);
    console.log(
      chalk.blue(entry.encoded.author.slice(-8)),
      chalk.grey(entry.encoded.entryHash.slice(-8)),
      chalk.grey(entry.encoded.payloadHash.slice(-8)),
      chalk.green(entry.message.action),
      chalk.white(message)
    );
  }
};
