<!-- 平台参数页面 -->
<template>
  <div class="basic-config">
    <ElCard shadow="never" class="config-card">
      <template #header>
        <span>平台运行参数</span>
      </template>

      <ElForm
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        style="max-width: 600px"
        v-loading="loading"
      >
        <!-- 系统名称 -->
        <ElFormItem label="系统名称" prop="systemName">
          <ElInput v-model="form.systemName" placeholder="请输入系统名称" clearable />
        </ElFormItem>

        <!-- 系统 Logo -->
        <ElFormItem label="系统 Logo">
          <ElInput v-model="form.systemLogo" placeholder="请输入 Logo 图片地址" clearable />
        </ElFormItem>

        <!-- 系统描述 -->
        <ElFormItem label="系统描述">
          <ElInput
            v-model="form.systemDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入系统描述"
          />
        </ElFormItem>

        <!-- 时区 -->
        <ElFormItem label="默认时区">
          <ElSelect v-model="form.timezone" placeholder="请选择时区" style="width: 100%">
            <ElOption label="Asia/Shanghai（UTC+8）" value="Asia/Shanghai" />
            <ElOption label="Asia/Tokyo（UTC+9）" value="Asia/Tokyo" />
            <ElOption label="UTC（UTC+0）" value="UTC" />
          </ElSelect>
        </ElFormItem>

        <!-- 日期格式 -->
        <ElFormItem label="日期格式">
          <ElSelect v-model="form.dateFormat" placeholder="请选择日期格式" style="width: 100%">
            <ElOption label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
            <ElOption label="YYYY/MM/DD HH:mm:ss" value="YYYY/MM/DD HH:mm:ss" />
            <ElOption label="YYYY-MM-DD" value="YYYY-MM-DD" />
          </ElSelect>
        </ElFormItem>

        <!-- 保存按钮 -->
        <ElFormItem>
          <ElButton type="primary" :loading="saving" @click="handleSave">保存</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  // 平台参数页面：配置系统名称、Logo、描述、时区、日期格式
  import type { FormInstance, FormRules } from 'element-plus'
  import { getBasicConfig, saveBasicConfig, type BasicConfig } from '@/api/systemConfig'

  defineOptions({ name: 'SystemConfigBasic' })

  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const saving = ref(false)

  // 表单数据
  const form = reactive<BasicConfig>({
    systemName: '',
    systemLogo: '',
    systemDesc: '',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD HH:mm:ss'
  })

  // 表单校验规则
  const formRules: FormRules = {
    systemName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }]
  }

  // 加载配置数据
  const fetchConfig = async () => {
    loading.value = true
    try {
      const { code, data } = await getBasicConfig()
      if (code === 200 && data) {
        Object.assign(form, data)
      }
    } finally {
      loading.value = false
    }
  }

  // 保存配置
  const handleSave = async () => {
    await formRef.value?.validate()
    saving.value = true
    try {
      const { code, message } = await saveBasicConfig({ ...form })
      if (code === 200) {
        ElMessage.success(message || '配置已保存，刷新页面后生效')
      }
    } finally {
      saving.value = false
    }
  }

  onMounted(fetchConfig)
</script>

<style lang="scss" scoped>
  .basic-config {
    height: 100%;

    .config-card {
      /* 配置卡片样式 */
      border: none;
      border-radius: 12px;
      box-shadow: none;
    }
  }
</style>
