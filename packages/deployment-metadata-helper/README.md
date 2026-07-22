# `@vitejs/deployment-metadata-helper`

Advertise and discover raw deployment metadata participants in Vite 8.

```ts
import {
  defineDeploymentParticipant,
  getViteDeploymentParticipants,
} from "@vitejs/deployment-metadata-helper";
import type { Plugin } from "vite";

export function provider(): Plugin {
  return {
    name: "provider",
    api: {
      "vite/deploymentMetadata": defineDeploymentParticipant({
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
      const participants = await getViteDeploymentParticipants(config);
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
