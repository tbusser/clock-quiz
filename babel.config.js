module.exports = {
	presets: ['@babel/preset-env'],
	plugins: [
		// Needed for async/await support in the unit tests
		"@babel/plugin-transform-runtime"
	],
	env: {
		coverage: {
			plugins: [
				"istanbul"
			]
		}
	}
};
