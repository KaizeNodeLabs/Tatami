import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/footer";
import I18nProviderWrapper from '@/components/I18nProviderWrapper';
import { CartridgeProvider } from '@/components/providers/CartridgeProvider';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { WebAuthnHelper } from '@/components/wallet/WebAuthnHelper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Tatami - Conquer the Dojo",
  description:
    "A project designed to accelerate the development of Dojo Engine games within the Starknet ecosystem. It provides no-code tools to effortlessly create models, visualize entity relationships, and make modifications with just a few clicks. With Tatami, you can master the Dojo and build 10x faster",
  keywords: "dojo, starknet, cairo, blockchain, gaming, no-code, web3",
  authors: [{ name: "Kaizenode Labs" }],
  openGraph: {
    title: "Tatami - Conquer the Dojo",
    description: "Accelerate Dojo Engine game development with no-code tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tatami - Conquer the Dojo",
    description: "Accelerate Dojo Engine game development with no-code tools",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preload critical assets */}
        <link rel="preload" href="/Primary Logo_Primary Color.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/hero-illustration.png" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProviderWrapper>
          <ErrorBoundary>
            <CartridgeProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <WebAuthnHelper />
              </div>
            </CartridgeProvider>
          </ErrorBoundary>
        </I18nProviderWrapper>
      </body>
    </html>
  );
}
