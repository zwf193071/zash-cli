#!/usr/bin/env node

const path = require('path');
const Handlebars = require('handlebars');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora();
let lastMsg = null;

exports.formateTime = () => {
    const o = new Date();
    const yy = o.getFullYear();
    const mm = o.getMonth() + 1;
    const dd = o.getDate();
    const hh = o.getHours();
    const mi = o.getMinutes();
    const ss = o.getSeconds();
    return `${yy}-${mm < 10 ? '0' + mm : mm}-${dd} ${hh}:${mi}:${ss}`;
}

exports.getTemplate = name => {
    const filePath = path.join(__dirname, `../templates/${name}.handlebars`);
    if (!fs.existsSync(filePath)) {
        console.log(`getTemplate: file ${name} not found!`)
        return;
    }
    const source = fs.readFileSync(filePath, 'utf-8');
    return Handlebars.compile(source);
}

exports.insertStr = (start, oldStr, newStr) => {
    return oldStr.slice(0, start) + newStr + oldStr.slice(start);
}

exports.logWithSpinner = (symbol, msg) => {
    if (!msg) {
        msg = symbol
        symbol = chalk.green('✔')
    }
    if (lastMsg) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        })
    }
    spinner.text = ' ' + msg
    lastMsg = {
        symbol: symbol + ' ',
        text: msg
    }
    spinner.start()
}
exports.stopSpinner = (persist) => {
    if (lastMsg && persist !== false) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        })
    } else {
        spinner.stop()
    }
    lastMsg = null
}

exports.errorExit = (message) => {
    console.error(chalk.bgRed('\n ERROR ') + chalk.white(message));
    process.exit(1);
}