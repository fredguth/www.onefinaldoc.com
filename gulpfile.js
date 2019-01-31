gulp        = require 'gulp'
concat      = require 'gulp-concat'
es          = require('event-stream')
sass        = require 'gulp-sass'
uglify      = require 'gulp-uglify'
streamqueue = require 'streamqueue'
gutil       = require 'gulp-util'
shell       = require 'gulp-shell'
cssmin      = require 'gulp-cssmin'
browserSync = require 'browser-sync'

isProd = gutil.env.type is 'prod'

sources =
  sass: 'src/css/**/*.sass'
  css: 'src/css/**/*.css'
  html: 'src/**/*.slim'
  js: 'src/js/**/*.js'

targets =
  css: 'www/css'
  html: 'www/'
  js: 'www/js'

gulp.task 'slim', ->
  gulp.src(sources.html)
    .pipe(shell(["slimrb -r ./lib/helpers.rb -p <%= file.path %> > .

gulp.task 'css', ->
  stream = streamqueue(objectMode: true)

  stream.queue(gulp.src(sources.css))

  stream.queue(gulp.src(sources.sass).pipe(sass(style: 'expanded', includePaths: ['src/css'], errLogToConsole: true)))
  stream.done()
    .pipe(concat("all.css"))
    .pipe(if isProd then uglify() else gutil.noop())
    .pipe(gulp.dest(targets.css))

gulp.task 'server', ->
  browserSync.init null,
    open: true
    server:
      baseDir: targets.html
    reloadDelay: 2000
    watchOptions:
      debounceDelay: 1000

gulp.task 'watch', ->
  gulp.watch sources.js, ['js']
  gulp.watch sources.css, ['css']
  gulp.watch sources.html, ['slim']
  gulp.watch 'www/**/**', (file) ->
    browserSync.reload(file.path) if file.type is "changed"

gulp.task 'build', ['lint', 'js', 'css', 'slim']

gulp.task 'default', ['watch', 'server']
