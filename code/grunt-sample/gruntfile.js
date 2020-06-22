// 实现这个项目的构建任务
// 使用grunt插件进行构建
const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");
module.exports = (grunt) => {
  grunt.initConfig({
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

  //引用grunt-contrib-clean插件，清除文件；命令行中使用yarn grunt clean;需使用多任务模式
  // grunt.loadNpmTasks('grunt-contrib-clean')

  // 安装sass模块 yarn add grunt-sass sass --dev
  // grunt.loadNpmTasks('grunt-sass')

  // 安装babel模块 yarn add grunt-babel @babel/core  @babel/preset-env  --dev
  // grunt.loadNpmTasks('grunt-babel')

  // 通过load-grunt-tasks插件可以自动加载所有的grunt插件中的任务
  loadGruntTasks(grunt);
  grunt.registerTask("default", ["sass", "babel", "watch"]);
};
