import type { Plugin } from "esbuild";
import { defineConfig } from "tsup";

/**
 * Substitui `import.meta.url` por equivalente CJS no bundle.
 * O client gerado pelo Prisma usa import.meta.url (ESM); em CJS isso é undefined
 * e causa: ERR_INVALID_ARG_TYPE em fileURLToPath(undefined).
 */
const importMetaUrlCjsPlugin: Plugin = {
	name: "import-meta-url-cjs",
	setup(build) {
		build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
			const fs = await import("node:fs");
			const contents = await fs.promises.readFile(args.path, "utf-8");
			if (!contents.includes("import.meta.url")) return null;

			const cjsUrl =
				"require('node:url').pathToFileURL(__filename).href";
			const newContents = contents.replace(
				/\bimport\.meta\.url\b/g,
				cjsUrl,
			);
			return {
				contents: newContents,
				loader: args.path.endsWith(".ts") ? "ts" : "js",
			};
		});
	},
};

export default defineConfig({
	entry: ["src/server.ts"],
	format: ["cjs"],
	esbuildPlugins: [importMetaUrlCjsPlugin],
});
