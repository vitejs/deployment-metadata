import { readFile } from "node:fs/promises";
import fs from "node:fs";
import { describe, expect, test } from "vitest";

const read = (path: string) => readFile(path, "utf8");

describe("canonical metadata proposals", () => {
  test.each([
    ["metadata/draft", "Draft Standard", "DS"],
    ["metadata/proposed", "Proposed Standard", "PS"],
    ["metadata/standard", "Finalized Standard", "FS"],
  ])("%s has a spec and stage-tagged declarations", async (directory, stage, stageCode) => {
    for (const dir of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      const id = dir.name;
      const path = `${directory}/${id}`;

      const spec = await read(`${path}/spec.md`);
      const types = await read(`${path}/types.d.ts`);

      for (const heading of ["# Summary", "# Basic example", "# Motivation", "# Detailed design"]) {
        expect(spec).toContain(heading);
      }

      const exports = [...types.matchAll(/export (?:interface|type) (\w+)/g)];
      expect(exports.length).toBeGreaterThan(0);
      for (const entry of exports) {
        const declarationEnd = entry.index ?? 0;
        const prefix = types.slice(0, declarationEnd);
        const commentStart = prefix.lastIndexOf("/**");
        const comment = prefix.slice(commentStart);
        const maturityTag = `**${id} — ${stage} (${stageCode}).**`;
        expect(comment).toContain(maturityTag);
        expect(comment.slice(comment.indexOf(maturityTag))).toBe(`${maturityTag}\n */\n`);
      }
    }
  });
});
