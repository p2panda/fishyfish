import chalk from "chalk";
import { Session } from "./p2panda-api/index.js";
import { getKeyPair } from "./utils.js";

type Format = "compact" | "long";

const printHeader = (format: Format) => {
  let header = chalk.blue("author".padEnd(9));
  header += chalk.grey("entry".padEnd(9));
  header += chalk.grey("payload".padEnd(9));
  header += chalk.green("action".padEnd(7));
  if (format == "long") header += chalk.white("message fields");
  console.log(header);
};

const formatMessage = (message, format: Format) => {
  let rv;
  if (format == null || format === "compact") {
    if (message == null) {
      rv = "---";
    } else {
      rv = Object.keys(message.fields).join(" ");
    }
  } else if (format === "long") {
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
    console.log(
      chalk.red(`Unknown format ${format}. Please use 'compact' or 'long'`)
    );
    process.exit(1);
  }
  return rv;
};

export const queryBySchema = async (
  schema: string,
  format: Format,
  options
) => {
  const session = new Session(options.node);
  const entries = await session.queryEntries(schema);

  console.log(
    chalk.white(`${entries.length} entries with schema ${schema.slice(-8)}\n`)
  );

  printHeader(format);

  for (const entry of entries as any[]) {
    const message = formatMessage(entry.message, format);
    console.log(
      chalk.blue(entry.encoded.author.slice(-8)),
      chalk.grey(entry.encoded.entryHash.slice(-8)),
      chalk.grey(entry.encoded.payloadHash.slice(-8)),
      chalk.green(entry.message.action),
      chalk.white(message)
    );
  }
};
