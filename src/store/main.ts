import { baseComList, baseComponent } from '@/modules/component'
import { useCloud } from '@/utils/request'
import { defineStore } from 'pinia'

export const useMain = defineStore('main', {
  state: () => {
    return {
      pageId: '', // 页面id
      thmbImgFileId: '', // 页面缩略图id
      pageTitle: '', // 网页名称
      pageRouter: '', // 网页地址
      backColor: '#fff', // 页面背景颜色
      pageHeight: 650, // 页面高度
      template: [] as baseComponent[], // 组件数组
      moveIndex: 0, // 当前拖动类型 1-8 坐标点 9 底部高度条 10 按住元素
      hoverCompIndex: -1, //
      activeCompIndex: -1, //
      lockCompId: [] as any[],

      domOffsetX: 0, // 元素距离左上角距离
      domOffsetY: 0,
    }
  },
  getters: {
    acTemp(state) {
      if (state.activeCompIndex != -1) {
        return state.template[state.activeCompIndex].cssModule
      } else {
        return {}
      }
    },
  },
  actions: {
    getTempData() {
      // 获取页面大致数据
      useCloud('pageList')
        .doc(this.pageId)
        .get()
        .then((res) => {
          console.log(res)
          if (res.data.length == 1) {
            this.pageTitle = res.data[0].title
            this.pageRouter = res.data[0].router
            this.thmbImgFileId = res.data[0].thmbImgFileId
          }
        })
      // 获取页面装修数据信息
      useCloud('pageDetails')
        .where({
          pageId: this.pageId,
        })
        .get()
        .then((res) => {
          console.log('详细数据', res.data)
          if (res.data.length == 1) {
            let { template, height, backColor } = res.data[0]
            this.template = template
            this.pageHeight = height
            this.backColor = backColor
          } else {
            console.log('数据异常')
          }
          console.log(this.template)
        })
    },
    addComp(name, data?) {
      let dom = baseComList(name, this.template.length + 1)
      if (dom) {
        if (data) {
          dom.cssModule.top = data.top - dom.cssModule.height / 2
          dom.cssModule.left = data.left - dom.cssModule.width / 2
        }
        this.template.push({ ...dom })
      }
    },
    deleteComp(index) {
      this.template.splice(index, 1)
    },
    toggleComp(index: number) {
      this.activeCompIndex = index
      // 判断是否被锁
      let id = this.template[index].id
      if (!this.lockCompId.includes(id)) {
        this.changeMoveIndex(10)
      } else {
        console.log('被锁住')
      }
    },
    changeMoveIndex(index: number) {
      if (this.moveIndex == 0) {
        this.moveIndex = index
      }
      if (index == 0) {
        this.moveIndex = 0
      }
    },
    savePage(thmbImg, fileID) {
      // 更新页面信息
      let updatePageList = useCloud('pageList').doc(this.pageId).update({
        title: this.pageTitle,
        thmbImg: thmbImg,
        thmbImgFileId: fileID,
      })
      // 保存模板信息
      let updatePageDetails = useCloud('pageDetails')
        .where({
          pageId: this.pageId,
        })
        .update({
          height: this.pageHeight,
          backColor: this.backColor,
          template: this.template,
        })

      return Promise.all([updatePageList, updatePageDetails])
    },
  },
})
