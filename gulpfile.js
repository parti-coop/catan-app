var gulp = require('gulp');
var exec = require('child_process').exec;
var yaml = require('js-yaml');
var fs = require('fs');
var _ = require('lodash');
var template = require('gulp-template');
var ext = require('gulp-ext');
var haml = require('gulp-ruby-haml');
var watch = require('gulp-watch');
var assign = require('assign-deep');

let getConfigVariables = function (file, enc) { // file and enc are optional in case you want to modify the file object
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

  let config = yaml.safeLoad(fs.readFileSync('./settings/config.yml', 'utf-8'))[env];
  let config_extends = yaml.safeLoad(fs.readFileSync('./settings/config-extends.yml', 'utf-8'))[env];
  let constants = assign(config, config_extends, {env: env});
  let secrets = yaml.safeLoad(fs.readFileSync('./settings/config-secrets.yml', 'utf-8'))[env];

  return {constants: constants, secrets: secrets, useProxy: useProxy};
}

gulp.task('build-haml', function() {
  gulp.src('./src/**/*.html.haml')
    .pipe(haml({trace: true}).on('error', function(e) { console.log(e.message); }))
    .pipe(ext.crop())
    .pipe(gulp.dest('./src'));
});

gulp.task('watch-haml', [ 'build-haml' ], function() {
  watch([ './src/**/*.haml' ], function() { gulp.start('build-haml'); });
});

gulp.task('watch-settings', function() {
  watch([ './settings/**/*' ], function() { gulp.start('settings'); });
});

gulp.task('settings', function() {
  gulp.src('./settings/templates/**/*.tpl')
    .pipe(template(getConfigVariables()))
    .pipe(ext.crop())
    .pipe(gulp.dest("./"));
});

gulp.task('reset', ['settings'], function() {
  let configVariables = getConfigVariables();
  var cmd = 'ionic state reset'
    + ' && '
    + 'ionic plugin add twitter-connect-plugin --variable FABRIC_KEY='
    + configVariables.secrets.fabricKey
    + ' && '
    + `cp -rf ./settings/resources/google-services.${configVariables.constants.env}.json ./platforms/android/google-services.json`
    + ' && '
    + 'ionic plugin add https://github.com/taejaehan/cordova-kakaotalk.git --variable KAKAO_APP_KEY='
    + configVariables.constants.kakaoKey;
  if(!configVariables.useProxy) {
    cmd = cmd
      + ' && '
      + 'ionic plugin add cordova-plugin-crosswalk-webview';
  }
  exec(cmd, function (err, stdout, stderr) {
    console.log(err);
    console.log(stdout);
    console.log(stderr);
  });
});
