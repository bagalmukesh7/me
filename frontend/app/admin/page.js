'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { getAdminStats, triggerAI } from '../../lib/api';
import Link from 'next/link';
import { Shield, Users, FileText, CheckCircle, Clock, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/');
      return;
    }
    if (user && isAdmin()) {
      fetchStats();
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIFetch = async () => {
    try {
      setAiLoading(true);
      await triggerAI();
      await fetchStats();
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || !isAdmin()) return null;

  const statCards = [
    { label: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: Users, color: 'text-navy', bg: 'bg-navy/10' },
    { label: 'Applications', value: stats?.stats?.totalApplications || 0, icon: FileText, color: 'text-saffron', bg: 'bg-saffron/10' },
    { label: 'Opportunities', value: stats?.stats?.totalOpportunities || 0, icon: TrendingUp, color: 'text-green', bg: 'bg-green/10' },
    { label: 'Verified Users', value: stats?.stats?.verifiedUsers || 0, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">System overview and management</p>
            </div>
          </div>
          <button
            onClick={handleAIFetch}
            disabled={aiLoading}
            className="flex items-center gap-2 bg-saffron text-white px-4 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            {aiLoading ? 'Fetching...' : 'Run AI Fetcher'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="text-2xl font-bold text-navy">{card.value}</span>
              </div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/users" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Manage Users</h3>
                <p className="text-sm text-gray-500">View and manage all registered users</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/applications" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-saffron/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-saffron" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Manage Applications</h3>
                <p className="text-sm text-gray-500">Review and update application statuses</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Recent Applications
          </h3>
          {stats?.recentApplications?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              No applications yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Opportunity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentApplications?.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{app.user?.first_name} {app.user?.last_name}</td>
                      <td className="py-3 px-4">{app.opportunity?.title}</td>
                      <td className="py-3 px-4 capitalize">{app.opportunity?.type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${app.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                          ${app.status === 'applied' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${app.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                          ${app.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(app.applied_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
