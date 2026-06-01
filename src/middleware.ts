import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/";
  const isAlbumPage = req.nextUrl.pathname.startsWith("/album");

  // Pokud je uživatel nepřihlášený a snaží se jít do alba -> přesměrovat na login
  if (isAlbumPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // Pokud je uživatel přihlášený a jde na landing page -> přesměrovat do alba
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/album", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Spustit middleware pro domovskou stránku a sekci alba
  matcher: ["/", "/album", "/album/:path*"],
};
