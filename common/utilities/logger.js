const chalk = require('chalk');

const log = function(msg, type) {

  let formatted;

  switch (type) {
    case 'error':
      formatted = chalk.red(chalk.underline.bgBlue(msg));
      break;
    case 'log':
      formatted = chalk.green(msg);
      break;
    case 'warn':
      formatted = chalk.orange(chalk.underline.bgBlue(msg));
      break;
    case 'info':
      formatted = chalk.blue(msg);
      break;
  }

  console.log(formatted);
};

module.exports = log;
