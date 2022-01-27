// SPDX-License-Identifier: MIT

import chalk from "chalk";
import program from "commander";
import p2panda from "p2panda-js";
import { Entry } from "./types";

const decodeEntry = async (encodedEntry: string, encodedOperation: string) => {
    const { decodeEntry } = await p2panda.wasm;
    let entry: Entry;
    try {
        entry = decodeEntry(encodedEntry, encodedOperation);
    } catch(err) {
        console.log(`${chalk.red('Decoding entry failed')}: ${err.message}`)
        return;
    }
    console.log(chalk.blue('Decoded entry:'))
    console.log(chalk.white(JSON.stringify(entry, null, 2)));
}

async function main() {
  program
    .command("entry <encodedEntry> [encodedOperation]")
    .description("decode an entry")
    .action(decodeEntry);


  await program.parseAsync(process.argv);
}
main();
