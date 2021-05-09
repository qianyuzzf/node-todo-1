#!/usr/bin/env node
const program = require('commander')
const api = require('./index.js')
const pkg = require('./package.json')


program
  .version(pkg.version)

program.parse(process.argv)

program
  .command('add <source> [destination]')
  .description('add a task')
  .action((...args) => {
    const x = args.slice(0, args.length - 2).join(' ')
    api.add(x).then(() => {
      console.log('添加成功')
    }, () => {
      console.log('添加失败')
    })
  })

program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => {
      console.log('清除成功')
    }, () => {
      console.log('清除失败')
    })
  })

if (process.argv.length === 2) {
  api.showAll().then()
} else {
  program.parse(process.argv)
}
