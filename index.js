const db = require("./db")
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  //面向接口编程
  const list = await db.read()
  list.push({title, done: false})
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list).then()
}

function markAsUndone(list, index) {
  list[index].done = false
  db.write(list).then()
}

function changeTitle(list, index) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: "请输入需要改的新名字",
      default: list[index].title
    })
    .then((answer) => {
      list[index].title = answer.title
      db.write(list).then()
    })
}

function remove(list, index) {
  list.splice(index, 1)
  db.write(list).then()
}

function askForAction(list, index) {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择你的操作',
      choices: [
        {name: '退出', value: 'quit'},
        {name: '已完成', value: 'markAsDone'},
        {name: '未完成', value: 'markAsUndone'},
        {name: '改标题', value: 'changeTitle'},
        {name: '删除', value: 'remove'}
      ]
    })
    .then((answer) => {
      const actions = {markAsDone, markAsUndone, changeTitle, remove}
      const action = actions[answer.action]
      action && action(list, index)
    })
}

function askForCreateTask(list) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: "请输入任务标题",
    })
    .then((answer) => {
      list.push({title: answer.title, done: false})
      db.write(list).then()
    })
}

function printTasks(list) {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务',
      choices: [{name: '退出', value: '-1'}, ...list.map((item, index) => {
        return {name: `${item.done ? '[√]' : '[_]'} ${index + 1} - ${item.title}`, value: index.toString()}
      }), {name: '+ 添加任务', value: -2}]
    })
    .then((answer) => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}

module.exports.showAll = async () => {
  let list = await db.read()
  printTasks(list)
}