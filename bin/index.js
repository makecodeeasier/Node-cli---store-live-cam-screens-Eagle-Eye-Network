#!/usr/bin/env node

const app = require('commander');
const chalk = require('chalk');

const aboutCommand = require('./commands/about');
const getImagesCommand = require('./commands/images');



app.command('about')
    .alias('a')
    .description('Displays information about this project')
    .action(() => aboutCommand());

app.command('get')
    .alias('g')
    .description('Get images from random 20 cameras and store them on disk in `images` folder.\n')
    .action(() => getImagesCommand());

app.on('command:*', () => {
    console.error(chalk.red('Invalid command: ', app.args.join(' ')) + '\n');
    console.error(chalk.red('See --help for a list of available commands.') + '\n');
    process.exit(1);
});

if (!process.argv.slice(2).length) {
    console.warn(chalk.yellow('No command specified!' + '\n'));
    app.outputHelp(help => chalk.yellow(help));
    process.exit(1);
}


app.parse(process.argv);