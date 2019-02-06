"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const browserify = require("gulp-browserify");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const slim = require("gulp-slim");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./_site/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["./_site/assets/"]);
}

// Optimize Images
function images() {
  return gulp
    .src("./assets/images/**/*")
    .pipe(newer("./_site/assets/images"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./_site/assets/images"));
}

// CSS task
function css() {
  return gulp
    .src("./assets/styles/**/*.sass")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./_site/assets/"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./_site/assets/"))
    .pipe(browsersync.stream());
}

// Markup task
function html() {
  return gulp
    .src("./assets/views/**/*.slim")
    .pipe(plumber())
    .pipe(slim({ pretty: true }))
    .pipe(gulp.dest("./_site/"))
    .pipe(browsersync.stream());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
    .src(["./assets/scripts/**/*.js"])
    .pipe(plumber())
    .pipe(gulp.dest("./_site/assets/"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./assets/views/**/*", html);
  gulp.watch("./assets/styles/**/*", css);
  gulp.watch("./assets/images/**/*", images);
  gulp.watch("./assets/scripts/**/*", scripts);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(html, css, images, scripts));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.html = html;
exports.css = css;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
