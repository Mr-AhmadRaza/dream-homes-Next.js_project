import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = [
  "/properties/add",
  "/saved-properties",
  "/messages",
  "/profile",
]

const editPropertyRouteRegex = /^\/properties\/\d+\/edit$/

export default function proxy(req: NextRequest) {  // ✅ Changed to "proxy"
  const token =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value

  const pathname = req.nextUrl.pathname

  const isProtectedRoute =
    protectedRoutes.includes(pathname) ||
    editPropertyRouteRegex.test(pathname)

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/", req.url)
    loginUrl.searchParams.set("error", "login_required")
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/properties/add",
    "/saved-properties",
    "/messages",
    "/profile",
    "/properties/:id/edit",
  ],
}