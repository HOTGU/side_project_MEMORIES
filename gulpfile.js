import gulpPkg from "gulp";
const { src, dest, watch, series } = gulpPkg;

import defaultSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(defaultSass);

import babel from "gulp-babel";
import uglify from "gulp-uglify";

const css = (cb) => {
    src("./src/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./static/css"));
    cb();
};

const js = (cb) => {
    src("./src/js/**/*.js").pipe(babel()).pipe(uglify()).pipe(dest("./static/js"));
    cb();
};

const watchFiles = () => {
    watch("./src/js/**/*.js", js);
    watch("./src/sass/**/*.scss", css);
};

export default series(js, css, watchFiles);
