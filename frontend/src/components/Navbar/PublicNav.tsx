"use client"

import Image from "next/image"
import Link from "next/link"
import { Moon, Sun, LogIn, UserPlus, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQs", href: "/FrequentlyAskedQuestions" },
    { name: "Documentation", href: "/documentation" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 font-outfit w-[90%] lg:w-[80%] hidden md:block">
        <div className="bg-white/40 dark:bg-gray-950/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-lg px-4 lg:px-8 flex items-center justify-between gap-4 lg:gap-12 w-full">
          {/* Logo - Left */}
          <div className="shrink-0 relative p-4">
            <Link href="/" className="flex w-full h-full items-center">
              <Image 
                src="/Logo.png" 
                alt="Logo.png" 
                // fill={true}
                height={150}
                width={150}
              />
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white duration-200 hover:scale-105 transform whitespace-nowrap transition-all ease-in-out"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-accent h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth / Home Button (shows 'Go to Home' when logged in) */}
            {isLoggedIn ? (
              <Button
                size="sm"
                className="flex items-center gap-2 font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700"
                asChild
              >
                <Link href="/home">Go to Home</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 font-medium rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  asChild
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Link>
                </Button>

                <Button
                  size="sm"
                  className="hidden md:flex items-center gap-2 font-medium rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                  asChild
                >
                  <Link href="/login">
                    <UserPlus className="h-4 w-4" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 font-outfit w-[95%] md:hidden">
        <div className="bg-white/40 dark:bg-gray-950/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between w-full">
          {/* Logo */}
          <div className="shrink-0 relative w-20 h-14">
            <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
              <Image 
                src="/Logo.png" 
                alt="Logo.png" 
                fill={true}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-accent h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="rounded-full cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-accent h-9 w-9"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-white dark:bg-gray-950 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 pt-24 font-outfit">
          {/* Navigation Links */}
          <div className="flex flex-col gap-6 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border-b border-gray-200 dark:border-gray-800 pb-3"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            {isLoggedIn ? (
              <Button
                className="w-full flex items-center justify-center gap-2 font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                asChild
              >
                <Link href="/home" onClick={closeMobileMenu}>
                  Go to Home
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 font-medium rounded-xl text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                  asChild
                >
                  <Link href="/login" onClick={closeMobileMenu}>
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Link>
                </Button>

                <Button
                  className="w-full flex items-center justify-center gap-2 font-medium rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                  asChild
                >
                  <Link href="/signup" onClick={closeMobileMenu}>
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  )
}

export default Navbar
