import { computed, ref } from 'vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { BaseDict, EnumDict } from '@/api/common/const'
import { DictType, DictStateList, DefaultValueType } from '@/api/common/type'
import {
  dictDataSourceMap,
  enumDataSource,
  commonDictDataSource,
  extractDefaultValue
} from '@/api/common/dictDataSourceMap'

export function useDict(type: DictType) {
  const store = useDictStoreWithOut()
  const loading = ref(false)
  const defaultLoading = ref(false) // 控制默认值加载
  const defaultValueCache = ref<DefaultValueType>(null) // 缓存默认值（value）

  // 当前字典是否已加载
  const isLoaded = computed(() => !!store.dict[type])

  // 懒加载
  const load = async () => {
    if (isLoaded.value) return
    await loadFresh()
  }

  // 强制重新加载（数据 + 默认值）
  const refresh = async () => {
    store.removeDict(type)
    defaultValueCache.value = null
    await loadFresh()
  }

  // 是否是需要调用默认接口的类型
  const needDefaultApi = computed(() => {
    return isBaseDict(type)
  })

  // 获取默认值接口数据
  const fetchDefaultFromApi = async (type: DictType): Promise<DefaultValueType> => {
    try {
      const action = extractDefaultValue[type]
      if (needDefaultApi.value && typeof action === 'function') {
        return await action[type](type)
      }
      return null
    } catch (error) {
      console.warn(`获取默认值接口失败 (${type}):`, error)
      return null
    }
  }

  // 加载字典数据
  const loadFresh = async () => {
    if (!type) {
      console.warn(`字典映射未定义: ${type}`)
      return
    }

    loading.value = true
    try {
      const data = await getDictApi(type)
      store.setDict(type, data)

      // 数据加载后，尝试加载默认值（仅对 needDefaultApi 类型）
      if (needDefaultApi.value) {
        await loadDefaultFromApi(type)
      }
    } catch (error) {
      console.error(`加载字典 ${type} 失败`, error)
    } finally {
      loading.value = false
    }
  }

  // 单独加载默认值（避免阻塞主数据）
  const loadDefaultFromApi = async (type: DictType) => {
    if (!needDefaultApi.value) return

    defaultLoading.value = true
    try {
      const defaultValue = await fetchDefaultFromApi(type)
      if (defaultValue !== null && defaultValue !== undefined) {
        defaultValueCache.value = defaultValue
      }
      // 如果接口无值，不设置 cache，后续 fallback 到第一个启用项
    } catch (error) {
      console.warn(`加载默认值失败:`, error)
    } finally {
      defaultLoading.value = false
    }
  }

  const getDictApi = async (type: DictType): Promise<DictStateList[]> => {
    // 1. 先看是否有特殊处理（如 user、department）
    if (needDefaultApi.value && dictDataSourceMap[type]) {
      return await dictDataSourceMap[type](type)
    }

    // 2. 判断是否为枚举
    if (isEnumValue(type)) {
      return await enumDataSource(type)
    }

    // 3. 默认：普通字典
    return await commonDictDataSource(type)
  }

  const isBaseDict = (value: DictType): boolean => {
    for (const baseDictValue of Object.values(BaseDict)) {
      if (baseDictValue === value) return true
    }
    return false
  }

  const isEnumValue = (value: DictType): boolean => {
    for (const enumValue of Object.values(EnumDict)) {
      if (enumValue === value) return true
    }
    return false
  }

  // 新增：计算 options
  const options = computed<DictStateList[]>(() => store.getDict(type) || [])

  // 新增：根据 value 查找 label
  const formatLabel = (value: any): string => {
    if (!value && value !== 0) return '-'
    const item = options.value.find((d) => d.value === value)
    return item ? item.label : '-'
  }

  // 新增：计算默认值
  const defaultValue = computed<DefaultValueType>(() => {
    // 1. 如果是 user/department 类型，且已有接口返回的默认值
    if (needDefaultApi.value && defaultValueCache.value !== null) {
      return defaultValueCache.value
    }

    // 2. fallback：从 options 中找第一个 isEnabled !== false 的项
    const enabledItem = options.value.find((item) => item.disabled == false)
    if (enabledItem) {
      return enabledItem.value
    }

    // 3. 再 fallback：返回第一个项
    return options.value.length > 0 ? options.value[0].value : null
  })

  // 自动加载
  if (!isLoaded.value) {
    load()
  }

  // 在 useDict 内部，添加：
  const getDictName = computed(() => {
    return (value: string | number): string => {
      if (!value) return ''
      const item = options.value.find((item) => item.value === value)
      return item ? item.label : ''
    }
  })

  return {
    options,
    loading: computed(() => loading.value),
    defaultLoading: computed(() => defaultLoading.value),
    refresh,
    formatLabel,
    defaultValue,
    reloadDefault: loadDefaultFromApi,
    getDictName
  }
}
