# VDM0000: Deployment Metadata Participants

# Summary

Defines the tool-agnostic participant and open metadata envelope used to exchange public deployment information within one build process.

# Basic example

```ts
import type { DeploymentParticipant } from "@vitejs/deployment-metadata-types";

const participant: DeploymentParticipant = {
  id: "@example/provider",
  getMetadata: () => [],
};
```

# Motivation

Framework and deployment-provider integrations need a shared vocabulary that does not depend on Vite, Rsbuild, or another tool. A small participant contract lets tool-specific integrations transport the same metadata shapes.

# Detailed design

The initial protocol has no lifecycle context, registry, global state, selection rule, or primary participant. Multiple participants and duplicate IDs remain visible. Participant selection, ID uniqueness enforcement, and a possible primary-provider convention are open interoperability questions for future proposals.

Metadata is visible to code in the build process and must not contain secrets unless a future metadata standard defines a safe restricted mechanism.

## `DeploymentParticipant`

### `id`

This is an identifier of the participant. It is recommended to be the package name of the participant. If there are multiple participant under the same package, it is recommended to start with the package name and `/`. For example, if it exists under `vite-plugin-myplatform` package, it will be `vite-plugin-myplatform/foo`.

### `name`

An optional human-readable name used for diagnostics.

### `getMetadata()`

A function to return the metadata for this participant. The function may be synchronous or asynchronous and returns a list of immutable `DeploymentMetadata`.

## `DeploymentMetadata`

Other than the following properties, the standards can extend the metadata type with any properties that does not start with `_`.

### `id`

The identifier of the metadata standard. The standards in this registry should start with `VDM`.

### `version`

The version of the schema this metadata follows.
