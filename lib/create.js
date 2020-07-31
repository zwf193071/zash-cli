#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const {
    formateTime,
    getTemplate,
    insertStr,
    logWithSpinner,
    stopSpinner,
    error
} = require('./utils')

async function create (fileName, options) {
    const cwd = process.cwd();
    const pageConf = require(path.resolve(cwd, 'pageConf.js')).conf;
    const parentPath = pageConf.parentFolderPath;
    const targetDir = path.resolve(cwd, parentPath);
    const filePath = `${targetDir}/${fileName}`;

    if (!fs.existsSync(targetDir)) {
        console.log(chalk.red(
            '\nThe path of parent folder doesn\'t exist, please make sure you have configured it in the pageConf.js file'
        ));
        return;
    }
    const { action } = await inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            message: 'Please Pick the appropriate template:',
            choices: [
                { name: 'Single', value: 'single' },
                { name: 'Multiple', value: 'multiple' }
            ]
        }
    ]);
    if (!action) {
        return
    } else {
        const source = getTemplate(action)({
            ...pageConf,
            createTime: formateTime(),
            fileName
        });
        if (fs.existsSync(filePath)) {
            error(`The folder:${fileName} has already existed!`);
            process.exit(1);
            return;
        } else {
            logWithSpinner(`✨`, `Busy creating folder-${fileName} in ${chalk.yellow(targetDir)}...`);
            autoInjectNavs(pageConf, parentPath, fileName);
            fs.outputFileSync(`${filePath}/index.vue`, source, 'utf8');
            stopSpinner();
            console.log(chalk.green(
                `✔ You have created folder: ${chalk.yellow(fileName)} successfully`
            ));
            process.exit(1);
        }
        
    }
}
function autoInjectNavs(pageConf, parentPath, fileName) {
    //插入路由
    let routeStr = JSON.stringify(fs.readFileSync(pageConf.routerPath, { encoding: 'utf8' }));
    const indexH = routeStr.indexOf('// $h');
    if (indexH === -1) {
        console.error(chalk.bgRed(' ERROR ') + chalk.white('The header placeholder is not in the router config file'));
        return;
    }
    const replaceStr = parentPath.replace('src', '@');
    routeStr = insertStr(indexH, routeStr, `import ${fileName} from '${replaceStr}/${fileName}';\\r\\n`);
    const indexF = routeStr.indexOf('// $f');
    if (indexF === -1) {
        console.error(chalk.bgRed(' ERROR ') + chalk.white('The footer placeholder is not in the router config file'));
        return;
    }
    routeStr = insertStr(indexF, routeStr, `      {\\r\\n        path: '${fileName}',\\r\\n        component: ${fileName}\\r\\n      },\\r\\n`);
    fs.outputFileSync(pageConf.routerPath, JSON.parse(routeStr), 'utf-8');

    //插入面包屑
    let breadStr = JSON.stringify(fs.readFileSync(pageConf.breadPath, { encoding: 'utf8' }));
    const indexB = breadStr.indexOf('// $f');
    if (indexB === -1) {
        console.error(chalk.bgRed(' ERROR ') + chalk.white('The placeholder is not in the breadcrumb config file'));
        return;
    }
    breadStr = insertStr(indexB, breadStr, `    {\\r\\n        path: '/home/${fileName}',\\r\\n        breadLink: [\\r\\n            { name: '${pageConf.parentName}', link: '' },\\r\\n            { name: '${pageConf.title}', link: '' }\\r\\n        ]\\r\\n    },\\r\\n`);
    fs.outputFileSync(pageConf.breadPath, JSON.parse(breadStr), 'utf-8');

    //插入菜单
    const menu = ['系统概况', '运维监控', '物理网络', '虚拟网络', '网络服务', '系统管理']
    const menuIndex = menu.indexOf(pageConf.parentName);
    let leftMenutr = JSON.stringify(fs.readFileSync(pageConf.leftMenuPath, { encoding: 'utf8' }));
    const indexM = leftMenutr.indexOf(`// $f${menuIndex}`);
    if (indexM === -1) {
        console.error(chalk.bgRed(' ERROR ') + chalk.white('The placeholder is not in the leftmenu config file'));
        return;
    }
    leftMenutr = insertStr(indexM, leftMenutr, `                {\\r\\n                    name: '${pageConf.title}',\\r\\n                    link: '/home/${fileName}',\\r\\n                    meta: {\\r\\n                        role: ['admin', 'user']\\r\\n                    }\\r\\n                },\\r\\n`);
    fs.outputFileSync(pageConf.leftMenuPath, JSON.parse(leftMenutr), 'utf-8');
}
module.exports = (...args) => {
    return create(...args);
}