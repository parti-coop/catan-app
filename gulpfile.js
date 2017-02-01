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
var print = require('gulp-print');
var newer = require('gulp-newer');

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

let SRC_ROOT = './src';
let HAML_PATH = SRC_ROOT + '/**/*.html.haml'

gulp.task('build-haml', function() {
  gulp.src(HAML_PATH)
    .pipe(haml({trace: true})
      .on('error', function(e) { console.log(e.message); }))
    .pipe(ext.crop())
    .pipe(gulp.dest(SRC_ROOT));
});

gulp.task('watch-haml', [ 'build-haml' ], function() {
  watch([ HAML_PATH ],  function() {
    gulp.src(HAML_PATH)
      .pipe(newer({
        dest: SRC_ROOT,
        map: function(path) { return path.replace(".html.haml", ".html"); }
      }))
      .pipe(print(function(filepath) {
        return "processing: " + filepath;
      }))
      .pipe(haml({trace: true})
        .on('error', function(e) { console.log(e.message); }))
      .pipe(ext.crop())
      .pipe(gulp.dest(SRC_ROOT));
  });
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
  var cmd = 'npm install && ionic state reset'
    + ' && '
    + 'ionic plugin add twitter-connect-plugin --variable FABRIC_KEY='
    + configVariables.secrets.fabricKey
    + ' && '
    + `cp -rf ./settings/resources/google-services.${configVariables.constants.env}.json ./google-services.json`
    + ' && '
    + `cp -rf ./settings/resources/GoogleService-Info.${configVariables.constants.env}.plist ./GoogleService-Info.plist`
    + ' && '
    + 'ionic plugin add cordova-plugin-fcm'
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

gulp.task('run:before', ['build-haml']);
gulp.task('run:before', ['build-haml']);
