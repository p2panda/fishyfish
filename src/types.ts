// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Arguments for publishing the next entry
 */
export type EntryArgs = {
  entryHashSkiplink: string | undefined;
  entryHashBacklink: string | undefined;
  seqNum: number;
  logId: number;
};

/**
 * Entry record received from aquadoggo
 */
export type EncodedEntry = {
  author: string;
  entryBytes: string;
  entryHash: string;
  logId: number;
  payloadBytes: string;
  payloadHash: string;
  seqNum: number;
};

/**
 * Entry record from aquadoggo with decoded `Entry`
 */
export type EntryRecord = Entry & {
  encoded: EncodedEntry;
};

/**
 * Decoded entry containing optional `Message`
 */
export type Entry = {
  entryHashBacklink: string | null;
  entryHashSkiplink: string | null;
  logId: number;
  operation: Operation | null;
  seqNum: number;
};

/**
 * Decoded form of a message, which can create, update or delete instances
 */
export type Operation = {
  action: "create" | "update" | "delete";
  schema: string;
  fields?: Fields;
  id?: string;
};

/**
 * Object containing message field values
 */
export type Fields = {
  [fieldname: string]: boolean | number | string;
};

/**
 * Decoded entry containing optional `Message`
 */
export type EntryTagged = {
  entryHashBacklink: string | null;
  entryHashSkiplink: string | null;
  logId: number;
  operation: OperationTagged | null;
  seqNum: number;
};

/**
 * Decoded form of a message, which can create, update or delete instances
 */
export type OperationTagged = {
  action: "create" | "update" | "delete";
  schema: string;
  fields: FieldsTagged;
};

/**
 * Object containing message fields in tagged form
 */
export type FieldsTagged = {
  // currently only a schema with a text message is supported
  [fieldname: string]: OperationValue;
};

export type OperationValue =
  | OperationValueText
  | OperationValueBool
  | OperationValueInt;

/**
 * A message value of `boolean` type
 */
export type OperationValueBool = {
  value: boolean;
  type: "bool";
};

/**
 * A message value of `number` type, which must be an integer
 */
export type OperationValueInt = {
  value: number;
  type: "int";
};

/**
 * A message value of `string` type
 */
export type OperationValueText = {
  value: string;
  type: "str";
};

export type DocumentView = Record<
  string,
  boolean | number | string | unknown
> & {
  _meta: {
    id: string;
    author: string;
    deleted: boolean;
    edited: boolean;
    entries: EntryRecord[];
    schema: string;
  };
};
