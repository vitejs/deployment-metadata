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
  /**
   * The identifier of the metadata standard
   *
   * @example `VDM0001`
   */
  id: string;
  /** Version of the metadata kind's shape. */
  version: number;
}

/**
 * Open envelope for standardized and participant-specific metadata kinds.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export type AbstractDeploymentMetadata = Readonly<DeploymentMetadataBase & Record<string, unknown>>;

/**
 * The map of all deployment metadata.
 *
 * The key is the id of the metadata standard, and the value is the metadata record.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export interface DeploymentMetadataMap {
  // [id]: DeploymentMetadataBase & { ... };
}

/**
 * The union of all deployment metadata records.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export type DeploymentMetadata = DeploymentMetadataMap[keyof DeploymentMetadataMap];

/**
 * A build participant that publishes deployment metadata.
 *
 * **VDM0000 — Draft Standard (DS).**
 */
export interface DeploymentParticipant {
  /** Participant identifier; package names are recommended. */
  id: string;
  /** Optional human-readable diagnostic name. */
  name?: string;
  /** Return the participant's currently available metadata. */
  getMetadata(): MaybePromise<readonly DeploymentMetadata[]>;
}
