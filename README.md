
# zash-cli

A simple CLI for generating pages into your projects

> Author：zwf193071

> E-mail: 997131679@qq.com

> date: 2020/07/29

## Feature
一款为公司内部vue项目特定的CLI工具，亦可基于此进行改造，现支持`create <new-file-name>`命令，可生成单页或带tab的多页面，自动注入新页面功能至路由、面包屑及菜单导航等组件内

## Usage
全局安装zash-cli。`npm install -g zash-cli`

or
```
git clone https://github.com/zwf193071/zash-cli.git

cd zash-cli && npm install

npm link
```

打开terminal或 cmd ，输入`zash` or `zash -h` ，你将看到如下信息:
```
  Usage: zash [options] [command]

  Options:
    -h, --help              output usage information

  Commands:
    create <new-file-name>  create a new file powered by zash-cli

    Run zash <command> --help for detailed usage of given command.

```

在你想生成页面的项目内的根目录下，新建pageConf.js文件，代码如下所示：
```

/**
 * 单页自动生成文件的相关配置信息
 * @param parentFolderPath 父文件地址，相对于根路径
 * @param routerPath 路由文件路径
 * @param author 当前文件的创建者
 * @param title 文件标题，与增删改的提示信息相关
 * @isDrawer 是否有抽屉
 * @getUrl 列表请求接口地址
 * @addUrl 新增接口地址
 * @editUrl 编辑接口地址
 * @deleteUrl 删除接口地址
 * @author zhuwenfang
 * @createtime 2020-07-28
 */
exports.conf = {
    parentFolderPath: 'src/views/Content/Monitor',
    routerPath: 'src/router/routes.js',
    author: 'zhuwenfang',
    title: 'test文件',
    isDrawer: true,
    getUrl: '',
    addUrl: '',
    editUrl: '',
    deleteUrl: ''
};

```

## Commands
### create <new-file-name>
这个命令会创建新页面组件Test.
```
$ zash create Test

```

![image](https://github.com/zwf193071/zash-cli/images/1.png)

在你想注入路由的文件内，写上`//${h}`和`//${f}`，当执行命令成功后，会在该路由文件，根据该注释语句，自动导入`Test`的路由
![image](https://github.com/zwf193071/zash-cli/images/2.png)
![image](https://github.com/zwf193071/zash-cli/images/3.png)

## Thanks to
* [vue-cli](https://github.com/vuejs/vue-cli)







