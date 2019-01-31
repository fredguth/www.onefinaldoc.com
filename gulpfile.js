#
# Gulpfile with:
#
# - Slim
# - Sass
# - Browsersync
# - CSS and HTML compression
#
# Install dependencies:
#
#   $ npm install gulp gulp-concat gulp-uglify event-stream gulp-sass gulp-cssmin browser-sync gulp-util gulp-shell
#
# Then start developing:
#
#   $ gulp
#

gulp        = require 'gulp'
concat      = require 'gulp-concat'
es          = require('event-stream')
sass        = require 'gulp-sass'
uglify      = require 'gulp-uglify'
streamqueue = require 'streamqueue' # Preserves file order (vendor...)
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

# Compile Slim
gulp.task 'slim', ->
  gulp.src(sources.html)
    .pipe(shell(["slimrb -r ./lib/helpers.rb -p <%= file.path %> > ./#{targets.html}/<%= file.relative.replace(\".slim\", \".html\") %>"]))

# Compile CSS
gulp.task 'css', ->
  stream = streamqueue(objectMode: true)
  # Vendor files
  stream.queue(gulp.src(sources.css))
  # App files
  stream.queue(gulp.src(sources.sass).pipe(sass(style: 'expanded', includePaths: ['src/css'], errLogToConsole: true)))
  stream.done()
    .pipe(concat("all.css"))
    .pipe(if isProd then uglify() else gutil.noop())
    .pipe(gulp.dest(targets.css))

# Reload browser
gulp.task 'server', ->
  browserSync.init null,
    open: true
    server:
      baseDir: targets.html
    reloadDelay: 2000 # Prevent white screen of death
    watchOptions:
      debounceDelay: 1000

# Watch files for changes
gulp.task 'watch', ->
  gulp.watch sources.js, ['js']
  gulp.watch sources.css, ['css']
  gulp.watch sources.html, ['slim']
  gulp.watch 'www/**/**', (file) ->
    browserSync.reload(file.path) if file.type is "changed"

# Build everything
gulp.task 'build', ['lint', 'js', 'css', 'slim']

# Start a server and watch for file changes
gulp.task 'default', ['watch', 'server']
