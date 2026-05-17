import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Leaf, Trophy, User, Recycle, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/challenges", label: "Challenges", icon: Leaf },
    { href: "/recycling", label: "Recycling", icon: Recycle },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#dcfce7] to-[#ccfbf1] dark:from-background dark:via-[#064e3b] dark:to-[#022c22] flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed h-full bg-card/60 backdrop-blur-xl border-r border-white/20 dark:border-white/10 p-6 z-40">
        <div className="flex items-center gap-3 mb-10 text-primary">
          <Leaf className="w-8 h-8 fill-primary text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">EcoSteps</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 relative group",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:bg-white/40 dark:hover:bg-white/5 hover:text-foreground"
                )}
                data-testid={`nav-desktop-${item.label.toLowerCase()}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="desktop-active-nav"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10 shadow-lg shadow-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 relative min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-full relative transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={`nav-mobile-${item.label.toLowerCase()}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="mobile-active-nav"
                  className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
