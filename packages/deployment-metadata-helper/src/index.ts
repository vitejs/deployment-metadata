import type { DeploymentParticipant } from "@vitejs/deployment-metadata-types";
import type { Plugin, PluginOption, ResolvedConfig, UserConfig } from "vite";

const deploymentMetadataApi = "vite/deploymentMetadata";

export function defineDeploymentParticipant(
  participant: DeploymentParticipant,
): DeploymentParticipant {
  return participant;
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

export async function getViteDeploymentParticipants(
  config: UserConfig | ResolvedConfig,
): Promise<DeploymentParticipant[]> {
  const plugins = await resolvePlugins(config.plugins ?? []);

  return plugins.flatMap((plugin) => {
    const participant = plugin.api?.[deploymentMetadataApi] as DeploymentParticipant | undefined;
    return participant === undefined ? [] : [participant];
  });
}
