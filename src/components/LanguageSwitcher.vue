<template>
  <div class="language-switcher">
    <el-dropdown @command="changeLanguage" trigger="click">
      <span class="language-trigger">
        <i class="el-icon-global"></i>
        {{ currentLanguageLabel }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            command="zh"
            :class="{ active: currentLanguage === 'zh' }"
          >
            🇨🇳 中文
          </el-dropdown-item>
          <el-dropdown-item 
            command="en"
            :class="{ active: currentLanguage === 'en' }"
          >
            🇺🇸 English
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  name: 'LanguageSwitcher',
  components: {
    ArrowDown
  },
  setup() {
    const { locale } = useI18n()
    
    const currentLanguage = computed(() => locale.value)
    
    const currentLanguageLabel = computed(() => {
      const labels = {
        zh: '中文',
        en: 'English'
      }
      return labels[locale.value] || '中文'
    })
    
    const changeLanguage = (lang) => {
      locale.value = lang
      localStorage.setItem('app_locale', lang)
      
      // 更新HTML lang属性
      document.documentElement.lang = lang
      
      // 可以在这里添加路由刷新或其他需要的操作
      window.location.reload()
    }
    
    return {
      currentLanguage,
      currentLanguageLabel,
      changeLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
  color: #666;
  font-size: 14px;
}

.language-trigger:hover {
  background-color: #f5f5f5;
  color: #409eff;
}

.el-dropdown-menu .el-dropdown-item.active {
  color: #409eff;
  font-weight: bold;
}

.el-dropdown-menu .el-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .language-trigger {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>