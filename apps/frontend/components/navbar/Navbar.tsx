"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "@/public/Primary Logo_Primary Color.svg";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from '../LanguageToggleButton';
import { memo, useCallback } from 'react';

const Navbar = memo(() => {
  const logoSrc = "/Primary Logo_Primary Color.svg";

  const { t, i18n } = useTranslation();

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full transition-colors duration-300 bg-neutral">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image 
              src={logo} 
              width={50} 
              height={50} 
              alt="Tatami logo" 
              priority
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-6 text-sm font-sm lg:flex">
            <Link
              href="#community"
              className="text-primary-foreground transition-colors hover:text-accent"
            >
              {t('community')}
            </Link>
            <Link
              href="/app"
              className="text-primary-foreground transition-colors hover:text-accent"
            >
              {t('build')}
            </Link>
            <LanguageToggleButton />
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="px-0 text-primary-foreground hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full h-full border-none p-0 transition-colors duration-300"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">{t('navigationMenu')}</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col bg-neutral">
                <div className="flex items-center justify-between p-6">
                  <Link href="/" className="flex items-center">
                    <Image 
                      src={logo}
                      alt="Logo" 
                      width={56}
                      height={56}
                      className="w-auto"
                    />
                  </Link>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-0 text-xl focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col space-y-8 p-6">
                  <Link
                    href="#community"
                    className="text-lg font-medium text-primary-foreground"
                  >
                    {t('community')}
                  </Link>
                  <Link
                    href="/app"
                    className="text-lg font-medium text-primary-foreground"
                  >
                    {t('build')}
                  </Link>
                  <LanguageToggleButton />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
