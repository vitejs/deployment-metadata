import type {
  DeploymentMetadataBase,
  MaybePromise,
  DeploymentMetadataMap,
} from "../../draft/VDM0000/types.js";

/**
 * A transport understood by the metadata producer, in preference order.
 *
 * **VDM0001 — Proposed Standard (PS).**
 */
export type RequestMetadataCarrier =
  | { type: "header"; name: string }
  | { type: "query"; name: string }
  | { type: "cookie"; name: string };

/**
 * How a consumer applies request metadata, passed to `RequestMetadata.enable()`.
 *
 * **VDM0001 — Proposed Standard (PS).**
 */
export interface RequestMetadataEnableOptions {
  /** The carrier types the consumer applies. */
  carriers: readonly RequestMetadataCarrier["type"][];
}

/**
 * A public deployment value and the request carriers that accept it.
 *
 * **VDM0001 — Proposed Standard (PS).**
 */
export type RequestMetadata = DeploymentMetadataBase & {
  id: "VDM0001";
  version: 1;
  value: string | (() => MaybePromise<string>);
  carriers: readonly RequestMetadataCarrier[];
  /** Enable skew protection over these carrier types. */
  enable(options: RequestMetadataEnableOptions): void;
};

declare module "@vitejs/deployment-metadata-types" {
  interface DeploymentMetadataMap {
    VDM0001: RequestMetadata;
  }
}
