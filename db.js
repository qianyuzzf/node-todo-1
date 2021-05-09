const homedir = require('os').homedir()    //系统默认的home目录位置
const home = process.env.HOME || homedir   //home变量位置
const fs = require('fs')
const path = require('path')
const dbPath = path.join(home, '.todo')

const db = {
  read(path = dbPath) {    //path默认为dbPath，如果传了参数就用传的参数
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
          //'a+'打开文件以进行读取和追加。如果文件不存在，则创建该文件。
          if (error) return reject(error)
          let list
          try {
            list = JSON.parse(data.toString())
          } catch {
            list = []
          }
          resolve(list)
        }
      )
    })
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string + '\n', (error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  }
}

module.exports = db