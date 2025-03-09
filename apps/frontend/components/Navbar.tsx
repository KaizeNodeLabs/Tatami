"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import logo from '@/public/Primary Logo_Primary Color.svg';
import Image from "next/image";

export default function Navbar() {

  const logoSrc = "/Primary Logo_Primary Color.svg"

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-colors duration-300 bg-neutral"
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src={logo} width={50} height={50} alt="Tatami logo"></Image>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-6 text-sm font-sm lg:flex">
            <Link
              href="/docs"
              className="text-primary-foreground transition-colors hover:text-accent"
            >
              Docs
            </Link>
            <Link
              href="/community"
              className="text-primary-foreground transition-colors hover:text-accent"
            >
              Community
            </Link>
            <Link
              href="/build"
              className="text-primary-foreground transition-colors hover:text-accent"
            >
              {"Let's build"}
            </Link>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={`px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={`w-full h-full border-none p-0 transition-colors duration-300`}
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-6">
                  <Link href="/" className="flex items-center">
                    <img src={logoSrc} alt="Logo" className="h-14 w-auto" />
                  </Link>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className={`px-0 text-xl hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0`}
                    />
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-8 p-6">
                  <Link
                    href="/docs"
                    className={`text-xl font-medium hover:text-white/80`}
                  >
                    Docs
                  </Link>
                  <Link
                    href="/community"
                    className={`text-xl font-medium hover:text-white/80`}
                  >
                    Community
                  </Link>
                  <Link
                    href="/build"
                    className={`text-xl font-medium hover:text-white/80`}
                  >
                    {"Let's build"}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
