const gulp = require("gulp");
const concatenate = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const autoPrefix = require("gulp-autoprefixer");
const gulpSASS = require("gulp-sass");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const imgaemin = require("gulp-imagemin");
const sassFiles = [
  "./src/styles/variables.scss",
  "./src/styles/custom.scss",
  "./node_modules/bootstrap/dist/css/bootstrap.css"
];

const vendorJsFiles = [
//   "./node_modules/tether/dist/js/tether.min.js",
  "./node_modules/bootstrap/dist/js/bootstrap.js"
];


gulp.task("sass", (done) => {
  gulp
    .src(sassFiles)
    .pipe(gulpSASS())
    .pipe(concatenate("styles.css"))
    .pipe(gulp.dest("./public/css/"))
    .pipe(
      autoPrefix({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cleanCSS())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("./public/css/"));
    done();
});

gulp.task("js:vendor", (done) => {
  gulp
    .src(vendorJsFiles)
    .pipe(uglify())
    .pipe(concatenate("vendor.min.js"))
    .pipe(gulp.dest("./public/js/"));
    done();
});

gulp.task("images", (done) => {
    gulp
      .src("src/images/*.jpg")
      .pipe(imgaemin())
      .pipe(gulp.dest("./public/images/"));
      done();
  });

gulp.task("build", gulp.parallel(["sass", "js:vendor","images"]));

gulp.task("watch", (done) => {
  gulp.watch(sassFiles, gulp.series("sass"));
  gulp.watch(vendorJsFiles, gulp.series("js:vendor"));
  done();
});

gulp.task("default", gulp.series("watch"));