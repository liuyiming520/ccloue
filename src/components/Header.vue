<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <img src="../assets/logo.png" alt="Company Logo" />
          <span>公司名称</span>
        </router-link>
      </div>
      
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于我们</router-link>
        <router-link to="/products" class="nav-link">产品服务</router-link>
        <router-link to="/news" class="nav-link">新闻动态</router-link>
        <router-link to="/contact" class="nav-link">联系我们</router-link>
      </nav>
      
      <div class="mobile-menu" @click="toggleMobileMenu">
        <div class="hamburger" :class="{ active: mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <div class="mobile-nav" :class="{ active: mobileMenuOpen }">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
      <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">关于我们</router-link>
      <router-link to="/products" class="mobile-nav-link" @click="closeMobileMenu">产品服务</router-link>
      <router-link to="/news" class="mobile-nav-link" @click="closeMobileMenu">新闻动态</router-link>
      <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">联系我们</router-link>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Header',
  setup() {
    const mobileMenuOpen = ref(false)
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }
    
    return {
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #409eff;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #409eff;
  transition: width 0.3s;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.mobile-menu {
  display: none;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #333;
  transition: all 0.3s;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-nav {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  padding: 20px;
}

.mobile-nav.active {
  display: flex;
}

.mobile-nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: #409eff;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
}
</style>