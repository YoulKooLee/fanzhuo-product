<!-- 消息通知页面 -->
<template>
  <div class="announcement-page">
    <!-- 表格卡片 -->
    <ElCard shadow="never" class="table-card">
      <div class="table-header">
        <ElButton type="primary" :icon="Plus" @click="handleAdd">新增</ElButton>
      </div>

      <div class="table-container">
        <ElTable v-loading="loading" :data="tableData" height="100%" style="width: 100%">
          <ElTableColumn prop="title" label="消息标题" min-width="200" show-overflow-tooltip />
          <ElTableColumn prop="publishTime" label="发布时间" width="180" />
          <ElTableColumn label="状态" width="100" align="center">
            <template #default="{ row }">
              <ElTag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <!-- 草稿/已撤回可编辑 -->
              <ElButton
                v-if="row.status !== 'published'"
                link
                type="primary"
                @click="handleEdit(row as Announcement)"
                >编辑</ElButton
              >
              <!-- 草稿可发布 -->
              <ElButton
                v-if="row.status === 'draft'"
                link
                type="primary"
                @click="handlePublish(row as Announcement)"
                >发布</ElButton
              >
              <!-- 已发布可撤回 -->
              <ElButton
                v-if="row.status === 'published'"
                link
                type="warning"
                @click="handleRecall(row as Announcement)"
                >撤回</ElButton
              >
              <!-- 草稿/已撤回可删除 -->
              <ElButton link type="danger" @click="handleDelete(row as Announcement)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </ElCard>

    <!-- 新增/编辑窗口 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="700px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="消息标题" prop="title">
          <ElInput
            v-model="form.title"
            placeholder="请输入消息标题"
            :maxlength="100"
            show-word-limit
          />
        </ElFormItem>
        <ElFormItem label="消息内容" prop="content">
          <!-- 富文本编辑器占位：使用 ElInput textarea 代替，实际项目可替换为 WangEditor -->
          <ElInput v-model="form.content" type="textarea" :rows="8" placeholder="请输入消息内容" />
        </ElFormItem>
        <ElFormItem label="附件">
          <div class="attachment-list" v-if="form.attachments && form.attachments.length">
            <div v-for="(file, idx) in form.attachments" :key="idx" class="attachment-item">
              <span>{{ file.name }}</span>
              <ElButton link type="danger" @click="removeAttachment(idx)">删除</ElButton>
            </div>
          </div>
          <ElButton
            :icon="Upload"
            @click="handleUploadAttachment"
            :disabled="(form.attachments?.length ?? 0) >= 5"
          >
            上传附件（最多5个）
          </ElButton>
          <div class="upload-tip">单文件最大 50MB</div>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  // 消息通知页面：发布和管理系统消息，支持新增、编辑、发布、撤回、删除
  import { Plus, Upload } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import {
    announcementApi,
    publishAnnouncement,
    recallAnnouncement,
    type Announcement
  } from '@/api/systemConfig'

  defineOptions({ name: 'SystemConfigAnnouncement' })

  const loading = ref(false)
  const tableData = ref<Announcement[]>([])

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增消息')
  const submitLoading = ref(false)
  const formRef = ref<FormInstance>()
  const isEdit = ref(false)

  // 表单数据
  const form = reactive<Partial<Announcement>>({
    title: '',
    content: '',
    attachments: []
  })

  // 表单校验规则
  const formRules: FormRules = {
    title: [{ required: true, message: '请输入消息标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入消息内容', trigger: 'blur' }]
  }

  // 状态标签类型
  const statusTagType = (
    status: string
  ): 'primary' | 'success' | 'info' | 'warning' | 'danger' | undefined => {
    const map: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
      draft: 'info',
      published: 'success',
      recalled: 'warning'
    }
    return map[status] || 'info'
  }

  // 状态文字
  const statusLabel = (status: string) => {
    const map: Record<string, string> = { draft: '草稿', published: '已发布', recalled: '已撤回' }
    return map[status] || status
  }

  // 获取列表数据
  const fetchList = async () => {
    loading.value = true
    try {
      const { code, data } = await announcementApi.getList()
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
    dialogTitle.value = '新增消息'
    dialogVisible.value = true
  }

  // 编辑（仅草稿/已撤回）
  const handleEdit = (row: Announcement) => {
    isEdit.value = true
    dialogTitle.value = '编辑消息'
    Object.assign(form, { ...row, attachments: [...(row.attachments || [])] })
    dialogVisible.value = true
  }

  // 上传附件（Mock：直接添加模拟文件）
  const handleUploadAttachment = () => {
    if (!form.attachments) form.attachments = []
    if (form.attachments.length >= 5) return
    form.attachments.push({
      name: `附件${form.attachments.length + 1}.pdf`,
      url: '/files/mock.pdf'
    })
  }

  // 删除附件
  const removeAttachment = (idx: number) => {
    form.attachments?.splice(idx, 1)
  }

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate()
    submitLoading.value = true
    try {
      const api = isEdit.value ? announcementApi.update : announcementApi.add
      const payload = isEdit.value
        ? form
        : { ...form, status: 'draft' as const, publishTime: null as string | null }
      const { code } = await api(payload)
      if (code === 200) {
        ElMessage.success('保存成功')
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
    Object.assign(form, { title: '', content: '', attachments: [] })
    isEdit.value = false
  }

  // 发布公告
  const handlePublish = (row: Announcement) => {
    ElMessageBox.confirm('确定发布该消息吗？发布后全员可见', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await publishAnnouncement(row.id)
      if (code === 200) {
        ElMessage.success('发布成功')
        fetchList()
      }
    })
  }

  // 撤回公告
  const handleRecall = (row: Announcement) => {
    ElMessageBox.confirm('确定撤回该消息吗？撤回后全员不可见', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await recallAnnouncement(row.id)
      if (code === 200) {
        ElMessage.success('消息已撤回')
        fetchList()
      }
    })
  }

  // 删除公告（已发布不可删除）
  const handleDelete = (row: Announcement) => {
    if (row.status === 'published') {
      ElMessage.warning('请先撤回消息再删除')
      return
    }
    ElMessageBox.confirm('确定要删除该消息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await announcementApi.delete(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchList()
      }
    })
  }

  onMounted(fetchList)
</script>

<style lang="scss" scoped>
  .announcement-page {
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

    .attachment-list {
      margin-bottom: 8px;

      .attachment-item {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 4px;
        font-size: 13px;
        color: var(--el-text-color-regular);
      }
    }

    .upload-tip {
      margin-top: 4px;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }
</style>
