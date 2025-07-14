<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>公司名称</h3>
          <p>专业的解决方案提供商，致力于为客户提供优质的产品和服务。</p>
        </div>
        
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
            <li><router-link to="/products">产品服务</router-link></li>
            <li><router-link to="/news">新闻动态</router-link></li>
            <li><router-link to="/contact">联系我们</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>联系信息</h3>
          <ul>
            <li><i class="el-icon-location"></i> 北京市朝阳区某某大厦</li>
            <li><i class="el-icon-phone"></i> 010-12345678</li>
            <li><i class="el-icon-message"></i> contact@company.com</li>
            <li><i class="el-icon-time"></i> 周一至周五 9:00-18:00</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 公司名称. 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  margin-bottom: 20px;
  color: #409eff;
}

.footer-section p {
  line-height: 1.6;
  color: #bdc3c7;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #409eff;
}

.footer-section ul li i {
  margin-right: 10px;
  color: #409eff;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #34495e;
  color: #bdc3c7;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer {
    padding: 30px 0 15px;
  }
}
</style>