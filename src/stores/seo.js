import { reactive } from 'vue'
import { SEOManager } from '@/utils/seo'

const defaultSEOConfig = {
  siteName: '公司官网',
  defaultTitle: '专业的解决方案提供商',
  defaultDescription: '我们致力于为客户提供优质的产品和服务，拥有专业的团队和创新的技术',
  defaultKeywords: ['公司', '服务', '产品', '解决方案', '专业团队'],
  defaultImage: '/logo.png',
  contact: {
    phone: '010-12345678',
    email: 'contact@company.com',
    address: '北京市朝阳区某某大厦'
  },
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    weibo: ''
  }
}

const state = reactive({
  config: JSON.parse(localStorage.getItem('seo_config')) || defaultSEOConfig,
  currentPage: {
    title: '',
    description: '',
    keywords: [],
    image: ''
  }
})

export const useSEOStore = () => {
  // 保存SEO配置
  const saveSEOConfig = () => {
    localStorage.setItem('seo_config', JSON.stringify(state.config))
  }

  // 更新SEO配置
  const updateSEOConfig = (newConfig) => {
    state.config = { ...state.config, ...newConfig }
    saveSEOConfig()
  }

  // 设置当前页面SEO
  const setPageSEO = (pageConfig) => {
    const config = {
      title: pageConfig.title || state.config.defaultTitle,
      description: pageConfig.description || state.config.defaultDescription,
      keywords: pageConfig.keywords || state.config.defaultKeywords,
      image: pageConfig.image || state.config.defaultImage,
      url: window.location.href
    }

    // 更新当前页面状态
    state.currentPage = config

    // 应用SEO设置
    SEOManager.setupPageSEO(config)

    // 设置结构化数据
    const structuredData = generateStructuredData(config)
    SEOManager.setStructuredData(structuredData)
  }

  // 生成组织结构化数据
  const generateStructuredData = (pageConfig) => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": state.config.siteName,
      "url": window.location.origin,
      "logo": window.location.origin + state.config.defaultImage,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": state.config.contact.phone,
        "contactType": "customer service",
        "email": state.config.contact.email
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": state.config.contact.address
      }
    }

    // 根据页面类型添加特定数据
    if (pageConfig.type === 'product') {
      return {
        ...baseData,
        "@type": "Product",
        "name": pageConfig.title,
        "description": pageConfig.description,
        "image": pageConfig.image
      }
    }

    if (pageConfig.type === 'article') {
      return {
        ...baseData,
        "@type": "Article",
        "headline": pageConfig.title,
        "description": pageConfig.description,
        "image": pageConfig.image,
        "author": {
          "@type": "Organization",
          "name": state.config.siteName
        }
      }
    }

    return baseData
  }

  // 生成网站地图
  const generateSitemap = () => {
    const routes = [
      { path: '/', changefreq: 'daily', priority: '1.0' },
      { path: '/about', changefreq: 'monthly', priority: '0.8' },
      { path: '/products', changefreq: 'weekly', priority: '0.9' },
      { path: '/news', changefreq: 'daily', priority: '0.7' },
      { path: '/contact', changefreq: 'monthly', priority: '0.6' }
    ]

    return SEOManager.generateSitemap(routes)
  }

  // 获取页面标题建议
  const getTitleSuggestions = (content) => {
    const suggestions = []
    
    if (content.includes('产品')) {
      suggestions.push('专业产品解决方案')
    }
    if (content.includes('服务')) {
      suggestions.push('优质服务体验')
    }
    if (content.includes('技术')) {
      suggestions.push('创新技术领先')
    }
    
    return suggestions
  }

  // 获取关键词建议
  const getKeywordSuggestions = (content) => {
    const commonKeywords = ['专业', '服务', '产品', '解决方案', '技术', '创新', '质量']
    const suggestions = commonKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    )
    
    return suggestions
  }

  return {
    config: state.config,
    currentPage: state.currentPage,
    updateSEOConfig,
    setPageSEO,
    generateSitemap,
    getTitleSuggestions,
    getKeywordSuggestions
  }
}