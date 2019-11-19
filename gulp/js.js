module.exports = function task(gulp, config, plugins) {
	const webpack = require('webpack-stream');

	gulp.task('build:js:es6', function buildProdTask() {
		return gulp
			.src(`${config.src.js}**/*.js`)
			.pipe(plugins.plumber())
			.pipe(webpack(require('../build/webpack.es6.js')))
			.pipe(gulp.dest(config.output.js));
	});

	gulp.task('build:js:es5', function buildProdTask() {
		return gulp
			.src(`${config.src.js}**/*.js`)
			.pipe(plugins.plumber())
			.pipe(webpack(require('../build/webpack.es5.js')))
			.pipe(gulp.dest(config.output.js));
	});

	gulp.task('build:js:dev', function buildDevTask() {
		return gulp
			.src(`${config.src.js}**/*.js`)
			.pipe(plugins.plumber())
			.pipe(webpack(require('../build/webpack.dev.js')))
			.pipe(gulp.dest(config.output.js));
	});

	gulp.task('build:js', function buildTask(taskReady) {
		if (config.production) {
			gulp.series('build:js:es5', 'build:js:es6')(taskReady);
		} else {
			gulp.series('build:js:dev')(taskReady);
		}
	});

	gulp.task('watch:js', function watchTask() {
		gulp.watch([`${config.src.js}**/*.js`, `!${config.src.js}**/*.test.js`], gulp.series('build:js'));
	});
};
