import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // Get token from cookies
  const role = req.cookies.get("userRole")?.value; // Get role from cookies

  // Check if the token and role exist, and if the role is authorized for admin access
  if (!token || !role || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page if not authorized
  }

  return NextResponse.next(); // Allow the request if authorized
}

export const config = {
  matcher: ["/admin/:path*"], // Protect all sub-routes of /admin
};
