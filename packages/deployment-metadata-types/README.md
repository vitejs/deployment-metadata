# `@vitejs/deployment-metadata-types`

Tool-agnostic declarations for Vite Deployment Metadata standards.

```ts
import type { DeploymentParticipant, RequestMetadata } from "@vitejs/deployment-metadata-types";

const metadata = {
  id: "deployment-id",
  kind: "deployment.requestMetadata",
  version: 1,
  value: "abc123",
  carriers: [{ type: "query", name: "__deployment_id" }],
} satisfies RequestMetadata;

const participant: DeploymentParticipant = {
  id: "@example/provider",
  getMetadata: () => [metadata],
};
```

The package root exports proposals at every maturity stage. Read each export's JSDoc before adopting it: Proposed Standards may change, Draft Standards have implementation feedback, and Finalized Standards have stable interoperable releases.
