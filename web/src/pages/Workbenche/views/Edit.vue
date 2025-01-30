<template>
  <div class="workbencheEditContainer" :class="{ isDark: isDark }">
    <div class="workbencheEditHeader">
      <div class="leftBar">
        <div class="homeBtn" @click="backHome()">
          <span class="iconfont iconzhuye"></span>
        </div>
      </div>
      <div class="inputBox">
        <el-input
          v-model="name"
          size="mini"
          placeholder=""
          @blur="rename"
          @keyup.enter="rename"
        >
          <template slot="append">.smm</template>
        </el-input>
        <div class="modifyDotBox">
          <div class="modifyDot" v-show="isUnSave"></div>
        </div>
      </div>
      <div class="rightBar"></div>
    </div>
    <Edit></Edit>
  </div>
</template>

<script>
import Edit from '../../Edit/Index.vue'
import { mapState, mapMutations } from 'vuex'
import { replaceFileInRecent } from '@/utils/storage'

export default {
  components: {
    Edit
  },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.localConfig.isDark,
      fileName: state => state.fileName,
      filePath: state => state.filePath,
      isUnSave: state => state.isUnSave
    })
  },
  watch: {
    fileName: {
      immediate: true,
      handler(val) {
        this.name = val
        document.title = val
      }
    },
    name(val) {
      if (!val.trim()) return
      this.setFileName(val.trim())
    }
  },
  created() {
    utools.onPluginOut(isKill => {
      if (isKill && this.filePath) {
        this.$bus.$emit('saveToLocal')
      }
    })
  },
  methods: {
    ...mapMutations(['setFileName', 'setFilePath']),

    // 返回主界面
    backHome() {
      if (this.isUnSave) {
        this.$confirm('有操作尚未保存，是否确认离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: this.isDark ? 'darkElMessageBox' : ''
        })
          .then(async () => {
            this.setFileName('')
            this.setFilePath('')
            this.$router.push({
              name: 'WorkbencheHome'
            })
          })
          .catch(() => {})
        return
      }
      this.setFileName('')
      this.setFilePath('')
      this.$router.push({
        name: 'WorkbencheHome'
      })
    },

    // 重命名文件
    async rename() {
      if (!this.filePath) return
      try {
        const oldPath = this.filePath
        const newPath = await window.electronAPI.rename(
          this.filePath,
          this.name.trim()
        )
        this.setFilePath(newPath)
        replaceFileInRecent(oldPath, newPath)
        this.$bus.$emit('refreshRecentFileList')
        this.$message.success('文件重命名成功')
      } catch (error) {
        this.$message.error('文件重命名失败')
        console.log(error)
      }
    },

    // 询问是否关闭页面
    checkIsClose() {
      return new Promise((resolve, reject) => {
        this.$confirm('有操作尚未保存，是否确认关闭？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: this.isDark ? 'darkElMessageBox' : ''
        })
          .then(async () => {
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.workbencheEditContainer {
  &.isDark {
    .workbencheEditHeader {
      background-color: #262a2e;

      .leftBar {
        .homeBtn {
          color: #fff;

          &:hover {
            background-color: rgb(55, 59, 63);
          }
        }
      }
    }
  }

  .workbencheEditHeader {
    position: relative;
    width: 100%;
    height: 40px;
    background-color: #ebeef1;
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .leftBar {
      margin-left: 12px;
      -webkit-app-region: no-drag;

      .homeBtn {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          background-color: #f5f5f5;
        }

        .iconfont {
        }
      }
    }

    .inputBox {
      -webkit-app-region: no-drag;
      position: absolute;
      height: 100%;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      display: flex;
      align-items: center;

      .modifyDotBox {
        width: 10px;
        height: 10px;
        margin-left: 10px;
        flex-shrink: 0;

        .modifyDot {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #409eff;
        }
      }
    }

    .rightBar {
      -webkit-app-region: no-drag;
      position: absolute;
      right: 0px;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
