<!-- 资料中心页面 -->
<template>
  <div class="document-page">
    <!-- 表格卡片 -->
    <ElCard shadow="never" class="table-card">
      <div class="table-header">
        <ElButton type="primary" :icon="Upload" @click="handleUpload">上传</ElButton>
      </div>

      <div class="table-container">
        <ElTable v-loading="loading" :data="tableData" height="100%" style="width: 100%">
          <ElTableColumn prop="name" label="资料名称" min-width="200" show-overflow-tooltip />
          <ElTableColumn prop="category" label="分类" width="140" />
          <ElTableColumn prop="createTime" label="上传时间" width="180" />
          <ElTableColumn label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <!-- PDF 支持预览，其他格式仅下载 -->
              <ElButton
                v-if="row.fileType === 'pdf'"
                link
                type="primary"
                @click="handlePreview(row as PolicyDocument)"
                >预览</ElButton
              >
              <ElButton link type="primary" @click="handleDownload(row as PolicyDocument)">下载</ElButton>
              <ElButton link type="primary" @click="handleEdit(row as PolicyDocument)">编辑</ElButton>
              <ElButton link type="danger" @click="handleDelete(row as PolicyDocument)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </ElCard>

    <!-- 上传/编辑窗口 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="资料名称" prop="name">
          <ElInput
            v-model="form.name"
            placeholder="请输入资料名称"
            :maxlength="100"
            show-word-limit
          />
        </ElFormItem>
        <ElFormItem label="资料分类">
          <ElSelect v-model="form.category" placeholder="请选择分类" clearable style="width: 100%">
            <ElOption v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
          </ElSelect>
        </ElFormItem>
        <!-- 上传模式才显示文件选择 -->
        <ElFormItem v-if="!isEdit" label="文件" prop="fileUrl">
          <div class="file-upload-area">
            <ElButton :icon="Upload" @click="handleSelectFile">选择文件</ElButton>
            <span v-if="form.name && isEdit === false && selectedFileName" class="file-name">
              {{ selectedFileName }}
            </span>
            <div class="upload-tip">支持 PDF、Word、Excel 格式，单文件最大 50MB</div>
          </div>
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
  // 资料中心页面：上传和管理企业资料文件，支持预览（PDF）、下载、编辑、删除
  import { Upload } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { documentApi, type PolicyDocument } from '@/api/systemConfig'
  import { documentCategories } from '@/mock/systemConfig'

  defineOptions({ name: 'SystemConfigDocument' })

  const loading = ref(false)
  const tableData = ref<PolicyDocument[]>([])
  const categoryOptions = documentCategories

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('上传资料')
  const submitLoading = ref(false)
  const formRef = ref<FormInstance>()
  const isEdit = ref(false)
  const selectedFileName = ref('')

  // 表单数据
  const form = reactive<Partial<PolicyDocument>>({
    name: '',
    category: '',
    fileUrl: '',
    fileType: ''
  })

  // 表单校验规则
  const formRules: FormRules = {
    name: [{ required: true, message: '请输入资料名称', trigger: 'blur' }],
    fileUrl: [{ required: true, message: '请选择文件', trigger: 'change' }]
  }

  // 获取列表数据
  const fetchList = async () => {
    loading.value = true
    try {
      const { code, data } = await documentApi.getList()
      if (code === 200) {
        tableData.value = data.list
      }
    } finally {
      loading.value = false
    }
  }

  // 上传（新增）
  const handleUpload = () => {
    isEdit.value = false
    dialogTitle.value = '上传资料'
    selectedFileName.value = ''
    dialogVisible.value = true
  }

  // 编辑（仅修改名称和分类）
  const handleEdit = (row: PolicyDocument) => {
    isEdit.value = true
    dialogTitle.value = '编辑资料'
    Object.assign(form, row)
    dialogVisible.value = true
  }

  // 选择文件（Mock：模拟文件选择）
  const handleSelectFile = () => {
    const mockFiles = ['员工手册.pdf', '操作指引.docx', '申请模板.xlsx']
    const mockFile = mockFiles[Math.floor(Math.random() * mockFiles.length)]
    selectedFileName.value = mockFile
    const ext = mockFile.split('.').pop() || 'pdf'
    form.fileUrl = `/files/${mockFile}`
    form.fileType = ext
    // 自动填充文档名称（如果为空）
    if (!form.name) {
      form.name = mockFile.replace(/\.[^.]+$/, '')
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    // 编辑模式不校验 fileUrl
    if (!isEdit.value) {
      await formRef.value?.validate()
    } else {
      const valid = await formRef.value?.validateField('name').catch(() => false)
      if (!valid) return
    }
    submitLoading.value = true
    try {
      const api = isEdit.value ? documentApi.update : documentApi.add
      const { code } = await api(form)
      if (code === 200) {
        ElMessage.success(isEdit.value ? '更新成功' : '上传成功')
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
    Object.assign(form, { name: '', category: '', fileUrl: '', fileType: '' })
    selectedFileName.value = ''
    isEdit.value = false
  }

  // 预览（PDF）
  const handlePreview = (row: PolicyDocument) => {
    window.open(row.fileUrl, '_blank')
  }

  // 下载
  const handleDownload = (row: PolicyDocument) => {
    const a = document.createElement('a')
    a.href = row.fileUrl
    a.download = row.name
    a.click()
  }

  // 删除
  const handleDelete = (row: PolicyDocument) => {
    ElMessageBox.confirm('确定要删除该文档吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await documentApi.delete(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchList()
      }
    })
  }

  onMounted(fetchList)
</script>

<style lang="scss" scoped>
  .document-page {
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

    .file-upload-area {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .file-name {
        font-size: 13px;
        color: var(--el-text-color-regular);
      }

      .upload-tip {
        font-size: 12px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
</style>
