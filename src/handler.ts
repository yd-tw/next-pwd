import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

interface NextPwdConfig {
  /** Cookie 過期時間（秒），預設 24 小時 */
  maxAge?: number;
}

export function createNextPwdHandler(config: NextPwdConfig = {}) {
  const { maxAge = 1200 } = config;
  const filePath = path.join(process.cwd(), "src/utils/login.html");
  let html = fs.readFileSync(filePath, "utf-8");

  const handler = async (
    request: NextRequest,
    context?: { params: Promise<{ all?: string[] }> },
  ): Promise<NextResponse> => {
    const method = request.method;
    const url = new URL(request.url);

    const params = context?.params ? await context.params : undefined;
    const action = params?.all?.[0];

    // 處理 signout
    if (action === "signout" && method === "POST") {
      const res = NextResponse.json({ success: true });
      res.cookies.delete("nextpwd_token");
      return res;
    }

    // GET: 顯示登入頁面
    if (action === "signin" && method === "GET") {
      const error = url.searchParams.get("error") === "1";
      html = html
        .replaceAll("{{errorMessage}}", error ? "密碼錯誤" : "")
        .replaceAll("{{#if errorMessage}}", error ? "" : "<!--")
        .replaceAll("{{/if}}", error ? "" : "-->");

      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // POST: 驗證密碼
    if (action === "signin" && method === "POST") {
      const { password } = await request.json();
      try {
        if (password !== (process.env.NEXTPWD_PASSWORD as string)) {
          return NextResponse.json(
            { error: "invalid password" },
            { status: 401 },
          );
        }

        const token = jwt.sign(
          { authenticated: true },
          process.env.NEXTPWD_SECRET!,
          { expiresIn: maxAge },
        );

        const res = NextResponse.json({ success: true });
        res.cookies.set("nextpwd_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: maxAge,
          path: "/",
        });

        return res;
      } catch (error) {
        return NextResponse.json({ error: "invalid request" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  };

  return {
    GET: handler,
    POST: handler,
  };
}
