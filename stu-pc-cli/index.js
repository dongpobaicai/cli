#!/usr/bin/env node
// 命令行解析工具
var program = require('commander');
var version = require('./package').version;
var { helloSuggest } = require('./suggest.js')
var publishEvent = require('./publish')


helloSuggest()
program.version(version, '-v, --version')
program.command('publish').description('打包发布').action((cmd, options) => {
  // 找寻当前可发布项目
  // 获取选择参数
  publishEvent()
})

program.parse(process.argv)