import jwt from "jsonwebtoken";

interface NextPwdRequest {
  nextUrl: { pathname: string };
  cookies: { get: (name: string) => { value: string } | undefined };
  url: string;
}

export function checkPwd({
  req,
  pwdPath,
}: {
  req: NextPwdRequest;
  pwdPath: RegExp;
}) {
  if (!pwdPath.test(req.nextUrl.pathname)) {
    return null;
  }

  const token = req.cookies.get("nextpwd_token")?.value;

  try {
    jwt.verify(token || "", process.env.NEXRPWD_SECRET!);
    return {
      authenticated: true,
      loginUrl: null,
    };
  } catch {
    const loginUrl = new URL("/api/pwd/signin", req.url);
    loginUrl.searchParams.set("callbackURL", req.nextUrl.pathname);
    return {
      authenticated: false,
      loginUrl: loginUrl.toString(),
    };
  }
}
