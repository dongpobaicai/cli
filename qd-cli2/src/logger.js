const chalk = require('chalk');
const util = require('util');
const format = util.format;

const sep = chalk.gray('·');

function fail(){
  const msg = format.apply(format,arguments);
  console.error(chalk.red('   error：'),sep,msg);
  process.exit(1);
}

function success(){
  const msg = format.apply(format,arguments);
  console.log(chalk.green('   success：'),sep,msg);
}

function warn(){
  const msg = format.apply(format,arguments);
  console.log(chalk.yellow('   warn：'),sep,msg);
}

function bad(){
  const msg = format.apply(format,arguments);
  console.log(chalk.red('   bad：'),sep,msg);
}

function message(repo) {
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
}

module.exports = {
  fail: fail,
  success: success,
  warn: warn,
  bad: bad,
  message: message,
};
