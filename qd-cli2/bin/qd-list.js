#!/usr/bin/env node

/**
 * 1.获取模板
 * 2.显示模板列表基本信息
 */
const env = require("../src/env");
const logger = require("../src/logger");
const chalk = require("chalk");
const success = logger.success;
/**
 * 获取所有的模板，这里可以通过接口获取
 */
function fetchTemplates() {
  return new Promise(function (resolve, reject) {
    resolve(env["template_list"]);
  });
}

success("await ... getting network data");
fetchTemplates()
  .then(function (data) {
    success("Available official templates:");
    console.log();
    data.forEach(function (repo) {
      const timeShow = repo.pushed_at || repo.created_at;
      console.log(
        " " +
          chalk.yellow("★") +
          " " +
          chalk.blue(repo.name) +
          " - " +
          repo.description
      );
      console.log("     " + chalk.green("- pushed at : ") + "" + timeShow);
      console.log();
    });
    success("done");
  })
  .catch();
