import p2panda from "p2panda-js";
import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";

import { log } from "./index.js";
import { EntryArgs, EntryRecord, EncodedEntry } from "~/p2panda-api/types.js";

import type { Resolved } from "./index.js";
import { marshallResponseFields } from "./utils.js";

export default class Session {
  // Address of a p2panda node that we can connect to
  endpoint: string;

  // An rpc client connected to the confgiured endpoint
  private client: Client;

  // The wasm library from p2panda-rs. To ensure that it is loaded before
  // using it await `this.loadWasm()`
  p2panda: Resolved<typeof p2panda> = null;

  // Cached arguments for the next entry
  nextEntryArgs: { [cacheKey: string]: EntryArgs } = {};

  constructor(endpoint: Session["endpoint"]) {
    this.endpoint = endpoint;
    const transport = new HTTPTransport(endpoint);
    this.client = new Client(new RequestManager([transport]));
    this.loadWasm();
  }

  // Load and return the WebAssembly p2panda library.
  //
  // Always await this function before using `this.p2panda`. Unfortunately this
  // cannot be handled in the constructor as the contructor cannot be async.
  async loadWasm(): Promise<Session["p2panda"]> {
    if (this.p2panda == null) {
      this.p2panda = await p2panda;
      if (this.p2panda.default != null) {
        log("fallback loader from `p2panda.default`");
        this.p2panda = await p2panda.default;
      }
    }
    return this.p2panda;
  }

  async getNextEntryArgs(author: string, schema: string): Promise<EntryArgs> {
    const cacheKey = `${author}/${schema}`;
    const cachedValue = this.nextEntryArgs[cacheKey];
    if (cachedValue) {
      // use cache
      delete this.nextEntryArgs[cacheKey];
      log("panda_getEntryArguments [cached]", cachedValue);
      return cachedValue;
    } else {
      // do rpc call
      const nextEntryArgs = await this.client.request({
        method: "panda_getEntryArguments",
        params: { author, schema },
      });
      log("panda_getEntryArguments", nextEntryArgs);
      return nextEntryArgs;
    }
  }

  /**
   * Cache next entry args for a given author and schema
   */
  setNextEntryArgs(author: string, schema: string, entryArgs: EntryArgs): void {
    const cacheKey = `${author}/${schema}`;
    this.nextEntryArgs[cacheKey] = entryArgs;
  }

  async publishEntry(
    entryEncoded: string,
    messageEncoded: string
  ): Promise<EntryArgs> {
    const result = await this.client.request({
      method: "panda_publishEntry",
      params: { entryEncoded, messageEncoded },
    });
    log("panda_publishEntry");
    return result;
  }

  async queryEntriesEncoded(schema: string): Promise<EncodedEntry[]> {
    const result = await this.client.request({
      method: "panda_queryEntries",
      params: { schema },
    });
    log("panda_queryEntries", result);
    return result.entries;
  }

  async queryEntries(schema: string): Promise<EntryRecord[]> {
    const { decodeEntry } = await this.loadWasm();
    const result = await this.queryEntriesEncoded(schema);
    return Promise.all(
      result.map(async (entry) => {
        const decoded = await decodeEntry(entry.entryBytes, entry.payloadBytes);
        decoded.message.fields = marshallResponseFields(decoded.message.fields);
        return {
          ...decoded,
          encoded: entry,
        };
      })
    );
  }

  toString(): string {
    return `<Session ${this.endpoint}>`;
  }
}