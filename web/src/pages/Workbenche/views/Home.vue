<template>
  <div
    class="workbencheHomeContainer"
    :class="{ isDark: isDark }"
    @drop="onDrop"
    @dragenter="onDragenter"
    @dragover="onDragover"
    @dragleave="onDragleave"
  >
    <div class="workbencheHomeContent">
      <Sidebar></Sidebar>
      <FileList></FileList>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import FileList from '../components/FileList.vue'
import { mapState, mapMutations } from 'vuex'
import { v4 as uuid } from 'uuid'
import { saveFileListToRecent, saveToRecent } from '@/utils/storage'
import { getLocalConfig } from '@/api'

export default {
  name: 'Home',
  components: {
    Sidebar,
    FileList
  },
  computed: {
    ...mapState({
      isNeedCreate: state => state.isNeedCreate,
      isDark: state => state.localConfig.isDark
    })
  },
  watch: {
    isDark() {
      this.setBodyDark()
    }
  },
  created() {
    this.checkIsVip()
    this.initLocalConfig()
    this.checkIsCreate()
  },
  activated() {
    this.checkIsCreate()
  },
  methods: {
    ...mapMutations([
      'setFilePath',
      'setIsNeedCreate',
      'setFileName',
      'setLocalConfig',
      'setIsVIP'
    ]),

    checkIsVip() {
      const purchasedUser = utools.isPurchasedUser()
      if (purchasedUser) {
        this.setIsVIP(true)
      }
    },

    // 初始化本地配置
    initLocalConfig() {
      let config = getLocalConfig()
      if (config) {
        this.setLocalConfig({
          ...this.$store.state.localConfig,
          ...config
        })
      }
    },

    setBodyDark() {
      this.isDark
        ? document.body.classList.add('isDark')
        : document.body.classList.remove('isDark')
    },

    checkIsCreate() {
      if (!this.isNeedCreate) {
        return
      }
      this.setIsNeedCreate(false)
      this.setFileName('')
      this.setFilePath('')
      this.$router.push({
        name: 'WorkbencheEdit',
        params: {
          id: uuid()
        }
      })
    },

    onDrop(e) {
      e.preventDefault()
      e.stopPropagation()

      let df = e.dataTransfer
      let dropFiles = []

      if (df.items !== undefined) {
        for (let i = 0; i < df.items.length; i++) {
          let item = df.items[i]
          if (item.kind === 'file' && item.webkitGetAsEntry().isFile) {
            let file = item.getAsFile()
            if (/\.smm$/.test(file.name)) {
              dropFiles.push(file)
            }
          }
        }
      }
      if (dropFiles.length === 1) {
        // 如果只有一个文件，直接打开编辑
        const filePath = dropFiles[0].path
        saveToRecent(filePath)
        this.$bus.$emit('refreshRecentFileList')
        this.setFilePath(filePath)
        this.$router.push({
          name: 'WorkbencheEdit',
          params: {
            id: uuid()
          }
        })
      } else if (dropFiles.length > 1) {
        // 否则添加到最近文件列表
        const fileList = dropFiles.map(file => {
          return file.path
        })
        saveFileListToRecent(fileList)
        this.$bus.$emit('refreshRecentFileList')
      }
    },

    onDragenter(e) {
      e.preventDefault()
      e.stopPropagation()
    },

    onDragover(e) {
      e.preventDefault()
      e.stopPropagation()
    },

    onDragleave(e) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>

<style lang="less" scoped>
.workbencheHomeContainer {
  background-color: #f6f8f9;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.isDark {
    background: rgb(39, 42, 46);
  }

  .workbencheHomeContent {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    overflow: hidden;
  }
}
</style>
