const path = require("path");

module.exports = {
	mode:"production",
	entry:"./src/server.ts",
	target:"node",
	output: {
		path: path.join(__dirname, 'dist'),
		filename: "index.js"
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		rules: [{
			test: /\.tsx?/,
			use: "ts-loader",
			exclude: /node_modules/
		}]
	}
}
