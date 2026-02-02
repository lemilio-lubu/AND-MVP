import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { UserProvider } from "@/lib/context/UserContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Factura local, sin complicaciones.",
  description: "Nacionaliza tus facturas de publicidad digital y paga menos impuestos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
