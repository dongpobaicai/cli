#!/usr/bin/env node
const commander = require("commander");
const chalk = require("chalk");

const logger = require("../src/logger.js");
const fail = logger.fail;
const success = logger.success;
const message = logger.message;

const env = require("../src/env.js");

commander.usage("<module-name>");
commander.on("--help", function () {
  console.log();
  console.log("  <module-name>:" + chalk.green("   模板项目名称"));
  console.log();
});

// 如果没有参数，则显示帮助
function help() {
  commander.parse(process.argv);
  if (commander.args.length < 1) {
    return commander.help();
  }
}
help();

// 用户输入的模块名称
let moduleName = commander.args[0];
let moduleAlias = Object.keys(env.moduleNameMap);
// 判断是否在模板列表里
if (moduleAlias.indexOf(moduleName) > -1) {
  message(env.moduleNameMap[moduleName]);
} else {
  fail("没有找到你希望的模板");
}
