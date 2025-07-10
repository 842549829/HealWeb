<script setup lang="ts">
import { ElCard, ElRow, ElCol, ElInput, ElSkeleton } from 'element-plus'
import { Icon } from '@/components/Icon'
import { computed, ref, onMounted, watch, unref } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { UserInfo } from '@/components/UserInfo'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import type { ModuleHomeListDto } from '@/api/home/type'
import { HomeHttpRequest } from '@/api/home/index'
import { useUserStore } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useTagsView } from '@/hooks/web/useTagsView'

// 创建 HomeHttpRequest 实例
const homeHttpRequest = new HomeHttpRequest()

const tagsViewStore = useTagsViewStore()
const setSelectTag = tagsViewStore.setSelectedTag
const { closeAll } = useTagsView()

const { currentRoute, addRoute, push, removeRoute } = useRouter()

const appStore = useAppStore()

const userStore = useUserStore()

const permissionStore = usePermissionStore()

const { t } = useI18n()

const searchText = ref('')

const redirect = ref<string>('')

const loading = ref(false)

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 挂载时执行
onMounted(async () => {
  try {
    loading.value = true
    cardList.value = await homeHttpRequest.getModuleHomeListAsync()
  } catch (error) {
    console.error('Failed to fetch module list:', error)
    cardList.value = [] // Set empty array as fallback
  } finally {
    loading.value = false
  }
})

// 模块列表
const cardList = ref<ModuleHomeListDto[]>([])

// 计算属性：过滤后的卡片列表
const filteredCardList = computed(() => {
  if (!searchText.value) return cardList.value // 如果搜索框为空，返回完整列表
  const lowerCaseSearchText = searchText.value.toLowerCase()
  return cardList.value.filter((card) => card.title.toLowerCase().includes(lowerCaseSearchText))
})

const isAppCustomRouteRecordRaw = (item: any): item is AppCustomRouteRecordRaw => {
  return typeof item === 'object' && item !== null && 'path' in item
}

// 移除路由
const removeRoutes = () => {
  const oldRouters = userStore.getRoleRouters
  if (oldRouters && Array.isArray(oldRouters)) {
    for (let i = 0; i < oldRouters.length; i++) {
      const item = oldRouters[i]
      if (isAppCustomRouteRecordRaw(item)) {
        removeRoute(item.path)
      } else {
        removeRoute(item)
      }
    }
    userStore.setRoleRouters([])
    permissionStore.setIsAddRouters(false)
  }
}

// 获取菜单信息
const getMenu = async (moduleName: string) => {
  removeRoutes()
  const res =
    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await homeHttpRequest.getMenuListAsync(moduleName)
      : []
  if (res) {
    const routers = res || []
    userStore.setRoleRouters(routers)

    appStore.getDynamicRouter && appStore.getServerDynamicRouter
      ? await permissionStore.generateRoutes('server', routers).catch(() => {})
      : await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}

// 点击卡片事件
const handleCardClick = async (module: ModuleHomeListDto) => {
  if (module.path.startsWith('http')) {
    window.open(module.path, '_blank')
  } else {
    await getMenu(module.moduleName)

    // 切换的时候关闭其他标签
    closeAllTags()
  }
}

// 去最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(permissionStore.getAddRouters[0].path)
  }
}

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    setSelectTag(unref(currentRoute))
    tagsViewStore.addView(unref(currentRoute))
  }
}

// 关闭全部
const closeAllTags = () => {
  closeAll(() => {
    toLastView()
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#409eff]/10 to-[#409eff]/20">
    <!-- 替换语言切换器 -->
    <div class="absolute top-4 right-8">
      <div class="flex justify-end items-center space-x-10px">
        <ThemeSwitch />
        <LocaleDropdown class="lt-xl:text-white dark:text-white" />
        <UserInfo />
      </div>
    </div>

    <div class="px-8 sm:px-16 md:px-32 lg:px-64 pt-10">
      <ElRow :gutter="20" class="mb-10">
        <ElCol :span="24">
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-4xl font-bold text-center text-[#409EFF] tracking-wider">{{
              t('home.welcome')
            }}</h1>
            <div class="w-20 h-1 bg-[#409EFF]/60 rounded-full"></div>
            <p class="text-gray-500 mt-2">{{ t('home.selectModule') }}</p>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20" class="mb-10">
        <ElCol :span="24">
          <ElInput
            v-model="searchText"
            :placeholder="t('home.searchPlaceholder')"
            class="w-full shadow-sm"
            size="large"
          />
        </ElCol>
      </ElRow>

      <ElRow class="p-5" :gutter="24">
        <!-- 加载中 -->
        <template v-if="loading">
          <ElCol v-for="n in 12" :key="n" :xs="12" :sm="8" :md="6" :lg="4.8" class="mb-6">
            <ElCard class="skeleton-card w-full h-150px flex items-center justify-center">
              <ElSkeleton :rows="3" animated />
            </ElCard>
          </ElCol>
        </template>
        <template v-else-if="filteredCardList?.length">
          <ElCol
            v-for="card in filteredCardList"
            :key="card.path"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4.8"
            class="mb-6"
          >
            <ElCard
              class="w-full h-150px flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#409eff]/90 custom-card"
              @click="handleCardClick(card)"
            >
              <p class="text-white text-lg">{{ card.title }}</p>
            </ElCard>
          </ElCol>
        </template>
        <ElCol v-else :span="24">
          <div class="flex flex-col items-center justify-center h-[200px] text-gray-400">
            <Icon icon="mdi:file-outline" :size="128" class="text-[64px] mb-4 text-[#409EFF]/60" />
            <span class="text-lg">{{ t('home.noAccessModule') }}</span>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style scoped>
/* 移除之前的 el-select 相关样式 */
:deep(.el-card.skeleton-card) {
  /* 针对骨架屏卡片的样式 */
  background-color: transparent !important;
  border: none;
  border-radius: initial !important;
  backdrop-filter: none;
}

:deep(.el-card:not(.skeleton-card)) {
  cursor: pointer;
  background-color: rgb(64 158 255 / 80%) !important;
  border: none;
  border-radius: 12px !important;
  backdrop-filter: blur(4px);
  transform-origin: center;
}

:deep(.el-card:hover:not(.skeleton-card)) {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgb(0 0 0 / 10%);
}

:deep(.el-input__wrapper) {
  background-color: rgb(255 255 255 / 90%);
  backdrop-filter: blur(4px);
}
</style>
