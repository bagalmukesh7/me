'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { Menu, X, Shield, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron via-white to-green flex items-center justify-center">
              <Shield className="w-5 h-5 text-navy" />
            </div>
            <span className="text-xl font-bold text-navy">UGOVA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/schemes" className="text-gray-700 hover:text-navy font-medium transition-colors">Schemes</Link>
            <Link href="/exams" className="text-gray-700 hover:text-navy font-medium transition-colors">Exams</Link>
            <Link href="/jobs" className="text-gray-700 hover:text-navy font-medium transition-colors">Jobs</Link>

            {user ? (
              <>
                {isAdmin() && (
                  <Link href="/admin" className="text-gray-700 hover:text-navy font-medium flex items-center gap-1 transition-colors">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-gray-700 hover:text-navy font-medium flex items-center gap-1 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={logout} className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-navy font-medium transition-colors">Login</Link>
                <Link href="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-navy" /> : <Menu className="w-6 h-6 text-navy" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 shadow-lg">
          <Link href="/schemes" className="block py-2 text-gray-700 hover:text-navy" onClick={() => setMobileMenuOpen(false)}>Schemes</Link>
          <Link href="/exams" className="block py-2 text-gray-700 hover:text-navy" onClick={() => setMobileMenuOpen(false)}>Exams</Link>
          <Link href="/jobs" className="block py-2 text-gray-700 hover:text-navy" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>

          {user ? (
            <>
              {isAdmin() && (
                <Link href="/admin" className="block py-2 text-gray-700 hover:text-navy" onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-navy" onClick={() => setMobileMenuOpen(false)}>
                My Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block py-2 text-gray-700 hover:text-red-600 w-full text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-700 hover:text-navy" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/register" className="block py-2 btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
