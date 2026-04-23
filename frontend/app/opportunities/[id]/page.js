'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOpportunity, createApplication } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import Link from 'next/link';
import { ArrowLeft, Calendar, Building2, MapPin, Users, FileText, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (id) fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const res = await getOpportunity(id);
      setOpportunity(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      setApplying(true);
      setError('');
      const res = await createApplication(id);
      setApplied(true);
      if (res.data?.redirect_url) {
        setTimeout(() => {
          window.open(res.data.redirect_url, '_blank');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const typeColors = {
    scheme: 'bg-saffron/10 text-saffron border-saffron/20',
    exam: 'bg-navy/10 text-navy border-navy/20',
    job: 'bg-green/10 text-green border-green/20',
  };

  const typeLabels = {
    scheme: 'Government Scheme',
    exam: 'Competitive Exam',
    job: 'Government Job',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Opportunity not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/${opportunity.type}s`} className="inline-flex items-center gap-2 text-gray-600 hover:text-navy mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to {opportunity.type}s
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-blue-900 text-white p-8">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${typeColors[opportunity.type]}`}>
                {typeLabels[opportunity.type]}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
            <p className="text-white/80">{opportunity.description}</p>
          </div>

          {/* Details */}
          <div className="p-8">
            {applied && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Application Recorded!</div>
                  <div className="text-sm">You will be redirected to the official portal shortly. A confirmation email has been sent.</div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-saffron mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Organization</div>
                  <div className="font-medium text-navy">{opportunity.organization}</div>
                </div>
              </div>
              {opportunity.state && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-navy mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">State</div>
                    <div className="font-medium text-navy">{opportunity.state}</div>
                  </div>
                </div>
              )}
              {opportunity.last_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Last Date</div>
                    <div className="font-medium text-navy">{new Date(opportunity.last_date).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              )}
              {opportunity.category && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-saffron mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-medium text-navy">{opportunity.category}</div>
                  </div>
                </div>
              )}
            </div>

            {opportunity.eligibility && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-navy mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Eligibility
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{opportunity.eligibility}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApply}
                disabled={applying || applied}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {applying ? 'Processing...' : applied ? 'Applied' : 'Apply Now'}
                {!applied && <ExternalLink className="w-4 h-4" />}
              </button>
              {opportunity.official_link && (
                <a
                  href={opportunity.official_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 border-2 border-navy text-navy rounded-lg font-semibold hover:bg-navy hover:text-white transition-all text-center flex items-center justify-center gap-2"
                >
                  Visit Official Site <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> UGOVA redirects you to official government portals. We do not process applications directly. Please complete your application on the official website.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
