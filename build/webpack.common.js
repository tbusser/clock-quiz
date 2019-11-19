const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/js/main.js',
	output: {
		// options related to how webpack emits results
		path: path.resolve(__dirname, './dist'), // string
		// the target directory for all output files
		// must be an absolute path (use the Node.js path module)
		filename: 'bundle.js' // string
	}
};
