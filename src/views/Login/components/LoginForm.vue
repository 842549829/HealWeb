<script setup lang="tsx">
import { reactive, ref, /*watch,*/ onMounted, unref } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { LoginHttpRequest } from '@/api/login'
//import { useAppStore } from '@/store/modules/app'
//import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
//import type { RouteLocationNormalizedLoaded /*RouteRecordRaw*/ } from 'vue-router'
import { TenantOption, UserLoginType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { Icon } from '@/components/Icon'
import { useUserStore } from '@/store/modules/user'
import { BaseButton } from '@/components/Button'
import { parseJwt, type Jwt } from '@/utils/token'

const { required } = useValidator()

const emit = defineEmits(['to-register'])

//const appStore = useAppStore()

const userStore = useUserStore()

//const permissionStore = usePermissionStore()

const { /*currentRoute*,/ /*addRoute,*/ push } = useRouter()

// 创建 LoginHttpRequest 实例
const loginHttpRequest = new LoginHttpRequest()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

// 定义租户选项的响应式变量
const tenantOptions = ref<TenantOption[]>([])

// 模拟延迟加载数据租户数据
const loadTenantOptions = () => {
  const options = [
    {
      label: '租户1',
      value: 'tenant1'
    },
    {
      label: '租户2',
      value: 'tenant2'
    }
  ]
  tenantOptions.value = options
}

// 组件挂载时加载租户数据
onMounted(() => {
  loadTenantOptions()
})

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.login')}</h2>
        }
      }
    }
  },
  {
    field: 'tenantId',
    label: t('login.tenant'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.tenantPlaceholder'),
      options: tenantOptions
    }
  },
  {
    field: 'userName',
    label: t('login.username'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder'),
      // 按下enter键触发登录
      onKeydown: (_e: any) => {
        if (_e.key === 'Enter') {
          _e.stopPropagation() // 阻止事件冒泡
          signIn()
        }
      }
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" />
                <ElLink type="primary" underline={false}>
                  {t('login.forgetPassword')}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%]"
                  onClick={signIn}
                >
                  {t('login.login')}
                </BaseButton>
              </div>
              <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toRegister}>
                  {t('login.register')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'other',
    component: 'Divider',
    label: t('login.otherLogin'),
    componentProps: {
      contentPosition: 'center'
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between w-[100%]">
                <Icon
                  icon="vi-ant-design:github-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="vi-ant-design:wechat-filled"
                  size={iconSize}
                  class="cursor-pointer ant-icon"
                  color={iconColor}
                  hoverColor={hoverColor}
                />
                <Icon
                  icon="vi-ant-design:alipay-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
                <Icon
                  icon="vi-ant-design:weibo-circle-filled"
                  size={iconSize}
                  color={iconColor}
                  hoverColor={hoverColor}
                  class="cursor-pointer ant-icon"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const iconSize = 30

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { userName, password } = loginInfo
    setValues({ userName, password })
  }
}
onMounted(() => {
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

// const redirect = ref<string>('')

// watch(
//   () => currentRoute.value,
//   (route: RouteLocationNormalizedLoaded) => {
//     redirect.value = route?.query?.redirect as string
//   },
//   {
//     immediate: true
//   }
// )

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserLoginType>()
      const userLoginType: UserLoginType = {
        userName: formData.userName,
        password: formData.password,
        remember: unref(remember),
        tenantId: formData.tenantId
      }
      try {
        const res = await loginHttpRequest.loginAsync(userLoginType)

        if (res) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo(userLoginType)
          } else {
            userStore.setLoginInfo(undefined)
          }
          userStore.setRememberMe(unref(remember))

          const jwt: Jwt = parseJwt(res.accessToken)
          res.userId = jwt.payload.sub
          res.username = jwt.payload.given_name
          userStore.setUserInfo(res)

          push('/home')

          // // 是否使用动态路由
          // if (appStore.getDynamicRouter) {
          //   getRole()
          // } else {
          //   await permissionStore.generateRoutes('static').catch(() => {})
          //   permissionStore.getAddRouters.forEach((route) => {
          //     addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
          //   })
          //   permissionStore.setIsAddRouters(true)
          //   push({ path: redirect.value || permissionStore.addRouters[0].path })
          // }
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息
// const getRole = async () => {
//   const res =
//     appStore.getDynamicRouter && appStore.getServerDynamicRouter
//       ? await loginHttpRequest.getPermissionAsync()
//       : []
//   if (res) {
//     const routers = res || []
//     userStore.setRoleRouters(routers)
//     appStore.getDynamicRouter && appStore.getServerDynamicRouter
//       ? await permissionStore.generateRoutes('server', routers).catch(() => {})
//       : await permissionStore.generateRoutes('frontEnd', routers).catch(() => {})

//     permissionStore.getAddRouters.forEach((route) => {
//       addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
//     })
//     permissionStore.setIsAddRouters(true)
//     push({ path: redirect.value || permissionStore.addRouters[0].path })
//   }
// }

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
