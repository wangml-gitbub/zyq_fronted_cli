# 需求描述

每次开新项目时都需要从头搭建架构，或者就是把之前的项目直接复制粘贴过来修修改改。
当然有时稍微勤奋一点的就会弄个基础模板放在本地或者放在 github，需要的时候直接 clone 过来。
但是其便捷性和通用性极差，就开始想为什么不做一个类似 vue-cli 的命令行工具呢(刚好现在有时间～)

## 脚手架基本功能

1、通过命令行交互式的询问用户问题
2、根据用户的答复选择不同的模版或者生成不同的文件

## 脚手架构建用到的基本工具

```bash
commander 可以自定义一些命令行指令，在输入自定义的命令行的时候，会去执行相应的操作
npm install commander


inquirer 可以在命令行询问用户问题，并且可以记录用户回答选择的结果
npm install inquirer


fs-extra 是fs的一个扩展，提供了非常多的便利API，并且继承了fs所有方法和为fs方法添加了promise的支持。
npm install fs-extra


chalk 可以美化终端的输出
npm install chalk


figlet 可以在终端输出logo
npm install figlet


ora 控制台的loading样式
npm install ora


download-git-repo 下载远程模板
npm install download-git-repo

```

## 构建过程

1、首先创建一个文件夹，初始化 package.json 文件

```bash
mkdir zyq_fronted_cli

cd zyq_fronted_cli

npm init
```

2、创建文件夹 bin ，用于放置程序的入口文件

```bash
zyq_fronted_cli      
├─ bin        
└─ package.json 
```

3、创建文件夹 lib ，用来放一些工具函数

```bash
zyq_fronted_cli      
├─ bin
├─ lib        
└─ package.json 
```

4、在 bin 文件夹中创建 cli.js 文件

```bash
zyq_fronted_cli      
├─ bin
│  ├─ cli.js   
├─ lib        
└─ package.json 
```

5、在 package.json 文件中指定程序的入口文件为 bin 文件夹下的 cli.js 文件

```bash
package.json 文件

{
  "name": "zyq_fronted_cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "bin": {
    "zyq_fronted": "./bin/cli.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^5.2.0",
    "commander": "^10.0.1"
  }
}

```

6、下载安装 commander 自定义命令行指令包

```bash
npm install commander
```

7、在 bin 文件夹下的 cli.js 中引入 commander
注意：文件开头如果带有 #！的话，那么这个文件就会被当做一个执行文件来执行，执行文件也即是可以由操作系统进行加载执行的文件。如果带有这个符号，说明这个文件可以当做脚本来运行。
/usr/bin/env node 的意思是这个文件用 node 来执行，(会去用户的安装根目录下的 env 环境变量里面去寻找 node（/usr/bin/env node）然后用node 来执行整个的脚本文件)

```bash
#! /usr/bin/env node

import { program } from 'commander'

program
.version('0.1.0')
.command('create <project name>')
.discription('create a new project')
.action(res => {
  console.log(res)
})

program.parse()
```

8、将当前项目（zyq_fronted_cli） 链接到全局

```bash
npm link
```

9、安装 chalk 和 figlet，在 bin 文件夹的 cli.js 中引入 ，用于自定义字体和颜色

```bash
npm install chalk
npm install figlet
```

```bash
#! /usr/bin/env node

import { program } from 'commander'

// 自定义指令
program
  .version('0.1.0')
  .command('create <project_name>')
  .description('create a new project')
  .action(res => {
    console.log(res)
  })



import chalk from 'chalk' // chalk 改变颜色
import figlet from 'figlet' // figlet 改变字体
program
  .on('--help', () => { // 监听 --help 执行
    
    console.log('\r\n' + figlet.textSync('ZYQ_FRONTED_CLI', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 500,
      whitespaceBreak: true
    }))

    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`zyq_fronted <command> --help`)} for detailed usage of given command\r\n`)
  })

program.parse()
```

10、