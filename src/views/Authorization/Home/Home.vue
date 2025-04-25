<script setup lang="ts">
import { ElCard, ElRow, ElCol, ElInput } from 'element-plus'
import { Icon } from '@/components/Icon'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { UserInfo } from '@/components/UserInfo'
import { getListAsync } from '@/api/menu/index'

const { t } = useI18n()
const router = useRouter()
const searchText = ref('')
interface Card {
  id: number
  title: string
  path: string
}

const cardList = ref<Card[]>([
  { id: 1, title: '系统管理', path: 'https://www.baidu.com' },
  { id: 2, title: '用户管理', path: 'https://www.baidu.com' },
  { id: 3, title: '角色管理', path: '/dashboard/analysis' },
  { id: 4, title: '权限管理', path: '/dashboard/analysis' },
  { id: 5, title: '菜单管理', path: '/dashboard/analysis' },
  { id: 6, title: '部门管理', path: '/dashboard/analysis' },
  { id: 7, title: '岗位管理', path: '/dashboard/analysis' },
  { id: 8, title: '字典管理', path: '/dashboard/analysis' },
  { id: 9, title: '参数设置', path: '/dashboard/analysis' },
  { id: 10, title: '通知公告', path: '/dashboard/analysis' }
])

// 计算属性：过滤后的卡片列表
const filteredCardList = computed(() => {
  if (!searchText.value) return cardList.value // 如果搜索框为空，返回完整列表
  const lowerCaseSearchText = searchText.value.toLowerCase()
  return cardList.value.filter((card) => card.title.toLowerCase().includes(lowerCaseSearchText))
})

const handleCardClick = async (path: string) => {
  await getListAsync('sdsss')
  if (path.startsWith('http')) {
    window.open(path, '_blank')
  } else {
    router.push(path)
  }
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
        <template v-if="filteredCardList?.length">
          <ElCol
            v-for="card in filteredCardList"
            :key="card.id"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4.8"
            class="mb-6"
          >
            <ElCard
              class="w-full h-150px flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#409eff]/90 custom-card"
              @click="handleCardClick(card.path)"
            >
              <p class="text-white text-lg">{{ card.title }}</p>
            </ElCard>
          </ElCol>
        </template>
        <ElCol v-else :span="24">
          <div class="flex flex-col items-center justify-center h-[200px] text-gray-400">
            <Icon icon="mdi:file-outline" :size="128" class="text-[64px] mb-4 text-[#409EFF]/60" />
            <span class="text-lg">暂无模块权限</span>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style scoped>
/* 移除之前的 el-select 相关样式 */
:deep(.el-card) {
  cursor: pointer;
  background-color: rgb(64 158 255 / 80%) !important;
  border: none;
  border-radius: 12px !important;
  backdrop-filter: blur(4px);
  transform-origin: center;
}

:deep(.el-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgb(0 0 0 / 10%);
}

:deep(.el-input__wrapper) {
  background-color: rgb(255 255 255 / 90%);
  backdrop-filter: blur(4px);
}
</style>
