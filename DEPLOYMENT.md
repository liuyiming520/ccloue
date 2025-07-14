# 免费部署方案指南

## 🚀 免费部署选项

### 方案一：Vercel (推荐)

1. **准备工作**
   ```bash
   npm run build
   ```

2. **部署步骤**
   - 注册 [Vercel](https://vercel.com/) 账号
   - 连接 GitHub 仓库
   - 选择项目并部署
   - 自动获得 `.vercel.app` 域名

3. **优势**
   - 自动部署
   - 全球CDN
   - 免费SSL证书
   - 支持自定义域名

### 方案二：Netlify

1. **部署步骤**
   - 注册 [Netlify](https://netlify.com/) 账号
   - 连接 GitHub 仓库
   - 构建设置：`npm run build`
   - 发布目录：`dist`

2. **优势**
   - 表单处理功能
   - 免费100GB流量/月
   - 支持环境变量

### 方案三：GitHub Pages

1. **配置 GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## 💾 免费数据存储方案

### 方案一：GitHub 作为数据库 (推荐)

1. **配置步骤**
   - 创建专用仓库存储数据
   - 生成 GitHub Personal Access Token
   - 配置 `src/stores/github-storage.js`

2. **优势**
   - 完全免费
   - 版本控制
   - 数据安全
   - 无需服务器

3. **配置示例**
   ```javascript
   const GITHUB_CONFIG = {
     owner: 'your-username',
     repo: 'your-data-repo',
     token: 'ghp_xxxxxxxxxxxx',
     branch: 'main'
   }
   ```

### 方案二：Firebase (Google)

1. **免费额度**
   - 1GB 存储空间
   - 20,000 写入/天
   - 50,000 读取/天

2. **配置步骤**
   - 创建 Firebase 项目
   - 启用 Firestore
   - 配置 Web 应用
   - 集成 Firebase SDK

### 方案三：Supabase

1. **免费额度**
   - 500MB 存储
   - 5万行数据
   - 2GB 数据传输/月

2. **优势**
   - PostgreSQL 数据库
   - 实时订阅
   - 自动生成 API
   - 开源

## 🔧 使用步骤

### 1. 启用云存储

在后台管理 → 仪表盘 → 数据存储状态 → 启用云存储

### 2. 配置 GitHub 存储

修改 `src/stores/github-storage.js` 中的配置：

```javascript
const GITHUB_CONFIG = {
  owner: '你的GitHub用户名',
  repo: '数据仓库名',
  token: '你的GitHub Token',
  branch: 'main'
}
```

### 3. 创建 GitHub Token

1. GitHub → Settings → Developer settings → Personal access tokens
2. 生成新 token，勾选 `repo` 权限
3. 复制 token 到配置文件

### 4. 数据同步

- **自动同步**：启用后自动上传数据
- **手动同步**：仪表盘中手动上传/下载
- **离线模式**：无网络时使用本地数据

## 🎯 最佳实践

### 数据管理
- 定期备份数据到云端
- 使用版本控制跟踪变更
- 设置自动同步避免数据丢失

### 部署优化
- 启用 gzip 压缩
- 使用 CDN 加速
- 优化图片资源

### 安全考虑
- 不要在前端暴露敏感信息
- 使用环境变量存储配置
- 定期更新依赖包

## 📞 支持

如需帮助，请：
1. 查看项目文档
2. 提交 GitHub Issue
3. 参考官方文档

---

这套方案让你在零成本的情况下拥有完整的官网系统！