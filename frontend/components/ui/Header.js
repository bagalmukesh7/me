'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { Menu, X, Shield, User, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
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
            <Link href="/schemes" className="text-gray-700 hover:text-navy font-medium">Schemes</Link>
            <Link href="/exams" className="text-gray-700 hover:text-navy font-medium">Exams</Link>
            <Link href="/jobs" className="text-gray-700 hover:text-navy font-medium">Jobs</Link>

            {user ? (
              <>
                {isAdmin() && (
                  <Link href="/admin" className="text-gray-700 hover:text-navy font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-gray-700 hover:text-navy font-medium flex items-center gap-1">
                  <User className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={logout} className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-navy font-medium">Login</Link>
                <Link href="/register" className="btn-primary">Register</Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <Link href="/schemes" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Schemes</Link>
          <Link href="/exams" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Exams</Link>
          <Link href="/jobs" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              {isAdmin() && (
                <Link href="/admin" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block py-2 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/register" className="block py-2 text-navy font-semibold" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
