import vue from "@vitejs/plugin-vue"
const path = require("path")

module.exports = {
	plugins: [vue()],
	build: {
		cssCodeSplit: false,
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, "lib/main.js"),
			name: "VueScrollingTable",
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
