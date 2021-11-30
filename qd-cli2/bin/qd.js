#!/usr/bin/env node

const program = require('commander');
const package = require('../package.json');

program
  .version(package.version)
  .usage('<command> [options]')
  .command('init','根据模板创建一个项目')
  .command('list', '列出所有的模板')
  .command('search', 'search the specified tesla for modules')
  .parse(process.argv)
