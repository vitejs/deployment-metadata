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

A participant has a stable `id`, an optional diagnostic `name`, and a zero-argument `getMetadata()` function. The function may be synchronous or asynchronous and returns immutable metadata records. Each record has an `id`, namespaced `kind`, numeric `version`, and optional non-behavioral description. Consumers must recognize both kind and version and ignore unknown records.

The initial protocol has no lifecycle context, registry, global state, selection rule, or primary participant. Multiple participants and duplicate IDs remain visible. Participant selection, ID uniqueness enforcement, and a possible primary-provider convention are open interoperability questions for future proposals.

Metadata is visible to code in the build process and must not contain secrets unless a future metadata standard defines a safe restricted mechanism.
