import { describe, expect, test, vi } from "vitest";
import type { Plugin, ResolvedConfig, UserConfig } from "vite";
import { createSharedMetadataHelpers } from "../src/index.js";

type Participant = {
  id: string;
  getMetadata: () => unknown[];
};
const SCHEMA_KEY = "vite/deploymentMetadata";

const {
  defineSharedMetadataParticipant: defineDeploymentParticipant,
  getSharedMetadataParticipants: getDeploymentParticipants,
} = createSharedMetadataHelpers<Participant>(SCHEMA_KEY);

describe("defineSharedMetadataParticipant", () => {
  test("returns the original participant", () => {
    const participant = {
      id: "@example/provider",
      getMetadata: vi.fn(() => []),
    };

    expect(defineDeploymentParticipant(participant)).toEqual({ [SCHEMA_KEY]: participant });
  });
});

describe("getSharedMetadataParticipants", () => {
  test("returns participants in flat plugin order without resolving metadata", async () => {
    const getFirstMetadata = vi.fn(() => []);
    const first = defineDeploymentParticipant({
      id: "first",
      getMetadata: getFirstMetadata,
    });
    const getSecondMetadata = vi.fn(() => []);
    const second = defineDeploymentParticipant({
      id: "second",
      getMetadata: getSecondMetadata,
    });
    const config: UserConfig = {
      plugins: [
        { name: "unrelated" },
        { name: "first", api: first } as Plugin,
        {
          name: "second",
          api: second,
        } as Plugin,
      ],
    };

    await expect(getDeploymentParticipants(config)).resolves.toEqual([
      first[SCHEMA_KEY],
      second[SCHEMA_KEY],
    ]);
    expect(getFirstMetadata).not.toHaveBeenCalled();
    expect(getSecondMetadata).not.toHaveBeenCalled();
  });

  test("flattens promised, nested, and falsy UserConfig plugin options", async () => {
    const first = defineDeploymentParticipant({
      id: "first",
      getMetadata: () => [],
    });
    const second = defineDeploymentParticipant({
      id: "second",
      getMetadata: () => [],
    });
    const config: UserConfig = {
      plugins: [
        false,
        Promise.resolve([
          {
            name: "first",
            api: first,
          } as Plugin,
          [
            null,
            {
              name: "second",
              api: second,
            } as Plugin,
          ],
        ]),
      ],
    };

    await expect(getDeploymentParticipants(config)).resolves.toEqual([
      first[SCHEMA_KEY],
      second[SCHEMA_KEY],
    ]);
  });

  test("accepts an already-flat ResolvedConfig plugin list", async () => {
    const participant = defineDeploymentParticipant({
      id: "resolved",
      getMetadata: () => [],
    });
    const config = {
      plugins: [
        {
          name: "resolved",
          api: participant,
        },
      ],
    } as unknown as ResolvedConfig;

    await expect(getDeploymentParticipants(config)).resolves.toEqual([participant[SCHEMA_KEY]]);
  });

  test("preserves duplicate IDs and object identity", async () => {
    const first = defineDeploymentParticipant({
      id: "same",
      getMetadata: () => [],
    });
    const second = defineDeploymentParticipant({
      id: "same",
      getMetadata: () => [],
    });
    const config: UserConfig = {
      plugins: [
        { name: "first", api: first } as Plugin,
        {
          name: "second",
          api: second,
        } as Plugin,
      ],
    };

    const result = await getDeploymentParticipants(config);
    expect(result).toEqual([first[SCHEMA_KEY], second[SCHEMA_KEY]]);
    expect(result[0]).toBe(first[SCHEMA_KEY]);
    expect(result[1]).toBe(second[SCHEMA_KEY]);
  });

  test("propagates rejected plugin promises", async () => {
    const failure = new Error("plugin failed");
    const config: UserConfig = {
      plugins: [Promise.reject(failure)],
    };

    await expect(getDeploymentParticipants(config)).rejects.toBe(failure);
  });
});
