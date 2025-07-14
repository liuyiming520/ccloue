import { reactive, computed } from 'vue'

// 访问统计数据结构
const defaultAnalytics = {
  visitors: {
    total: 1234,
    today: 56,
    yesterday: 78,
    thisWeek: 389,
    thisMonth: 1567,
    dailyData: [] // 30天数据
  },
  pageViews: {
    total: 5678,
    today: 123,
    pages: [
      { path: '/', views: 2345, title: '首页' },
      { path: '/products', views: 1234, title: '产品页面' },
      { path: '/about', views: 890, title: '关于我们' },
      { path: '/news', views: 567, title: '新闻动态' },
      { path: '/contact', views: 345, title: '联系我们' }
    ]
  },
  devices: {
    desktop: 45,
    mobile: 40,
    tablet: 15
  },
  browsers: {
    chrome: 65,
    firefox: 15,
    safari: 12,
    edge: 5,
    other: 3
  },
  traffic: {
    direct: 40,
    search: 35,
    social: 15,
    referral: 10
  },
  geographic: [
    { province: '北京', visitors: 234 },
    { province: '上海', visitors: 189 },
    { province: '广东', visitors: 156 },
    { province: '江苏', visitors: 123 },
    { province: '浙江', visitors: 98 }
  ],
  events: [], // 用户行为事件
  conversions: {
    contactForm: 23,
    phoneCall: 15,
    productInquiry: 45
  }
}

const state = reactive({
  analytics: JSON.parse(localStorage.getItem('site_analytics')) || defaultAnalytics,
  realTimeVisitors: 12,
  isTracking: true
})

export const useAnalyticsStore = () => {
  // 保存统计数据
  const saveAnalytics = () => {
    localStorage.setItem('site_analytics', JSON.stringify(state.analytics))
  }

  // 记录页面访问
  const trackPageView = (path, title) => {
    if (!state.isTracking) return

    // 更新页面访问数据
    const page = state.analytics.pageViews.pages.find(p => p.path === path)
    if (page) {
      page.views++
    } else {
      state.analytics.pageViews.pages.push({
        path,
        title,
        views: 1
      })
    }

    // 更新总访问量
    state.analytics.pageViews.total++
    state.analytics.pageViews.today++

    // 记录事件
    trackEvent('page_view', { path, title })

    saveAnalytics()
  }

  // 记录访客
  const trackVisitor = () => {
    if (!state.isTracking) return

    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('last_visit_date')

    if (lastVisit !== today) {
      state.analytics.visitors.today++
      state.analytics.visitors.total++
      localStorage.setItem('last_visit_date', today)
      
      // 更新每日数据
      updateDailyData()
      saveAnalytics()
    }
  }

  // 更新每日访问数据
  const updateDailyData = () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    
    let dailyData = state.analytics.visitors.dailyData
    if (!Array.isArray(dailyData)) {
      dailyData = []
    }

    const todayData = dailyData.find(d => d.date === dateStr)
    if (todayData) {
      todayData.visitors++
    } else {
      dailyData.push({
        date: dateStr,
        visitors: 1,
        pageViews: 1
      })
    }

    // 只保留最近30天的数据
    if (dailyData.length > 30) {
      dailyData = dailyData.slice(-30)
    }

    state.analytics.visitors.dailyData = dailyData
  }

  // 记录事件
  const trackEvent = (eventName, data = {}) => {
    if (!state.isTracking) return

    const event = {
      id: Date.now(),
      name: eventName,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    state.analytics.events.push(event)

    // 只保留最近1000个事件
    if (state.analytics.events.length > 1000) {
      state.analytics.events = state.analytics.events.slice(-1000)
    }

    saveAnalytics()
  }

  // 记录转化事件
  const trackConversion = (type) => {
    if (!state.isTracking) return

    if (state.analytics.conversions[type] !== undefined) {
      state.analytics.conversions[type]++
      trackEvent('conversion', { type })
      saveAnalytics()
    }
  }

  // 获取访问趋势数据
  const getVisitorTrend = (days = 7) => {
    const dailyData = state.analytics.visitors.dailyData || []
    const recent = dailyData.slice(-days)
    
    return {
      dates: recent.map(d => d.date),
      visitors: recent.map(d => d.visitors),
      pageViews: recent.map(d => d.pageViews || 0)
    }
  }

  // 获取热门页面
  const getTopPages = (limit = 5) => {
    return state.analytics.pageViews.pages
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }

  // 获取实时统计
  const getRealTimeStats = computed(() => ({
    visitors: state.realTimeVisitors,
    pageViews: state.analytics.pageViews.today,
    bounceRate: '35%',
    avgSessionTime: '2分35秒'
  }))

  // 获取设备统计
  const getDeviceStats = computed(() => {
    const total = Object.values(state.analytics.devices).reduce((a, b) => a + b, 0)
    return Object.entries(state.analytics.devices).map(([device, count]) => ({
      name: device,
      value: count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
  })

  // 获取浏览器统计
  const getBrowserStats = computed(() => {
    const total = Object.values(state.analytics.browsers).reduce((a, b) => a + b, 0)
    return Object.entries(state.analytics.browsers).map(([browser, count]) => ({
      name: browser,
      value: count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
  })

  // 获取流量来源统计
  const getTrafficStats = computed(() => {
    const total = Object.values(state.analytics.traffic).reduce((a, b) => a + b, 0)
    return Object.entries(state.analytics.traffic).map(([source, count]) => ({
      name: source,
      value: count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
  })

  // 生成统计报告
  const generateReport = (startDate, endDate) => {
    const events = state.analytics.events.filter(event => {
      const eventDate = new Date(event.timestamp)
      return eventDate >= startDate && eventDate <= endDate
    })

    return {
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      summary: {
        totalEvents: events.length,
        uniqueVisitors: new Set(events.map(e => e.userAgent)).size,
        pageViews: events.filter(e => e.name === 'page_view').length,
        conversions: events.filter(e => e.name === 'conversion').length
      },
      topPages: getTopPages(),
      deviceBreakdown: getDeviceStats.value,
      trafficSources: getTrafficStats.value
    }
  }

  // 模拟实时数据更新
  const startRealTimeTracking = () => {
    setInterval(() => {
      // 模拟实时访客数变化
      state.realTimeVisitors = Math.max(1, state.realTimeVisitors + Math.floor(Math.random() * 3) - 1)
    }, 5000)
  }

  // 导出数据
  const exportData = (format = 'json') => {
    const data = {
      exportTime: new Date().toISOString(),
      analytics: state.analytics
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  // 清空数据
  const clearData = () => {
    state.analytics = { ...defaultAnalytics }
    localStorage.removeItem('site_analytics')
  }

  return {
    analytics: state.analytics,
    realTimeVisitors: state.realTimeVisitors,
    isTracking: state.isTracking,
    trackPageView,
    trackVisitor,
    trackEvent,
    trackConversion,
    getVisitorTrend,
    getTopPages,
    getRealTimeStats,
    getDeviceStats,
    getBrowserStats,
    getTrafficStats,
    generateReport,
    startRealTimeTracking,
    exportData,
    clearData
  }
}