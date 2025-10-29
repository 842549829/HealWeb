import { defineStore } from 'pinia'
import { store } from '../index'
import { DictStateList, DictType } from '@/api/common/type'

export const useDictStore = defineStore('dict', {
  state: () => ({
    // 所有字典：key -> 选项数组
    dict: {} as Record<DictType, DictStateList[]>
  }),

  actions: {
    // 设置某个字典
    setDict(name: DictType, data: DictStateList[]) {
      this.dict[name] = data
    },
    // 删除某个字典（用于刷新）
    removeDict(name: DictType) {
      delete this.dict[name]
    },
    // 清空所有
    clearAll() {
      this.dict = {} as Record<DictType, DictStateList[]>
    }
  },

  getters: {
    // 获取字典
    getDict: (state) => (name: string) => state.dict[name] || []
  },
  // 开启持久化存储
  persist: true
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}
