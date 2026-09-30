/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Plus, Building2, Menu, X, Bell, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsReportModalOpen,
    userReports,
    showToast,
    theme,
    toggleTheme,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Map' },
    { id: 'trending', label: 'Trending' },
    { id: 'evidence', label: 'Evidence Gallery' },
    { id: 'cross-brics', label: 'Cross-BRICS' },
    { id: 'my-issues', label: 'My Tracked' },
  ] as const;

  const handleNavClick = (viewId: typeof navLinks[number]['id']) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="theme-transition sticky top-0 z-40 backdrop-blur-md border-b b-skin"
      style={{ background: 'var(--surface-glass)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ZONE 1: Brand Wordmark (Single text element in display face) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="text-left group flex items-baseline gap-1.5 focus:outline-none"
            >
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight group-hover:text-[#6D4AFF] transition-colors brand-text">
                LokDrishti
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full brand-bg live-dot"></span>
            </button>
          </div>

          {/* ZONE 2: Clean text navigation links (4-6 links) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium t-ink-2">
            {navLinks.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#6D4AFF] font-semibold'
                      : 'hover:t-ink t-ink-2'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full brand-bg animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: 1-2 primary actions + privacy indicator & Gov switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Privacy indicator */}
            <div
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/50 font-medium"
              title="End-to-end anonymization & spatial privacy fuzzing active"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy Protected</span>
            </div>

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 t-ink-2 hover:t-ink hover:themed-muted rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6D4AFF] rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 themed-card rounded-xl shadow-xl border b-skin p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b b-skin text-xs font-semibold t-ink-2">
                    <span>Signal Notifications</span>
                    <span className="text-[11px] text-[#6D4AFF] font-normal">2 new updates</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 themed-muted rounded-lg">
                      <p className="font-medium t-ink">Official update on Energy Supply</p>
                      <p className="t-muted text-[11px] mt-0.5">TANGEDCO energized secondary circuit 3B in Anna Nagar.</p>
                      <span className="text-[10px] t-faint mt-1 block">16:40 IST</span>
                    </div>
                    <div className="p-2 themed-muted rounded-lg">
                      <p className="font-medium t-ink">Your report matched 183 signals</p>
                      <p className="t-muted text-[11px] mt-0.5">Automated AI spatial clustering grouped report into active cluster.</p>
                      <span className="text-[10px] t-faint mt-1 block">1h ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-[1.06] active:scale-[0.96] themed-muted text-[#6D4AFF] shadow-sm animate-pop"
              title={theme === 'light' ? 'Switch to Dark color grade' : 'Switch to Light color grade'}
              aria-label="Toggle color theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Gov Console Switcher */}
            <button
              onClick={() => {
                if (activeView === 'gov-console') {
                  setActiveView('home');
                  showToast('Switched to Citizen Public View', 'info');
                } else {
                  setActiveView('gov-console');
                  showToast('Switched to Government Operations Console', 'info');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                activeView === 'gov-console'
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 't-ink-2 themed-muted b-skin hover:themed-muted'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {activeView === 'gov-console' ? 'Citizen View' : 'Gov Console'}
              </span>
              <span className="sm:hidden">Gov</span>
            </button>

            {/* Primary Action CTA: + Report Issue */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] hover:from-[#603df5] hover:to-[#7c4def] rounded-lg shadow-sm shadow-[#6D4AFF]/20 transition-all hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 t-ink-2 hover:t-ink rounded-lg hover:themed-muted"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t b-skin themed-card px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeView === item.id
                  ? 'bg-[#6D4AFF]/10 text-[#6D4AFF]'
                  : 't-ink-2 hover:themed-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t b-skin flex items-center justify-between text-xs t-muted">
            <span>Location: Chennai · Tamil Nadu</span>
            <span className="text-emerald-600 font-medium">✓ Privacy Protected</span>
          </div>
        </div>
      )}
    </header>
  );
};
