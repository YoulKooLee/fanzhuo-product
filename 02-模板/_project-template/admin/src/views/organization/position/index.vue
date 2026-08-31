<script setup lang="ts">
  import { Plus, Search, Upload, Download } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { Position } from '@/types/api'
  import {
    getPositionList,
    addPosition,
    updatePosition,
    deletePosition,
    updatePositionStatus
  } from '@/api/organization'

  defineOptions({ name: 'OrganizationPosition' })

  // 表格相关
  const tableRef = ref()
  const loading = ref(false)
  const tableData = ref<Position[]>([])
  const total = ref(0)

  // 筛选表单
  const filterForm = reactive({
    keyword: '',
    status: ''
  })

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 10
  })

  // 对话框相关
  const dialogVisible = ref(false)
  const dialogTitle = computed(() => (isEditing.value ? '编辑岗位' : '新增岗位'))
  const isEditing = ref(false)
  const submitLoading = ref(false)

  // 表单相关
  const formRef = ref<FormInstance>()
  const form = reactive<Partial<Position>>({
    id: undefined,
    code: '',
    name: '',
    description: '',
    sort: 0
  })

  // 表单验证规则
  const formRules: FormRules = {
    code: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
  }

  // 加载岗位列表
  async function loadPositionList() {
    try {
      loading.value = true
      const res = await getPositionList({
        keyword: filterForm.keyword,
        status: filterForm.status,
        page: pagination.page,
        pageSize: pagination.pageSize
      })
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } catch (error: any) {
      ElMessage.error(error.message || '加载岗位列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  function handleSearch() {
    pagination.page = 1
    loadPositionList()
  }

  // 重置搜索
  function handleReset() {
    filterForm.keyword = ''
    filterForm.status = ''
    pagination.page = 1
    loadPositionList()
  }

  // 新增岗位
  function handleAdd() {
    isEditing.value = false
    dialogVisible.value = true
  }

  // 编辑岗位
  function handleEdit(row: Position) {
    isEditing.value = true
    dialogVisible.value = true
    Object.assign(form, {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      sort: row.sort
    })
  }

  // 删除岗位
  async function handleDelete(row: Position) {
    try {
      await ElMessageBox.confirm(`确定要删除岗位"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await deletePosition(row.id!)
      ElMessage.success('删除成功')
      await loadPositionList()
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  // 状态切换
  async function handleStatusChange(row: Position) {
    try {
      await updatePositionStatus(row.id!, row.status!)
      ElMessage.success('状态更新成功')
    } catch (error: any) {
      ElMessage.error(error.message || '状态更新失败')
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
    }
  }

  // 提交表单
  async function handleSubmit() {
    try {
      await formRef.value?.validate()
      submitLoading.value = true

      if (isEditing.value) {
        await updatePosition(form.id!, form)
        ElMessage.success('更新成功')
      } else {
        await addPosition(form)
        ElMessage.success('新增成功')
      }

      dialogVisible.value = false
      await loadPositionList()
    } catch (error: any) {
      if (error !== false) {
        ElMessage.error(error.message || '操作失败')
      }
    } finally {
      submitLoading.value = false
    }
  }

  // 重置表单
  function resetForm() {
    formRef.value?.resetFields()
    Object.assign(form, {
      id: undefined,
      code: '',
      name: '',
      description: '',
      sort: 0
    })
  }

  // 导入
  function handleImport() {
    ElMessage.info('导入功能开发中...')
  }

  // 导出
  function handleExport() {
    ElMessage.info('导出功能开发中...')
  }

  // 分页改变
  function handlePageChange(page: number) {
    pagination.page = page
    loadPositionList()
  }

  // 每页条数改变
  function handleSizeChange(size: number) {
    pagination.pageSize = size
    pagination.page = 1
    loadPositionList()
  }

  // 初始化
  onMounted(() => {
    loadPositionList()
  })
</script>

<template>
  <div class="organization-position">
    <!-- 筛选卡片 -->
    <ElCard shadow="never" class="filter-card">
      <ElForm :inline="true" :model="filterForm" class="filter-form">
        <ElFormItem label="岗位查询">
          <ElInput
            v-model="filterForm.keyword"
            placeholder="输入岗位编码、岗位名称搜索"
            clearable
            style="width: 240px"
            @keyup.enter="handleSearch"
          />
        </ElFormItem>
        <ElFormItem label="岗位状态">
          <ElSelect v-model="filterForm.status" placeholder="请选择" clearable style="width: 150px">
            <ElOption label="启用" :value="1" />
            <ElOption label="禁用" :value="0" />
          </ElSelect>
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
        <ElButton type="primary" :icon="Plus" @click="handleAdd">新增</ElButton>
        <ElButton :icon="Upload" @click="handleImport">导入</ElButton>
        <ElButton :icon="Download" @click="handleExport">导出</ElButton>
      </div>

      <div class="table-container">
        <ElTable ref="tableRef" :data="tableData" v-loading="loading" border stripe height="100%">
          <ElTableColumn prop="code" label="岗位编码" width="150" align="left" />
          <ElTableColumn prop="name" label="岗位名称" width="200" align="left" />
          <ElTableColumn
            prop="description"
            label="备注"
            min-width="200"
            align="left"
            show-overflow-tooltip
          />
          <ElTableColumn prop="sort" label="排序" width="100" align="center" />
          <ElTableColumn prop="updateTime" label="更新时间" width="180" align="left" />
          <ElTableColumn label="状态" width="100" align="center">
            <template #default="{ row }">
              <ElSwitch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row as Position)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleEdit(row as Position)">编辑</ElButton>
              <ElButton link type="danger" @click="handleDelete(row as Position)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>

      <div class="pagination-container">
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ElCard>

    <!-- 新增/编辑对话框 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="岗位编码" prop="code">
          <ElInput v-model="form.code" placeholder="请输入岗位编码" clearable />
        </ElFormItem>
        <ElFormItem label="岗位名称" prop="name">
          <ElInput v-model="form.name" placeholder="请输入岗位名称" clearable />
        </ElFormItem>
        <ElFormItem label="备注" prop="description">
          <ElInput v-model="form.description" type="textarea" :rows="4" placeholder="请输入备注" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber v-model="form.sort" :min="0" :max="9999" controls-position="right" />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
  .organization-position {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    overflow: hidden;
    padding: 0;
  }

  .filter-card {
    margin-bottom: 16px;
    flex-shrink: 0;
    border-radius: 12px;
    border: none !important;
    box-shadow: none !important;

    :deep(.el-card__body) {
      padding: 12px 20px;
    }
  }

  .filter-form {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .table-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 12px;
    border: none !important;
    box-shadow: none !important;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 20px;
    }
  }

  .table-header {
    display: flex;
    margin-bottom: 16px;

    .el-button:not(:first-child) {
      margin-left: 12px;
    }
  }

  .table-container {
    flex: 1;
    overflow: auto;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
</style>
