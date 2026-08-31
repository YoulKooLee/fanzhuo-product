<!-- 系统首页：登录后默认落地页，当前为占位布局，后续可替换为仪表盘等业务内容 -->
<template>
  <div class="page-container system-home-page">
    <!-- 欢迎横幅占位 -->
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-inner">
        <p class="welcome-label">您好，欢迎使用</p>
        <h2 class="welcome-title">{{ systemName }}</h2>
        <p class="welcome-desc">系统首页内容建设中，后续可在此放置概览、快捷入口或数据看板。</p>
      </div>
    </el-card>

    <!-- 内容区占位：空状态提示 -->
    <el-card class="placeholder-card" shadow="never">
      <el-empty description="功能模块开发中，敬请期待" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'

  defineOptions({ name: 'SystemHomePage' })

  // 与顶部栏系统名称一致，便于识别当前环境
  const systemName = AppConfig.systemInfo.name
</script>

<style scoped lang="scss">
  .system-home-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;
  }

  /* 与 README 列表页卡片风格一致：无边框、圆角 */
  .welcome-card,
  .placeholder-card {
    flex-shrink: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 12px;

    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  /* 占位主区域可随窗口增高，空状态垂直居中 */
  .placeholder-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 280px;
    overflow: hidden;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .welcome-inner {
    .welcome-label {
      margin: 0 0 8px;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .welcome-title {
      margin: 0 0 12px;
      font-size: 22px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .welcome-desc {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }
  }
</style>
