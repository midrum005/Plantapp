import React, { useState, useEffect } from 'react';
import { Home, Plus, User } from "lucide-react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const navItems = [
    { name: 'Home', label: 'หน้าหลัก', icon: Home, page: 'Home' },
    { name: 'Add', label: 'เพิ่มพืช', icon: Plus, page: 'AddPlant' },
    { name: 'Profile', label: 'โปรไฟล์', icon: User, page: 'Profile' }
  ];

  const handleNavClick = (page) => {
    if (page === 'AddPlant' || page === 'Profile') {
      if (!isAuthenticated) {
        base44.auth.redirectToLogin(createPageUrl(page));
        return;
      }
    }
    window.location.href = createPageUrl(page);
  };

  const shouldShowNav = !['PlantDetail', 'EditPlant'].includes(currentPageName);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Status Bar Background */}
      <div className="fixed top-0 left-0 right-0 h-11 bg-emerald-600 z-50" />
      
      {/* Main Content */}
      <div className={`flex-1 ${shouldShowNav ? 'pb-20' : ''}`}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {shouldShowNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                    isActive 
                      ? 'text-emerald-600' 
                      : 'text-gray-500 active:text-emerald-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PWA Safe Area Support */}
      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        /* Remove scrollbar for cleaner mobile look */
        ::-webkit-scrollbar {
          display: none;
        }
        
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}