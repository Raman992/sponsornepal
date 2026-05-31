"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

const navLinks = [
  { href: "/creators", label: "Explore Creators" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 shadow-sm shadow-black/5 bg-background-solid">

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:bg-primary/30 transition-all duration-300" />
              <Image
                src="/sponsornepal_nav_logo.png"
                alt="SponsorNepal"
                width={100}
                height={100}
                className="relative h-10 w-auto rounded-xl shadow-md shadow-black/10 ring-1 ring-black/5 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-sm hover:shadow-black/5"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-lg shadow-sm shadow-primary/10 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-lg shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20 hover:bg-accent transition-all duration-200" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <div className="shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20 rounded-lg transition-all duration-200">
              <ThemeToggle />
            </div>

                  {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 ml-2 hover:bg-transparent">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/40 ring-offset-2 ring-offset-background shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/30 hover:ring-primary/60 transition-all duration-300">
                      <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-neutral-600 text-white font-medium">
                        {getInitials(user.full_name || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${user.role}`}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${user.role}/profile`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button variant="outline" className="rounded-lg border-border shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button className="rounded-lg gap-2 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:brightness-110 transition-all duration-200" asChild>
                  <Link href="/signup">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20 hover:bg-accent transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border/50 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm hover:shadow-black/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  className="pt-4 border-t border-border/50 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  
                  {user ? (
                    <>
                      <Link
                        href={`/dashboard/${user.role}`}
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted hover:shadow-sm hover:shadow-black/5 transition-all duration-200"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={`/dashboard/${user.role}/profile`}
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted hover:shadow-sm hover:shadow-black/5 transition-all duration-200"
                      >
                        Profile
                      </Link>
                      <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 hover:shadow-sm hover:shadow-destructive/10 transition-all duration-200">
                        Log out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 px-4">
                      <Button variant="outline" className="w-full justify-center shadow-sm shadow-black/10 hover:shadow-md hover:shadow-black/20 border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200" asChild>
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button className="w-full justify-center shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:brightness-110 transition-all duration-200" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
