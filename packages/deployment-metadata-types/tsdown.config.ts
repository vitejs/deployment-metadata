import { defineConfig } from "tsdown";

const selfMetadataMapAugmentation =
  /^declare module "@vitejs\/deployment-metadata-types" \{\r?\n  interface DeploymentMetadataMap \{\r?\n([\s\S]*?)^  \}\r?\n^\}/gm;
const moduleAugmentation = /(?:^|[;}])\s*declare\s+module\s+["'][^"']+["']\s*\{/m;

export function flattenDeploymentMetadataMapAugmentation(code: string): string {
  const transformed = code.replace(selfMetadataMapAugmentation, (_match, members: string) => {
    return `interface DeploymentMetadataMap {\n${members.replace(/^  /gm, "")}}`;
  });

  if (moduleAugmentation.test(transformed)) {
    throw new Error("Unhandled module augmentation in declaration output");
  }

  return transformed;
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  fixedExtension: false,
  dts: true,
  clean: true,
  plugins: [
    {
      name: "flatten-deployment-metadata-map-augmentation",
      renderChunk: {
        order: "post",
        handler(code, chunk) {
          if (!/\.d\.[cm]?ts$/.test(chunk.fileName)) return;

          const transformed = flattenDeploymentMetadataMapAugmentation(code);
          if (transformed !== code) return transformed;
        },
      },
    },
  ],
});
