import { NextResponse } from "next/server";

export async function middleware(request) {

  try {
    const jwt = request.cookies.get("Tokendespacho");
    if (!jwt) {
      console.log (request.url)
      return NextResponse.redirect(new URL("/auth/login/", request.url))
    }

     return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
 
 matcher: ['/((?!auth|api/auth/error|favicon.ico|themes|layout|_next/static|demo/images).*)'],
}