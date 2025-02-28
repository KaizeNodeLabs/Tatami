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

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-navblack">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <img
              src="/Primary Logo_Primary Color.svg"
              alt="Logo"
              className="h-14 w-auto"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-6 text-sm font-sm lg:flex">
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground/80 text-white"
            >
              Docs
            </Link>
            <Link
              href="/community"
              className="transition-colors hover:text-foreground/80 text-white"
            >
              Community
            </Link>
            <Link
              href="/build"
              className="transition-colors hover:text-foreground/80 text-white"
            >
              {"Let's build"}
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full h-full border-none bg-navblack p-0"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-6">
                  <Link href="/" className="flex items-center">
                    <img
                      src="/Primary Logo_Primary Color.svg"
                      alt="Logo"
                      className="h-14 w-auto"
                    />
                  </Link>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-0 text-xl hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                    ></Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-8 p-6">
                  <Link
                    href="/docs"
                    className="text-xl font-medium text-white hover:text-white/80"
                  >
                    Docs
                  </Link>
                  <Link
                    href="/community"
                    className="text-xl font-medium text-white hover:text-white/80"
                  >
                    Community
                  </Link>
                  <Link
                    href="/build"
                    className="text-xl font-medium text-white hover:text-white/80"
                  >
                    {"Let's build"}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
