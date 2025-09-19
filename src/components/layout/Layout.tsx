

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const handler = () => setSidebarOpen((open) => !open);
    window.addEventListener('toggleSidebar', handler);
    return () => window.removeEventListener('toggleSidebar', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 min-h-[calc(100vh-56px)]"> {/* 56px for header height, flex-1 for full height */}
        {/* Mobile sidebar drawer */}
        <div className="md:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)}>
              <div className="absolute left-0 top-0 h-full w-64 bg-card shadow-lg p-0" onClick={e => e.stopPropagation()}>
                <Sidebar />
              </div>
            </div>
          )}
        </div>
        {/* Desktop sidebar */}
        <div className="hidden md:block border-r bg-card">
          <Sidebar />
        </div>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      {/* Footer always at bottom */}
      <footer className="w-full text-center py-4 bg-card/0 border-none text-muted-foreground text-sm">
        &copy; ShivamKumarDubey 2025
      </footer>
    </div>
  );
}