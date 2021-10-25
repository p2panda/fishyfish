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
    fs.mkdirSync(dataDir);
  }

  const fname = path.join(dataDir, "secret.key");

  let privateKey = null;
  try {
    privateKey = fs.readFileSync(fname).toString();
  } catch {}

  if (!privateKey) {
    console.log(chalk.green("New signing key created"), chalk.grey(fname));
    const keyPair = p2panda.createKeyPair();
    privateKey = keyPair.privateKey;
    fs.writeFileSync(fname, privateKey);
    return keyPair;
  }

  return p2panda.recoverKeyPair(privateKey);
};
