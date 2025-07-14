import { createI18n } from 'vue-i18n'

// 中文语言包
const zh = {
  nav: {
    home: '首页',
    about: '关于我们',
    products: '产品服务',
    news: '新闻动态',
    contact: '联系我们'
  },
  home: {
    title: '欢迎来到我们公司',
    subtitle: '专业的解决方案提供商',
    description: '我们致力于为客户提供优质的产品和服务',
    features: {
      team: '专业团队',
      service: '优质服务',
      technology: '创新技术',
      teamDesc: '拥有多年行业经验的专业团队',
      serviceDesc: '7x24小时贴心服务',
      technologyDesc: '采用最新的技术解决方案'
    },
    buttons: {
      viewProducts: '查看产品',
      learnMore: '了解更多',
      viewAllProducts: '查看全部产品',
      viewAllNews: '查看全部新闻'
    }
  },
  about: {
    title: '关于我们',
    description: '公司成立于2020年，是一家专注于技术创新的现代化企业...',
    mission: '我们的使命',
    vision: '我们的愿景',
    values: '我们的价值观',
    missionText: '致力于通过技术创新改善人们的生活',
    visionText: '成为行业领先的技术解决方案提供商'
  },
  products: {
    title: '产品服务',
    subtitle: '我们提供专业的产品和服务解决方案',
    noProducts: '暂无产品信息，请联系管理员添加产品。',
    features: '产品特点',
    price: '价格'
  },
  news: {
    title: '新闻动态',
    subtitle: '了解公司最新动态和行业资讯',
    noNews: '暂无新闻动态，请联系管理员添加新闻。'
  },
  contact: {
    title: '联系我们',
    subtitle: '欢迎与我们取得联系，我们将竭诚为您服务',
    info: '联系信息',
    address: '地址',
    phone: '电话',
    email: '邮箱',
    workTime: '工作时间',
    form: {
      title: '在线留言',
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      subject: '主题',
      message: '内容',
      submit: '提交留言',
      reset: '重置',
      namePlaceholder: '请输入您的姓名',
      emailPlaceholder: '请输入您的邮箱',
      phonePlaceholder: '请输入您的电话',
      subjectPlaceholder: '请输入留言主题',
      messagePlaceholder: '请输入留言内容',
      submitSuccess: '留言提交成功！我们会尽快与您联系。'
    }
  },
  admin: {
    title: '后台管理系统',
    login: '请登录您的账户',
    dashboard: '仪表盘',
    contentManage: '内容管理',
    productManage: '产品管理',
    newsManage: '新闻管理',
    userManage: '用户管理',
    logout: '退出登录',
    welcome: '欢迎使用后台管理系统'
  },
  common: {
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    ok: '确定',
    yes: '是',
    no: '否'
  },
  footer: {
    company: '公司名称',
    description: '专业的解决方案提供商，致力于为客户提供优质的产品和服务。',
    quickLinks: '快速链接',
    contactInfo: '联系信息',
    copyright: '版权所有'
  }
}

// 英文语言包
const en = {
  nav: {
    home: 'Home',
    about: 'About Us',
    products: 'Products',
    news: 'News',
    contact: 'Contact'
  },
  home: {
    title: 'Welcome to Our Company',
    subtitle: 'Professional Solution Provider',
    description: 'We are committed to providing high-quality products and services to our customers',
    features: {
      team: 'Professional Team',
      service: 'Quality Service',
      technology: 'Innovative Technology',
      teamDesc: 'Professional team with years of industry experience',
      serviceDesc: '7x24 hours caring service',
      technologyDesc: 'Adopt the latest technology solutions'
    },
    buttons: {
      viewProducts: 'View Products',
      learnMore: 'Learn More',
      viewAllProducts: 'View All Products',
      viewAllNews: 'View All News'
    }
  },
  about: {
    title: 'About Us',
    description: 'Founded in 2020, we are a modern enterprise focused on technological innovation...',
    mission: 'Our Mission',
    vision: 'Our Vision',
    values: 'Our Values',
    missionText: 'Committed to improving people\'s lives through technological innovation',
    visionText: 'To become the industry-leading technology solution provider'
  },
  products: {
    title: 'Products & Services',
    subtitle: 'We provide professional product and service solutions',
    noProducts: 'No products available. Please contact administrator to add products.',
    features: 'Features',
    price: 'Price'
  },
  news: {
    title: 'News & Updates',
    subtitle: 'Stay updated with our latest news and industry insights',
    noNews: 'No news available. Please contact administrator to add news.'
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'We welcome you to get in touch with us, we will serve you wholeheartedly',
    info: 'Contact Information',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    workTime: 'Working Hours',
    form: {
      title: 'Online Message',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      submit: 'Submit Message',
      reset: 'Reset',
      namePlaceholder: 'Please enter your name',
      emailPlaceholder: 'Please enter your email',
      phonePlaceholder: 'Please enter your phone',
      subjectPlaceholder: 'Please enter message subject',
      messagePlaceholder: 'Please enter message content',
      submitSuccess: 'Message submitted successfully! We will contact you soon.'
    }
  },
  admin: {
    title: 'Admin Management System',
    login: 'Please login to your account',
    dashboard: 'Dashboard',
    contentManage: 'Content Management',
    productManage: 'Product Management',
    newsManage: 'News Management',
    userManage: 'User Management',
    logout: 'Logout',
    welcome: 'Welcome to Admin Management System'
  },
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    ok: 'OK',
    yes: 'Yes',
    no: 'No'
  },
  footer: {
    company: 'Company Name',
    description: 'Professional solution provider, committed to providing high-quality products and services to customers.',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Information',
    copyright: 'All Rights Reserved'
  }
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('app_locale') || 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

export default i18n