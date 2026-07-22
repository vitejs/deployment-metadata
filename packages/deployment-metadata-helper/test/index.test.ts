import { describe, expect, test, vi } from "vitest";
import type { Plugin, ResolvedConfig, UserConfig } from "vite";
import { defineDeploymentParticipant, getViteDeploymentParticipants } from "../src/index.js";

describe("defineDeploymentParticipant", () => {
  test("returns the original participant", () => {
    const participant = {
      id: "@example/provider",
      getMetadata: vi.fn(() => []),
    };

    expect(defineDeploymentParticipant(participant)).toBe(participant);
  });
});

describe("getViteDeploymentParticipants", () => {
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
        { name: "first", api: { "vite/deploymentMetadata": first } } as Plugin,
        {
          name: "second",
          api: { "vite/deploymentMetadata": second },
        } as Plugin,
      ],
    };

    await expect(getViteDeploymentParticipants(config)).resolves.toEqual([first, second]);
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
            api: { "vite/deploymentMetadata": first },
          } as Plugin,
          [
            null,
            {
              name: "second",
              api: { "vite/deploymentMetadata": second },
            } as Plugin,
          ],
        ]),
      ],
    };

    await expect(getViteDeploymentParticipants(config)).resolves.toEqual([first, second]);
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
          api: { "vite/deploymentMetadata": participant },
        },
      ],
    } as unknown as ResolvedConfig;

    await expect(getViteDeploymentParticipants(config)).resolves.toEqual([participant]);
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
        { name: "first", api: { "vite/deploymentMetadata": first } } as Plugin,
        {
          name: "second",
          api: { "vite/deploymentMetadata": second },
        } as Plugin,
      ],
    };

    const result = await getViteDeploymentParticipants(config);
    expect(result).toEqual([first, second]);
    expect(result[0]).toBe(first);
    expect(result[1]).toBe(second);
  });

  test("propagates rejected plugin promises", async () => {
    const failure = new Error("plugin failed");
    const config: UserConfig = {
      plugins: [Promise.reject(failure)],
    };

    await expect(getViteDeploymentParticipants(config)).rejects.toBe(failure);
  });
});
