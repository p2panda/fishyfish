// SPDX-License-Identifier: MIT

import chalk from "chalk";
import p2panda from "p2panda-js";
import appDataPath from "appdata-path";
import path from "path";
import fs from "fs";

export const getKeyPair = async () => {
  // os dependent folder for application data
  const dataDir = appDataPath("fishyfish");

  try {
    fs.statSync(dataDir);
  } catch {
    try {
    fs.mkdirSync(dataDir);
    } catch(err) {
      throw new Error(`Error creating application data directory at ${dataDir}: ${err}`)
    }
  }

  const fname = path.join(dataDir, "secret.key");

  let privateKey = null;
  try {
    privateKey = fs.readFileSync(fname).toString();
  } catch {
    // No private key was found, proceeding to create one and write it to disk
  }

  if (!privateKey) {
    console.log(chalk.green("New signing key created"), chalk.grey(fname));
    const keyPair = await p2panda.createKeyPair();
    privateKey = keyPair.privateKey();
    // Only allow current user to access this file by setting mode 0700
    fs.writeFileSync(fname, privateKey, { mode: 0o700 });
    return keyPair;
  }

  return p2panda.recoverKeyPair(privateKey);
};
