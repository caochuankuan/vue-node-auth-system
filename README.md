# 用户注册登录系统

一个完整的用户注册登录系统，包含邮箱验证码功能。采用前后端分离架构，后端使用 Node.js + Express + MongoDB，前端使用 Vue 3 + Vite。

## 📋 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心功能](#核心功能)
- [验证码系统详解](#验证码系统详解)
- [API 接口文档](#api-接口文档)
- [安装和运行](#安装和运行)
- [配置说明](#配置说明)
- [安全特性](#安全特性)
- [常见问题](#常见问题)

---

## 技术栈

### 后端
- **Node.js** - JavaScript 运行时环境
- **Express** - Web 应用框架
- **MongoDB + Mongoose** - NoSQL 数据库及 ORM
- **JWT (jsonwebtoken)** - 身份认证令牌
- **bcryptjs** - 密码加密
- **Nodemailer** - 邮件发送（QQ 邮箱）
- **dotenv** - 环境变量管理
- **CORS** - 跨域资源共享

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 状态管理库
- **Axios** - HTTP 客户端

---

## 项目结构

```
email/
├── backend/                    # 后端项目
│   ├── config/
│   │   └── db.js              # MongoDB 数据库连接配置
│   ├── models/
│   │   ├── User.js            # 用户数据模型
│   │   └── VerificationCode.js # 验证码数据模型
│   ├── routes/
│   │   └── auth.js            # 认证相关路由（注册、登录、验证码）
│   ├── middleware/
│   │   ├── auth.js            # JWT 认证中间件
│   │   └── verification.js    # 验证码验证中间件
│   ├── utils/
│   │   └── email.js           # 邮件发送工具（QQ邮箱）
│   ├── server.js              # 服务器入口文件
│   ├── .env                   # 环境变量配置
│   └── package.json           # 后端依赖配置
│
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── views/
│   │   │   ├── LoginView.vue      # 登录页面
│   │   │   ├── RegisterView.vue   # 注册页面（含验证码）
│   │   │   └── DashboardView.vue  # 仪表板页面（登录后）
│   │   ├── stores/
│   │   │   └── user.js        # 用户状态管理（Pinia）
│   │   ├── services/
│   │   │   └── api.js         # API 服务封装（Axios）
│   │   ├── router/
│   │   │   └── index.js       # 路由配置
│   │   ├── App.vue            # 根组件
│   │   └── main.js            # 应用入口
│   ├── index.html             # HTML 模板
│   ├── vite.config.js         # Vite 配置文件
│   └── package.json           # 前端依赖配置
│
├── .gitignore                 # Git 忽略文件配置
└── README.md                  # 项目说明文档
```

---

## 核心功能

### 1. 用户注册
- ✅ 用户名、邮箱、密码输入
- ✅ 邮箱格式验证
- ✅ 密码强度验证（最少6位）
- ✅ 邮箱验证码验证（6位数字）
- ✅ 防止重复注册（检查邮箱和用户名）
- ✅ 密码自动加密存储（bcrypt）
- ✅ 注册成功后自动登录

### 2. 用户登录
- ✅ 邮箱和密码登录
- ✅ JWT Token 认证
- ✅ 登录状态持久化（localStorage）
- ✅ 自动跳转保护（未登录重定向）

### 3. 验证码系统
- ✅ 6位随机数字验证码
- ✅ QQ 邮箱发送
- ✅ 5分钟有效期
- ✅ 60秒发送间隔限制
- ✅ 一次性使用（验证后删除）
- ✅ MongoDB 持久化存储
- ✅ TTL Index 自动清理过期数据
- ✅ 防重放攻击

### 4. 用户信息管理
- ✅ 查看当前用户信息
- ✅ JWT Token 验证
- ✅ 安全退出登录

---

## 验证码系统详解

### 工作流程

#### 发送验证码
```
1. 用户输入邮箱 → 点击"获取验证码"
2. 前端调用: POST /api/auth/send-code
3. 后端处理:
   - 验证邮箱格式
   - 检查邮箱是否已注册
   - 生成6位随机验证码
   - 删除该邮箱的旧验证码
   - 存入 MongoDB（5分钟过期）
   - 通过 QQ 邮箱发送
4. 前端开始60秒倒计时
```

#### 验证验证码
```
1. 用户输入验证码 → 点击"注册"
2. 前端调用: POST /api/auth/register
3. 后端处理:
   - 从 MongoDB 查询验证码
   - 检查是否存在
   - 检查是否过期
   - 检查是否正确
   - 验证成功后删除（一次性使用）
   - 创建用户账号
4. 返回 JWT Token
```

### 数据存储

**MongoDB 集合**: `verificationcodes`

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",      // 用户邮箱
  code: "123456",                  // 6位验证码
  expiresAt: ISODate("..."),       // 过期时间（创建+5分钟）
  createdAt: ISODate("...")        // 创建时间
}
```

**关键特性**:
- **TTL Index**: `expiresAt` 字段设置自动过期，MongoDB 自动删除过期文档
- **唯一性**: 每个邮箱同时只能有一个有效验证码
- **持久化**: 服务重启后验证码仍然有效（在有效期内）
- **自动清理**: 5分钟后自动从数据库删除

### 安全机制

1. **防重放攻击**: 验证码验证后立即删除，只能使用一次
2. **防暴力破解**: 6位数字（100万种组合）+ 5分钟有效期
3. **防重复发送**: 每次发送新验证码时删除旧验证码
4. **时间窗口限制**: 60秒内不能重复发送
5. **邮箱验证**: 注册前检查邮箱是否已存在

---

## API 接口文档

### 基础信息
- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`

### 1. 发送验证码

**请求**:
```http
POST /api/auth/send-code
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**响应**:
```json
{
  "message": "Verification code sent successfully"
}
```

**错误响应**:
```json
{
  "message": "Email already registered"
}
```

---

### 2. 用户注册

**请求**:
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "user@example.com",
  "password": "password123",
  "verificationCode": "123456"
}
```

**响应**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "username": "testuser",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应**:
```json
{
  "message": "验证码已过期"
}
```

---

### 3. 用户登录

**请求**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "username": "testuser",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**错误响应**:
```json
{
  "message": "Invalid email or password"
}
```

---

### 4. 获取当前用户信息

**请求**:
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**响应**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "username": "testuser",
  "email": "user@example.com"
}
```

---

## 安装和运行

### 前置要求
- Node.js >= 16.x
- MongoDB 数据库
- QQ 邮箱账号（已开启 SMTP 服务）

### 开发环境

#### 后端启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量（编辑 .env 文件）
# 设置 QQ 邮箱和授权码

# 启动开发服务器
npm run dev
```

后端服务将运行在: **http://localhost:3000**

#### 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在: **http://localhost:5173**

---

## 生产环境部署

### 🚀 一键部署流程

本项目采用**后端 Serve 前端静态文件**的架构，只需启动一个后端服务即可。

#### 部署步骤

```bash
# 1. 上传代码到服务器
git clone https://github.com/caochuankuan/vue-node-auth-system.git
cd vue-node-auth-system

# 2. 配置环境变量
nano backend/.env
```

编辑 `backend/.env`：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth_system
JWT_SECRET=your_super_secure_random_string_here
JWT_EXPIRE=7d
EMAIL_USER=your_qq@qq.com
EMAIL_PASS=your_authorization_code
NODE_ENV=production
```

```bash
# 3. 构建前端
cd frontend
npm install
npm run build
cd ..

# 4. 安装后端依赖并启动
cd backend
npm install --production
pm2 start ecosystem.config.js
pm2 save

# 完成！访问 http://your-server-ip
```

#### 架构说明

```
用户访问 http://server-ip
    ↓
Express (Port 3000)
    ├─ /api/* → API 路由（后端处理）
    └─ /* → 前端静态文件（frontend/dist/）
         └─ index.html (Vue SPA)
```

**优势**：
- ✅ 只需一个端口（3000）
- ✅ 只需一个进程（PM2 管理）
- ✅ 无需 Nginx（可选）
- ✅ 简化部署流程

### 🔧 常用命令

#### PM2 管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs auth-api

# 重启服务
pm2 restart auth-api

# 停止服务
pm2 stop auth-api

# 实时监控
pm2 monit
```

#### 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建前端
cd frontend && npm install && npm run build && cd ..

# 重启后端
cd backend && npm install --production && pm2 restart auth-api && cd ..
```

### 🔒 安全建议

#### 1. 配置防火墙

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

#### 2. 配置 HTTPS（推荐）

使用 Nginx + Let's Encrypt：

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Nginx 反向代理配置：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

#### 3. MongoDB 安全

启用认证并创建专用用户：

```javascript
// MongoDB Shell
use auth_system
db.createUser({
  user: "authuser",
  pwd: "securepassword",
  roles: [{ role: "readWrite", db: "auth_system" }]
})
```

更新 `.env`:
```env
MONGODB_URI=mongodb://authuser:securepassword@localhost:27017/auth_system
```

### 📊 监控和维护

#### 日志位置

```bash
# PM2 日志
~/.pm2/logs/auth-api-error.log
~/.pm2/logs/auth-api-out.log

# 实时查看
pm2 logs auth-api --lines 100
```

#### 备份数据库

```bash
# 备份
mongodump --db auth_system --out /backup/mongodb-$(date +%Y%m%d)

# 恢复
mongorestore --db auth_system /backup/mongodb-20260607/auth_system
```

---

## 配置说明

### 环境变量配置 (backend/.env)

```env
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://username:password@host:port/database

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# QQ 邮箱配置
EMAIL_USER=your_qq_email@qq.com
EMAIL_PASS=your_qq_email_authorization_code
```

### QQ 邮箱授权码获取步骤

1. 登录 QQ 邮箱网页版 (mail.qq.com)
2. 点击「设置」→「账户」
3. 找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」
4. 开启「IMAP/SMTP服务」
5. 点击「生成授权码」
6. 按提示发送短信验证
7. 复制生成的16位授权码到 `.env` 文件的 `EMAIL_PASS`

**重要**: `EMAIL_PASS` 是授权码，不是 QQ 邮箱的登录密码！

---

## 安全特性

### 密码安全
- ✅ 使用 bcryptjs 进行哈希加密
- ✅ 盐值 rounds = 10
- ✅ 密码不在响应中返回（select: false）

### 认证安全
- ✅ JWT Token 认证
- ✅ Token 有效期 7 天（可配置）
- ✅ 受保护的路由需要 Token
- ✅ Token 存储在 localStorage

### 验证码安全
- ✅ 6位随机数字（100万种组合）
- ✅ 5分钟有效期
- ✅ 一次性使用
- ✅ MongoDB TTL 自动清理
- ✅ 防重放攻击
- ✅ 60秒发送间隔

### 数据安全
- ✅ CORS 跨域配置
- ✅ 输入验证
- ✅ SQL 注入防护（MongoDB）
- ✅ 环境变量隔离敏感信息

---

## 常见问题

### Q1: 发送验证码失败？

**可能原因**:
1. QQ 邮箱未开启 SMTP 服务
2. 授权码错误（注意是授权码，不是密码）
3. 网络连接问题
4. 邮箱格式不正确

**解决方法**:
- 检查 QQ 邮箱设置，确保 IMAP/SMTP 服务已开启
- 重新生成授权码并更新 `.env` 文件
- 检查控制台错误日志

---

### Q2: 验证码一直显示错误或过期？

**可能原因**:
1. 验证码已超过5分钟有效期
2. 输入的验证码有误
3. 已经使用过该验证码（一次性）

**解决方法**:
- 重新获取验证码
- 仔细核对输入的6位数字
- 确保在5分钟内完成注册

---

### Q3: 注册时提示邮箱已注册？

**原因**: 该邮箱已经被注册过

**解决方法**:
- 直接使用登录功能
- 或使用其他邮箱注册

---

### Q4: 登录后刷新页面需要重新登录？

**原因**: Token 存储在 localStorage，正常情况下应该保持登录状态

**解决方法**:
- 检查浏览器控制台是否有错误
- 确认 Token 是否正确保存
- 检查 JWT_EXPIRE 配置

---

### Q5: 如何修改验证码有效期？

**修改位置**: `backend/middleware/verification.js`

```javascript
const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 改为需要的时间
```

同时需要更新 MongoDB TTL Index 配置。

---

### Q6: 数据库连接失败？

**可能原因**:
1. MongoDB 服务未启动
2. 连接字符串错误
3. 网络问题

**解决方法**:
- 检查 MongoDB 服务是否运行
- 验证 `.env` 中的 `MONGODB_URI` 配置
- 检查网络连接

---

## 开发建议

### 生产环境部署

1. **更换 JWT Secret**: 使用强随机字符串
2. **启用 HTTPS**: 保护数据传输安全
3. **使用 Redis**: 替代 MongoDB 存储验证码（更快）
4. **添加速率限制**: 防止暴力攻击
5. **日志记录**: 添加 Winston 等日志库
6. **错误监控**: 集成 Sentry 等监控服务
7. **备份策略**: 定期备份 MongoDB 数据

### 性能优化

1. **数据库索引**: 已为 email 和 expiresAt 创建索引
2. **连接池**: MongoDB 默认启用连接池
3. **缓存**: 考虑使用 Redis 缓存常用数据
4. **压缩**: 启用 Gzip 压缩响应

### 功能扩展

1. **密码重置**: 添加忘记密码功能
2. **邮箱验证**: 注册后发送验证链接
3. **双因素认证**: 增加安全性
4. **社交登录**: 支持微信、GitHub 等
5. **用户资料**: 完善用户信息字段
6. **角色权限**: 添加管理员和普通用户

---

## 许可证

MIT License

---

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
