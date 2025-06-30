import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/footer";
import I18nProviderWrapper from '@/components/I18nProviderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tatami",
  description:
    "A project designed to accelerate the development of Dojo Engine games within the Starknet ecosystem. It provides no-code tools to effortlessly create models, visualize entity relationships, and make modifications with just a few clicks. With Tatami, you can master the Dojo and build 10x faste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <I18nProviderWrapper>
          <Navbar />
          {children}
          <Footer />
        </I18nProviderWrapper>
      </body>
    </html>
  );
}
