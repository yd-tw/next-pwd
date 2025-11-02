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
NEXTPWD_SECRET=your_secret
```

### 2. 配置 Middleware

在 `proxy.ts` 中 (Next.js 15 前稱為 middleware.ts)：

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkPwd } from "next-pwd";

export function proxy(req: NextRequest) {
  const pwdPath = new RegExp(/((?!api|_next\/static|_next\/image|.*\.png$).*)/);
  const checkResult = checkPwd({ req, pwdPath });

  if (checkResult?.authenticated === false) {
    return NextResponse.redirect(checkResult.loginUrl!);
  }

  return NextResponse.next();
}

// 指定 middleware 適用的路徑
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
```

### 3. 配置 API Route

在 `app/api/pwd/[...all]/route.ts` 中：

```typescript
import { createNextPwdHandler } from "next-pwd";

export const { GET, POST } = createNextPwdHandler();
```

就這樣！你的網站現在已經有密碼保護了。

## 其他設定

### 自訂 Cookie 設定

你可以自訂 `Cookie` 生效時長 (預設為 20 分鐘)

```typescript
const handler = createNextPwdHandler({
  maxAge: 3600, // 1 小時
});
```

### 登出

除了等待 `Cookie` 過期，你也可以呼叫 `signOut` 方法登出

```typescript
import { signOut } from "next-pwd";

export default function HeroSection() {
  return(
    <button onClick={signOut}>
      登出
    </button>
  );
}
```

## 注意事項

- 此套件適合用於簡單的密碼保護場景
- 不建議用於需要多用戶管理的情況
- 在生產環境中，請使用 HTTPS
- Cookie 在生產環境自動啟用 `secure` 標記

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！
