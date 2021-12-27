#!/usr/bin/env node

/**
 * 1.获取模板
 * 2.显示模板列表基本信息
 */
const env = require("../src/env");
const logger = require("../src/logger");
const chalk = require("chalk");

/**
 * 获取所有的模板，这里可以通过接口获取
 */
function fetchTemplates() {
  return new Promise(function (resolve, reject) {
    resolve(env.moduleNameMap);
  });
}

fetchTemplates()
  .then(function (templateList) {
    const keys = Object.keys(templateList);
    keys.forEach((key) => {
      console.log(
        " " +
          chalk.yellow("★") +
          " " +
          chalk.blue(key) +
          " - " +
          env.moduleNameMap[key].description
      );
    });
  })
  .catch();
