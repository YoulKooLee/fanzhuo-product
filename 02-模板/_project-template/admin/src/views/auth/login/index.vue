<template>
  <div class="login-page">
    <div class="login-layout">
      <div class="login-form-card">
        <div class="login-form-top-logo">
          <ArtLogo :size="56" />
        </div>
        <div class="card-header">
          <h3 class="form-title">欢迎使用{{ systemName }}</h3>
        </div>

        <ElForm
          ref="formRef"
          :model="formData"
          :rules="rules"
          :key="formKey"
          @keyup.enter="handleSubmit"
          class="login-form"
        >
          <ElFormItem prop="username">
            <ElInput
              :placeholder="$t('login.placeholder.username')"
              v-model.trim="formData.username"
            >
              <template #prefix>
                <ElIcon>
                  <User />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>
          <ElFormItem prop="password">
            <ElInput
              :placeholder="$t('login.placeholder.password')"
              v-model.trim="formData.password"
              type="password"
              autocomplete="off"
              show-password
            >
              <template #prefix>
                <ElIcon>
                  <Lock />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <div class="form-options">
            <ElCheckbox v-model="formData.rememberPassword">{{ $t('login.rememberPwd') }}</ElCheckbox>
            <ElButton text class="forget-pwd" @click="openForgetDialog">
              {{ $t('login.forgetPwd') }}
            </ElButton>
          </div>

          <ElButton class="login-btn" type="primary" @click="handleSubmit" :loading="loading">
            {{ $t('login.btnText') }}
          </ElButton>

          <p class="default-account">默认账号：admin / 123456</p>
        </ElForm>
      </div>
    </div>

    <ElDialog
      v-model="forgetDialogVisible"
      title="忘记密码"
      width="520px"
      :close-on-click-modal="false"
      @closed="handleForgetDialogClosed"
    >
      <div v-if="forgetStep === 'email'" class="forget-dialog">
        <p class="forget-dialog-subtitle">{{ $t('forgetPassword.subTitle') }}</p>
        <ElInput
          v-model.trim="forgetEmail"
          :placeholder="$t('forgetPassword.placeholder')"
          clearable
        />

        <div class="forget-dialog-actions">
          <ElButton type="primary" :loading="forgetSending" @click="handleSendReset">
            {{ $t('forgetPassword.submitBtnText') }}
          </ElButton>
          <ElButton @click="forgetDialogVisible = false">取消</ElButton>
        </div>
      </div>

      <div v-else class="forget-dialog">
        <p class="forget-dialog-subtitle">请输入验证码并设置新密码</p>

        <ElInput
          v-model.trim="forgetResetCode"
          :placeholder="'请输入验证码'"
          clearable
        />
        <ElInput
          v-model.trim="forgetNewPassword"
          style="margin-top: 12px"
          type="password"
          :placeholder="'请输入新密码'"
          show-password
          clearable
        />
        <ElInput
          v-model.trim="forgetConfirmPassword"
          style="margin-top: 12px"
          type="password"
          :placeholder="'请再次输入新密码'"
          show-password
          clearable
        />

        <div v-if="USE_MOCK" class="forget-dialog-tip">
          演示验证码：{{ forgetResetCodeFromServer || '123456' }}
        </div>

        <div class="forget-dialog-actions">
          <ElButton type="primary" :loading="forgetResetting" @click="handleResetPassword">
            重置密码
          </ElButton>
          <ElButton @click="handleBackToEmail">返回上一步</ElButton>
        </div>
      </div>
    </ElDialog>

    <p class="copyright">© 2026 {{ systemName }} All Rights Reserved</p>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useUserStore } from '@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  import { HttpError } from '@/utils/http/error'
  import { fetchLogin, resetPasswordByEmail, sendPasswordResetEmail } from '@/api/auth'
  import { ElMessage, ElNotification, type FormInstance, type FormRules } from 'element-plus'
  import { Lock, User } from '@element-plus/icons-vue'

  defineOptions({ name: 'Login' })

  const { t, locale } = useI18n()
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
  const formKey = ref(0)

  // 监听语言切换，重置表单
  watch(locale, () => {
    formKey.value++
  })

  const userStore = useUserStore()
  const router = useRouter()

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: 'admin',
    password: '123456',
    rememberPassword: true
  })

  const rules = computed<FormRules>(() => ({
    username: [{ required: true, message: t('login.placeholder.username'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.placeholder.password'), trigger: 'blur' }]
  }))

  const loading = ref(false)

  // 忘记密码弹窗
  const forgetDialogVisible = ref(false)
  const forgetStep = ref<'email' | 'reset'>('email')
  const forgetEmail = ref('')
  const forgetResetId = ref('')

  const forgetResetCode = ref('')
  const forgetResetCodeFromServer = ref('')
  const forgetNewPassword = ref('')
  const forgetConfirmPassword = ref('')

  const forgetSending = ref(false)
  const forgetResetting = ref(false)

  const openForgetDialog = () => {
    forgetDialogVisible.value = true
    forgetStep.value = 'email'
    forgetEmail.value = ''
    forgetResetId.value = ''
    forgetResetCode.value = ''
    forgetResetCodeFromServer.value = ''
    forgetNewPassword.value = ''
    forgetConfirmPassword.value = ''
    forgetSending.value = false
    forgetResetting.value = false
  }

  const handleForgetDialogClosed = () => {
    forgetSending.value = false
    forgetResetting.value = false
  }

  const handleSendReset = async () => {
    if (!forgetEmail.value) {
      ElMessage.error('请输入电子邮件')
      return
    }

    try {
      forgetSending.value = true
      const { code, data, message } = await sendPasswordResetEmail({ email: forgetEmail.value })
      if (code === 200 && data) {
        forgetResetId.value = data.resetId
        forgetResetCodeFromServer.value = data.code || ''
        forgetResetCode.value = ''
        forgetStep.value = 'reset'
        ElMessage.success(message || '已发送找回邮件，请查收')
      } else {
        throw new Error(message || '发送失败')
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '发送失败')
    } finally {
      forgetSending.value = false
    }
  }

  const handleBackToEmail = () => {
    forgetStep.value = 'email'
    forgetResetCode.value = ''
    forgetNewPassword.value = ''
    forgetConfirmPassword.value = ''
  }

  const handleResetPassword = async () => {
    if (!forgetResetId.value) {
      ElMessage.error('请先发送找回邮件')
      return
    }
    if (!forgetResetCode.value) {
      ElMessage.error('请输入验证码')
      return
    }
    if (!forgetNewPassword.value) {
      ElMessage.error('请输入新密码')
      return
    }
    if (forgetNewPassword.value !== forgetConfirmPassword.value) {
      ElMessage.error('两次输入的密码不一致')
      return
    }

    try {
      forgetResetting.value = true
      const { code, data, message } = await resetPasswordByEmail({
        resetId: forgetResetId.value,
        code: forgetResetCode.value,
        newPassword: forgetNewPassword.value
      })
      if (code === 200 && data) {
        ElMessage.success(message || '密码重置成功')
        // 为了让登录更顺畅：直接把登录密码填为新密码（账号仍需用户确认）
        formData.password = forgetNewPassword.value
        forgetDialogVisible.value = false
      } else {
        throw new Error(message || '重置失败')
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '重置失败')
    } finally {
      forgetResetting.value = false
    }
  }

  // 登录
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      // 表单验证
      const valid = await formRef.value.validate()
      if (!valid) return

      loading.value = true

      // 登录请求
      const { username, password } = formData

      const { code, data, message } = await fetchLogin({
        userName: username,
        password,
        captchaCode: '', // Mock 模式不需要验证码
        captchaId: ''
      })

      // 检查响应状态
      if (code === 200 && data) {
        const { token, refreshToken, user } = data

        // 验证token和用户信息
        if (!token) {
          throw new Error('Login failed - no token received')
        }
        if (!user) {
          throw new Error('Login failed - no user info received')
        }

        // 存储token和用户信息
        userStore.setToken(token, refreshToken)
        userStore.setUserInfo(user)
        userStore.setLoginStatus(true)

        // 登录成功处理
        showLoginSuccessNotice()
        router.push('/')
      } else {
        // 响应状态异常
        throw new Error(message || 'Login failed')
      }
    } catch (error) {
      // 处理 HttpError
      if (error instanceof HttpError) {
        console.error('[Login] Login failed:', error)
      } else {
        console.error('[Login] Unexpected error:', error)
      }
    } finally {
      loading.value = false
    }
  }

  // 登录成功提示
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${systemName}!`
      })
    }, 150)
  }
</script>

<style lang="scss" scoped>
  @use './index';
</style>
