<template>
  <div class="organization-user">
    <div class="user-layout">
      <!-- 左侧：部门树卡片 -->
      <ElCard shadow="never" class="dept-tree-card">
        <div class="tree-header">
          <span class="tree-title">部门列表</span>
        </div>
        <ElInput v-model="deptFilterText" placeholder="请输入内容" clearable class="tree-search" />
        <ElScrollbar class="tree-container">
          <ElTree
            ref="treeRef"
            :data="departmentTree"
            :props="{ label: 'name', children: 'children' }"
            :filter-node-method="filterNode"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleDeptClick"
          />
        </ElScrollbar>
      </ElCard>

      <!-- 右侧：筛选 + 表格 -->
      <div class="user-content">
        <!-- 筛选卡片 -->
        <ElCard shadow="never" class="filter-card">
          <ElForm :model="filterForm" class="filter-form-content">
            <ElFormItem label="员工查询">
              <ElInput
                v-model="filterForm.keyword"
                placeholder="输入姓名/账号/手机号"
                clearable
                style="width: 220px"
              />
            </ElFormItem>
            <ElFormItem label="员工状态">
              <ElSelect
                v-model="filterForm.status"
                placeholder="请选择"
                clearable
                style="width: 150px"
              >
                <ElOption label="启用" :value="1" />
                <ElOption label="禁用" :value="0" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label=" ">
              <div class="filter-buttons">
                <ElButton type="primary" :icon="Search" @click="handleSearch">搜索</ElButton>
                <ElButton @click="handleReset">重置</ElButton>
              </div>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <!-- 表格卡片 -->
        <ElCard shadow="never" class="table-card">
          <div class="table-header">
            <ElButton type="primary" :icon="Plus" @click="handleAdd">新增</ElButton>
            <ElButton @click="handleImport">导入</ElButton>
            <ElButton @click="handleExport">导出</ElButton>
            <ElButton :disabled="selectedRows.length === 0" @click="handleBatchSetPosition"
              >设置岗位</ElButton
            >
            <ElButton :disabled="selectedRows.length === 0" @click="handleBatchSetRole"
              >设置角色</ElButton
            >
            <ElButton type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete"
              >批量删除</ElButton
            >
          </div>

          <div class="table-container">
            <ElTable
              ref="tableRef"
              v-loading="loading"
              :data="tableData"
              height="100%"
              @selection-change="handleSelectionChange"
            >
              <ElTableColumn type="selection" width="55" fixed="left" />
              <ElTableColumn prop="realName" label="姓名" width="120" fixed="left" />
              <ElTableColumn prop="username" label="账号" width="120" />
              <ElTableColumn prop="departmentName" label="所属部门" min-width="160" />
              <ElTableColumn prop="positionName" label="岗位" width="120" />
              <ElTableColumn label="角色" width="140">
                <template #default="{ row }">
                  {{ row.roles?.map((r: any) => r.name).join(', ') || '-' }}
                </template>
              </ElTableColumn>
              <ElTableColumn prop="phone" label="手机号" width="130" />
              <ElTableColumn label="状态" width="100" align="center">
                <template #default="{ row }">
                  <ElSwitch
                    v-model="row.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handleStatusChange(row as AdminUser)"
                  />
                </template>
              </ElTableColumn>
              <ElTableColumn label="操作" width="150" align="center" fixed="right">
                <template #default="{ row }">
                  <ElButton link type="primary" @click="handleEdit(row as AdminUser)">编辑</ElButton>
                  <ElButton link type="danger" @click="handleDelete(row as AdminUser)">删除</ElButton>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>

          <div class="pagination-container">
            <ElPagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="
                () => {
                  pagination.page = 1
                  loadUserList()
                }
              "
              @current-change="loadUserList"
            />
          </div>
        </ElCard>
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="姓名" prop="realName">
          <ElInput v-model="form.realName" placeholder="请输入姓名" />
        </ElFormItem>
        <ElFormItem label="账号" prop="username">
          <ElInput v-model="form.username" :disabled="isEditing" placeholder="请输入账号" />
        </ElFormItem>
        <ElFormItem label="所属部门" prop="departmentId">
          <ElTreeSelect
            v-model="form.departmentId"
            :data="departmentTree"
            :props="{ label: 'name' }"
            node-key="id"
            placeholder="请选择部门"
            clearable
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem label="岗位">
          <ElInput v-model="form.positionName" placeholder="请输入岗位" />
        </ElFormItem>
        <ElFormItem label="手机号">
          <ElInput v-model="form.phone" placeholder="请输入手机号" />
        </ElFormItem>
        <ElFormItem label="邮箱">
          <ElInput v-model="form.email" placeholder="请输入邮箱" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 批量设置岗位对话框 -->
    <ElDialog v-model="positionDialogVisible" title="设置岗位" width="400px">
      <ElForm :model="positionForm" label-width="80px">
        <ElFormItem label="岗位">
          <ElInput v-model="positionForm.positionName" placeholder="请输入岗位" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="positionDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmSetPosition">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 批量设置角色对话框 -->
    <ElDialog v-model="roleDialogVisible" title="设置角色" width="400px">
      <ElForm :model="roleForm" label-width="80px">
        <ElFormItem label="角色">
          <ElSelect
            v-model="roleForm.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <ElOption label="系统管理员" :value="1" />
            <ElOption label="普通用户" :value="2" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="roleDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmSetRole">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import { Search, Plus } from '@element-plus/icons-vue'
  import { userApi, batchSetPosition, batchSetRole, type AdminUser } from '@/api/user'
  import { departmentApi, type Department } from '@/api/department'

  defineOptions({ name: 'OrganizationUser' })

  // 部门树
  const treeRef = ref()
  const deptFilterText = ref('')
  const departmentTree = ref<Department[]>([])
  const selectedDeptId = ref<number>()

  // 表格
  const tableRef = ref()
  const loading = ref(false)
  const tableData = ref<AdminUser[]>([])
  const selectedRows = ref<AdminUser[]>([])

  const filterForm = reactive({ keyword: '', status: '' as any })

  const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

  // 对话框
  const dialogVisible = ref(false)
  const isEditing = ref(false)
  const dialogTitle = computed(() => (isEditing.value ? '编辑用户' : '新增用户'))
  const submitLoading = ref(false)

  const formRef = ref<FormInstance>()
  const form = reactive<Partial<AdminUser>>({
    id: undefined,
    realName: '',
    username: '',
    departmentId: undefined,
    positionName: '',
    phone: '',
    email: ''
  })

  const formRules: FormRules = {
    realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }]
  }

  const positionDialogVisible = ref(false)
  const positionForm = reactive({ positionName: '' })

  const roleDialogVisible = ref(false)
  const roleForm = reactive({ roleIds: [] as number[] })

  // 部门树加载
  async function loadDepartmentList() {
    try {
      const res = await departmentApi.getList()
      const deptList = res.data.list || []
      departmentTree.value = [
        { id: 0, name: '全部', children: [], parentId: null } as Department,
        ...deptList
      ]
    } catch (error: any) {
      ElMessage.error(error.message || '加载部门列表失败')
    }
  }

  watch(deptFilterText, (val) => treeRef.value?.filter(val))

  const filterNode = (value: string, data: any) => !value || data.name.includes(value)

  function handleDeptClick(data: Department) {
    selectedDeptId.value = data.id === 0 ? undefined : data.id
    pagination.page = 1
    loadUserList()
  }

  // 用户列表加载
  async function loadUserList() {
    loading.value = true
    try {
      const res = await userApi.getList({
        keyword: filterForm.keyword || undefined,
        departmentId: selectedDeptId.value,
        status: filterForm.status !== '' ? filterForm.status : undefined,
        page: pagination.page,
        pageSize: pagination.pageSize
      })
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    } catch (error: any) {
      ElMessage.error(error.message || '加载用户列表失败')
    } finally {
      loading.value = false
    }
  }

  function handleSearch() {
    pagination.page = 1
    loadUserList()
  }

  function handleReset() {
    filterForm.keyword = ''
    filterForm.status = ''
    pagination.page = 1
    loadUserList()
  }

  function handleSelectionChange(selection: AdminUser[]) {
    selectedRows.value = selection
  }

  function handleAdd() {
    isEditing.value = false
    dialogVisible.value = true
  }

  function handleEdit(row: AdminUser) {
    isEditing.value = true
    dialogVisible.value = true
    Object.assign(form, {
      id: row.id,
      realName: row.realName,
      username: row.username,
      departmentId: row.departmentId,
      positionName: row.positionName,
      phone: row.phone,
      email: row.email
    })
  }

  async function handleDelete(row: AdminUser) {
    try {
      await ElMessageBox.confirm(`确定要删除用户"${row.realName}"吗？`, '提示', { type: 'warning' })
      await userApi.delete(row.id)
      ElMessage.success('删除成功')
      loadUserList()
    } catch (error: any) {
      if (error !== 'cancel') ElMessage.error(error.message || '删除失败')
    }
  }

  async function handleStatusChange(row: AdminUser) {
    try {
      await userApi.updateStatus(row.id, row.status!)
      ElMessage.success('状态更新成功')
    } catch (error: any) {
      ElMessage.error(error.message || '状态更新失败')
      row.status = row.status === 1 ? 0 : 1
    }
  }

  async function handleSubmit() {
    try {
      await formRef.value?.validate()
      submitLoading.value = true
      if (isEditing.value) {
        await userApi.update(form)
        ElMessage.success('更新成功')
      } else {
        await userApi.add(form)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadUserList()
    } catch (error: any) {
      if (error !== false) ElMessage.error(error.message || '操作失败')
    } finally {
      submitLoading.value = false
    }
  }

  function resetForm() {
    formRef.value?.resetFields()
    Object.assign(form, {
      id: undefined,
      realName: '',
      username: '',
      departmentId: undefined,
      positionName: '',
      phone: '',
      email: ''
    })
  }

  async function handleBatchDelete() {
    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
        '提示',
        { type: 'warning' }
      )
      const ids = selectedRows.value.map((row) => row.id)
      await userApi.batchDelete(ids)
      ElMessage.success('批量删除成功')
      loadUserList()
    } catch (error: any) {
      if (error !== 'cancel') ElMessage.error(error.message || '批量删除失败')
    }
  }

  function handleBatchSetPosition() {
    positionDialogVisible.value = true
  }

  async function handleConfirmSetPosition() {
    if (!positionForm.positionName) {
      ElMessage.warning('请输入岗位')
      return
    }
    const ids = selectedRows.value.map((row) => row.id)
    await batchSetPosition(ids, positionForm.positionName)
    ElMessage.success('设置岗位成功')
    positionDialogVisible.value = false
    positionForm.positionName = ''
    loadUserList()
  }

  function handleBatchSetRole() {
    roleDialogVisible.value = true
  }

  async function handleConfirmSetRole() {
    if (roleForm.roleIds.length === 0) {
      ElMessage.warning('请选择角色')
      return
    }
    const ids = selectedRows.value.map((row) => row.id)
    await batchSetRole(ids, roleForm.roleIds)
    ElMessage.success('设置角色成功')
    roleDialogVisible.value = false
    roleForm.roleIds = []
    loadUserList()
  }

  function handleImport() {
    ElMessage.info('导入功能开发中')
  }

  function handleExport() {
    ElMessage.info('导出功能开发中')
  }

  onMounted(async () => {
    await loadDepartmentList()
    await nextTick()
    treeRef.value?.setCurrentKey(0)
    loadUserList()
  })
</script>

<style lang="scss" scoped>
  .organization-user {
    height: 100%;
    display: flex;
    flex-direction: column;

    .user-layout {
      display: flex;
      gap: 16px;
      height: 100%;
      overflow: hidden;

      .dept-tree-card {
        width: 280px;
        flex-shrink: 0;
        border-radius: 12px;
        border: none !important;
        box-shadow: none !important;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        :deep(.el-card__body) {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 20px;
        }

        .tree-header {
          margin-bottom: 16px;

          .tree-title {
            font-size: 16px;
            font-weight: 500;
          }
        }

        .tree-search {
          margin-bottom: 16px;
        }

        .tree-container {
          flex: 1;
          overflow: hidden;
        }
      }

      .user-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow: hidden;

        .filter-card {
          flex-shrink: 0;
          border: none !important;
          box-shadow: none !important;
          border-radius: 12px;

          :deep(.el-card__body) {
            padding: 12px 20px;
          }

          .filter-form-content {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;

            :deep(.el-form-item) {
              margin-bottom: 0;
            }
          }

          .filter-buttons {
            display: flex;

            .el-button:not(:first-child) {
              margin-left: 12px;
            }
          }
        }

        .table-card {
          flex: 1;
          border: none !important;
          box-shadow: none !important;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          :deep(.el-card__body) {
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .table-header {
            flex-shrink: 0;
            margin-bottom: 16px;
            display: flex;

            .el-button:not(:first-child) {
              margin-left: 12px;
            }
          }

          .table-container {
            flex: 1;
            overflow: hidden;
          }

          .pagination-container {
            flex-shrink: 0;
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
          }
        }
      }
    }
  }
</style>
