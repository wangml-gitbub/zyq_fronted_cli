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