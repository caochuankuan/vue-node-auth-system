# 快速开始指南

## 第一步：配置 QQ 邮箱

1. 打开 `backend/.env` 文件
2. 修改以下配置为你的 QQ 邮箱信息：

```env
EMAIL_USER=你的QQ号@qq.com
EMAIL_PASS=你的授权码（不是密码）
```

### 如何获取 QQ 邮箱授权码？

1. 登录 QQ 邮箱网页版
2. 点击「设置」→「账户」
3. 向下滚动找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」
4. 开启「IMAP/SMTP服务」
5. 点击「生成授权码」
6. 按照提示发送短信验证
7. 复制生成的授权码到 `.env` 文件的 `EMAIL_PASS`

## 第二步：启动后端

```bash
cd backend
npm run dev
```

看到以下信息表示启动成功：
```
Server running on port 3000
MongoDB Connected: 161.33.17.80
```

## 第三步：启动前端

新开一个终端窗口：

```bash
cd frontend
npm run dev
```

看到以下信息表示启动成功：
```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

## 第四步：访问应用

在浏览器中打开：http://localhost:5173

- 注册页面：http://localhost:5173/register
- 登录页面：http://localhost:5173/login

## 测试流程

1. 打开注册页面
2. 输入用户名、邮箱、密码
3. 点击「获取验证码」按钮
4. 检查邮箱，输入收到的6位验证码
5. 点击「注册」按钮
6. 注册成功后自动跳转到仪表板
7. 可以使用注册的账号登录

## 注意事项

⚠️ **重要：** 
- EMAIL_PASS 是授权码，不是 QQ 邮箱的登录密码
- 确保 QQ 邮箱已开启 SMTP 服务
- 验证码有效期为 5 分钟
- 60秒内不能重复发送验证码
