// 发布
var inquirer = require("inquirer");
var process = require('process')
var fs = require('fs');
var util = require('util');
var path = require('path');
var { buildSuggest, buildSuccess } = require('./suggest.js')
var exec = util.promisify(require('child_process').exec);
var fileDir = process.cwd()

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

async function runPull(projectPath) {
  try {
    await exec("git pull", {
      cwd: projectPath,
    });
  } catch(err) {
    console.log('拉取代码失败，继续进行打包')
  }
}
async function runVersion(projectPath) {
  // 判断是否version文件
  var versionPath = path.join(projectPath, 'version.json')
  var res = fs.existsSync(versionPath)
  if (res) {
    var versionInfo = JSON.parse(fs.readFileSync(versionPath).toString())
    console.log(versionInfo.version)
  } else {

  }
}

async function runBuild(projectPath) {
  var buildCmd = 'npm run build'
  switch(answers.env) {
    case 'develop':
      break;
    case 'preview':
      buildCmd = 'npm run build:preview'
      break;
    case 'production':
      buildCmd = 'npm run build:prod'
      break;
  }
  buildSuggest()
  var result = await exec(buildCmd, {
    cwd: projectPath,
  });
  buildSuccess()
  console.log(result)
}

var beforePublish = () => {
  var dirNames = fs.readdirSync(fileDir)
  const question = [
    // 选择需要发布的项目
    {
      type: "autocomplete",
      name: "project",
      message: "选择想要打包的项目",
      source(answersSoFar, input) {
        if (input) {
          return Promise.resolve(dirNames.filter(dirName => dirName.startsWith(input)))
        }
        return dirNames
      }
    },
    // 选择打包环境
    {
      type: "list",
      name: "env",
      message: "选择想要环境",
      choices: ["develop", "preview", "production"],
    },
    // 设置名称
    {
      type: "confirm",
      name: "pull",
      message: "是否需要拉取代码",
      default: true,
    },
    {
      type: "confirm",
      name: 'version',
      message: "是否需要设置版本号",
      default: false
    }
  ];
  inquirer.prompt(question).then(async (answers) => {
    var projectPath = path.join(fileDir, answers.project)
    if (answers.pull) {
      await runPull(projectPath)
    }
    if (answers.version) {
      await runVersion(projectPath)
    }
    await runBuild(projectPath)
  });
};


module.exports = async function () {
  await beforePublish();
};
