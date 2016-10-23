var gulp = require('gulp');
var exec = require('child_process').exec;
var yaml = require('js-yaml');
var fs = require('fs');
var _ = require('lodash');
var template = require('gulp-template');
var ext = require('gulp-ext');
var haml = require('gulp-ruby-haml');
var watch = require('gulp-watch');

gulp.task('build-haml', function(done) {
  gulp.src('./src/pages/**/*.html.haml')
    .pipe(haml().on('error', function(e) { console.log(e.message); }))
    .pipe(ext.crop())
    .pipe(gulp.dest('./src/pages'))
    .on('end', done);
});

gulp.task('watch-haml', [ 'build-haml' ], function() {
  watch([ './src/**/*.haml' ], function() { gulp.start('build-haml'); });
});

gulp.task('config', function() {
  var env = 'development';
  if(process.env.PARTI_ENV) {
    env = process.env.PARTI_ENV;
    console.log("Parti Environment: " + env);
  }

  let postfixProxy = '-proxy';
  var useProxy = false;
  if(env.endsWith(postfixProxy)) {
    useProxy = true;
    env = env.replace(postfixProxy,'');
  }

  let constants = yaml.safeLoad(fs.readFileSync('./settings/config.yml', 'utf-8'))[env];
  constants.env = env;
  gulp.src('./settings/templates/**/*.tpl')
    .pipe(template({constants: constants, useProxy: useProxy}))
    .pipe(ext.crop())
    .pipe(gulp.dest("./"));
});

gulp.task('reset', ['config'], function() {
  exec('ionic state reset', function (err, stdout, stderr) {
    console.log(err);
    console.log(stdout);
    console.log(stderr);
  });
});
