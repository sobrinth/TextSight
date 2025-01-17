import autoprefixer from "autoprefixer";
import builtins from "builtin-modules";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import process from "process";
import sveltePreprocess from "svelte-preprocess";

////////////////////////////////////////////////////////////////
// Custom plugin to handle various asset types before bundling
////////////////////////////////////////////////////////////////
import fs from 'fs';
import path from 'path';
const assetLoaderPlugin = {
  name: 'assetLoader',
  setup(build) {
    // Handle specific file extensions
    const extensions = /\.(hdr|png|jpg|glb|gltf|obj|svg)$/;

    build.onResolve({ filter: extensions }, args => {
      return { path: path.resolve(args.resolveDir, args.path), namespace: 'file-to-base64' };
    });

    build.onLoad({ filter: /.*/, namespace: 'file-to-base64' }, async (args) => {
      const buffer = await fs.promises.readFile(args.path);
      const mimeType = determineMimeType(args.path);
      const base64 = buffer.toString('base64');
      return {
        contents: `export default "data:${mimeType};base64,${base64}"`,
        loader: 'js',
      };
    });
  },
};

function determineMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.hdr':
      return 'image/vnd.radiance';
    case '.png':
      return 'image/png';
    case '.svg':
      return 'image/svg+xml';
    case '.jpg': case '.jpeg':
      return 'image/jpeg';
    case '.glb':
      return 'model/gltf-binary';
    case '.gltf':
      return 'model/gltf+json';
    case '.obj':
      return 'model/obj';
    default:
      return 'application/octet-stream';
  }
}


const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
        js: banner,
    },
    entryPoints: ["main.ts"],
    bundle: true, 
    plugins: [
        esbuildSvelte({
            compilerOptions: { css: "injected" },
            preprocess: sveltePreprocess({
                typescript: true,
                scss: {
                    includePaths: ['components/styles', 'components'],
                },
                postcss: {
                    plugins: [
                        autoprefixer(),
                    ],
                },
            }),
        }),
        assetLoaderPlugin, //Loader plugin
    ],    
    external: [
        "obsidian",
        "electron",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        ...builtins
    ],
    format: "cjs",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    outfile: "main.js",
    conditions: ['svelte'],
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}

