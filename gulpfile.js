import gulpPkg from "gulp";
const { src, dest, watch, series } = gulpPkg;
import clean from "gulp-clean";

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

const image = (cb) => {
    src("./src/images/*").pipe(dest("./static/images"));
    cb();
};

const cleanJs = (cb) => {
    src("./static/js/*.js").pipe(clean({ read: false }));
    cb();
};
const cleanCss = (cb) => {
    src("./static/css/*.js").pipe(clean({ read: false }));
    cb();
};

const watchFiles = () => {
    watch("./src/js/**/*.js", cleanJs);
    watch("./src/sass/**/*.scss", cleanCss);

    watch("./src/js/**/*.js", js);
    watch("./src/images/*", image);
    watch("./src/sass/**/*.scss", css);
};

export default series(js, css, image, watchFiles);
// export default series(js, css, image, watchFiles);
