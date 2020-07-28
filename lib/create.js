#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const {
    formateTime,
    getTemplate,
    logWithSpinner,
    stopSpinner
} = require('./utils')

async function create(fileName, options) {
    const cwd = process.cwd();
    const pageConf = require(path.resolve(cwd, 'pageConf.js')).conf;
    console.log(pageConf)
    const targetDir = pageConf.parentFolderPath;

    if (!fs.existsSync(targetDir)) {
        console.log(`\n父文件夹路径并不存在，请重新在根目录内的pageConf.js里指定父文件夹路径`);
        return;
    }
    const { action } = await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            message: `Please Pick the appropriate template:`,
            choices: [
                { name: 'Single', value: 'single' },
                { name: 'Multiple', value: 'multiple' }
            ]
        }
    ])
    if (!action) {
        return
    } else if (action === 'single') {
        logWithSpinner(`✨`, `Creating folder-${fileName} in ${chalk.yellow(targetDir)}.`)
        const filePath = `${targetDir}/${fileName}`;
        await fs.ensureDir(filePath, function (err) { console.log(err) });
        const source = getTemplate(action)({
            ...pageConf,
            createTime: formateTime(),
            fileName
        });
        await fs.outputFile(`${filePath}/index.vue`, source, 'utf-8');
        stopSpinner();
        console.log(`✔ You have created folder-${fileName} successfully`);
    }
}
module.exports = (...args) => {
    return create(...args);
}