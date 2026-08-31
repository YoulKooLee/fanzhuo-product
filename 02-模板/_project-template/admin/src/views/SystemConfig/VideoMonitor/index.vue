<!-- 监控设备页面 -->
<template>
  <div class="video-monitor-page">
    <!-- 表格卡片 -->
    <ElCard shadow="never" class="table-card">
      <div class="table-header">
        <ElButton type="primary" :icon="Plus" @click="handleAdd">新增</ElButton>
      </div>

      <div class="table-container">
        <ElTable v-loading="loading" :data="tableData" height="100%" style="width: 100%">
          <ElTableColumn prop="deviceName" label="设备名称" min-width="160" />
          <ElTableColumn prop="ipAddress" label="IP地址" width="160" />
          <ElTableColumn prop="port" label="端口" width="100" align="center" />
          <ElTableColumn prop="brand" label="品牌型号" min-width="180" show-overflow-tooltip />
          <ElTableColumn prop="createTime" label="创建时间" width="180" />
          <ElTableColumn label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleTest(toVideoMonitorRow(row))" :loading="row._testing"
                >连接测试</ElButton
              >
              <ElButton link type="primary" @click="handleEdit(toVideoMonitorRow(row))">编辑</ElButton>
              <ElButton link type="danger" @click="handleDelete(toVideoMonitorRow(row))">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </ElCard>

    <!-- 新增/编辑窗口 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="560px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="设备名称" prop="deviceName">
          <ElInput
            v-model="form.deviceName"
            placeholder="请输入设备名称"
            :maxlength="100"
            show-word-limit
          />
        </ElFormItem>
        <ElFormItem label="IP地址" prop="ipAddress">
          <ElInput
            v-model="form.ipAddress"
            placeholder="请输入IP地址，如 192.168.1.100"
            clearable
          />
        </ElFormItem>
        <ElFormItem label="端口" prop="port">
          <ElInputNumber
            v-model="form.port"
            :min="1"
            :max="65535"
            style="width: 100%"
            placeholder="请输入端口号"
          />
        </ElFormItem>
        <ElFormItem label="用户名" prop="username">
          <ElInput v-model="form.username" placeholder="请输入设备登录用户名" clearable />
        </ElFormItem>
        <ElFormItem label="密码" prop="password">
          <ElInput
            v-model="form.password"
            type="password"
            placeholder="请输入设备登录密码"
            show-password
          />
        </ElFormItem>
        <ElFormItem label="品牌型号">
          <ElInput
            v-model="form.brand"
            placeholder="请输入品牌和型号"
            :maxlength="100"
            show-word-limit
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  // 监控设备页面：配置监控设备连接信息，支持新增、编辑、删除、连接测试
  import { Plus } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { videoMonitorApi, testVideoConnection, type VideoMonitor } from '@/api/systemConfig'

  defineOptions({ name: 'SystemConfigVideoMonitor' })

  type VideoMonitorRow = VideoMonitor & { _testing?: boolean }

  const toVideoMonitorRow = (row: unknown): VideoMonitorRow => row as VideoMonitorRow

  const loading = ref(false)
  const tableData = ref<(VideoMonitor & { _testing?: boolean })[]>([])

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增监控设备')
  const submitLoading = ref(false)
  const formRef = ref<FormInstance>()
  const isEdit = ref(false)

  // 表单数据
  const form = reactive<Partial<VideoMonitor>>({
    deviceName: '',
    ipAddress: '',
    port: undefined,
    username: '',
    password: '',
    brand: ''
  })

  // 表单校验规则
  const formRules: FormRules = {
    deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
    ipAddress: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
    port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

  // 获取列表数据
  const fetchList = async () => {
    loading.value = true
    try {
      const { code, data } = await videoMonitorApi.getList()
      if (code === 200) {
        tableData.value = data.list
      }
    } finally {
      loading.value = false
    }
  }

  // 新增
  const handleAdd = () => {
    isEdit.value = false
    dialogTitle.value = '新增监控设备'
    dialogVisible.value = true
  }

  // 编辑
  const handleEdit = (row: VideoMonitor) => {
    isEdit.value = true
    dialogTitle.value = '编辑监控设备'
    Object.assign(form, row)
    dialogVisible.value = true
  }

  // 连接测试
  const handleTest = async (row: VideoMonitor & { _testing?: boolean }) => {
    row._testing = true
    try {
      const { code, message } = await testVideoConnection(row.id)
      if (code === 200) {
        ElMessage.success(message || '连接成功')
      } else {
        ElMessage.error('连接失败，请检查配置信息')
      }
    } catch {
      ElMessage.error('连接失败，请检查配置信息')
    } finally {
      row._testing = false
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate()
    submitLoading.value = true
    try {
      const api = isEdit.value ? videoMonitorApi.update : videoMonitorApi.add
      const { code } = await api(form)
      if (code === 200) {
        ElMessage.success('配置已保存，数字大屏刷新后生效')
        dialogVisible.value = false
        fetchList()
      }
    } finally {
      submitLoading.value = false
    }
  }

  // 重置表单
  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(form, {
      deviceName: '',
      ipAddress: '',
      port: undefined,
      username: '',
      password: '',
      brand: ''
    })
    isEdit.value = false
  }

  // 删除
  const handleDelete = (row: VideoMonitor) => {
    ElMessageBox.confirm('确定要删除该监控设备吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await videoMonitorApi.delete(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchList()
      }
    })
  }

  onMounted(fetchList)
</script>

<style lang="scss" scoped>
  .video-monitor-page {
    display: flex;
    flex-direction: column;
    height: 100%;

    .table-card {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      border: none;
      border-radius: 12px;
      box-shadow: none;

      :deep(.el-card__body) {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        padding: 16px;
      }
    }

    .table-header {
      margin-bottom: 16px;
    }

    .table-container {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
