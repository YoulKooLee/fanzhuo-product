<template>
  <div class="permission-role">
    <!-- 筛选卡片 -->
    <ElCard shadow="never" class="filter-card">
      <ElForm :inline="true" :model="filterForm" class="filter-form">
        <ElFormItem label="角色名称">
          <ElInput
            v-model="filterForm.name"
            placeholder="输入角色名称"
            clearable
            style="width: 200px"
          />
        </ElFormItem>
        <ElFormItem label="角色状态">
          <ElSelect v-model="filterForm.status" placeholder="请选择" clearable style="width: 150px">
            <ElOption label="启用" :value="1" />
            <ElOption label="禁用" :value="0" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" :icon="Search" @click="handleSearch">搜索</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 表格卡片 -->
    <ElCard shadow="never" class="table-card">
      <div class="table-header">
        <ElButton type="primary" :icon="Plus" @click="handleAdd">新增</ElButton>
      </div>

      <div class="table-container">
        <ElTable v-loading="loading" :data="tableData" height="100%" style="width: 100%">
          <ElTableColumn prop="id" label="ID" width="80" align="center" />
          <ElTableColumn prop="name" label="名称" min-width="150" />
          <ElTableColumn prop="description" label="备注" min-width="200" show-overflow-tooltip />
          <ElTableColumn prop="userCount" label="授权人数" width="120" align="center" />
          <ElTableColumn prop="sort" label="排序" width="100" align="center" />
          <ElTableColumn prop="createTime" label="创建时间" width="180" />
          <ElTableColumn label="状态" width="100" align="center">
            <template #default="{ row }">
              <ElSwitch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row as Role)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="250" align="center" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleEdit(row as Role)">编辑</ElButton>
              <ElButton link type="primary" @click="handleAssignPermissions(row as Role)"
                >分配权限</ElButton
              >
              <ElButton link type="danger" @click="handleDelete(row as Role)">删除</ElButton>
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
          @size-change="fetchRoleList"
          @current-change="fetchRoleList"
        />
      </div>
    </ElCard>

    <!-- 新增/编辑对话框 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="角色代码" prop="code">
          <ElInput v-model="form.code" placeholder="请输入角色代码（英文）" />
        </ElFormItem>
        <ElFormItem label="角色名称" prop="name">
          <ElInput v-model="form.name" placeholder="请输入角色名称" />
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="form.description" type="textarea" :rows="3" placeholder="请输入备注" />
        </ElFormItem>
        <ElFormItem label="排序">
          <ElInputNumber v-model="form.sort" :min="0" :max="9999" style="width: 100%" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElRadioGroup v-model="form.status">
            <ElRadio :value="1">启用</ElRadio>
            <ElRadio :value="0">禁用</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 分配权限对话框 -->
    <ElDialog
      v-model="permissionDialogVisible"
      title="分配权限"
      width="600px"
      @closed="resetPermissionForm"
    >
      <div class="permission-tree-container">
        <div class="tree-header">
          <ElCheckbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选/不全选
          </ElCheckbox>
          <ElButton link @click="handleExpandAll">
            {{ isExpandAll ? '折叠' : '展开' }}
          </ElButton>
        </div>
        <ElTree
          ref="treeRef"
          :data="menuTreeData"
          :props="{ label: 'title', children: 'children' }"
          node-key="id"
          show-checkbox
          :default-expand-all="isExpandAll"
          :default-checked-keys="checkedMenuIds"
          @check="handleTreeCheck"
        />
      </div>
      <template #footer>
        <ElButton @click="permissionDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmitPermissions">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, Plus } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { Role, Menu } from '@/types/api'
  import {
    getRoleList,
    addRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    assignRolePermissions
  } from '@/api/organization'
  import { getMenuList } from '@/api/organization'

  defineOptions({ name: 'PermissionRole' })

  // 筛选表单
  const filterForm = reactive({
    name: '',
    status: undefined as number | undefined
  })

  // 表格数据
  const loading = ref(false)
  const tableData = ref<Role[]>([])

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 对话框
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const formRef = ref<FormInstance>()
  const form = reactive<Partial<Role>>({
    code: '',
    name: '',
    description: '',
    sort: 0,
    status: 1
  })

  // 表单验证规则
  const formRules: FormRules = {
    code: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
  }

  // 分配权限对话框
  const permissionDialogVisible = ref(false)
  const currentRole = ref<Role | null>(null)
  const menuTreeData = ref<Menu[]>([])
  const treeRef = ref()
  const checkedMenuIds = ref<number[]>([])
  const checkAll = ref(false)
  const isIndeterminate = ref(false)
  const isExpandAll = ref(true)

  // 获取角色列表
  const fetchRoleList = async () => {
    loading.value = true
    try {
      const params = {
        name: filterForm.name || undefined,
        status: filterForm.status,
        page: pagination.page,
        pageSize: pagination.pageSize
      }
      const res = await getRoleList(params)
      if (res.code === 200) {
        tableData.value = res.data.list || []
        pagination.total = res.data.total || 0
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
      ElMessage.error('获取角色列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.page = 1
    fetchRoleList()
  }

  // 新增
  const handleAdd = () => {
    dialogTitle.value = '新增角色'
    dialogVisible.value = true
  }

  // 编辑
  const handleEdit = (row: Role) => {
    dialogTitle.value = '编辑角色'
    Object.assign(form, {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      sort: row.sort,
      status: row.status
    })
    dialogVisible.value = true
  }

  // 删除
  const handleDelete = async (row: Role) => {
    try {
      await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      const res = await deleteRole(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchRoleList()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('删除角色失败:', error)
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  // 状态切换
  const handleStatusChange = async (row: Role) => {
    try {
      const res = await updateRoleStatus(row.id, row.status!)
      if (res.code === 200) {
        ElMessage.success('状态更新成功')
      } else {
        ElMessage.error(res.message || '状态更新失败')
        row.status = row.status === 1 ? 0 : 1
      }
    } catch (error) {
      console.error('更新状态失败:', error)
      ElMessage.error('状态更新失败')
      row.status = row.status === 1 ? 0 : 1
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          const data = { ...form }
          let res
          if (form.id) {
            res = await updateRole(form.id, data)
          } else {
            res = await addRole(data)
          }

          if (res.code === 200) {
            ElMessage.success(form.id ? '更新成功' : '新增成功')
            dialogVisible.value = false
            fetchRoleList()
          } else {
            ElMessage.error(res.message || '操作失败')
          }
        } catch (error) {
          console.error('提交失败:', error)
          ElMessage.error('操作失败')
        }
      }
    })
  }

  // 重置表单
  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(form, {
      id: undefined,
      code: '',
      name: '',
      description: '',
      sort: 0,
      status: 1
    })
  }

  // 分配权限
  const handleAssignPermissions = async (row: Role) => {
    currentRole.value = row
    permissionDialogVisible.value = true

    // 获取菜单列表
    try {
      const res = await getMenuList()
      if (res.code === 200) {
        menuTreeData.value = res.data || []
        // 设置已选中的菜单
        checkedMenuIds.value = row.menuIds || []
        // 更新全选状态
        updateCheckAllStatus()
      }
    } catch (error) {
      console.error('获取菜单列表失败:', error)
      ElMessage.error('获取菜单列表失败')
    }
  }

  // 展开/折叠
  const handleExpandAll = () => {
    isExpandAll.value = !isExpandAll.value
    const nodes = treeRef.value?.store?.nodesMap
    if (nodes) {
      Object.values(nodes).forEach((node: any) => {
        node.expanded = isExpandAll.value
      })
    }
  }

  // 全选/不全选
  const handleCheckAllChange = (val: any) => {
    if (val) {
      // 全选：获取所有菜单ID
      const allMenuIds = getAllMenuIds(menuTreeData.value)
      treeRef.value?.setCheckedKeys(allMenuIds)
    } else {
      // 不全选：清空所有选中
      treeRef.value?.setCheckedKeys([])
    }
    isIndeterminate.value = false
  }

  // 获取所有菜单ID
  const getAllMenuIds = (menus: Menu[]): number[] => {
    const ids: number[] = []
    const traverse = (items: Menu[]) => {
      items.forEach((item) => {
        ids.push(item.id)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      })
    }
    traverse(menus)
    return ids
  }

  // 树节点勾选变化
  const handleTreeCheck = () => {
    updateCheckAllStatus()
  }

  // 更新全选状态
  const updateCheckAllStatus = () => {
    const checkedCount = treeRef.value?.getCheckedKeys().length || 0
    const allCount = getAllMenuIds(menuTreeData.value).length
    checkAll.value = checkedCount === allCount
    isIndeterminate.value = checkedCount > 0 && checkedCount < allCount
  }

  // 提交权限分配
  const handleSubmitPermissions = async () => {
    if (!currentRole.value) return

    try {
      // 获取选中的菜单ID（包括半选中的父节点）
      const checkedKeys = treeRef.value?.getCheckedKeys() || []
      const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
      const menuIds = [...checkedKeys, ...halfCheckedKeys]

      const res = await assignRolePermissions(currentRole.value.id, menuIds)
      if (res.code === 200) {
        ElMessage.success('分配权限成功')
        permissionDialogVisible.value = false
        fetchRoleList()
      } else {
        ElMessage.error(res.message || '分配权限失败')
      }
    } catch (error) {
      console.error('分配权限失败:', error)
      ElMessage.error('分配权限失败')
    }
  }

  // 重置权限表单
  const resetPermissionForm = () => {
    currentRole.value = null
    menuTreeData.value = []
    checkedMenuIds.value = []
    checkAll.value = false
    isIndeterminate.value = false
  }

  // 初始化
  onMounted(() => {
    fetchRoleList()
  })
</script>

<style lang="scss" scoped>
  .permission-role {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    overflow: hidden;
    padding: 0;

    .filter-card {
      margin-bottom: 16px;
      border-radius: 12px;
      border: none !important;
      box-shadow: none !important;
      flex-shrink: 0;

      :deep(.el-card__body) {
        padding: 12px 20px;
      }

      .filter-form {
        margin-bottom: 0;
        display: flex;
        align-items: center;

        :deep(.el-form-item) {
          margin-bottom: 0;
        }
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
        padding: 16px;
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

    .permission-tree-container {
      max-height: 500px;
      overflow: auto;

      .tree-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
</style>
