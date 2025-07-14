// SEO优化工具类
export class SEOManager {
  // 设置页面标题
  static setTitle(title, siteName = '公司官网') {
    document.title = title ? `${title} - ${siteName}` : siteName
  }

  // 设置meta描述
  static setDescription(description) {
    this.setMetaTag('description', description)
  }

  // 设置meta关键词
  static setKeywords(keywords) {
    this.setMetaTag('keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords)
  }

  // 设置Open Graph标签
  static setOpenGraph(data) {
    const ogTags = {
      'og:title': data.title,
      'og:description': data.description,
      'og:image': data.image,
      'og:url': data.url || window.location.href,
      'og:type': data.type || 'website',
      'og:site_name': data.siteName || '公司官网'
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        this.setMetaTag(null, content, property)
      }
    })
  }

  // 设置Twitter卡片
  static setTwitterCard(data) {
    const twitterTags = {
      'twitter:card': data.card || 'summary_large_image',
      'twitter:title': data.title,
      'twitter:description': data.description,
      'twitter:image': data.image
    }

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (content) {
        this.setMetaTag(name, content, null, 'name')
      }
    })
  }

  // 设置结构化数据
  static setStructuredData(data) {
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  // 设置canonical链接
  static setCanonical(url) {
    const existing = document.querySelector('link[rel="canonical"]')
    if (existing) {
      existing.remove()
    }

    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = url || window.location.href
    document.head.appendChild(link)
  }

  // 通用meta标签设置方法
  static setMetaTag(name, content, property = null, attr = 'name') {
    const selector = property ? `meta[property="${property}"]` : `meta[${attr}="${name}"]`
    let meta = document.querySelector(selector)
    
    if (!meta) {
      meta = document.createElement('meta')
      if (property) {
        meta.setAttribute('property', property)
      } else {
        meta.setAttribute(attr, name)
      }
      document.head.appendChild(meta)
    }
    
    meta.setAttribute('content', content)
  }

  // 生成网站地图数据
  static generateSitemap(routes) {
    const baseUrl = window.location.origin
    const sitemap = routes.map(route => ({
      loc: `${baseUrl}${route.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: route.changefreq || 'weekly',
      priority: route.priority || '0.8'
    }))
    
    return sitemap
  }

  // 页面SEO配置
  static setupPageSEO(pageConfig) {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      structuredData
    } = pageConfig

    // 设置基本SEO
    this.setTitle(title)
    this.setDescription(description)
    this.setKeywords(keywords)
    this.setCanonical(url)

    // 设置社交媒体标签
    this.setOpenGraph({
      title,
      description,
      image,
      url,
      type
    })

    this.setTwitterCard({
      title,
      description,
      image
    })

    // 设置结构化数据
    if (structuredData) {
      this.setStructuredData(structuredData)
    }
  }
}