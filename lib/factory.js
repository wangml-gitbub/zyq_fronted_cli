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