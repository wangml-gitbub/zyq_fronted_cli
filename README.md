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
npm install chalk@4.1.0


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
  "bin": {
    "zyq_fronted": "./bin/cli.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.0",
    "commander": "^10.0.1",
    "figlet": "^1.6.0",
    "fs-extra": "^11.1.1"
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

const program = require('commander')

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
npm install chalk@4.1.0
npm install figlet
```

```bash
#! /usr/bin/env node

const program = require('commander') // 自定义指令

// 自定义指令
program
  .version('0.1.0')
  .command('create <project_name>')
  .description('create a new project')
  .action(res => {
    console.log(res)
  })




const chalk = require('chalk') // chalk 改变颜色
const figlet = require('figlet') // figlet 改变字体
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

10、在 lib 文件夹中创建 create.js 文件，用于编写创建文件所需的逻辑

```bash
zyq_fronted_cli      
├─ bin
│  ├─ cli.js   
├─ lib        
│  ├─ create.js  
└─ package.json 
```

```bash
create.js 文件
module.exports =  async function (name, option){
  console.log('项目名称以及配置项：', name, option)
}
```

11、 创建项目时，询问用户是否需要强制覆盖已有的文件(在 cli.js 文件中加入 --force 选项来实现该需求，修改 create.js 文件的逻辑)
创建项目时（zyq_fronted create myproject --force 或者 zyq_fronted create myproject -f），询问用户是否需要强制覆盖已有的文件

```bash
cli.js 文件


#! /usr/bin/env node


const program = require('commander') // 自定义指令
const create = require('../lib/create.js')

program
  .version('0.1.0')
  .command('create <project_name>')
  .description('create a new project')
  .option('-f --force', 'overwrite target directory if it exist')
  .action((name, option) => {
    console.log(name, option)
    create(name, option)
  })



  const chalk = require('chalk') // chalk 改变颜色
  const figlet = require('figlet') // figlet 改变字体
  program
  // 监听 --help 执行
  .on('--help', () => {
    
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

```bash
create.js 文件


module.exports = async function (name, option){
  const path = require('path')
  const fs = require('fs-extra') // npm install fs-extra
  const cwd = process.cwd() // 当前命令行选择的目录
  const targeCwd = path.join(cwd, name) // 需要创建的目录地址
    
  // 判断是否存在该目录
  if (fs.existsSync(targetCwd)) { // 目录存在

    if (options.force) { // 是否强制创建
      console.log('进行强制创建')
    } else {
      console.log('询问用户是否强制创建')
    }
  } else { // 目录不存在
    console.log('目录不存在，进行强制创建')
  }


  console.log('项目名称以及配置项：', name, options)
}
```

12、安装 inquirer ，使用 inquirer 获取终端与用户的交互信息
inquirer 可以在命令行询问用户问题，也可以记住用户在命令行的选择

```bash
npm install --save inquirer@^8.0.0
```

13、修改 create.js 文件的逻辑（当非强制性创建项目的时候，项目存在的话就询问用户要不要覆盖项目；当非强制性创建项目的时候，项目不存在的话直接创建项目；当强制性创建项目的时候，项目存在或不存在都强制创建项目；）

```bash
create.js 文件

module.exports =  async function (name, options){
  const path = require('path')
  const fs = require('fs-extra')
  const inquirer = require('inquirer')
  
  const cwd  = process.cwd() // 当前命令行选择的目录
  const targetCwd = path.join(cwd, name) // 需要创建的目录地址
  console.log(cwd,targetCwd)
  
  // 判断是否存在该目录
  if (fs.existsSync(targetCwd)) { // 目录存在

    if (options.force) { // 是否强制创建

      console.log('进行强制创建')
      // 移除原来存在的项目
      await fs.remove(targetCwd)

    } else {

      console.log('询问用户是否强制创建')

      // 询问用户是否强制创建项目
      let { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Target directory already exists Pick an action:',
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: false}
        ]
      }])

      if (!action) {
        return
      } else {
        console.log('移除存在的文件')
        await fs.remove(targetCwd)
      }

    }
  } else { // 目录不存在
    console.log('目录不存在，进行强制创建')
  }


  console.log('项目名称以及配置项：', name, options)
}
```

14、在 lib 文件夹下创建 factory.js 文件，用于负责 创建目录、拉取模版等逻辑

```bash
zyq_fronted_cli      
├─ bin
│  ├─ cli.js   
├─ lib
│  ├─ create.js
│  ├─ factory.js 
└─ package.json
```

15、编辑 factory.js 文件内容，并在 create.js 文件中引入

```bash
factory.js 文件


module.exports = class Factory{
  constructor(name, targetCwd){
    this.name = name // 目录名称
    this.targetCwd = targetCwd // 目录所在地址

    console.log(this.name, this.targetCwd)
  }

  // 创建
  create() {

  }
}
```

```bash
create.js 文件


module.exports =  async function (name, options){
  const path = require('path')
  const fs = require('fs-extra')
  const inquirer = require('inquirer')

  const cwd  = process.cwd() // 当前命令行选择的目录
  const targetCwd = path.join(cwd, name) // 需要创建的目录地址
  console.log(cwd,targetCwd)


  
  // 判断是否存在该目录
  if (fs.existsSync(targetCwd)) { // 目录存在

    if (options.force) { // 是否强制创建

      console.log('进行强制创建')
      // 移除原来存在的项目
      await fs.remove(targetCwd)

    } else {

      console.log('询问用户是否强制创建')

      // 询问用户是否强制创建项目
      let { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Target directory already exists Pick an action:',
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: false}
        ]
      }])

      if (!action) {
        return
      } else {
        console.log('移除存在的文件')
        await fs.remove(targetCwd)
      }

    }
  } else { // 目录不存在
    console.log('目录不存在，进行强制创建')
  }

  // 创建项目  
  const Factory = require('./factory')
  const factory = new Factory(name, targetCwd)
  factory.create()
  console.log('项目名称以及配置项：', name, options)
}
```

16、接着来写询问用户选择模版的逻辑
github 提供了接口可以获取模板，你可以事先准备好了两个模板发布到 github 上
在 lib 文件夹中创建 http.js 文件，专门用来管理接口，创建好后整个目录结构如下

```bash
zyq_fronted_cli      
├─ bin
│  ├─ cli.js   
├─ lib
│  ├─ create.js
│  ├─ factory.js
│  ├─ http.js 
└─ package.json 
```

17、安装 axios ，编写 http.js 文件内容

```bash
npm install axios
```

```bash
http.js 文件


const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

// 获取模版列表
async function getRepoList(myGithub = 'vue3-0-cli-yd'){
  return axios.get('https://api.github.com/orgs/vue3-0-cli-yd/repos') // 更换自己的 github 项目 `https://api.github.com/orgs/wangml-gitbub/repos`
}

// 获取版本信息
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/vue3-0-cli-yd/${repo}/tags`) // https://api.github.com/orgs/wangml-gitbub/repos
}

module.exports = {
  getRepoList,
  getTagList
}
```

18、安装 ora，用于显示加载中的效果；
安装 util , util 可以让没有 node 环境的宿主（如：浏览器）拥有 node 的 util模块；
安装 download-git-repo，用于下载 git 存储库

```bash
npm install ora@5.4.1
npm install util
npm install download-git-repo
```

19、编写 factory.js 文件内容， 添加加载动画、获取用户选择的模版、获取模版的 tag 列表、下载远程模版、创建项目 的逻辑

```bash
factory.js 文件


const { getRepoList, getTagList } = require('./http')
const ora = require('ora') // 显示加载中的效果
const util = require('util') // 让没有 node 环境的宿主拥有 node 的 util 模块
const downloadGitRepo = require('download-git-repo') // 下载 git 存储库
const inquirer = require('inquirer')
const path = require('path')
const chalk = require('chalk')

module.exports = class Factory{
  constructor(name, targetCwd){
    this.name = name // 目录名称
    this.targetCwd = targetCwd // 目录所在地址
    this.downloadGitRepo = util.promisify(downloadGitRepo) // 对 download-git-repo 进行 promise 化改造

    console.log(this.name, this.targetCwd)
  }

  // 加载动画
  async loading(fn, message, ...args) {
   
    const spinning = ora(message) // 初始化 ora，传入提示信息 message 
    spinning.start() // 开始加载动画


    try {
      const result = await fn(...args) // 执行 fn 方法
      spinning.succeed() // 将状态改为成功

      return result

    } catch (err){
      spinning.fail('Request failed, refetch ...')
    }
  }

  // 获取用户选择的模版
  async getRepo(){

    // 从远程拉取模板数据
    const repoList = await this.loading(getRepoList, 'waiting fetch template')
    if(!repoList) return

    // 过滤需要的模板名称
    const repos = repoList.map(item => item.name) 
    console.log(repos)
    
    // 让用户选择模版
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    // 返回用户选择的名称
    return repo 
  }

  // 获取模版的 tag 列表
  async getTag(repo){
    // 从远程拉取模板 tag 列表
    const tags = await this.loading(getTagList, 'waiting fetch tag', repo)
    if(!tags) return

    // 过滤需要的 tag 名称
    const tagList = tags.map(item => item.name)
    console.log(tagList)

    // 让用户选择 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagList,
      message: 'Place choose a tag to create project'
    })

    // 返回用户选择的 tag
    return tag
  }

  // 下载远程模版
  async download(repo, tag){
    
    const requestUrl = `vue3-0-cli-yd/${repo}${tag ? '#' + tag : ''}` // 拉取模版的地址
    const createUrl =  path.resolve(process.cwd(), this.targetCwd) // 创建项目的地址

    // 下载方法调用
    await this.loading(this.downloadGitRepo, 'waiting download template', requestUrl, createUrl)
  }

  // 创建项目
  async create() {
    console.log('创建项目---', this.name, this.targetCwd)
    try {
      // 获取用户选择的模版名称
      const repo = await this.getRepo()

      // 获取用户选择的 tag
      const tag = await this.getTag(repo)

      await this.download(repo, tag)


      // 4）模板使用提示
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
      console.log(`\r\n  npm install`)
      console.log("\r\n  npm run dev\r\n")
    } catch (error) {
      console.log(error);
    }
  }
}
```

20、到此就结束啦，可以使用这个自定义的脚手架进行拉取相应的模版

```bash
zyq_fronted create my_project
选择模版及 tag
cd my_project
npm install
npm run dev
```

21、[代码地址](https://github.com/wangml-gitbub/zyq_fronted_cli)
cli.js 文件代码

```bash
#! /usr/bin/env node


const program = require('commander') // 自定义指令
const create = require('../lib/create.js')

program
  .version('0.1.0')
  .command('create <project_name>')
  .description('create a new project')
  .option('-f --force', 'overwrite target directory if it exist')
  .action((name, option) => {
    console.log(name, option)
    create(name, option)
  })



  const chalk = require('chalk') // chalk 改变颜色
  const figlet = require('figlet') // figlet 改变字体
  program
  // 监听 --help 执行
  .on('--help', () => {
    
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

create.js 文件代码

```bash
module.exports =  async function (name, options){
  const path = require('path')
  const fs = require('fs-extra')
  const inquirer = require('inquirer')

  const cwd  = process.cwd() // 当前命令行选择的目录
  const targetCwd = path.join(cwd, name) // 需要创建的目录地址
  console.log(cwd,targetCwd)


  
  // 判断是否存在该目录
  if (fs.existsSync(targetCwd)) { // 目录存在

    if (options.force) { // 是否强制创建

      console.log('进行强制创建')
      // 移除原来存在的项目
      await fs.remove(targetCwd)

    } else {

      console.log('询问用户是否强制创建')

      // 询问用户是否强制创建项目
      let { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Target directory already exists Pick an action:',
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: false}
        ]
      }])

      if (!action) {
        return
      } else {
        console.log('移除存在的文件')
        await fs.remove(targetCwd)
      }

    }
  } else { // 目录不存在
    console.log('目录不存在，进行强制创建')
  }

  // 创建项目  
  const Factory = require('./factory')
  const factory = new Factory(name, targetCwd)
  factory.create()
  console.log('项目名称以及配置项：', name, options)
}

```

http.js 文件代码

```bash
const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

// 获取模版列表
async function getRepoList(){
  return axios.get('https://api.github.com/orgs/vue3-0-cli-yd/repos') // https://api.github.com/orgs/wangml-gitbub/repos
}

// 获取版本信息
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/vue3-0-cli-yd/${repo}/tags`) // https://api.github.com/orgs/wangml-gitbub/repos
}

module.exports = {
  getRepoList,
  getTagList
}
```

factory.js 文件代码

```bash
const { getRepoList, getTagList } = require('./http')
const ora = require('ora') // 显示加载中的效果
const util = require('util') // 让没有 node 环境的宿主拥有 node 的 util 模块
const downloadGitRepo = require('download-git-repo') // 下载 git 存储库
const inquirer = require('inquirer')
const path = require('path')
const chalk = require('chalk')

module.exports = class Factory{
  constructor(name, targetCwd){
    this.name = name // 目录名称
    this.targetCwd = targetCwd // 目录所在地址
    this.downloadGitRepo = util.promisify(downloadGitRepo) // 对 download-git-repo 进行 promise 化改造

    console.log(this.name, this.targetCwd)
  }

  // 加载动画
  async loading(fn, message, ...args) {
   
    const spinning = ora(message) // 初始化 ora，传入提示信息 message 
    spinning.start() // 开始加载动画


    try {
      const result = await fn(...args) // 执行 fn 方法
      spinning.succeed() // 将状态改为成功

      return result

    } catch (err){
      spinning.fail('Request failed, refetch ...')
    }
  }

  // 获取用户选择的模版
  async getRepo(){

    // 从远程拉取模板数据
    const repoList = await this.loading(getRepoList, 'waiting fetch template')
    if(!repoList) return

    // 过滤需要的模板名称
    const repos = repoList.map(item => item.name) 
    console.log(repos)
    
    // 让用户选择模版
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    // 返回用户选择的名称
    return repo 
  }

  // 获取模版的 tag 列表
  async getTag(repo){
    // 从远程拉取模板 tag 列表
    const tags = await this.loading(getTagList, 'waiting fetch tag', repo)
    if(!tags) return

    // 过滤需要的 tag 名称
    const tagList = tags.map(item => item.name)
    console.log(tagList)

    // 让用户选择 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagList,
      message: 'Place choose a tag to create project'
    })

    // 返回用户选择的 tag
    return tag
  }

  // 下载远程模版
  async download(repo, tag){
    
    const requestUrl = `vue3-0-cli-yd/${repo}${tag ? '#' + tag : ''}` // 拉取模版的地址
    const createUrl =  path.resolve(process.cwd(), this.targetCwd) // 创建项目的地址

    // 下载方法调用
    await this.loading(this.downloadGitRepo, 'waiting download template', requestUrl, createUrl)
  }

  // 创建项目
  async create() {
    console.log('创建项目---', this.name, this.targetCwd)
    try {
      // 获取用户选择的模版名称
      const repo = await this.getRepo()

      // 获取用户选择的 tag
      const tag = await this.getTag(repo)

      await this.download(repo, tag)


      // 4）模板使用提示
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
      console.log(`\r\n  npm install`)
      console.log("\r\n  npm run dev\r\n")
    } catch (error) {
      console.log(error);
    }
  }
}
```

package.json 内容

```bash
{
  "name": "zyq_fronted_cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "zyq_fronted": "./bin/cli.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.3.5",
    "chalk": "^4.1.0",
    "commander": "^10.0.1",
    "download-git-repo": "^3.0.2",
    "figlet": "^1.6.0",
    "fs-extra": "^11.1.1",
    "inquirer": "^8.2.5",
    "ora": "^5.4.1",
    "util": "^0.12.5"
  }
}

```
