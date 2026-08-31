<!-- 事项分类页面 -->
<template>
  <div class="issue-type-page">
    <!-- 筛选卡片 -->
    <ElCard shadow="never" class="filter-card">
      <ElForm :inline="true" :model="filterForm" class="filter-form">
        <ElFormItem label="分类名称">
          <ElInput
            v-model="filterForm.name"
            placeholder="输入分类名称"
            clearable
            style="width: 200px"
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" :icon="Search" @click="handleSearch">搜索</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 表格卡片 -->
    <ElCard shadow="never" class="table-card">
      <div class="table-header">
        <ElButton type="primary" :icon="Plus" class="btn-add" @click="handleAdd">新增</ElButton>
      </div>

      <div class="table-container">
        <ElTable v-loading="loading" :data="tableData" height="100%" style="width: 100%">
          <ElTableColumn prop="name" label="分类名称" min-width="150" />
          <ElTableColumn prop="defaultReviewer" label="默认审核人" min-width="120" />
          <ElTableColumn prop="sort" label="排序" width="80" align="center" />
          <ElTableColumn label="状态" width="100" align="center">
            <template #default="{ row }">
              <ElSwitch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row as IssueType)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="createTime" label="创建时间" width="180" />
          <ElTableColumn label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleEdit(row as IssueType)">编辑</ElButton>
              <ElButton link type="danger" @click="handleDelete(row as IssueType)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </ElCard>

    <!-- 新增/编辑窗口 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="500px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="110px">
        <ElFormItem label="分类名称" prop="name">
          <ElInput
            v-model="form.name"
            placeholder="请输入分类名称"
            :maxlength="50"
            show-word-limit
          />
        </ElFormItem>
        <ElFormItem label="默认审核人">
          <ElSelect
            v-model="form.defaultReviewerId"
            placeholder="请选择默认审核人"
            clearable
            style="width: 100%"
            @change="handleReviewerChange"
          >
            <ElOption
              v-for="item in reviewerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="排序">
          <ElInputNumber v-model="form.sort" :min="0" :max="9999" style="width: 100%" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio :value="1">启用</ElRadio>
            <ElRadio :value="0">停用</ElRadio>
          </ElRadioGroup>
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
  // 事项分类页面：维护业务事项分类，支持筛选、新增、编辑、删除、状态切换
  import { Search, Plus } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { issueTypeApi, getReviewerOptions, type IssueType } from '@/api/systemConfig'

  defineOptions({ name: 'SystemConfigIssueType' })

  const loading = ref(false)
  const tableData = ref<IssueType[]>([])
  const reviewerOptions = ref<{ id: number; name: string }[]>([])

  // 筛选表单
  const filterForm = reactive({ name: '' })

  // 分页
  const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增事项分类')
  const submitLoading = ref(false)
  const formRef = ref<FormInstance>()
  const isEdit = ref(false)

  // 表单数据
  const form = reactive<Partial<IssueType>>({
    name: '',
    defaultReviewer: '',
    defaultReviewerId: null,
    sort: 0,
    status: 1
  })

  // 表单校验规则
  const formRules: FormRules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }

  // 获取列表数据
  const fetchList = async () => {
    loading.value = true
    try {
      const { code, data } = await issueTypeApi.getList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        name: filterForm.name || undefined
      })
      if (code === 200) {
        tableData.value = data.list
        pagination.total = data.total
      }
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.page = 1
    fetchList()
  }

  // 重置筛选
  const handleReset = () => {
    filterForm.name = ''
    pagination.page = 1
    fetchList()
  }

  // 新增
  const handleAdd = () => {
    isEdit.value = false
    dialogTitle.value = '新增事项分类'
    dialogVisible.value = true
  }

  // 编辑
  const handleEdit = (row: IssueType) => {
    isEdit.value = true
    dialogTitle.value = '编辑事项分类'
    Object.assign(form, row)
    dialogVisible.value = true
  }

  // 审核人选择联动：同步 defaultReviewer 名称
  const handleReviewerChange = (id: number | null) => {
    const found = reviewerOptions.value.find((r) => r.id === id)
    form.defaultReviewer = found?.name || ''
  }

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate()
    submitLoading.value = true
    try {
      const api = isEdit.value ? issueTypeApi.update : issueTypeApi.add
      const { code } = await api(form)
      if (code === 200) {
        ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
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
      name: '',
      defaultReviewer: '',
      defaultReviewerId: null,
      sort: 0,
      status: 1
    })
    isEdit.value = false
  }

  // 状态切换
  const handleStatusChange = async (row: IssueType) => {
    try {
      const { code } = await issueTypeApi.updateStatus(row.id, row.status)
      if (code === 200) {
        ElMessage.success('状态更新成功')
      } else {
        // 失败时回滚状态
        row.status = row.status === 1 ? 0 : 1
      }
    } catch {
      row.status = row.status === 1 ? 0 : 1
    }
  }

  // 删除
  const handleDelete = (row: IssueType) => {
    ElMessageBox.confirm('确定要删除该事项分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await issueTypeApi.delete(row.id)
      if (code === 200) {
        ElMessage.success('删除成功')
        fetchList()
      }
    })
  }

  onMounted(() => {
    fetchList()
    // 加载审核人选项
    getReviewerOptions().then(({ code, data }) => {
      if (code === 200) reviewerOptions.value = data
    })
  })
</script>

<style lang="scss" scoped>
  .issue-type-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;

    .filter-card {
      flex-shrink: 0;
      border: none;
      border-radius: 12px;
      box-shadow: none;
    }

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

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
</style>
