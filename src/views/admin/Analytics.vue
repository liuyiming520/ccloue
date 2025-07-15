<template>
  <div class="analytics">
    <!-- 实时数据 -->
    <div class="real-time-section">
      <h2>实时数据</h2>
      <div class="real-time-cards">
        <div class="real-time-card">
          <div class="card-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-content">
            <h3>{{ realTimeStats.visitors }}</h3>
            <p>在线访客</p>
          </div>
        </div>
        
        <div class="real-time-card">
          <div class="card-icon">
            <el-icon><View /></el-icon>
          </div>
          <div class="card-content">
            <h3>{{ realTimeStats.pageViews }}</h3>
            <p>今日浏览量</p>
          </div>
        </div>
        
        <div class="real-time-card">
          <div class="card-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="card-content">
            <h3>{{ realTimeStats.avgSessionTime }}</h3>
            <p>平均会话时长</p>
          </div>
        </div>
        
        <div class="real-time-card">
          <div class="card-icon">
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="card-content">
            <h3>{{ realTimeStats.bounceRate }}</h3>
            <p>跳出率</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 访问趋势图表 -->
    <div class="chart-section">
      <h2>访问趋势 (最近7天)</h2>
      <div class="chart-container">
        <v-chart :option="visitorTrendOption" class="chart" />
      </div>
    </div>

    <!-- 统计数据网格 -->
    <div class="stats-grid">
      <!-- 热门页面 -->
      <div class="stats-card">
        <h3>热门页面</h3>
        <div class="page-list">
          <div 
            v-for="page in topPages" 
            :key="page.path"
            class="page-item"
          >
            <div class="page-info">
              <span class="page-title">{{ page.title }}</span>
              <span class="page-path">{{ page.path }}</span>
            </div>
            <div class="page-views">{{ page.views }}</div>
          </div>
        </div>
      </div>

      <!-- 设备统计 -->
      <div class="stats-card">
        <h3>设备分布</h3>
        <div class="chart-container">
          <v-chart :option="deviceChartOption" class="chart" />
        </div>
      </div>

      <!-- 浏览器统计 -->
      <div class="stats-card">
        <h3>浏览器分布</h3>
        <div class="browser-list">
          <div 
            v-for="browser in browserStats" 
            :key="browser.name"
            class="browser-item"
          >
            <div class="browser-info">
              <span class="browser-name">{{ browser.name }}</span>
              <span class="browser-percentage">{{ browser.percentage }}%</span>
            </div>
            <div class="browser-bar">
              <div 
                class="browser-fill" 
                :style="{ width: browser.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 流量来源 -->
      <div class="stats-card">
        <h3>流量来源</h3>
        <div class="chart-container">
          <v-chart :option="trafficChartOption" class="chart" />
        </div>
      </div>
    </div>

    <!-- 地理分布 -->
    <div class="geographic-section">
      <h2>地理分布</h2>
      <div class="geographic-list">
        <div 
          v-for="geo in analytics.geographic" 
          :key="geo.province"
          class="geographic-item"
        >
          <span class="province">{{ geo.province }}</span>
          <span class="visitors">{{ geo.visitors }} 访客</span>
        </div>
      </div>
    </div>

    <!-- 转化统计 -->
    <div class="conversion-section">
      <h2>转化统计</h2>
      <div class="conversion-cards">
        <div class="conversion-card">
          <h4>联系表单</h4>
          <div class="conversion-number">{{ analytics.conversions.contactForm }}</div>
        </div>
        <div class="conversion-card">
          <h4>电话咨询</h4>
          <div class="conversion-number">{{ analytics.conversions.phoneCall }}</div>
        </div>
        <div class="conversion-card">
          <h4>产品询价</h4>
          <div class="conversion-number">{{ analytics.conversions.productInquiry }}</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button type="primary" @click="exportData">导出数据</el-button>
      <el-button @click="generateReport">生成报告</el-button>
      <el-button type="danger" @click="clearData">清空数据</el-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useAnalyticsStore } from '@/stores/analytics'
import { 
  User, 
  View, 
  Timer, 
  DataLine 
} from '@element-plus/icons-vue'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  name: 'Analytics',
  components: {
    VChart,
    User,
    View,
    Timer,
    DataLine
  },
  setup() {
    // 获取分析数据存储实例
    const analyticsStore = useAnalyticsStore()
    
    // 响应式数据：控制加载状态
    const loading = ref(false)
    
    // 计算属性：获取各种统计数据
    // 获取最近7天的访问趋势数据
    const visitorTrend = computed(() => analyticsStore.getVisitorTrend(7))
    
    // 获取热门页面排行（前5名）
    const topPages = computed(() => analyticsStore.getTopPages())
    
    // 获取设备类型统计数据
    const deviceStats = computed(() => analyticsStore.getDeviceStats)
    
    // 获取浏览器分布统计数据
    const browserStats = computed(() => analyticsStore.getBrowserStats)
    
    // 获取流量来源统计数据
    const trafficStats = computed(() => analyticsStore.getTrafficStats)

    // 访问趋势图表配置
    const visitorTrendOption = computed(() => ({
      // 鼠标悬浮提示配置
      tooltip: {
        trigger: 'axis', // 坐标轴触发
        formatter: function (params) {
          // 自定义提示内容格式
          let result = params[0].name + '<br/>'
          params.forEach(param => {
            result += param.marker + param.seriesName + ': ' + param.value + '<br/>'
          })
          return result
        }
      },
      // 图例配置
      legend: {
        data: ['访客', '页面浏览量'],
        top: 10
      },
      // 网格配置
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      // X轴配置
      xAxis: {
        type: 'category',
        data: visitorTrend.value.dates || [], // 防止undefined错误
        axisTick: {
          alignWithLabel: true
        }
      },
      // Y轴配置
      yAxis: {
        type: 'value',
        minInterval: 1 // 确保Y轴显示整数
      },
      // 数据系列配置
      series: [
        {
          name: '访客',
          type: 'line',
          data: visitorTrend.value.visitors || [], // 防止undefined错误
          smooth: true, // 平滑曲线
          itemStyle: { color: '#409eff' },
          lineStyle: { width: 2 }
        },
        {
          name: '页面浏览量',
          type: 'line',
          data: visitorTrend.value.pageViews || [], // 防止undefined错误
          smooth: true,
          itemStyle: { color: '#67c23a' },
          lineStyle: { width: 2 }
        }
      ]
    }))

    // 设备分布图表配置（环形饼图）
    const deviceChartOption = computed(() => ({
      // 提示框配置
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      // 图例配置
      legend: {
        orient: 'vertical',
        left: 'left',
        data: deviceStats.value.map(item => item.name) || []
      },
      // 数据系列配置
      series: [
        {
          name: '设备类型',
          type: 'pie',
          radius: ['40%', '70%'], // 环形饼图：内半径40%，外半径70%
          avoidLabelOverlap: false,
          data: (deviceStats.value || []).map(item => ({
            value: item.value,
            name: item.name
          })),
          // 鼠标悬浮效果
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          // 标签配置
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          }
        }
      ]
    }))

    // 流量来源图表配置（普通饼图）
    const trafficChartOption = computed(() => ({
      // 提示框配置
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      // 图例配置
      legend: {
        bottom: 10,
        left: 'center',
        data: trafficStats.value.map(item => item.name) || []
      },
      // 数据系列配置
      series: [
        {
          name: '流量来源',
          type: 'pie',
          radius: '50%', // 饼图半径
          center: ['50%', '45%'], // 饼图位置
          data: (trafficStats.value || []).map(item => ({
            value: item.value,
            name: item.name
          })),
          // 鼠标悬浮效果
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          // 标签配置
          label: {
            show: true,
            formatter: '{b}: {d}%'
          }
        }
      ]
    }))

    // 导出数据功能
    const exportData = () => {
      try {
        loading.value = true
        analyticsStore.exportData('json')
        ElMessage.success('数据导出成功！')
      } catch (error) {
        ElMessage.error('导出失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    // 生成统计报告
    const generateReport = () => {
      try {
        loading.value = true
        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 7天前
        
        const report = analyticsStore.generateReport(startDate, endDate)
        console.log('生成的报告:', report)
        
        ElMessage.success('报告生成成功！请查看控制台。')
      } catch (error) {
        ElMessage.error('报告生成失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    // 清空所有统计数据
    const clearData = () => {
      ElMessageBox.confirm('确定要清空所有统计数据吗？此操作不可恢复。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          analyticsStore.clearData()
          ElMessage.success('数据已清空！')
        } catch (error) {
          ElMessage.error('清空失败：' + error.message)
        }
      }).catch(() => {
        ElMessage.info('已取消清空操作')
      })
    }

    // 组件挂载时的初始化操作
    onMounted(() => {
      try {
        // 启动实时数据跟踪（模拟实时访客数变化）
        analyticsStore.startRealTimeTracking()
        
        // 模拟初始化一些统计数据
        analyticsStore.trackPageView('/', '首页')
        analyticsStore.trackPageView('/about', '关于我们')
        analyticsStore.trackPageView('/products', '产品页面')
        
        console.log('数据统计系统初始化完成')
      } catch (error) {
        console.error('数据统计初始化失败:', error)
      }
    })

    // 返回组件需要的所有数据和方法
    return {
      // 数据
      analytics: analyticsStore.analytics,
      realTimeStats: analyticsStore.getRealTimeStats,
      loading,
      topPages,
      deviceStats,
      browserStats,
      trafficStats,
      
      // 图表配置
      visitorTrendOption,
      deviceChartOption,
      trafficChartOption,
      
      // 方法
      exportData,
      generateReport,
      clearData
    }
  }
}
</script>

<style scoped>
.analytics {
  max-width: 1200px;
  padding: 20px;
}

.analytics h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

.real-time-section {
  margin-bottom: 30px;
}

.real-time-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.real-time-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.card-content h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #333;
}

.card-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.chart-section {
  margin-bottom: 30px;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 300px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-card h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.page-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.page-item:last-child {
  border-bottom: none;
}

.page-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.page-title {
  font-weight: 500;
  color: #333;
}

.page-path {
  font-size: 12px;
  color: #999;
}

.page-views {
  font-weight: bold;
  color: #409eff;
}

.browser-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.browser-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.browser-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.browser-name {
  font-weight: 500;
  color: #333;
}

.browser-percentage {
  font-size: 12px;
  color: #666;
}

.browser-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.browser-fill {
  height: 100%;
  background: linear-gradient(to right, #409eff, #67c23a);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.geographic-section {
  margin-bottom: 30px;
}

.geographic-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.geographic-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
}

.province {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.visitors {
  font-size: 14px;
  color: #666;
}

.conversion-section {
  margin-bottom: 30px;
}

.conversion-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.conversion-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.conversion-card h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.conversion-number {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .analytics {
    padding: 15px;
  }
  
  .real-time-cards {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .geographic-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .conversion-cards {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>