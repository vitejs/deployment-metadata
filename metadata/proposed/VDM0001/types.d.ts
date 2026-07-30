import type { DeploymentMetadata, MaybePromise } from "../../draft/VDM0000/types.js";

/**
 * A transport understood by the metadata producer, in preference order.
 *
 * **VDM0001 — Proposed Standard (PS).**
 */
export type RequestMetadataCarrier =
  | { type: "header"; name: string }
  | { type: "query"; name: string };

/**
 * A public deployment value and the request carriers that accept it.
 *
 * **VDM0001 — Proposed Standard (PS).**
 */
export type RequestMetadata = DeploymentMetadata & {
  id: "VDM0001";
  version: 1;
  value: string | (() => MaybePromise<string>);
  carriers: readonly RequestMetadataCarrier[];
};
