import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "LifeManager | Your Personal Life Assistant",
  description: "Track subscriptions, split bills, and manage document expiries with AI-powered smart reminders. No sign-up required to start.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/30`}
      >
        <div className="relative min-h-screen flex flex-col">
          {/* Background Ambient Glow */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
