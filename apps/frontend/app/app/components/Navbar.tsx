"use client";

import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-md w-full fixed top-0 left-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/Primary Logo_Primary Color.svg"
          alt="Logo"
          width={36}
          height={36}
          className="object-contain"
          priority
        />
      </Link>

      {/* Dark Mode Icon */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 transition-all"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </nav>
  );
};

export default Navbar;
