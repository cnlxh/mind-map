export const RECENT_FILE_LIST = 'recentFileList'
export const CLIENT_CONFIG = 'client_config'
export const EDIT_WINDOW_SIZE = 'edit_window_size'

// 保存到最近文件
export const saveToRecent = file => {
  let list = getRecent()
  let index = list.findIndex(item => {
    return item === file
  })
  if (index !== -1) {
    list.splice(index, 1)
  }
  list.push(file)
  utools.dbCryptoStorage.setItem(RECENT_FILE_LIST, list)
}

// 保存到最近文件
export const saveFileListToRecent = fileList => {
  let list = getRecent()
  fileList.forEach(file => {
    let index = list.findIndex(item => {
      return item === file
    })
    if (index !== -1) {
      list.splice(index, 1)
    }
    list.push(file)
  })
  utools.dbCryptoStorage.setItem(RECENT_FILE_LIST, list)
}

// 获取最近文件列表
export const getRecent = () => {
  let res = utools.dbCryptoStorage.getItem(RECENT_FILE_LIST)
  return (Array.isArray(res) ? res : []).filter(item => {
    return !!item
  })
}

// 清除最近文件列表
export const clearRecent = () => {
  utools.dbCryptoStorage.removeItem(RECENT_FILE_LIST)
}

// 从最近文件列表中移除指定文件
export const removeFileInRecent = file => {
  let list = getRecent()
  let index = list.findIndex(item => {
    return item === file
  })
  if (index !== -1) {
    list.splice(index, 1)
  }
  utools.dbCryptoStorage.setItem(RECENT_FILE_LIST, list)
}

// 从最近文件列表中移除指定的多个文件
export const removeMultiFileInRecent = fileList => {
  let list = getRecent()
  list = list.filter(item => {
    return !fileList.includes(item)
  })
  utools.dbCryptoStorage.setItem(RECENT_FILE_LIST, list)
}

// 替换指定文件
export const replaceFileInRecent = (oldFile, newFile) => {
  let list = getRecent()
  let index = list.findIndex(item => {
    return item === oldFile
  })
  if (index !== -1) {
    list.splice(index, 1)
  }
  list.push(newFile)
  utools.dbCryptoStorage.setItem(RECENT_FILE_LIST, list)
}

// 保存配置
export const saveClientConfig = config => {
  utools.dbCryptoStorage.setItem(CLIENT_CONFIG, config)
}

// 获取配置
export const getClientConfig = () => {
  const res = utools.dbCryptoStorage.getItem(CLIENT_CONFIG)
  return res
}

// 保存编辑窗口大小信息
export const saveEditWindowSize = config => {
  utools.dbCryptoStorage.setItem(EDIT_WINDOW_SIZE, config)
}

// 获取编辑窗口大小信息
export const getEditWindowSize = () => {
  const res = utools.dbCryptoStorage.getItem(EDIT_WINDOW_SIZE)
  return res
}
