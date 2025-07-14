# GitHub 配置指南

## 🔧 配置步骤

### 1. 创建数据存储仓库

1. 访问 https://github.com/liuyiming520
2. 点击 "New repository"
3. 仓库名：`company-website-data`
4. 设为 **Private**（保护数据安全）
5. 勾选 "Add a README file"
6. 点击 "Create repository"

### 2. 生成 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - **Note**: `Company Website Data Access`
   - **Expiration**: `No expiration` 或选择合适期限
   - **Scopes**: 勾选 `repo` (完整仓库权限)
4. 点击 "Generate token"
5. **重要**：复制生成的token（只显示一次）

### 3. 配置项目

修改 `src/stores/github-storage.js` 文件：

```javascript
const GITHUB_CONFIG = {
  owner: 'liuyiming520',
  repo: 'company-website-data', // 你刚创建的仓库名
  token: 'ghp_xxxxxxxxxxxxxxxxxxxx', // 粘贴你的token
  branch: 'main'
}
```

### 4. 推送项目代码

在你的项目目录下执行：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Company website"

# 添加远程仓库（创建一个新的代码仓库）
git remote add origin https://github.com/liuyiming520/company-website.git

# 推送代码
git push -u origin main
```

## 🚀 部署选项

### 选项1：Vercel (推荐)

1. 访问 https://vercel.com/
2. 用GitHub账号登录
3. 点击 "New Project"
4. 选择你的 `company-website` 仓库
5. 保持默认设置，点击 "Deploy"
6. 获得免费域名：`https://company-website-xxx.vercel.app`

### 选项2：Netlify

1. 访问 https://netlify.com/
2. 用GitHub账号登录
3. 点击 "New site from Git"
4. 选择GitHub → 选择你的仓库
5. 构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 点击 "Deploy site"

## 📁 仓库结构建议

你需要创建两个仓库：

1. **company-website** (公开)
   - 存放网站代码
   - 用于部署

2. **company-website-data** (私有)
   - 存放网站数据
   - 用于云端存储

## 🔒 安全提醒

- **GitHub Token** 非常重要，不要泄露给他人
- 数据仓库设为私有，保护商业信息
- 定期检查token使用情况

## ✅ 测试步骤

1. 启动项目：`npm run serve`
2. 登录后台：http://localhost:8081/admin/login
3. 账号：admin / admin123
4. 进入仪表盘，点击"启用云存储"
5. 添加一些测试数据
6. 检查GitHub数据仓库是否有文件更新

## 🎉 完成！

配置完成后，你的官网将拥有：
- ✅ 免费托管（Vercel/Netlify）
- ✅ 免费数据存储（GitHub）
- ✅ 自动备份和同步
- ✅ 版本控制
- ✅ 全球CDN加速
- ✅ 免费SSL证书

需要帮助请参考 `DEPLOYMENT.md` 或提交Issue！