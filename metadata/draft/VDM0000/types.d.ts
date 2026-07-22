/**
 * A synchronous or asynchronous value.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Fields shared by every deployment metadata record.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export interface DeploymentMetadataBase {
  /** Stable identifier within the publishing participant. */
  id: string;
  /** Namespaced metadata kind interpreted together with `version`. */
  kind: string;
  /** Version of the metadata kind's shape. */
  version: number;
  /** Human-readable text that consumers must not use for behavior. */
  description?: string;
}

/**
 * Open envelope for standardized and participant-specific metadata kinds.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export type DeploymentMetadata = DeploymentMetadataBase & Readonly<Record<string, unknown>>;

/**
 * A build participant that publishes deployment metadata.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export interface DeploymentParticipant {
  /** Stable participant identifier; package names are recommended. */
  id: string;
  /** Optional human-readable diagnostic name. */
  name?: string;
  /** Return the participant's currently available metadata. */
  getMetadata(): MaybePromise<readonly DeploymentMetadata[]>;
}
