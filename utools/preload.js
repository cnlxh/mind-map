const fs = require('node:fs')
const path = require('node:path')

window.platform = process.platform
window.IS_ELECTRON = true

// 获取文件内容
const getFileContent = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        try {
          resolve({
            name: path.parse(filePath).name,
            content: data ? JSON.parse(data) : null
          })
        } catch (error) {
          resolve({
            name: path.parse(filePath).name,
            content: null
          })
        }
      }
    })
  })
}

// 保存文件内容
const save = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// 重命名文件
const rename = (filePath, name) => {
  return new Promise((resolve, reject) => {
    const oldPath = filePath
    const { base, ...oldPathData } = path.parse(oldPath)
    oldPathData.name = name
    const newPath = path.format(oldPathData)
    fs.rename(oldPath, newPath, err => {
      if (err) {
        reject(err)
      } else {
        resolve(newPath)
      }
    })
  })
}

// 检查文件是否存在
const checkFileExist = filePath => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// 删除文件
const deleteFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.rm(filePath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// 删除多个文件
const deleteMultiFile = filePathList => {
  return new Promise(resolve => {
    const total = filePathList.length
    let count = 0
    const failList = []
    filePathList.forEach(item => {
      fs.rm(item, err => {
        count++
        if (err) {
          failList.push(item)
        }
        if (count >= total) {
          resolve(failList)
        }
      })
    })
  })
}

// 同步判断一个文件是否存在
const fileIsExist = filePath => {
  try {
    fs.accessSync(filePath)
    return true
  } catch (err) {
    return false
  }
}

// 复制文件
const copyFile = filePath => {
  return new Promise((resolve, reject) => {
    const { base, ...oldPathData } = path.parse(filePath)
    const newName = oldPathData.name + '-复制'
    let index = 2
    oldPathData.name = newName
    let newPath = path.format(oldPathData)
    // 检查新路径是否已存在
    while (fileIsExist(newPath)) {
      oldPathData.name = newName + index
      newPath = path.format(oldPathData)
      index++
    }
    fs.copyFile(filePath, newPath, err => {
      if (err) {
        reject(err)
      } else {
        resolve(newPath)
      }
    })
  })
}

// 获取一个文件路径相对于另一个路径的相对路径
const getRelativePath = (filePath, relativePath) => {
  const name = path.basename(filePath)
  let file = filePath
  if (relativePath) {
    // 如果传递了路径，那么返回相对路径
    file = path.relative(relativePath, filePath)
  }
  return {
    file,
    name
  }
}

// 根据相对路径返回绝对路径
const getAbsolutePath = (file, relativePath = '') => {
  if (!path.isAbsolute(file) && relativePath) {
    file = path.resolve(relativePath, file)
  }
  const exist = fileIsExist(file)
  if (exist) {
    return file
  } else {
    return ''
  }
}

// 获取指定目录下指定类型的文件列表
const getFilesInDir = (dir, ext) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const reg = new RegExp(ext + '$')
        files = files.filter(item => {
          return reg.test(item)
        })
        resolve(files)
      }
    })
  })
}

window.electronAPI = {
  checkFileExist,
  deleteFile,
  deleteMultiFile,
  copyFile,
  getFileContent,
  save,
  rename,
  getRelativePath,
  getAbsolutePath,
  getFilesInDir
}
