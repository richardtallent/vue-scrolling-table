import vue from "@vitejs/plugin-vue"
import typescript from "rollup-plugin-typescript2"
const path = require("path")

module.exports = {
	plugins: [vue()],
	build: {
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, "lib/main.ts"),
			name: "VueScrollingTable",
			esbuild: false,
		},
		rollupOptions: {
			plugins: [typescript()],
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
