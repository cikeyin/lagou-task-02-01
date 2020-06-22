// 实现这个项目的构建任务
// gulp的文件操作api比nodejs中提供的更强大
// 构建就是读取流-转换流-写入流的过程
const { src, dest, series, parallel, watch } = require("gulp");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const swig = require("gulp-swig");
const imagemin = require("gulp-imagemin");

// 自动加载所有gulp插件
// const loadPlugins = require('gulp-load-plugins')
// const plugins = loadPlugins()

// web服务器
const browserSync = require("browser-sync");
const bs = browserSync.create();

const del = require("del");
const clean = () => {
  return del(["dist"]);
};

const style = () => {
  //  base使输出目录与输入目录一致
  return (
    src("src/assets/styles/*.scss", { base: "src" })
      .pipe(cleanCss())
      // .pipe(sass({ outputStyle: "expanded" }))
      .pipe(rename({ extname: ".min.css" }))
      .pipe(dest("dist"))
  );
};

const script = () => {
  //  base使输出目录与输入目录一致
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("dist"));
};

const page = () => {
  //  base使输出目录与输入目录一致
  return src("src/**/*.html", { base: "src" })
    .pipe(swig({ data: { title: "xl gulp project" }, cache: false }))
    .pipe(dest("dist"));
};

const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(imagemin())
    .pipe(dest("dist"));
};

const font = () => {
  return src("src/assets/fonts/**", { base: "src" }).pipe(dest("dist"));
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/**/*.html", page);

  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );
  bs.init({
    notify: false,
    open: true,
    files: "dist/**", //监听文件
    server: {
      baseDir: ["dist", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const compile = parallel(style, script, page);
const build = series(clean, parallel(compile, image, font, extra));
const start = series(compile, serve);
module.exports = {
  clean,
  compile,
  build,
  serve,
  start,
};
