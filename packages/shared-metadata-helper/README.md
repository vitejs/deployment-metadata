# `@vitejs/shared-metadata-helper`

Advertise and discover raw shared metadata participants in Vite 8.

```ts
import { DeploymentParticipant } from "@vitejs/deployment-metadata-types";
import { createSharedMetadataHelpers } from "@vitejs/shared-metadata-helper";
import type { Plugin } from "vite";

const {
  defineSharedMetadataParticipant: defineDeploymentParticipant,
  getSharedMetadataParticipants: getDeploymentParticipants,
} = createSharedMetadataHelpers<DeploymentParticipant>("vite/deploymentMetadata");

export function provider(): Plugin {
  return {
    name: "provider",
    api: {
      ...defineDeploymentParticipant({
        id: "@example/provider",
        getMetadata: () => [],
      }),
    },
  };
}

export function consumer(): Plugin {
  return {
    name: "consumer",
    async config(config) {
      const participants = await getDeploymentParticipants(config);
      for (const participant of participants) {
        const metadata = await participant.getMetadata();
        // Interpret only recognized kind/version pairs.
        void metadata;
      }
    },
  };
}
```

Discovery accepts `UserConfig` or `ResolvedConfig`, preserves plugin order, and returns every participant unchanged. It does not invoke metadata producers, deduplicate IDs, select a provider, or apply metadata to requests.
