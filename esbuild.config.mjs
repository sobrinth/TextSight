import autoprefixer from "autoprefixer";
import builtins from "builtin-modules";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import process from "process";
import sveltePreprocess from "svelte-preprocess";

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
                scss: {
                    includePaths: ['components/styles', 'components'],
                },
                postcss: {
                    plugins: [autoprefixer()],
                },
            }),
        }),
        // Define or import your postcssPlugin correctly if needed
        postcssPlugin({
            plugins: [autoprefixer()],
        }),
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