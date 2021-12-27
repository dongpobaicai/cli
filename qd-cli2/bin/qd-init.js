#!/usr/bin/env node
const commander = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const home = require("user-home"); // 获取当前用户目录
const rm = require("rimraf"); // 删除文件目录
const ora = require("ora");
const donwloadRepo = require("download-git-repo");
const Metalsmith = require("metalsmith");
const Handlebars = require("handlebars");

const path = require("path");
const fs = require("fs");

const logger = require("../src/logger.js");
const util = require("../src/util");
const env = require("../src/env");

const success = logger.success;
const fail = logger.fail;
const isLocalPath = util.isLocalPath;
const getTemplatePath = util.getTemplatePath;

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

let template = commander.args[0];
let project = commander.args[1];
let project_path = path.resolve(project || ".");

let _arr = template.split("@");
let version = "";
if (_arr.length > 1) {
  version = `@${_arr[1]}`;
}
let cachePath = path.join(home, ".qd-templates", template.replace(/\//g, "-"));
// 兼容不填项目名称情况
let project_name =
  !project || project === "." ? path.relative("../", process.cwd()) : project;

if (fs.existsSync(project_path)) {
  // 如果存在目录
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "cover",
        message: "当前目录已存在，是否覆盖当前文件夹？",
        default: true,
      },
    ])
    .then((answers) => {
      if (answers.cover) {
        rm(project_path, function (err) {
          if (err) {
            fail(
              "Failed to rm -rf localhost repo " +
                template +
                ": " +
                JSON.stringify(err)
            );
            return;
          }
          create();
        });
      } else {
        success("done");
      }
    });
} else {
  create();
}

/**
 * 创建项目
 */
function create() {
  if (!env.moduleNameMap[template]) {
    fail("模板 " + template + " 不存在");
    return false;
  }
  if (fs.existsSync(cachePath)) {
    rm(cachePath, function (err) {
      if (err) {
        fail(
          "Failed to rm -rf template cache " +
            cachePath +
            ": " +
            JSON.stringify(err)
        );
        return;
      }
      downloadHandler();
    });
  } else {
    downloadHandler();
  }
}

/**
 * 下载模板数据
 */
function downloadHandler() {
  let spinner = ora(`downloading template to path ${cachePath}`, cachePath);
  spinner.start();
  const templateInfo = env.moduleNameMap[template];
  donwloadRepo(templateInfo.web_url, cachePath, async function (err) {
    // 下载完成
    spinner.stop();
    if (!err) {
      // 开始复制项目
      try {
        const collectData = await collectProjectData();
        await createGenerateProject(
          project_name,
          cachePath,
          project_path,
          collectData
        );
      } catch (error) {
        fail("create fail " + error);
      }
    } else {
      fail("download template " + err);
    }
  });
}

/**
 * 收集项目基本信息
 */
function collectProjectData() {
  return new Promise(async function (resolve, reject) {
    try {
      const author = await new Promise(function (resolve, reject) {
        inquirer
          .prompt({
            type: "input",
            message: 'enter author, the default author is "dongpobaicai":',
            name: "author",
          })
          .then(function (answers) {
            resolve(answers.author || "dongpobaicai");
          });
      });
      const description = await new Promise(function (resolve, reject) {
        inquirer
          .prompt({
            type: "input",
            message:
              'enter description, the default description is "template and Vue.js project":',
            name: "description",
          })
          .then(function (answers) {
            resolve(answers.description || "template and Vue.js project");
          });
      });
      resolve({
        author,
        description,
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 创建项目
 * @returns
 */
function createGenerateProject(name, tmpPath, toPath, meta) {
  return new Promise(function (resolve, reject) {
    // 1. 获取模板数据
    const metalsmith = Metalsmith(tmpPath);
    const data = Object.assign(
      Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: toPath === process.cwd(),
        noEscape: true,
      }),
      meta
    );
    // 2. 创建项目
    metalsmith.use(renderTemplateFiles(data));
    metalsmith
      .clean(false)
      .source(".")
      .destination(toPath)
      .build(function (err, files) {
        resolve();
      });
  });
}

/**
 * 处理package.json   README.md
 */
function renderTemplateFiles(data) {
  return function (files, metalsmith, done) {
    const keys = Object.keys(files);
    keys.forEach(function (conf) {
      const str = files[conf].contents.toString();
      if ("package.json" === conf || "README.md" === conf) {
        if (/{{([^{}]+)}}/g.test(str)) {
          const compile = Handlebars.compile(str);
          const res = compile(data);
          files[conf].contents = new Buffer(res);
        }
      }
    });
    done();
  };
}
