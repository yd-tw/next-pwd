# next-pwd

簡單的 Next.js 密碼保護套件，只需配置兩個檔案即可保護你的網站。

## 特點

- 🔒 簡單的密碼保護機制
- ⚡ 只需配置 2 個檔案
- 🎨 內建登入頁面
- 🛣️ 支援路徑萬用字元
- 🍪 使用 HTTP-only cookies 保護
- 📦 TypeScript 支援

## 安裝

```bash
npm install next-pwd
# 或
yarn add next-pwd
# 或
pnpm add next-pwd
```

## 快速開始

### 1. 設定環境變數

在 `.env.local` 中設定密碼：

```env
NEXTPWD_PASSWORD=your_password
NEXRPWD_SECRET=your_secret
```

### 2. 配置 Middleware

在 `middleware.ts` 中：

```typescript
import { createNextPwdMiddleware } from 'next-pwd';

export const middleware = createNextPwdMiddleware({
  protectedPaths: ['/*'], // 保護所有路徑
  cookieName: 'next-pwd-auth',
  apiPath: '/api/next-pwd',
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 3. 配置 API Route

在 `app/api/[...next-pwd]/route.ts` 中：

```typescript
import { createNextPwdHandler } from 'next-pwd';

const handler = createNextPwdHandler({
  pageTitle: '請輸入密碼',
  errorMessage: '密碼錯誤，請重試',
  cookieName: 'next-pwd-auth',
  maxAge: 86400, // 24 小時
});

export { handler as GET, handler as POST };
```

就這樣！你的網站現在已經有密碼保護了。

## 進階配置

### 保護特定路徑

```typescript
// middleware.ts
export const middleware = createNextPwdMiddleware({
  protectedPaths: [
    '/admin/*',      // 保護所有 /admin 下的路徑
    '/dashboard',    // 只保護 /dashboard
    '/secret/*',     // 保護所有 /secret 下的路徑
  ],
});
```

### 自訂登入頁面樣式

```typescript
// app/api/[...next-pwd]/route.ts
const handler = createNextPwdHandler({
  pageTitle: '🔐 會員專區',
  errorMessage: '密碼錯誤！請再試一次',
  customStyles: `
    body {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    }
    .container {
      border-radius: 20px;
    }
  `,
});
```

### 自訂 Cookie 設定

```typescript
const handler = createNextPwdHandler({
  cookieName: 'my-custom-auth',
  maxAge: 3600, // 1 小時
});
```

## API 參考

### `createNextPwdMiddleware(options)`

創建 Next.js middleware 函數。

#### 選項

- `protectedPaths` (string[]): 要保護的路徑，支援萬用字元 `*`。預設: `['/*']`
- `cookieName` (string): Cookie 名稱。預設: `'next-pwd-auth'`
- `apiPath` (string): API 路徑。預設: `'/api/next-pwd'`

### `createNextPwdHandler(config)`

創建 API route handler。

#### 配置

- `pageTitle` (string): 登入頁面標題。預設: `'請輸入密碼'`
- `errorMessage` (string): 密碼錯誤訊息。預設: `'密碼錯誤，請重試'`
- `cookieName` (string): Cookie 名稱。預設: `'next-pwd-auth'`
- `maxAge` (number): Cookie 過期時間（秒）。預設: `86400` (24 小時)
- `customStyles` (string): 自訂 CSS 樣式

## 環境變數

- `NEXT_PWD_PASSWORD` (必要): 用於驗證的密碼

## 注意事項

- 此套件適合用於簡單的密碼保護場景
- 不建議用於需要多用戶管理的情況
- 在生產環境中，請使用 HTTPS
- Cookie 在生產環境自動啟用 `secure` 標記

## 授權

MIT

## 貢獻

歡迎提交 Issue 和 Pull Request！
