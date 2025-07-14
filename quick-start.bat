@echo off
echo ========================================
echo    公司官网快速部署脚本
echo ========================================
echo.

echo 1. 检查项目文件...
if not exist "package.json" (
    echo 错误：找不到package.json文件
    pause
    exit
)

echo 2. 安装依赖包...
call npm install

echo 3. 构建项目...
call npm run build

echo 4. 初始化Git仓库...
git init

echo 5. 添加所有文件...
git add .

echo 6. 提交代码...
git commit -m "Initial commit: Company website"

echo.
echo ========================================
echo    接下来需要手动操作:
echo ========================================
echo 1. 在GitHub创建仓库 'company-website'
echo 2. 在GitHub创建仓库 'company-website-data' (私有)
echo 3. 生成GitHub Personal Access Token
echo 4. 配置 src/stores/github-storage.js
echo 5. 推送代码到GitHub
echo 6. 连接Vercel/Netlify部署
echo.
echo 详细步骤请查看 GITHUB_SETUP.md
echo ========================================

pause