import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.nextUrl.origin), 303);
  response.cookies.delete({ name: SESSION_COOKIE, path: "/" });
  return response;
}
