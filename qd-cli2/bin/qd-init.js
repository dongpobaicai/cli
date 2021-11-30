#!/usr/bin/env node
const commander = require("commander");
const inquirer = require('inquirer');
const chalk = require("chalk");
const home = require('user-home');  // 获取当前用户目录
const path = require('path');
const fs = require('fs')

const logger = require("../src/logger.js");

const success = logger.success;
const fail = logger.fail;
// const isLocalPath = localPath.isLocalPath;
// const getTemplatePath = localPath.getTemplatePath;

// 设置命令接受的参数

commander
  .usage("<template-name> [project-name]")
  .option("--offline", "use cached template");

commander.on("--help", function () {
  console.log("  template-name:", chalk.green("   使用的模板名称"));
  console.log();
  console.log("  project-name:", chalk.green("   你想创建的项目名称"));
  console.log();
  console.log(
    "  for exmaple:",
    chalk.green("    $ qd init template my-project")
  );
  console.log();
});

function help() {
  commander.parse(process.argv);
  if (commander.args.length < 1) {
    return commander.help();
  }
}

help();

let template = commander.args[0]
let project = commander.args[1]
let project_path = path.resolve(project || '.');

let _arr = template.split('@');
let version = '';
if (_arr.length > 1) {
  version = `@${_arr[1]}`;
}
let cachePath = path.join(home, '.qd-templates', template.replace(/\//g, '-'));
// 兼容不填项目名称情况
let project_name = (!project || project === '.') ? path.relative('../', process.cwd()) : project;

console.log(project_name)

if (fs.existsSync(project_path)) {
  // 如果存在目录
  inquirer.prompt([{
    type: 'confirm',
    name: "cover",
    message: "当前目录已存在，是否覆盖当前文件夹？",
    default: true,
  }]).then(answers => {
    if (answers.cover) {
      create()
    } else {
      success('done')
    }
  })
} else {
  create()
}

/**
 * 创建项目
 */
function create() {

}