const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	output: {
		filename: 'bundle.es6.js'
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
									targets: {
										esmodules: true
									},
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
