##### 一、简答题

###### 1. 谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。

答：前端工程本质上是软件工程的一种，软件工程关注的是可用性、稳定性、性能、可维护性等，注重开发效率、运行效率和维护效率，一切以提高以上内容为目标的工作都是“工程化”。工程化是一种思想而不是某种技术。
前端工程说的是从搭建、开发、构建、测试到部署上线再到后期迭代维护整个过程，**前端工程化**则是从工程的角度管理前端开发，从模块化、组件化、规范化、自动化四个方面考虑，形成前端开发流程的一整套规范。前端工程化的**目的**是提高前端开发效率、提高运行效率、提高可扩展性、提高可维护性。

###### 2.你认为脚手架除了为我们创建项目结构，还有什么更深的意义?

答：脚手架是前端工程化的一部分，使用脚手架有以下好处。

-   提供了统一的项目结构和代码书写规范，有利于协同开发和后续的维护；
-   通过命令行工具创建项目减少了复制粘贴文件的重复性工作，提高了开发效率；
-   可以交互动态生成项目结构和配置文件。

##### 二、编程题

###### 1. 概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具

答：脚手架实现过程：
(1) 通过命令行交互询问用户问题
(2) 根据用户回答的结果生成文件

```javascript
#!/usr/bin/env node

// Node CLI应用入口文件必须要有这个文件头
// 搭建脚手架
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const ejs = require("ejs");

inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "Project name?",
        },
    ])
    .then((answers) => {
        // console.log(answers)
        // 模板目录
        const tmplDir = path.join(__dirname, "templates");
        // 目标目录
        const destDir = process.cwd();

        // 将模板下的文件转换到目标目录
        fs.readdir(tmplDir, (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                // 通过模板引擎渲染文件
                ejs.renderFile(
                    path.join(tmplDir, file),
                    answers,
                    (err, result) => {
                        if (err) throw err;
                        fs.writeFileSync(path.join(destDir, file), result);
                    }
                );
            });
        });
    });
```

###### 2. 尝试使用 Gulp 完成项目的自动化构建

```javascript
// 使用grunt插件进行构建
const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");
module.exports = (grunt) => {
    grunt.initConfig({
        clean: {
            // 使用**通配符可删除所有文件夹和文件
            temp: "dist/**",
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true,
            },
            main: {
                files: {
                    // 输出文件路径：出入文件路径
                    "dist/styles/main.css": "src/assets/styles/main.scss",
                },
            },
        },
        babel: {
            options: {
                presets: ["@babel/preset-env"],
                sourceMap: true,
            },
            main: {
                files: {
                    "dist/scripts/main.js": "src/assets/scripts/main.js",
                },
            },
        },
        // 添加了grunt-contrib-watch插件
        watch: {
            js: {
                files: ["src/**/*.js"],
                tasks: ["babel"],
            },
            css: {
                files: ["src/**/*.scss"],
                tasks: ["sass"],
            },
        },
    });

    // 通过load-grunt-tasks插件可以自动加载所有的grunt插件中的任务
    loadGruntTasks(grunt);
    grunt.registerTask("default", ["sass", "babel", "watch"]);
};
```

###### 3. 使用 Grunt 完成项目的自动化构建

```javascript
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
    return src("src/assets/styles/*.scss", { base: "src" })
        .pipe(cleanCss())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(dest("dist"));
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
```
