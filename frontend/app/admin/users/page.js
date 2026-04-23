'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import api from '../../../lib/api';
import Link from 'next/link';
import { Shield, Users, ArrowLeft, Search, ChevronLeft, ChevronRight, UserCheck, UserX } from 'lucide-react';

export default function AdminUsers() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/');
      return;
    }
    if (user && isAdmin()) {
      fetchUsers();
    }
  }, [user, authLoading, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/users?page=${page}&limit=20`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const term = search.toLowerCase();
    return (
      u.first_name?.toLowerCase().includes(term) ||
      u.last_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.state?.toLowerCase().includes(term)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || !isAdmin()) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1 text-gray-600 hover:text-navy">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Manage Users</h1>
              <p className="text-sm text-gray-500">View and manage registered users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">State</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-navy">{u.first_name} {u.last_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                      <td className="py-3 px-4 text-sm">{u.state || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.is_verified ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <UserCheck className="w-4 h-4" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-sm">
                            <UserX className="w-4 h-4" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
