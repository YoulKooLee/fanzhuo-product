<template>
  <div class="login register">
    <LoginLeftView></LoginLeftView>
    <div class="right-wrap">
      <AuthTopBar />
      <div class="header">
        <ArtLogo class="icon" />
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
          <div class="input-wrap">
            <ElInput
              v-if="forgetStep === 'email'"
              :placeholder="$t('forgetPassword.placeholder')"
              v-model.trim="email"
              clearable
            />

            <ElInput
              v-else
              :placeholder="'请输入验证码'"
              v-model.trim="resetCode"
              clearable
            />
          </div>

          <div v-if="forgetStep === 'reset'" class="input-wrap">
            <ElInput
              type="password"
              :placeholder="'请输入新密码'"
              v-model.trim="newPassword"
              show-password
              clearable
            />
            <ElInput
              style="margin-top: 12px"
              type="password"
              :placeholder="'请再次输入新密码'"
              v-model.trim="confirmPassword"
              show-password
              clearable
            />
          </div>

          <div style="margin-top: 15px">
            <ElButton
              class="login-btn"
              type="primary"
              @click="handleSubmit"
              :loading="loading"
              v-ripple
            >
              {{ forgetStep === 'email' ? $t('forgetPassword.submitBtnText') : '重置密码' }}
            </ElButton>
          </div>

          <div style="margin-top: 15px">
            <ElButton class="back-btn" plain @click="toLogin">
              {{ $t('forgetPassword.backBtnText') }}
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { resetPasswordByEmail, sendPasswordResetEmail } from '@/api/auth'
  import { ElMessage } from 'element-plus'

  defineOptions({ name: 'ForgetPassword' })

  const router = useRouter()
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

  const systemName = AppConfig.systemInfo.name
  const forgetStep = ref<'email' | 'reset'>('email')
  const email = ref('')
  const resetId = ref('')
  const resetCode = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')

  const loading = ref(false)

  const handleSubmit = async () => {
    if (forgetStep.value === 'email') {
      if (!email.value) {
        ElMessage.error('请输入电子邮件')
        return
      }

      try {
        loading.value = true
        const { code, data, message } = await sendPasswordResetEmail({ email: email.value })
        if (code === 200 && data) {
          resetId.value = data.resetId
          resetCode.value = USE_MOCK ? data.code || '123456' : ''
          forgetStep.value = 'reset'
          ElMessage.success(message || '已发送找回邮件，请查收')
        } else {
          throw new Error(message || '发送失败')
        }
      } catch (error: any) {
        ElMessage.error(error?.message || '发送失败')
      } finally {
        loading.value = false
      }
      return
    }

    // reset
    if (!resetCode.value) {
      ElMessage.error('请输入验证码')
      return
    }
    if (!newPassword.value) {
      ElMessage.error('请输入新密码')
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      ElMessage.error('两次输入的密码不一致')
      return
    }

    try {
      loading.value = true
      const { code, data, message } = await resetPasswordByEmail({
        resetId: resetId.value,
        code: resetCode.value,
        newPassword: newPassword.value
      })

      if (code === 200 && data) {
        ElMessage.success(message || '密码重置成功')
        router.push({ name: 'Login' })
      } else {
        throw new Error(message || '重置失败')
      }
    } catch (error: any) {
      ElMessage.error(error?.message || '重置失败')
    } finally {
      loading.value = false
    }
  }

  const toLogin = () => {
    router.push({ name: 'Login' })
  }
</script>

<style lang="scss" scoped>
  @use '../login/index';
</style>
