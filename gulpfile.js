var gulp = require('gulp');
var ionicChannels = require('gulp-ionic-channels');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');
var exec = require('child_process').exec;

gulp.task('config', function() {
  var env = 'development';
  if(process.env.PARTI_ENV) {
    var env = process.env.PARTI_ENV;
    console.log("Parti Environment: " + env);
  }

  var partiConfig = require('./config.json');
  var envConfig = partiConfig[process.env];

  gulp.src('./config.json')
  .pipe(ionicChannels({
    channelTag: env
  }))
  .pipe(ngConstant({
    templatePath: 'constant.tpl.ejs',
    wrap: false
  }))
  .pipe(rename('constant.ts'))
  .pipe(gulp.dest('src/config'));
});

gulp.task('reset', ['config'], function() {
  exec('ionic state reset', function (err, stdout, stderr) {
    console.log(err);
    console.log(stdout);
    console.log(stderr);
  });
});
