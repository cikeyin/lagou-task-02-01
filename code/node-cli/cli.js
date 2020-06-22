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
