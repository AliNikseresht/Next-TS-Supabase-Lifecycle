import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authBearer"); // دریافت توکن از کوکی
  const publicRoutes = ["/login", "/register"]; // مسیرهای عمومی که نیاز به لاگین ندارند

  // اگر توکن وجود نداشت و مسیر درخواست شده در مسیرهای عمومی نبود، به صفحه لاگین هدایت شود
  if (!authToken && !publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", // بررسی همه مسیرها
};
