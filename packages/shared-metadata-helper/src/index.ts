import type { Plugin, PluginOption, ResolvedConfig, UserConfig } from "vite";

export type SharedMetadataHelpers<Participant> = {
  defineSharedMetadataParticipant: (participant: Participant) => { [key: string]: Participant };
  getSharedMetadataParticipants: (config: UserConfig | ResolvedConfig) => Promise<Participant[]>;
};

export function createSharedMetadataHelpers<Participant>(
  schemaKey: string,
): SharedMetadataHelpers<Participant> {
  return {
    defineSharedMetadataParticipant: (participant) => ({ [schemaKey]: participant }),
    getSharedMetadataParticipants: async (config) => {
      const plugins = await resolvePlugins(config.plugins ?? []);

      return plugins.flatMap((plugin) => {
        const participant = plugin.api?.[schemaKey] as Participant | undefined;
        return participant === undefined ? [] : [participant];
      });
    },
  };
}

async function resolvePlugins(options: readonly PluginOption[]): Promise<Plugin[]> {
  const plugins: Plugin[] = [];

  for (const option of options) {
    const resolved = await Promise.resolve(option);
    if (!resolved) continue;

    if (Array.isArray(resolved)) {
      plugins.push(...(await resolvePlugins(resolved)));
    } else {
      plugins.push(resolved);
    }
  }

  return plugins;
}
