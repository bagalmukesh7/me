'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth';
import api from '../../../lib/api';
import Link from 'next/link';
import { Shield, FileText, ArrowLeft, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AdminApplications() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/');
      return;
    }
    if (user && isAdmin()) {
      fetchApplications();
    }
  }, [user, authLoading, page, filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let url = `/api/admin/applications?page=${page}&limit=20`;
      if (filterStatus) url += `&status=${filterStatus}`;
      const res = await api.get(url);
      setApplications(res.data.applications || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/applications/${id}/status`, { status });
      fetchApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const statusIcons = {
    applied: <Clock className="w-4 h-4 text-yellow-500" />,
    pending: <AlertTriangle className="w-4 h-4 text-orange-500" />,
    approved: <CheckCircle className="w-4 h-4 text-green-500" />,
    rejected: <XCircle className="w-4 h-4 text-red-500" />,
  };

  const statusColors = {
    applied: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

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
            <div className="w-10 h-10 bg-saffron/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Manage Applications</h1>
              <p className="text-sm text-gray-500">Review and update application statuses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-4 items-center">
          <span className="text-sm font-medium text-gray-600">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:border-transparent outline-none"
          >
            <option value="">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Opportunity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Org</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">No applications found</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-navy font-medium">
                        {app.user?.first_name} {app.user?.last_name}
                      </td>
                      <td className="py-3 px-4 text-sm">{app.opportunity?.title || '-'}</td>
                      <td className="py-3 px-4 capitalize text-sm">{app.opportunity?.type || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{app.opportunity?.organization || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusColors[app.status] || 'bg-gray-100'}`}>
                          {statusIcons[app.status]} {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(app.id, 'approved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'rejected')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'pending')}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"
                            title="Mark Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
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
