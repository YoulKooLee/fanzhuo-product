<template>
  <div class="permission-menu">
    <!-- 筛选卡片 -->
    <ElCard shadow="never" class="filter-card">
      <ElForm :inline="true" :model="filterForm" class="filter-form">
        <ElFormItem label="菜单名称">
          <ElInput
            v-model="filterForm.name"
            placeholder="输入菜单名称"
            clearable
            style="width: 200px"
          />
        </ElFormItem>
        <ElFormItem label="菜单状态">
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
        <ElButton type="primary" :icon="Plus" @click="handleAdd()">新增</ElButton>
        <ElButton @click="toggleExpand">{{ isExpanded ? '折叠' : '展开' }}</ElButton>
      </div>

      <div class="table-container">
        <ElTable
          ref="tableRef"
          v-loading="loading"
          :data="tableData"
          :key="tableKey"
          row-key="id"
          :tree-props="{ children: 'children' }"
          :default-expand-all="isExpanded"
          height="100%"
          style="width: 100%"
        >
          <ElTableColumn prop="title" label="菜单名称" min-width="200" />
          <ElTableColumn label="类型" width="100" align="center">
            <template #default="{ row }">
              <ElTag v-if="row.type === 'directory'" type="warning">目录</ElTag>
              <ElTag v-else-if="row.type === 'menu'" type="success">菜单</ElTag>
              <ElTag v-else-if="row.type === 'button'" type="info">按钮</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="图标" width="80" align="center">
            <template #default="{ row }">
              <i v-if="row.icon" class="iconfont-sys" v-html="row.icon"></i>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="permission" label="权限标识" width="200" />
          <ElTableColumn prop="sort" label="排序" width="100" align="center" />
          <ElTableColumn prop="updateTime" label="更新时间" width="180" />
          <ElTableColumn label="状态" width="100" align="center">
            <template #default="{ row }">
              <ElSwitch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row as Menu)"
              />
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleAdd(row.id)">新增</ElButton>
              <ElButton link type="primary" @click="handleEdit(row as Menu)">编辑</ElButton>
              <ElButton link type="danger" @click="handleDelete(row as Menu)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </ElCard>

    <!-- 新增/编辑对话框 -->
    <ElDialog v-model="dialogVisible" :title="dialogTitle" width="600px" @closed="resetForm">
      <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <ElFormItem label="菜单类型" prop="type">
          <ElRadioGroup v-model="form.type">
            <ElRadio value="directory">目录</ElRadio>
            <ElRadio value="menu">菜单</ElRadio>
            <ElRadio value="button">按钮</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="菜单名称" prop="title">
          <ElInput v-model="form.title" placeholder="请输入菜单名称" />
        </ElFormItem>
        <ElFormItem label="上级菜单">
          <ElTreeSelect
            v-model="form.parentId"
            :data="menuTreeOptions"
            :props="{ label: 'title' }"
            node-key="id"
            placeholder="请选择上级菜单"
            clearable
            check-strictly
            :render-after-expand="false"
            style="width: 100%"
          />
        </ElFormItem>
        <ElFormItem v-if="form.type !== 'button'" label="路由名称" prop="name">
          <ElInput v-model="form.name" placeholder="请输入路由名称（英文）" />
        </ElFormItem>
        <ElFormItem v-if="form.type !== 'button'" label="路由路径" prop="path">
          <ElInput v-model="form.path" placeholder="请输入路由路径" />
        </ElFormItem>
        <ElFormItem v-if="form.type === 'menu'" label="组件路径" prop="component">
          <ElInput v-model="form.component" placeholder="请输入组件路径" />
        </ElFormItem>
        <ElFormItem v-if="form.type !== 'button'" label="菜单图标">
          <ElInput v-model="form.icon" placeholder="请输入图标Unicode（如：&#xe88a;）" />
        </ElFormItem>
        <ElFormItem label="权限标识" prop="permission">
          <ElInput v-model="form.permission" placeholder="请输入权限标识（如：menu:view）" />
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, Plus } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { Menu } from '@/types/api'
  import {
    getMenuList,
    addMenu,
    updateMenu,
    deleteMenu,
    updateMenuStatus
  } from '@/api/organization'

  defineOptions({ name: 'PermissionMenu' })

  // 筛选表单
  const filterForm = reactive({
    name: '',
    status: undefined as number | undefined
  })

  // 表格数据
  const loading = ref(false)
  const tableData = ref<Menu[]>([])
  const isExpanded = ref(true)
  const tableRef = ref()
  const tableKey = ref(0)

  // 对话框
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const formRef = ref<FormInstance>()
  const form = reactive<Partial<Menu>>({
    type: 'menu',
    title: '',
    name: '',
    path: '',
    component: '',
    icon: '',
    permission: '',
    sort: 0,
    status: 1,
    parentId: undefined
  })

  // 表单验证规则
  const formRules: FormRules = {
    type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
    title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    permission: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  }

  // 菜单树选项（用于上级菜单选择）
  const menuTreeOptions = computed(() => {
    // 过滤掉按钮类型的菜单，只显示目录和菜单
    const filterButtons = (menus: Menu[]): Menu[] => {
      return menus
        .filter((menu) => menu.type !== 'button')
        .map((menu) => ({
          ...menu,
          children: menu.children ? filterButtons(menu.children) : undefined
        }))
    }
    return filterButtons(tableData.value)
  })

  // 获取菜单列表
  const fetchMenuList = async () => {
    loading.value = true
    try {
      const params = {
        name: filterForm.name || undefined,
        status: filterForm.status
      }
      const res = await getMenuList(params)
      if (res.code === 200) {
        tableData.value = res.data || []
      }
    } catch (error) {
      console.error('获取菜单列表失败:', error)
      ElMessage.error('获取菜单列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    fetchMenuList()
  }

  // 展开/折叠
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    tableKey.value++
  }

  // 新增
  const handleAdd = (parentId?: number) => {
    dialogTitle.value = '新增菜单'
    form.parentId = parentId
    dialogVisible.value = true
  }

  // 编辑
  const handleEdit = (row: Menu) => {
    dialogTitle.value = '编辑菜单'
    Object.assign(form, {
      id: row.id,
      type: row.type,
      title: row.title,
      name: row.name,
      path: row.path,
      component: row.component,
      icon: row.icon,
      permission: row.permission,
      sort: row.sort,
      status: row.status,
      parentId: row.parentId
    })
    dialogVisible.value = true
  }

  // 删除
  const handleDelete = async (row: Menu) => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      const res = await deleteMenu(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchMenuList()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('删除菜单失败:', error)
        ElMessage.error(error.message || '删除失败')
      }
    }
  }

  // 状态切换
  const handleStatusChange = async (row: Menu) => {
    try {
      const res = await updateMenuStatus(row.id, row.status!)
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
            res = await updateMenu(form.id, data)
          } else {
            res = await addMenu(data)
          }

          if (res.code === 200) {
            ElMessage.success(form.id ? '更新成功' : '新增成功')
            dialogVisible.value = false
            fetchMenuList()
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
      type: 'menu',
      title: '',
      name: '',
      path: '',
      component: '',
      icon: '',
      permission: '',
      sort: 0,
      status: 1,
      parentId: undefined
    })
  }

  // 初始化
  onMounted(() => {
    fetchMenuList()
  })
</script>

<style lang="scss" scoped>
  .permission-menu {
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
        align-items: center;
        margin-bottom: 16px;

        .el-button:not(:first-child) {
          margin-left: 12px;
        }
      }

      .table-container {
        flex: 1;
        overflow: auto;
      }
    }

    .iconfont-sys {
      font-size: 18px;
    }
  }
</style>
