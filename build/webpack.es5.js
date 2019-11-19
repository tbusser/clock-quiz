const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	entry: ['./src/js/main.js'],
	output: {
		filename: 'bundle.es5.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									debug: false,
									useBuiltIns: 'usage',
									corejs: 3
								}
							]
						]
					}
				}
			}
		]
	}
});
