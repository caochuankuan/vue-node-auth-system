# 用户注册登录系统

一个完整的用户注册登录系统，包含邮箱验证码功能。

## 技术栈

### 后端
- Node.js + Express
- MongoDB (Mongoose)
- JWT 认证
- Nodemailer (QQ邮箱发送验证码)
- bcryptjs (密码加密)

### 前端
- Vue 3 + TypeScript
- Vue Router
- Pinia (状态管理)
- Axios
- Vite

## 项目结构

```
email/
├── backend/          # 后端代码
│   ├── config/       # 配置文件
│   ├── models/       # 数据模型
│   ├── routes/       # 路由
│   ├── middleware/   # 中间件
│   ├── utils/        # 工具函数
│   ├── server.js     # 服务器入口
│   └── .env          # 环境变量
└── frontend/         # 前端代码
    ├── src/
    │   ├── views/    # 页面组件
    │   ├── stores/   # Pinia store
    │   ├── services/ # API 服务
    │   └── router/   # 路由配置
    └── ...
```

## 配置说明

### 1. QQ邮箱配置

在使用之前，你需要配置 QQ 邮箱：

1. 登录你的 QQ 邮箱
2. 进入「设置」→「账户」
3. 找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」
4. 开启「IMAP/SMTP服务」
5. 生成授权码（不是邮箱密码）

然后在 `backend/.env` 文件中配置：

```env
EMAIL_USER=your_qq_email@qq.com
EMAIL_PASS=your_authorization_code
```

**重要：** `EMAIL_PASS` 是授权码，不是你的 QQ 邮箱密码！

### 2. MongoDB 配置

MongoDB 连接字符串已在 `.env` 中配置：

```env
MONGODB_URI=mongodb://yifeng:cck134414@161.33.17.80:27017
```

如需修改，请更新此配置。

### 3. JWT Secret

建议在生产环境中更改 JWT_SECRET：

```env
JWT_SECRET=your_secure_random_string_here
```

## 安装和运行

### 后端

```bash
cd backend
npm install
npm run dev
```

后端服务将运行在 http://localhost:3000

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端服务将运行在 http://localhost:5173

## API 接口

### 1. 发送验证码
- **URL:** `POST /api/auth/send-code`
- **Body:** `{ "email": "user@example.com" }`
- **说明:** 向指定邮箱发送6位验证码

### 2. 用户注册
- **URL:** `POST /api/auth/register`
- **Body:** 
```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "password123",
  "verificationCode": "123456"
}
```

### 3. 用户登录
- **URL:** `POST /api/auth/login`
- **Body:** 
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 4. 获取当前用户信息
- **URL:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

## 功能特性

✅ 用户注册（需要邮箱验证码）
✅ 用户登录（JWT 认证）
✅ 密码加密存储（bcrypt）
✅ 验证码有效期 5 分钟
✅ 60秒验证码重发限制
✅ 表单验证
✅ 响应式设计
✅ 自动登录状态保持

## 注意事项

1. **验证码存储：** 当前使用内存存储（Map），生产环境建议使用 Redis
2. **CORS 配置：** 已配置允许前端访问，如需修改请更新 `backend/server.js`
3. **安全性：** 生产环境请启用 HTTPS
4. **邮箱配置：** 确保 QQ 邮箱的 SMTP 服务已开启并使用正确的授权码

## 常见问题

### Q: 发送验证码失败？
A: 检查以下几点：
- QQ 邮箱是否开启了 SMTP 服务
- 授权码是否正确（不是邮箱密码）
- 网络连接是否正常

### Q: 注册时提示验证码错误？
A: 
- 验证码有效期为 5 分钟
- 每个邮箱只能有一个有效验证码
- 确保输入的验证码与邮件中的一致

### Q: 数据库连接失败？
A: 检查 MongoDB 连接字符串是否正确，确保数据库服务正常运行。

## 开发建议

1. 生产环境使用前，请更换 JWT_SECRET
2. 考虑添加速率限制防止暴力攻击
3. 添加更多的输入验证和错误处理
4. 考虑使用 Redis 存储验证码
5. 添加日志记录功能
