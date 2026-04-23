'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { getProfile, getApplications } from '../../lib/api';
import Link from 'next/link';
import { User, Phone, Shield, FileText, Clock, CheckCircle, AlertTriangle, GraduationCap, MapPin, Mail } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [profileRes, appsRes] = await Promise.all([
        getProfile(),
        getApplications()
      ]);
      setProfile(profileRes.data);
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  const statusIcons = {
    applied: <Clock className="w-4 h-4 text-yellow-500" />,
    pending: <AlertTriangle className="w-4 h-4 text-orange-500" />,
    approved: <CheckCircle className="w-4 h-4 text-green-500" />,
    rejected: <AlertTriangle className="w-4 h-4 text-red-500" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {profile?.first_name || user?.first_name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-navy" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-navy">{profile?.first_name} {profile?.last_name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    {profile?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-saffron" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">{profile?.phone || 'Not added'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-navy" />
                  <div>
                    <div className="text-sm text-gray-500">State</div>
                    <div className="font-medium">{profile?.state || 'Not set'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-green" />
                  <div>
                    <div className="text-sm text-gray-500">Education</div>
                    <div className="font-medium capitalize">{profile?.education || 'Not set'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-saffron" />
                  <div>
                    <div className="text-sm text-gray-500">Verification</div>
                    <div className={`font-medium ${profile?.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {profile?.is_verified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/profile"
                className="mt-4 block text-center py-2 border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-all text-sm font-medium"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  My Applications
                </h3>
                <span className="text-sm text-gray-500">{applications.length} total</span>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No applications yet</p>
                  <Link href="/schemes" className="btn-primary text-sm">
                    Browse Opportunities
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        {statusIcons[app.status] || <Clock className="w-4 h-4 text-gray-400" />}
                        <div>
                          <div className="font-medium text-navy">{app.opportunity?.title}</div>
                          <div className="text-sm text-gray-500">{app.opportunity?.type} | {app.opportunity?.organization}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Applied on {new Date(app.applied_at).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${app.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                        ${app.status === 'applied' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${app.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                        ${app.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/schemes" className="card text-center hover:shadow-md transition-shadow">
                <Shield className="w-8 h-8 text-saffron mx-auto mb-2" />
                <div className="font-semibold text-navy">Schemes</div>
                <div className="text-sm text-gray-500">Browse government schemes</div>
              </Link>
              <Link href="/exams" className="card text-center hover:shadow-md transition-shadow">
                <GraduationCap className="w-8 h-8 text-navy mx-auto mb-2" />
                <div className="font-semibold text-navy">Exams</div>
                <div className="text-sm text-gray-500">View exam notifications</div>
              </Link>
              <Link href="/jobs" className="card text-center hover:shadow-md transition-shadow">
                <FileText className="w-8 h-8 text-green mx-auto mb-2" />
                <div className="font-semibold text-navy">Jobs</div>
                <div className="text-sm text-gray-500">Find government jobs</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
