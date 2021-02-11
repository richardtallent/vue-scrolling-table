import vue from "@vitejs/plugin-vue"
import typescript from "rollup-plugin-typescript2"
const path = require("path")

module.exports = {
	// ESBuild doesn't emit typescript declarations, so use typescript2 instead
	plugins: [vue(), typescript()],
	esbuild: false,

	build: {
		sourcemap: false,
		lib: {
			entry: path.resolve(__dirname, "lib/main.ts"),
			name: "VueScrollingTable",
			manifest: true,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled into your library
			external: ["vue"],
			output: {
				// Provide global variables to use in the UMD build for externalized deps
				globals: {
					vue: "Vue",
				},
			},
		},
	},
}
