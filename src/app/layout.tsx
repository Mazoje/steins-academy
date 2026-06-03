import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Steins Academy",
  description: "Architecting the infrastructure of a robotics-enabled future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-steins-gold/30">
        
        {/* The Master Sticky Navbar */}
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-slate-200/80 px-6 py-2.5 rounded-full shadow-lg grid grid-cols-3 items-center max-w-5xl w-[92%] gap-4">
          
          {/* Column 1: Brand Asset Logo (Replaced text with optimized image asset) */}
          <Link href="/" className="flex items-center justify-self-start shrink-0 group">
            <Image 
              src="/steins.png"             // Make sure 'steins.png' is placed inside your /public folder
              alt="Steins Inc. Logo"
              width={140}                   // Aspect-ratio layout standard
              height={32}                   // Sized down smoothly to match navbar height scale
              className="h-7 w-auto object-contain group-hover:opacity-85 transition-opacity"
              priority                      // Injects early asset rendering flag
            />
          </Link>

          {/* Column 2: Public Navigation Links (Absolute Center + No Text Wrapping) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider text-slate-600 justify-self-center whitespace-nowrap">
            <Link href="/" className="text-steins-gold font-bold whitespace-nowrap">MAIN HUB</Link>
            <Link href="https://steins-inc-website.vercel.app/studios" className="hover:text-steins-navy transition-colors whitespace-nowrap">STUDIOS</Link>
            <Link href="https://steins-inc-website.vercel.app/foundation" className="hover:text-steins-navy transition-colors whitespace-nowrap">FOUNDATION</Link>
            <Link href="https://steins-inc-website.vercel.app/sicarr" className="hover:text-steins-navy transition-colors whitespace-nowrap">SICARR</Link>
            <Link href="https://steins-inc-website.vercel.app/academy" className="hover:text-steins-navy transition-colors whitespace-nowrap">ACADEMY</Link>
          </nav>

          {/* Column 3: Admin Link (Right-aligned) */}
          <Link 
            href="/admin/dashboard" 
            className="text-xs font-black tracking-wider text-[#001D4A] hover:text-[#A27B2C] transition-colors uppercase justify-self-end whitespace-nowrap"
          >
            Admin
          </Link>
          
        </header>

        {children}
      </body>
    </html>
  );
}