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